import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const router = express.Router();

router.use(bodyParser.json());

// Create a new shipping information record
router.post('/', createShippingInformation);

// Update a shipping information record by ID
router.put('/:id', updateShippingInformation);

// Get all shipping information records
router.get('/', getAllShippingInformation);

// Get a single shipping information record by ID
router.get('/:id', getShippingInformationById);

// Delete a shipping information record by ID
router.delete('/:id', deleteShippingInformation);

// Define a function to create a new shipping information record
async function createShippingInformation(req: Request, res: Response) {
  try {
    const { name, address, email, phone, postCode, userId, state } = req.body; // Include state

    const shippingInformation = await prisma.shippingInformation.create({
      data: {
        name,
        address,
        email,
        phone,
        postCode,
        userId,
        state, // Include state in the data object
      },
    });

    res.json(shippingInformation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating shipping information record' });
  }
}


// Define a function to update a shipping information record by ID
async function updateShippingInformation(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const updatedFields = req.body;

    // Check if the record with the specified ID exists
    const existingRecord = await prisma.shippingInformation.findUnique({
      where: { shippingId: id },
    });

    if (!existingRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Create an object to hold only the fields that are present in the request body
    const dataToUpdate: Record<string, any> = {};

    if (updatedFields.name !== undefined) dataToUpdate.name = updatedFields.name;
    if (updatedFields.address !== undefined) dataToUpdate.address = updatedFields.address;
    if (updatedFields.email !== undefined) dataToUpdate.email = updatedFields.email;
    if (updatedFields.phone !== undefined) dataToUpdate.phone = updatedFields.phone;
    if (updatedFields.postCode !== undefined) dataToUpdate.postCode = updatedFields.postCode;
    if (updatedFields.state !== undefined) dataToUpdate.state = updatedFields.state; // Include state

    const updatedShippingInformation = await prisma.shippingInformation.update({
      where: { shippingId: id },
      data: dataToUpdate,
    });

    res.json(updatedShippingInformation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error updating shipping information record with ID ${id}` });
  }
}


// Define a function to get all shipping information records
async function getAllShippingInformation(req: Request, res: Response) {
  try {
    const shippingInformation = await prisma.shippingInformation.findMany();
    res.json(shippingInformation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving shipping information records' });
  }
}

// Define a function to get a single shipping information record by ID
async function getShippingInformationById(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    // Check if the record with the specified ID exists
    const shippingInformation = await prisma.shippingInformation.findUnique({
      where: { shippingId: id },
    });

    if (!shippingInformation) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(shippingInformation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error retrieving shipping information record with ID ${id}` });
  }
}

// Define a function to delete a shipping information record by ID
async function deleteShippingInformation(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    // Check if the record with the specified ID exists
    const existingRecord = await prisma.shippingInformation.findUnique({
      where: { shippingId: id },
    });

    if (!existingRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // If the record exists, then proceed to delete it
    const shippingInformation = await prisma.shippingInformation.delete({
      where: { shippingId: id },
    });

    res.json(shippingInformation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error deleting shipping information record with ID ${id}` });
  }
}


export default router;
