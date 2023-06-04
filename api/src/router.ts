import express, { Request, Response } from 'express';
import controllers from './controllers';

const router = express.Router();

const checkAuth = controllers.auth.isAuthorized;

router.get('/healthcheck', (req: Request, res: Response) => {
   res.send('Ok');
});

router.post('/auth', controllers.auth.createUser);

router.post('/auth/profile', checkAuth, controllers.auth.getProfile);

export default router;
