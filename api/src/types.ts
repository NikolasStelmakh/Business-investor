import { Request } from 'express';

export type GraphQlApiRequest = Request & {
   authToken?: string;
};

export type AuthPayload = {
   id: string;
   name?: string;
   email?: string;
};
export interface AuthorizedRequest extends Request {
   user?: {
      id: string;
      userType: number;
   };
}
