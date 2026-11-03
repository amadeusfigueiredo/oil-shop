import { beforeEach, expect, test, vi } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import authRoutes from './auth.js';
import db from '../models/index.js';
import { comparePassword } from '../middleware/passwordEncrypt.js';

vi.mock('../models/index.js', () => ({
  __esModule: true,
  default: { users: { findOne: vi.fn() }, roles: {} },
}));
vi.mock('../middleware/passwordEncrypt.js', () => ({
  comparePassword: vi.fn(),
}));

const app = express();
app.use(express.json(), cookieParser());
app.use('/auth', authRoutes);

beforeEach(() => {
  process.env.JWT_KEY = 'test-only-signing-key';
  delete process.env.IS_SECURE;
  db.users.findOne.mockResolvedValue({
    id: 1,
    password: 'stored-password-hash',
    toJSON: () => ({
      id: 1,
      email: 'test@example.com',
      password: 'stored-password-hash',
    }),
  });
  comparePassword.mockResolvedValue(true);
});

const login = () =>
  request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'Password!' });

test('login issues a four-hour token without returning the password hash', async () => {
  const response = await login();
  expect(response.status).toBe(200);
  expect(response.body.user).not.toHaveProperty('password');
  const cookie = response.headers['set-cookie'][0];
  const token = jwt.verify(
    cookie.split(';')[0].slice('token='.length),
    process.env.JWT_KEY
  );
  expect(token.exp - token.iat).toBe(4 * 60 * 60);
});

test.each([undefined, 'false'])(
  'HTTP login uses a browser-compatible cookie when IS_SECURE is %s',
  async (value) => {
    if (value !== undefined) process.env.IS_SECURE = value;
    const response = await login();
    const cookie = response.headers['set-cookie'][0];
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).not.toContain('; Secure');
    const logout = await request(app).post('/auth/logout');
    expect(logout.headers['set-cookie'][0]).toContain('SameSite=Lax');
  }
);

test('HTTPS login and logout use matching secure cross-site cookies', async () => {
  process.env.IS_SECURE = 'true';
  for (const response of [
    await login(),
    await request(app).post('/auth/logout'),
  ]) {
    expect(response.headers['set-cookie'][0]).toContain('; Secure');
    expect(response.headers['set-cookie'][0]).toContain('SameSite=None');
  }
});

test('missing password is rejected before accessing the database', async () => {
  db.users.findOne.mockClear();
  const response = await request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com' });
  expect(response.status).toBe(400);
  expect(db.users.findOne).not.toHaveBeenCalled();
});

test('invalid and expired tokens return an authentication error', async () => {
  const expired = jwt.sign({ id: 1 }, process.env.JWT_KEY, { expiresIn: -1 });
  for (const token of ['invalid', expired]) {
    const response = await request(app)
      .get('/auth/user-token')
      .set('Cookie', `token=${token}`);
    expect(response.status).toBe(403);
  }
});
