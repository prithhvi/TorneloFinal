// Import necessary dependencies
import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';


// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Create an instance of the Express router
const router = express.Router();

// parse application/json
router.use(bodyParser.json());


// Get all User
router.get('/', getAllUser);

// Get a single User by ID
router.get('/:id', getUserById);

// Create a new User
router.post('/', createUser);

// Update a User by ID
router.put('/:id', updateUser);

// Delete a User by ID
router.delete('/:id', deleteUser);

// Get User by name
router.get('/search/:search', getUserBySearch);

// Define a function to get all User
async function getAllUser(req: Request, res: Response) {
  try {
    const User = await prisma.user.findMany();
    res.json(User);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving User',
    });
  }
}

// Define a function to get a single User by ID
async function getUserById(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const User = await prisma.user.findUnique({ where: { id } });
    res.json(User);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error retrieving User with ID ${id}`,
    });
  }
}

// Define a function to create a new User
async function createUser(req: Request, res: Response) {
    const { userId, userEmail, userAddress, userPhoneNo, userFirstName, userLastName, userPassword } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          userId: userId || null,
          userEmail: userEmail || null,
          userAddress: userAddress || null,
          userPhoneNo: userPhoneNo || null,
          userFirstName: userFirstName || null,
          userLastName: userLastName || null,
          userPassword: userPassword || null,
        },
      });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  }


// Define a function to update a User by ID
async function updateUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { userId, userEmail, userAddress, userPhoneNo, userFirstName, userLastName, userPassword } = req.body;
    try {
      const user = await prisma.user.update({
        where: { userId : id },
        data: {
          userId,
          userEmail,
          userAddress,
          userPhoneNo,
          userFirstName,
          userLastName,
          userPassword
        },
      });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `Error updating user with ID ${id}`,
      });
    }
  }

// Define a function to delete a User by ID
async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const User = await prisma.user.delete({ where: { id } });
    res.json(User);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error deleting User with ID ${id}`,
    });
  }
}

//Get User by name
async function getUserBySearch(req: Request, res: Response) {
  const { search } = req.params;
  try {
    const User = await prisma.user.findMany({
      where: { userEmail: { contains: search } }});
    res.json(User);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving User' });
  }
}

//Get User by creation date
/*
async function getUserByCreationDate(req: Request, res: Response) {
  const { createdAt } = req.params;
  try {
    const User = await prisma.user.findMany({
      where: {
        createdAt: {
          equals: new Date(createdAt),
        },
      },
    });
    res.json(User);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving User' });
  }
} */

export default router;
