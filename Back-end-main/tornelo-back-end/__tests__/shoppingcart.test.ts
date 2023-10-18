import request from 'supertest';
import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import shoppingCartRouter from '../routes/shoppingCartRoutes'; // Replace with your actual import path

const app: Application = express();
app.use(express.json());
app.use('/', shoppingCartRouter);

const prisma = new PrismaClient();

describe('Shopping Cart Routes', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /', () => {
    it('should create a new shopping cart item', async () => {
      const requestData = {
        userId: 2,
        prodId: 3,
        prodQuantity: 1,
        prodCost: 15,
        prodName: 'New Product',
      };

      const response = await request(app)
        .post('/')
        .send(requestData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(requestData);
    });
  });

  describe('PUT /:id', () => {
    it('should update a shopping cart item by ID', async () => {
      // Create a test shopping cart item first
      const createResponse = await request(app)
        .post('/')
        .send({
          userId: 2,
          prodId: 3,
          prodQuantity: 1,
          prodCost: 15,
          prodName: 'New Product',
        });

      const updatedData = {
        userId: 2,
        prodId: 4, // Change the product ID
        prodQuantity: 2, // Change the product quantity
        prodCost: 10, // Change the product cost
        prodName: 'New Product', // Updated product name
      };

      const id = createResponse.body.id;

      const response = await request(app)
        .put(`/${id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updatedData);
    });

    it('should return 404 when updating a non-existent shopping cart item', async () => {
      const updatedData = {
        userId: 2,
        prodId: 4,
        prodQuantity: 2,
        prodCost: 10,
        prodName: 'New Product',
      };

      const id = 999; // Non-existent ID

      const response = await request(app)
        .put(`/${id}`)
        .send(updatedData);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /', () => {
    it('should get all shopping cart items', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /:id', () => {
    it('should get a single shopping cart item by ID', async () => {
      // Create a test shopping cart item first
      const createResponse = await request(app)
        .post('/')
        .send({
          userId: 2,
          prodId: 3,
          prodQuantity: 1,
          prodCost: 15,
          prodName: 'New Product',
        });

      const id = createResponse.body.id;

      const response = await request(app).get(`/${id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);
    });

    it('should return 404 when getting a non-existent shopping cart item by ID', async () => {
      const id = 999; // Non-existent ID

      const response = await request(app).get(`/${id}`);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a shopping cart item by ID', async () => {
      // Create a test shopping cart item first
      const createResponse = await request(app)
        .post('/')
        .send({
          userId: 2,
          prodId: 3,
          prodQuantity: 1,
          prodCost: 15,
          prodName: 'New Product',
        });

      const id = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/${id}`);
      expect(deleteResponse.status).toBe(200);

      // Verify that the record is deleted by attempting to retrieve it
      const getResponse = await request(app).get(`/${id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting a non-existent shopping cart item by ID', async () => {
      const id = 999; // Non-existent ID

      const response = await request(app).delete(`/${id}`);
      expect(response.status).toBe(404);
    });
  });
});
