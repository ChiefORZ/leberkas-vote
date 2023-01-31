import { ApolloServer } from 'apollo-server-micro';
import { DateTimeResolver } from 'graphql-scalars';
import cors from 'micro-cors';
import { NextApiHandler } from 'next';
import {
  asNexusMethod,
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
    t.string('id');
    t.string('name');
    t.string('email');
    t.list.field('ratings', {
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

// { id?: string; imageUrl?: string; title?: string; }
const Item = objectType({
  name: 'Item',
  definition(t) {
    t.string('id');
    t.nullable.string('title');
    t.nullable.string('imageUrl');
    t.int('avgRating', {
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
    t.string('id');
    t.int('value');
    t.field('user', {
      type: 'User',
      resolve: (parent) =>
        prisma.rating
          .findUnique({
            where: { id: String(parent.id) },
          })
          .user(),
    });
    t.field('item', {
      type: 'Item',
      resolve: (parent) =>
        prisma.rating
          .findUnique({
            where: { id: String(parent.id) },
          })
          .item(),
    });
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
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
        });
      },
    });
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createRating', {
      type: 'Rating',
      args: {
        value: nonNull(stringArg()),
        userId: nonNull(stringArg()),
        itemId: nonNull(stringArg()),
      },
      resolve: (_, { value, userId, itemId }, ctx) => {
        return prisma.rating.create({
          data: {
            value: Number(value),
            user: {
              connect: { id: userId },
            },
            item: {
              connect: { id: itemId },
            },
          },
        });
      },
    });

    // t.nullable.field('deletePost', {
    //   type: 'Post',
    //   args: {
    //     postId: stringArg(),
    //   },
    //   resolve: (_, { postId }, ctx) => {
    //     return prisma.post.delete({
    //       where: { id: String(postId) },
    //     })
    //   },
    // })

    // t.field('createDraft', {
    //   type: 'Post',
    //   args: {
    //     title: nonNull(stringArg()),
    //     content: stringArg(),
    //     authorEmail: stringArg(),
    //   },
    //   resolve: (_, { title, content, authorEmail }, ctx) => {
    //     return prisma.post.create({
    //       data: {
    //         title,
    //         content,
    //         published: false,
    //         author: {
    //           connect: { email: authorEmail },
    //         },
    //       },
    //     })
    //   },
    // })

    // t.nullable.field('publish', {
    //   type: 'Post',
    //   args: {
    //     postId: stringArg(),
    //   },
    //   resolve: (_, { postId }, ctx) => {
    //     return prisma.post.update({
    //       where: { id: String(postId) },
    //       data: { published: true },
    //     })
    //   },
    // })
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, Item, User, Rating, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

let apolloServerHandler: NextApiHandler;

async function getApolloServerHandler() {
  const apolloServer = new ApolloServer({ schema });

  if (!apolloServerHandler) {
    await apolloServer.start();

    apolloServerHandler = apolloServer.createHandler({
      path: '/api',
    });
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
