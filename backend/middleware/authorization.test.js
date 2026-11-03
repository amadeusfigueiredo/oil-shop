import { beforeEach, expect, test, vi } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { decodeJWT } from './decodeToken.js';
import {
  requireAdmin,
  requireOrderAccess,
  requireUserAccess,
} from './authorization.js';
import db from '../models/index.js';

vi.mock('../models/index.js', () => ({
  __esModule: true,
  default: {
    users: { findByPk: vi.fn() },
    orders: { findByPk: vi.fn() },
    roles: {},
  },
}));

const app = express();
app.use(express.json(), cookieParser());
app.get('/admin', decodeJWT, requireAdmin, (req, res) => res.sendStatus(200));
app.get('/users/:id', decodeJWT, requireUserAccess('id'), (req, res) =>
  res.sendStatus(200)
);
app.get(
  '/orders/:id',
  decodeJWT,
  requireOrderAccess((req) => req.params.id),
  (req, res) => res.sendStatus(200)
);
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.sendStatus(500);
});

beforeEach(() => {
  process.env.JWT_KEY = 'authorization-test-only-key';
  db.users.findByPk
    .mockReset()
    .mockResolvedValue({ role: { name: 'customer' } });
  db.orders.findByPk.mockReset().mockResolvedValue({ userId: 1 });
});

const cookie = (id = 1) => `token=${jwt.sign({ id }, process.env.JWT_KEY)}`;

test('anonymous users cannot access protected operations', async () => {
  expect((await request(app).get('/admin')).status).toBe(401);
  expect(db.users.findByPk).not.toHaveBeenCalled();
});

test('customers cannot perform administrator operations', async () => {
  expect(
    (await request(app).get('/admin').set('Cookie', cookie())).status
  ).toBe(403);
});

test('administrators are authorized using their current database role', async () => {
  db.users.findByPk.mockResolvedValue({ role: { name: 'admin' } });
  expect(
    (await request(app).get('/admin').set('Cookie', cookie())).status
  ).toBe(200);
  db.users.findByPk.mockResolvedValue({ role: { name: 'customer' } });
  expect(
    (await request(app).get('/admin').set('Cookie', cookie())).status
  ).toBe(403);
});

test('customers can access themselves but cannot access another account', async () => {
  expect(
    (await request(app).get('/users/1').set('Cookie', cookie())).status
  ).toBe(200);
  expect(
    (await request(app).get('/users/2').set('Cookie', cookie())).status
  ).toBe(403);
});

test('administrators can access another account', async () => {
  db.users.findByPk.mockResolvedValue({ role: { name: 'admin' } });
  expect(
    (await request(app).get('/users/2').set('Cookie', cookie())).status
  ).toBe(200);
});

test('order access verifies ownership', async () => {
  expect(
    (await request(app).get('/orders/1').set('Cookie', cookie())).status
  ).toBe(200);
  expect(
    (await request(app).get('/orders/1').set('Cookie', cookie(2))).status
  ).toBe(403);
});

test('invalid and nonexistent orders are rejected', async () => {
  expect(
    (await request(app).get('/orders/not-an-id').set('Cookie', cookie())).status
  ).toBe(400);
  expect(db.orders.findByPk).not.toHaveBeenCalled();
  db.orders.findByPk.mockResolvedValue(null);
  expect(
    (await request(app).get('/orders/1').set('Cookie', cookie())).status
  ).toBe(404);
});

test('a failed permission lookup does not authorize the request', async () => {
  db.users.findByPk.mockRejectedValue(new Error('Database unavailable'));
  expect(
    (await request(app).get('/admin').set('Cookie', cookie())).status
  ).toBe(500);
});
