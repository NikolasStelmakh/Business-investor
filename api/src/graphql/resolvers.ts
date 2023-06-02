import { Context } from './context';
import prisma from '../lib/prisma';

export const resolvers = {
  Query: {
    users: (parent: any, args: null, context: Context) => {
      return prisma.user.findMany();
    },
    staticData: async (parent: any, args: null, context: Context) => {
      return {
        userTypes: await prisma.userType.findMany(),
      };
    },
    // tasks: (
    //   parent: any,
    //   args: { userId: string; limit?: number; offset?: number },
    //   context: Context,
    // ) => {
    //   return prisma.task.findMany({
    //     where: { user_id: args.userId },
    //     include: { user: true, recurring_interval: true, categorie: true },
    //   });
    // },
  },
  Mutation: {
    // createTask: (
    //   parent: any,
    //   args: {
    //     name: string;
    //     startDate: string;
    //     userId: string;
    //     categorieId: number;
    //     recurringIntervalId: number;
    //   },
    //   context: Context,
    //   info: { cacheControl: any },
    // ) => {
    //   console.log(info.cacheControl);
    //   return prisma.task.create({
    //     data: {
    //       name: args.name,
    //       user_id: args.userId,
    //       start_date: args.startDate || undefined,
    //       categorie_id: args.categorieId,
    //       recurring_interval_id: args.recurringIntervalId,
    //     },
    //   });
    // },
  },
};
