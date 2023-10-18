// Import necessary dependencies
import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient, ShoppingCart } from '@prisma/client';
import bodyParser from 'body-parser';

// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Create an instance of the Express router
const router = express.Router();

// parse application/json
router.use(bodyParser.json());

// Get all shopping carts
router.get('/', getAllShoppingCarts);

// Get a single shopping cart by ID
router.get('/:id', getShoppingCartById);

// Create a new shopping cart item
router.post('/', createShoppingCartItem);

// Update a shopping cart item by ID
router.put('/:id', updateShoppingCartItem);

// Delete a shopping cart item by ID
router.delete('/:id', deleteShoppingCartItem);

// Define a function to get all shopping carts
async function getAllShoppingCarts(req: Request, res: Response) {
  try {
    const shoppingCarts = await prisma.shoppingCart.findMany();
    res.json(shoppingCarts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving shopping carts',
    });
  }
}

// Define a function to get a single shopping cart item by ID
async function getShoppingCartById(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const shoppingCartItem = await prisma.shoppingCart.findUnique({ where: { id: id } });
    
    if (!shoppingCartItem) {
      return res.status(404).json({
        message: `Shopping cart item with ID ${id} not found`,
      });
    }

    res.json(shoppingCartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error retrieving shopping cart item with ID ${id}`,
    });
  }
}


// Define a function to create a new shopping cart item
async function createShoppingCartItem(req: Request, res: Response) {
  const { userId, prodId, prodQuantity, prodCost, prodName, prodImg } = req.body;

  try {
    const shoppingCartItem = await prisma.shoppingCart.create({
      data: {
        userId: userId || null,
        prodId: prodId || null,
        prodQuantity: prodQuantity || null,
        prodCost: prodCost || null,
        prodName: prodName || null,
        prodImg: prodImg || [] // Use the prodImg from req.body, or initialize as an empty array if not provided
      },
    });
    res.json(shoppingCartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}


async function updateShoppingCartItem(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { userId, prodId, prodQuantity, prodCost } = req.body;

  try {
    // Check if the record exists before attempting to update it
    const existingItem = await prisma.shoppingCart.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Shopping cart item not found' });
    }

    const updatedShoppingCartItem = await prisma.shoppingCart.update({
      where: { id },
      data: { userId, prodId, prodQuantity, prodCost },
    });

    res.json(updatedShoppingCartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function deleteShoppingCartItem(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    // Check if the record with the specified ID exists
    const existingItem = await prisma.shoppingCart.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Shopping cart item not found' });
    }

    // If the record exists, then proceed to delete it
    const deletedItem = await prisma.shoppingCart.delete({
      where: { id },
    });

    res.status(200).json(deletedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error deleting shopping cart item with ID ${id}` });
  }
}
// Attach the router to

export default router