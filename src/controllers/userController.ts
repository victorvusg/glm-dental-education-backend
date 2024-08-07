import { Request, Response } from 'express';
import User from '../models/user';
import { MongoServerError } from 'mongodb';
import Account from '../models/account';
import env from '../config/env';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ERROR_RESPONSE } from '../constants';

export const userCreate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { accountId, role, fullName } = req.body;

  // Check if accountId is existed
  try {
    await Account.findById(accountId);
  } catch (err) {
    const error = err as MongoServerError;
    res.status(400).json({ error: 'Account Id is invalid' });
    return;
  }

  // Create user link to account
  try {
    const newUser = new User({ accountId, role, fullName });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    const error = err as MongoServerError;
    res.status(400).json({ error: error.errmsg });
  }
};

export const userGet = async (req: Request, res: Response): Promise<void> => {
  const authorizationHeader = req.header('Authorization');

  const token = authorizationHeader?.replace('Bearer ', '');

  if (!!token) {
    jwt.verify(token, env.jwtSecret, async (err, decoded) => {
      if (err && !decoded) {
        res.status(403);
        return;
      }

      const decodedData = decoded as JwtPayload;

      try {
        const user = await User.findOne({
          accountId: decodedData?._id as string,
        });
        if (!user) {
          res.status(404).json(ERROR_RESPONSE.RECORD_NOT_FOUND);
          return;
        }
        res.status(200).json({ user: user });
        return;
      } catch (error) {
        res.status(500).json(ERROR_RESPONSE.RECORD_NOT_FOUND);
        return;
      }
    });
    return;
  }
  res.send(400).json(ERROR_RESPONSE.INVALID_TOKEN);
  return;
};
