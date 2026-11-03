import { decodeJWT } from '../middleware/decodeToken.js';
import { requireUserAccess } from '../middleware/authorization.js';
import dotenv from 'dotenv';
import express from 'express';
import { validateBody } from '../middleware/validationMiddleware.js';
import { shippingDataValidation } from '../middleware/validationSchemas/userSchema.js';
import db from '../models/index.js';
dotenv.config({ quiet: true });
const router = express.Router();

router.get('/:id', decodeJWT, requireUserAccess('id'), async (req, res) => {
  try {
    let shippingData = await db.shippingData.findOne({
      where: { userId: req.params.id },
    });
    const user = await db.users.findOne({
      where: { id: req.params.id },
    });
    if (!shippingData && user) {
      const initialData = {
        userId: req.params.id,
        street: 'Street',
        number: 'number',
        details: 'details',
        postalCode: 'postal code',
        city: 'city',
        state: 'state',
        country: 'country',
      };

      shippingData = await db.shippingData.create(initialData);
    }
    if (shippingData) {
      return res.status(200).json(shippingData);
    } else if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post('/:id', decodeJWT, requireUserAccess('id'), async (req, res) => {
  try {
    const shippingData = await db.shippingData.findOne({
      where: { userId: req.params.id },
    });
    if (!shippingData) {
      const newShippingData = await db.shippingData.create({
        ...req.body,
        userId: req.params.id,
      });

      return res.status(201).json({
        message: 'Shipping data created successfully',
        data: newShippingData,
      });
    } else {
      return res.status(422).json({ message: 'User has already shippingData' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.put(
  '/:id',
  decodeJWT,
  requireUserAccess('id'),
  validateBody(shippingDataValidation),

  async (req, res) => {
    try {
      const shippingData = await db.shippingData.findOne({
        where: { userId: req.params.id },
      });

      if (!shippingData) {
        const created = await db.shippingData.create({
          ...req.body,
          userId: req.params.id,
        });
        return res.status(200).json(created);
      } else {
        shippingData.userId = req.params.id;
        shippingData.street = req.body.street || shippingData.street;
        shippingData.number = req.body.number || shippingData.number;
        shippingData.details = req.body.details || shippingData.details;
        shippingData.postalCode =
          req.body.postalCode || shippingData.postalCode;
        shippingData.city = req.body.city || shippingData.city;
        shippingData.state = req.body.state || shippingData.state;
        shippingData.country = req.body.country || shippingData.country;

        await shippingData.save();
      }

      return res.status(200).json(shippingData);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

export default router;
