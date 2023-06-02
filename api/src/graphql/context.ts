import { ApiRequest } from '../types';

export interface Context {
  token?: string;
}

export const createContext = async ({
  req,
}: {
  req: ApiRequest;
}): Promise<Context> => ({
  token: req.authToken,
});
