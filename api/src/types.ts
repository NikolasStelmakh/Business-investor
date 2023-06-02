import { Request } from 'express';

export type ApiRequest = Request & {
  authToken?: string;
};
