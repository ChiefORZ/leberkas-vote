import path from 'node:path';

import type { NextApiHandler } from 'next';
import type { Session } from 'next-auth';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import AWS from 'aws-sdk';
import { DateTimeResolver } from 'graphql-scalars';
import cors from 'micro-cors';
import { getServerSession } from 'next-auth/next';
import {
  asNexusMethod,
  enumType,
  idArg,
  inputObjectType,
  list,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

AWS.config.update({
  accessKeyId: process.env.S3_UPLOAD_KEY,
  region: process.env.S3_UPLOAD_REGION,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
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
  members: ['USER', 'ADMIN'],
  name: 'UserRole',
});

const User = objectType({
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.string('email');
    t.nonNull.field('role', { type: UserRole });
    t.nonNull.list.field('ratings', {
      resolve: (parent) =>
        prisma.user
          .findUnique({
            where: { id: String(parent.id) },
          })
          .ratings(),
      type: 'Rating',
    });
  },
  name: 'User',
});

const Item = objectType({
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
  name: 'Item',
});

const Rating = objectType({
  definition(t) {
    t.nonNull.int('value');
    t.nonNull.string('userId');
    t.nonNull.field('user', {
      resolve: (parent) =>
        prisma.rating
          .findUnique({
            where: {
              itemId_userId: { itemId: parent.itemId, userId: parent.userId },
            },
          })
          .user(),
      type: 'User',
    });
    t.nonNull.string('itemId');
    t.nonNull.field('item', {
      resolve: (parent) =>
        prisma.rating
          .findUnique({
            where: {
              itemId_userId: { itemId: parent.itemId, userId: parent.userId },
            },
          })
          .item(),
      type: 'Item',
    });
  },
  name: 'Rating',
});

const RatingInput = inputObjectType({
  definition(t) {
    t.nonNull.string('itemId');
    t.nonNull.string('userId');
    t.nonNull.int('value');
  },
  name: 'RatingInput',
});

const Query = objectType({
  definition(t) {
    t.field('getMe', {
      resolve: (_, __, ctx) => {
        return prisma.user.findUnique({
          include: { ratings: true },
          where: { id: String(ctx.user?.id) },
        });
      },
      type: 'User',
    });

    t.field('getItems', {
      resolve: (_) => {
        return prisma.item.findMany({
          include: { ratings: true },
          where: { published: true },
        });
      },

      type: list('Item'),
    });

    t.field('getItem', {
      args: {
        id: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.item.findUnique({
          include: { ratings: true },
          where: { id: String(args.id) },
        });
      },
      type: 'Item',
    });
  },
  name: 'Query',
});

const Mutation = objectType({
  definition(t) {
    t.field('uploadItem', {
      args: {
        imagePlaceholder: nonNull(stringArg()),
        imageUrl: nonNull(stringArg()),
        title: nonNull(stringArg()),
      },
      resolve: (_, args, ctx) => {
        // dis-allow anonymous users
        if (!ctx.user) {
          throw new Error('Not authenticated');
        }
        return prisma.item.create({
          data: {
            imagePlaceholder: args.imagePlaceholder,
            imageUrl: args.imageUrl,
            name: args.title,
            published: false,
            uploader: {
              connect: { id: String(ctx.user?.id) },
            },
          },
        });
      },
      type: 'Item',
    });
    t.field('deleteItem', {
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
      type: 'Item',
    });
    t.field('publishItem', {
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
          data: { published: true },
          where: { id: String(args.id) },
        });
      },
      type: 'Item',
    });
    t.field('setRatings', {
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
            AND: {
              userId: {
                in: ratings.map((rating) => rating.userId),
              },
            },
            itemId: {
              notIn: ratings.map((rating) => rating.itemId),
            },
          },
        });
        // execute promises serially
        return prisma.$transaction(
          ratings.map((rating) => {
            return prisma.rating.upsert({
              create: {
                item: {
                  connect: { id: String(rating.itemId) },
                },
                user: {
                  connect: { id: String(rating.userId) },
                },
                value: rating.value,
              },
              update: {
                value: rating.value,
              },
              where: {
                itemId_userId: {
                  itemId: rating.itemId,
                  userId: rating.userId,
                },
              },
            });
          })
        );
      },
      type: list('Rating'),
    });
  },
  name: 'Mutation',
});

export const schema = makeSchema({
  outputs: {
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
  },
  types: [Query, Mutation, Item, User, Rating, GQLDate, UserRole],
});

let apolloServerHandler: NextApiHandler;

type TUser = Session['user'];

interface IApolloContext {
  user: TUser | null;
}

function getApolloServerHandler() {
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
