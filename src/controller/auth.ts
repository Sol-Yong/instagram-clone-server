import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/auth';
import { config } from '../config';

export async function signup(req: Request, res: Response) {
  const { username, password, name, email } = req.body;
  const foundEmail = await userRepository.findByEmail(email);
  const foundUsername = await userRepository.findByUsername(username);
  if (foundEmail) {
    return res
      .status(409)
      .json({
        existence: 'email',
        message: `이미 존재하는 이메일 입니다. ${email}`,
      });
  }
  if (foundUsername) {
    return res
      .status(409)
      .json({
        existence: 'username',
        message: `이미 존재하는 닉네임 입니다. ${username}`,
      });
  }

  const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    username,
    password: hashedPassword,
    name,
    email,
  });
  const token = createJwtToken(userId);

  res.status(201).json({ token, username });
}

function createJwtToken(id: string) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
