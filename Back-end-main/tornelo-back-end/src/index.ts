// Import necessary dependencies
import express, { NextFunction } from 'express';
import productRoutes from '../routes/productRoutes';
import shoppingCartRoutes from '../routes/shoppingCartRoutes';
import userRoutes from '../routes/userRoutes';
import analyticsRoutes from '../routes/analyticsRoutes';
import completedOrderRoutes from '../routes/completedOrderRoutes';
import shippingRoutes from '../routes/shippingRoutes';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create an instance of the Express app
const app = express();

// Allow all domains to access the API endpoint
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next();
});

// Use the router for all product-related routes
app.use('/api/products', productRoutes);

// Use the router for all shopping cart-related routes
app.use('/api/shoppingCart', shoppingCartRoutes);

// Use the router for all user related routes
app.use('/api/user', userRoutes);

// Use the router for all completed order routes
app.use('/api/completedOrders', completedOrderRoutes);

// Use the router for all analytics related routes
app.use('/api/analytics', analyticsRoutes);

// Use the router for all analytics related routes
app.use('/api/shipping', shippingRoutes);

const port = process.env.PORT || 5100;

prisma.$connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });