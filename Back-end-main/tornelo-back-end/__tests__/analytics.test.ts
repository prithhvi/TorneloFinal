import request from 'supertest';
import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import analyticsRouter from '../routes/analyticsRoutes'; // Replace with your actual import path

const app: Application = express();
app.use(express.json());
app.use('/analytics', analyticsRouter);

const prisma = new PrismaClient();

describe('Analytics Data Routes', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /analytics', () => {
    it('should get all analytics data', async () => {
      const response = await request(app).get('/analytics');
      expect(response.status).toBe(200);
      // Add more specific assertions for the response body
      expect(Array.isArray(response.body)).toBe(true); // Assuming it returns an array
    });
  });

  describe('GET /analytics/:id', () => {
    it('should get a single analytics data item by ID', async () => {
      // Create a test analytics data item first
      const createResponse = await request(app)
        .post('/analytics')
        .send({
          name: 'Test Analytics',
          amount: 50,
          totalSales: 25,
          views: 100,
          uptakes: 15,
          month: '2023-10-23T00:00:00Z', // Use ISO-8601 DateTime format
        });

      const id = createResponse.body.id;

      const response = await request(app).get(`/analytics/${id}`);
      expect(response.status).toBe(200);
      // Add more specific assertions for the response body
      expect(response.body.name).toBe('Test Analytics');
      expect(response.body.amount).toBe(50);
      // Add more assertions as needed
    });

    it('should return 404 when getting a non-existent analytics data item by ID', async () => {
      const id = 999; // Non-existent ID

      const response = await request(app).get(`/analytics/${id}`);
      expect(response.status).toBe(404);
      // You can also check the response body for an error message, if applicable
      expect(response.body.error).toBe('Analytics Data not found');
    });
  });

  describe('PUT /analytics/:id', () => {
    it('should update an analytics data item by ID', async () => {
      // Create a test analytics data item first
      const createResponse = await request(app)
        .post('/analytics')
        .send({
          name: 'Test Analytics',
          amount: 50,
          totalSales: 25,
          views: 100,
          uptakes: 15,
          month: '2023-10-23T00:00:00Z', // Use ISO-8601 DateTime format
        });

      const id = createResponse.body.id;

      const updatedData = {
        name: 'Updated Analytics',
        amount: 60,
        totalSales: 30,
        views: 120,
        uptakes: 20,
        month: '2023-10-23T00:00:00Z', // Use ISO-8601 DateTime format
      };

      const response = await request(app)
        .put(`/analytics/${id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      // Add more specific assertions for the response body
    });

    it('should return 404 when updating a non-existent analytics data item', async () => {
      const updatedData = {
        name: 'Updated Analytics',
        amount: 60,
        totalSales: 30,
        views: 120,
        uptakes: 20,
        month: '2023-10-23T00:00:00Z', // Use ISO-8601 DateTime format
      };

      const id = 999; // Non-existent ID

      const response = await request(app)
        .put(`/analytics/${id}`)
        .send(updatedData);

      expect(response.status).toBe(404);
      // You can also check the response body for an error message, if applicable
      expect(response.body.error).toBe('Record not found');
    });
  });

  // Add more test cases as needed
});
