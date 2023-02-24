import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { DateTimeResolver } from 'graphql-scalars';
import cors from 'micro-cors';
import { NextApiHandler } from 'next';
import {
  asNexusMethod,
  inputObjectType,
  list,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from 'nexus';
import path from 'path';

import prisma from '../../lib/prisma';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date');

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.string('email');
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
        return prisma.item.findMany({ include: { ratings: true } });
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
    t.field('setRatings', {
      type: list('Rating'),
      args: {
        ratings: nonNull(list(nonNull(RatingInput))),
      },
      // @ts-ignore
      resolve: async (_, { ratings }, ctx) => {
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
  types: [Query, Mutation, Item, User, Rating, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
});

let apolloServerHandler: NextApiHandler;

async function getApolloServerHandler() {
  const apolloServer = new ApolloServer({ schema });

  if (!apolloServerHandler) {
    apolloServerHandler = startServerAndCreateNextHandler(apolloServer);
  }

  return apolloServerHandler;
}

const handler: NextApiHandler = async (req, res) => {
  const apolloServerHandler = await getApolloServerHandler();

  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }

  return apolloServerHandler(req, res);
};

export default cors()(handler);
