import { beforeEach, expect, test, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import app from '../server.js';
import db from '../models/index.js';

vi.mock('../models/index.js', () => ({
  default: {
    users: { findByPk: vi.fn() },
    roles: {},
    products: { findAll: vi.fn(), findOne: vi.fn(), create: vi.fn() },
    productCategories: { findAll: vi.fn() },
    orders: { findByPk: vi.fn() },
  },
}));
vi.mock('@aws-sdk/s3-request-presigner', () => ({ getSignedUrl: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  process.env.JWT_KEY = 'route-test-only-signing-key';
  db.users.findByPk.mockResolvedValue({ role: { name: 'customer' } });
  db.products.findAll.mockResolvedValue([]);
  db.productCategories.findAll.mockResolvedValue([]);
});

const cookie = () => `token=${jwt.sign({ id: 1 }, process.env.JWT_KEY)}`;

test.each([
  ['get', '/api/users'],
  ['post', '/api/users/create-admin'],
  ['put', '/api/users/1'],
  ['delete', '/api/users/1'],
  ['post', '/api/products'],
  ['put', '/api/products/1'],
  ['delete', '/api/products/1'],
  ['post', '/api/product-categories'],
  ['get', '/api/aws/generate-upload-url?fileName=oil.png'],
  ['get', '/api/shipping/1'],
  ['post', '/api/shipping/1'],
  ['put', '/api/shipping/1'],
  ['get', '/api/orders'],
  ['get', '/api/orders/user/1'],
  ['get', '/api/orders/last-order/1'],
  ['get', '/api/orders/items/1'],
  ['post', '/api/orders/user/1'],
  ['post', '/api/orders/items'],
])('%s %s rejects anonymous requests', async (method, path) => {
  const response = await request(app)[method](path).send({});
  expect(response.status).toBe(401);
});

test('the catalog remains accessible without an account', async () => {
  expect((await request(app).get('/api/products')).status).toBe(200);
  expect((await request(app).get('/api/product-categories')).status).toBe(200);
});

test('customers cannot modify products or read another account shipping details', async () => {
  expect(
    (await request(app).delete('/api/products/1').set('Cookie', cookie()))
      .status
  ).toBe(403);
  expect(
    (await request(app).get('/api/shipping/2').set('Cookie', cookie())).status
  ).toBe(403);
});

test('duplicate products return one conflict response without creating another product', async () => {
  db.users.findByPk.mockResolvedValue({ role: { name: 'admin' } });
  db.products.findOne.mockResolvedValue({ id: 1 });
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie())
    .send({
      name: 'Oil',
      brand: 'Brand',
      image: '',
      description: '',
      size: 5,
      categoryId: 1,
      price: 10,
      details: '',
    });
  expect(response.status).toBe(422);
  expect(db.products.create).not.toHaveBeenCalled();
});

test('S3 v3 signing preserves the upload response contract without a network request', async () => {
  db.users.findByPk.mockResolvedValue({ role: { name: 'admin' } });
  vi.mocked(getSignedUrl).mockResolvedValue(
    'https://signed.example.test/upload'
  );
  const response = await request(app)
    .get('/api/aws/generate-upload-url?fileName=oil.png')
    .set('Cookie', cookie());
  expect(response.status).toBe(200);
  expect(response.body.uploadURL).toBe('https://signed.example.test/upload');
  expect(response.body.fileName).toMatch(/^\d+-oil\.png$/);
  expect(getSignedUrl).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      input: { Bucket: 'oylo-images', Key: response.body.fileName },
    }),
    { expiresIn: 3600 }
  );
});

test('invalid JSON returns a structured client error', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send('{invalid');
  expect(response.status).toBe(400);
  expect(response.body).toEqual({ message: 'Invalid request body' });
});
