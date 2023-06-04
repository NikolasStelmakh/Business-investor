import { NextFunction, Response } from 'express';
import { AuthorizedRequest } from '../types';

const isAuthorized = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
   if (!req.user?.id) return res.sendStatus(401);
   next();
};

const isAdmin = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
   if (req.user?.userType !== 1) return res.sendStatus(401);
   next();
};

const isInvestor = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
   if (req.user?.userType !== 2) return res.sendStatus(401);
   next();
};

const isClient = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
   if (req.user?.userType !== 3) return res.sendStatus(401);
   next();
};

const createUser = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
   return res.sendStatus(200);
};

const getProfile = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
   return res.sendStatus(200);
};

export default {
   isAuthorized,
   isAdmin,
   isInvestor,
   isClient,
   createUser,
   getProfile,
};
