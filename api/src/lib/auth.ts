import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types';

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

export function generateAccessToken(payload: AuthPayload) {
   return jwt.sign(payload, TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_TIME_LIVE || '5m',
   });
}
export function generateRefreshToken(payload: AuthPayload) {
   return jwt.sign(payload, TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_TIME_LIVE || '24h',
   });
}
