import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import AWS from 'aws-sdk';
import { DateTimeResolver } from 'graphql-scalars';
import cors from 'micro-cors';
import { NextApiHandler } from 'next';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import {
  asNexusMethod,
  enumType,
  idArg,
  inputObjectType,
  list,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from 'nexus';
import path from 'path';

import { authOptions } from '../../lib/auth';
import prisma from '../../lib/prisma';

AWS.config.update({
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  region: process.env.S3_UPLOAD_REGION,
});
const s3 = new AWS.S3();

export const GQLDate = asNexusMethod(DateTimeResolver, 'date');

const asyncS3Delete = (params) =>
  new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

const UserRole = enumType({
  name: 'UserRole',
  members: ['USER', 'ADMIN'],
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.string('email');
    t.nonNull.field('role', { type: UserRole });
    t.nonNull.list.field('ratings', {
      type: 'Rating',
      resolve: (parent) =>
        prisma.user
          .findUnique({
            where: { id: String(parent.id) },
          })
          .ratings(),
    });
  },
});

const Item = objectType({
  name: 'Item',
  definition(t) {
    t.nonNull.string('id');
    t.nullable.string('title');
    t.nullable.string('imageUrl');
    t.nullable.string('imagePlaceholder');
    t.nonNull.int('avgRating', {
      resolve: async (parent) => {
        const ratings = await prisma.item
          .findUnique({
            where: { id: String(parent.id) },
          })
          .ratings();

        const avg =
          ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length;

        return Math.round(avg);
      },
    });
  },
});

const Rating = objectType({
  name: 'Rating',
  definition(t) {
    t.nonNull.int('value');
    t.nonNull.string('userId');
    t.nonNull.field('user', {
      type: 'User',
      resolve: (parent) =>
        prisma.rating
          .findUnique({
            where: {
              itemId_userId: { itemId: parent.itemId, userId: parent.userId },
            },
          })
          .user(),
    });
    t.nonNull.string('itemId');
    t.nonNull.field('item', {
      type: 'Item',
      resolve: (parent) =>
        prisma.rating
          .findUnique({
            where: {
              itemId_userId: { itemId: parent.itemId, userId: parent.userId },
            },
          })
          .item(),
    });
  },
});

const RatingInput = inputObjectType({
  name: 'RatingInput',
  definition(t) {
    t.nonNull.string('itemId');
    t.nonNull.string('userId');
    t.nonNull.int('value');
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('getMe', {
      type: 'User',
      resolve: (_, args, ctx) => {
        return prisma.user.findUnique({
          where: { id: String(ctx.user?.id) },
          include: { ratings: true },
        });
      },
    });

    t.field('getItems', {
      type: list('Item'),
      // @ts-ignore
      resolve: (_, args) => {
        return prisma.item.findMany({
          include: { ratings: true },
          where: { published: true },
        });
      },
    });

    t.field('getItem', {
      type: 'Item',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.item.findUnique({
          where: { id: String(args.id) },
          include: { ratings: true },
        });
      },
    });
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('uploadItem', {
      type: 'Item',
      args: {
        title: nonNull(stringArg()),
        imageUrl: nonNull(stringArg()),
        imagePlaceholder: nonNull(stringArg()),
      },
      resolve: (_, args, ctx) => {
        // dis-allow anonymous users
        if (!ctx.user) {
          throw new Error('Not authenticated');
        }
        return prisma.item.create({
          data: {
            name: args.title,
            imageUrl: args.imageUrl,
            imagePlaceholder: args.imagePlaceholder,
            published: false,
            uploader: {
              connect: { id: String(ctx.user?.id) },
            },
          },
        });
      },
    });
    t.field('deleteItem', {
      type: 'Item',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_, args, ctx) => {
        // dis-allow anonymous users
        if (!ctx.user) {
          throw new Error('Not authenticated');
        }
        // dis-allow non-admin users
        if (ctx.user?.role !== 'ADMIN') {
          throw new Error('Not authorized');
        }
        // get item
        const item = await prisma.item.findUnique({
          where: { id: String(args.id) },
        });
        // dis-allow deleting items that are already published
        if (item?.published) {
          throw new Error('Item is already published');
        }

        // delete the image from aws
        if (item?.imageUrl) {
          const params = {
            Bucket: process.env.S3_UPLOAD_BUCKET,
            Key: item.imageUrl,
          };
          try {
            await asyncS3Delete(params);
          } catch (error) {
            console.error(error);
            throw new Error('Failed to delete image');
          }
        }

        // delete item
        return prisma.item.delete({
          where: { id: String(args.id) },
        });
      },
    });
    t.field('publishItem', {
      type: 'Item',
      args: {
        id: nonNull(idArg()),
      },
      resolve: async (_, args, ctx) => {
        // dis-allow anonymous users
        if (!ctx.user) {
          throw new Error('Not authenticated');
        }
        // dis-allow non-admin users
        if (ctx.user?.role !== 'ADMIN') {
          throw new Error('Not authorized');
        }
        // get item
        const item = await prisma.item.findUnique({
          where: { id: String(args.id) },
        });
        // dis-allow publishing items that are already published
        if (item?.published) {
          throw new Error('Item is already published');
        }
        // publish item
        return prisma.item.update({
          where: { id: String(args.id) },
          data: { published: true },
        });
      },
    });
    t.field('setRatings', {
      type: list('Rating'),
      args: {
        ratings: nonNull(list(nonNull(RatingInput))),
      },
      resolve: async (_, { ratings }, ctx) => {
        // dis-allow anonymous users
        if (!ctx.user) {
          throw new Error('Not authenticated');
        }
        // delete my ratings that are in database, but not in input anymore
        await prisma.rating.deleteMany({
          where: {
            itemId: {
              notIn: ratings.map((rating) => rating.itemId),
            },
            AND: {
              userId: {
                in: ratings.map((rating) => rating.userId),
              },
            },
          },
        });
        // execute promises serially
        return prisma.$transaction(
          ratings.map((rating) => {
            return prisma.rating.upsert({
              where: {
                itemId_userId: {
                  itemId: rating.itemId,
                  userId: rating.userId,
                },
              },
              create: {
                value: rating.value,
                user: {
                  connect: { id: String(rating.userId) },
                },
                item: {
                  connect: { id: String(rating.itemId) },
                },
              },
              update: {
                value: rating.value,
              },
            });
          })
        );
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, Item, User, Rating, GQLDate, UserRole],
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
});

let apolloServerHandler: NextApiHandler;

type TUser = Session['user'];

interface IApolloContext {
  user: TUser | null;
}

async function getApolloServerHandler() {
  const apolloServer = new ApolloServer<IApolloContext>({
    schema,
  });

  if (!apolloServerHandler) {
    apolloServerHandler = startServerAndCreateNextHandler(apolloServer, {
      context: async (req, res) => {
        const session = await getServerSession(req, res, authOptions);
        return {
          user: session?.user,
        };
      },
    });
  }

  return apolloServerHandler;
}

const handler: NextApiHandler = async (req, res) => {
  apolloServerHandler = await getApolloServerHandler();

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  return apolloServerHandler(req, res);
};

export default cors()(handler);
