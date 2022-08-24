import express from 'express';
import {} from 'express-async-errors';
import { body } from 'express-validator';
import * as authController from '../controller/auth';
import { validate } from '../middleware/validator';

const router = express.Router();

const validateCredential = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('이메일 형식이 올바르지 않습니다.'),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자리 이상이어야 합니다.'),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body('name').notEmpty().withMessage('이름을 입력해주세요.'),
  body('username')
    .notEmpty()
    .isLength({ min: 5, max: 10 })
    .matches(/^[A-Za-z0-9.,'!&]+$/)
    .withMessage(
      '닉네임은 최소 5글자 ~ 10글자로 이루어진 영문과 특수문자 조합으로 가능합니다.'
    ),
  validate,
];

router.post('/signup', validateSignup, authController.signup);

export default router;
