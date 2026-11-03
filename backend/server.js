import cookieParser from 'cookie-parser';
import cors from 'cors';
import './config/env.js';
import express from 'express';
import authRoutes from './routes/auth.js';
import awsRoutes from './routes/aws.js';
import orderRoutes from './routes/orders.js';
import productCategoryRoutes from './routes/productCategory.js';
import productRoutes from './routes/products.js';
import shippingRoutes from './routes/shipping.js';
import userRoutes from './routes/users.js';

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.API_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/aws', awsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shipping', shippingRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status === 400 ? 400 : 500;
  res.status(status).json({
    message: status === 400 ? 'Invalid request body' : 'Internal server error',
  });
});

export default app;
