import { GraphQlApiRequest } from '../types';

export interface Context {
   token?: string;
}

export const createContext = async ({ req }: { req: GraphQlApiRequest }): Promise<Context> => ({
   token: req.authToken,
});
