import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const router = express.Router();


router.use(bodyParser.json());

// Create a new completed order
router.post('/', createCompletedOrders);

// Update a completed order by ID
router.put('/:id', updateCompletedOrders);

// Get all completed orders
router.get('/', getAllCompletedOrderss);

// Get a single completed order by ID
router.get('/:id', getCompletedOrdersById);

// Delete a completed order by ID
router.delete('/:id', deleteCompletedOrders);

// Define a function to create a new completed order
async function createCompletedOrders(req: Request, res: Response) {
  try {
    const { userId, prodQuantity, prodCost, prodId, prodName } = req.body;

    const completedOrders = await prisma.completedOrders.create({
      data: {
        userId,
        prodQuantity,
        prodCost,
        prodId,
        prodName,
      },
    });

    res.json(completedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating completed order' });
  }
}

// Define a function to update a completed order by ID
async function updateCompletedOrders(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const { userId, prodQuantity, prodCost, prodId, prodName } = req.body;

    const completedOrders = await prisma.completedOrders.update({
      where: { id },
      data: {
        userId,
        prodQuantity,
        prodCost,
        prodId,
        prodName,
      },
    });

    res.json(completedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error updating completed order with ID ${id}` });
  }
}

// Define a function to get all completed orders
async function getAllCompletedOrderss(req: Request, res: Response) {
  try {
    const completedOrders = await prisma.completedOrders.findMany();
    res.json(completedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving completed orders' });
  }
}

// Define a function to get a single completed order by ID
async function getCompletedOrdersById(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const completedOrders = await prisma.completedOrders.findUnique({ where: { id } });
    res.json(completedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error retrieving completed order with ID ${id}` });
  }
}

// Define a function to delete a completed order by ID
async function deleteCompletedOrders(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const completedOrders = await prisma.completedOrders.delete({ where: { id } });
    res.json(completedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error deleting completed order with ID ${id}` });
  }
}

export default router;
