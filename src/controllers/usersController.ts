import { Request, Response } from 'express';
import { User } from '@Models/user';

export const getUsers = (req: Request, res: Response) => {
  res.send('getUsers');
};

export const createUser = async (req: Request, res: Response) => {
  const { body } = req;
  const user = new User(body);

  try {
    await user.save();
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(400).send(`An error occurred while creating the user:${error}`);
  }
};
