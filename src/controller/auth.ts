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
    return res.status(409).json({
      existence: 'email',
      message: `이미 존재하는 이메일 입니다. ${email}`,
    });
  }
  if (foundUsername) {
    return res.status(409).json({
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

export async function login(req: Request, res: Response) {
  const { userId, password } = req.body;
  let loginedemail = '';
  let loginedUsername = '';
  let user = null;

  if (isEmail(userId)) {
    loginedemail = userId;
    user = await userRepository.findByEmail(loginedemail);
  } else {
    loginedUsername = userId;
    user = await userRepository.findByUsername(loginedUsername);
  }

  if (!user) {
    return res
      .status(401)
      .json({ message: '아이디 또는 비밀번호가 잘못 되었습니다.' });
  }
  const { username, email } = user;

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res
      .status(401)
      .json({ message: '아이디 또는 비밀번호가 잘못 되었습니다.' });
  }

  if (user.id) {
    const token = createJwtToken(user.id);
    res.status(201).json({ token, email, username });
  }
}

function isEmail(string: string) {
  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  if (string.match(emailRegExp) === null) {
    return false;
  } else {
    return true;
  }
}
