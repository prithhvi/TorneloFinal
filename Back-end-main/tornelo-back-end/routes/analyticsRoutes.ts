import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const router = express.Router();

// Parse application/json
router.use(bodyParser.json());

// Get all Analytics Data
router.get('/', getAllAnalytics);

// Get a single Analytics Data by ID
router.get('/:id', getAnalyticsById);

// Create a new Analytics Data
router.post('/', createAnalytics);

// Update an Analytics Data by ID
router.put('/:id', updateAnalytics);

// Delete an Analytics Data by ID
router.delete('/:id', deleteAnalytics);

// Define a function to get all Analytics Data
async function getAllAnalytics(req: Request, res: Response) {
  try {
    const analyticsData = await prisma.analytics.findMany();
    res.json(analyticsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

// Define a function to get a single Analytics Data by ID
async function getAnalyticsById(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const analyticsData = await prisma.analytics.findUnique({ where: { id } });
    if (!analyticsData) {
      return res.status(404).json({ error: 'Analytics Data not found' });
    }
    res.json(analyticsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}

// Define a function to create a new Analytics Data
async function createAnalytics(req: Request, res: Response) {
  const { name, amount, totalSales, views, uptakes, month } = req.body;

  // Input validation
  if (!name || !amount || !totalSales || !views || !uptakes || !month) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newAnalyticsData = await prisma.analytics.create({
      data: {
        name,
        amount,
        totalSales,
        views,
        uptakes,
        month,
      },
    });
    res.json(newAnalyticsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Define a function to update an Analytics Data by ID
async function updateAnalytics(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { name, amount, totalSales, views, uptakes, month } = req.body;

  try {
    // Check if the record with the specified id exists
    const existingRecord = await prisma.analytics.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Create an object to hold only the fields that are present in the request body
    const dataToUpdate: Record<string, any> = {};

    if (name !== undefined) dataToUpdate.name = name;
    if (amount !== undefined) dataToUpdate.amount = amount;
    if (totalSales !== undefined) dataToUpdate.totalSales = totalSales;
    if (views !== undefined) dataToUpdate.views = views;
    if (uptakes !== undefined) dataToUpdate.uptakes = uptakes;
    if (month !== undefined) dataToUpdate.month = month;

    const updatedAnalyticsData = await prisma.analytics.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json(updatedAnalyticsData);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Internal server error' });
  }
}

// Define a function to delete an Analytics Data by ID
async function deleteAnalytics(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await prisma.analytics.delete({ where: { id } });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({
      error: 'Internal server error',
    });
  }
}

export default router;
