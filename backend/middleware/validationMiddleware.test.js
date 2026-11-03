import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';
import { validateBody, validateParams } from './validationMiddleware.js';
import { CreateProductSchema } from './validationSchemas/productSchema.js';

const response = () => {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
};

describe('request validation', () => {
  test('invalid Zod 4 input returns structured issues without continuing', () => {
    const req = { body: { name: 123 } };
    const res = response();
    const next = vi.fn();
    validateBody(z.object({ name: z.string() }))(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        expect.objectContaining({
          path: ['name'],
          message: expect.any(String),
        }),
      ],
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('validated data applies transformations and strips unexpected fields', () => {
    const req = { body: { name: '  Customer  ', roleId: 1 } };
    const next = vi.fn();
    validateBody(z.object({ name: z.string().trim() }))(req, response(), next);
    expect(req.body).toEqual({ name: 'Customer' });
    expect(next).toHaveBeenCalledOnce();
  });

  test('product validation preserves the brand used by the catalog', () => {
    const product = {
      name: 'Oil',
      brand: 'Brand',
      image: '',
      description: '',
      size: 5,
      categoryId: 1,
      price: 10,
      details: '',
    };
    const req = { body: product };
    validateBody(CreateProductSchema)(req, response(), vi.fn());
    expect(req.body.brand).toBe('Brand');
  });

  test('Express 5 read-only params property can still be validated', () => {
    const params = { id: '5' };
    const req = {
      get params() {
        return params;
      },
    };
    const next = vi.fn();
    validateParams(z.object({ id: z.coerce.number().int().positive() }))(
      req,
      response(),
      next
    );
    expect(req.params.id).toBe(5);
    expect(next).toHaveBeenCalledOnce();
  });
});
