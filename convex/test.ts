import { query } from './_generated/server';

export const testFunction = query({
  args: {},
  handler: async ctx => {
    return { message: 'Convex is working!' };
  },
});
