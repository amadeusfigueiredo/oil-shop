import { decodeJWT } from '../middleware/decodeToken.js';
import { requireAdmin } from '../middleware/authorization.js';
import express from 'express';
import { validateBody } from '../middleware/validationMiddleware.js';
import { ProductCategorySchema } from '../middleware/validationSchemas/productSchema.js';
import db from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const productCategories = await db.productCategories.findAll();
    res.json(productCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  '/',
  decodeJWT,
  requireAdmin,
  validateBody(ProductCategorySchema),
  async (req, res) => {
    try {
      const productCategory = await db.productCategories.findOne({
        where: {
          name: req.body.name,
        },
      });

      if (productCategory) {
        res.status(400).json({
          message:
            'Can not add category with this name, please try with another name',
        });
      } else {
        const newProductCategory = await db.productCategories.create(req.body);
        res.status(201).json(newProductCategory);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
