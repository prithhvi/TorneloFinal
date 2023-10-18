import request from 'supertest';
import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import shippingRouter from '../routes/shippingRoutes';

const app: Application = express();
app.use(express.json());
app.use('/', shippingRouter);

const prisma = new PrismaClient();

describe('Shipping Routes', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /', () => {
    it('should create a new shipping information record', async () => {
      const requestData = {
        name: 'John Doe',
        address: '123 Main St',
        email: 'john@example.com',
        phone: '123-456-7890',
        postCode: '12345',
        userId: 1,
        state: 'CA',
      };

      const response = await request(app)
        .post('/')
        .send(requestData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(requestData);
    });
  });

  describe('PUT /:id', () => {
    it('should update a shipping information record by ID', async () => {
      // Create a test record first
      const createResponse = await request(app)
        .post('/')
        .send({
          name: 'Test User',
          address: 'Test Address',
          email: 'test@example.com',
          phone: '555-555-5555',
          postCode: '54321',
          userId: 2,
          state: 'NY',
        });

      const updatedData = {
        name: 'Updated User',
        address: 'Updated Address',
        email: 'updated@example.com',
      };

      const id = createResponse.body.shippingId;

      const response = await request(app)
        .put(`/${id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updatedData);
    });

    it('should return 404 when updating a non-existent shipping information record', async () => {
      const updatedData = {
        name: 'Updated User',
        address: 'Updated Address',
        email: 'updated@example.com',
      };

      const id = 999; // Non-existent ID

      const response = await request(app)
        .put(`/${id}`)
        .send(updatedData);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /', () => {
    it('should get all shipping information records', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /:id', () => {
    it('should get a single shipping information record by ID', async () => {
      // Create a test record first
      const createResponse = await request(app)
        .post('/')
        .send({
          name: 'Test User',
          address: 'Test Address',
          email: 'test@example.com',
          phone: '555-555-5555',
          postCode: '54321',
          userId: 2,
          state: 'NY',
        });

      const id = createResponse.body.shippingId;

      const response = await request(app).get(`/${id}`);
      expect(response.status).toBe(200);
      expect(response.body.shippingId).toBe(id);
    });

    it('should return 404 when getting a non-existent shipping information record by ID', async () => {
      const id = 999; // Non-existent ID

      const response = await request(app).get(`/${id}`);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a shipping information record by ID', async () => {
      // Create a test record first
      const createResponse = await request(app)
        .post('/')
        .send({
          name: 'Test User',
          address: 'Test Address',
          email: 'test@example.com',
          phone: '555-555-5555',
          postCode: '54321',
          userId: 2,
          state: 'NY',
        });

      const id = createResponse.body.shippingId;

      const deleteResponse = await request(app).delete(`/${id}`);
      expect(deleteResponse.status).toBe(200);

      // Verify that the record is deleted by attempting to retrieve it
      const getResponse = await request(app).get(`/${id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting a non-existent shipping information record by ID', async () => {
      const id = 999; // Non-existent ID

      const response = await request(app).delete(`/${id}`);
      expect(response.status).toBe(404);
    });
  });
});
