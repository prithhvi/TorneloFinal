// Import necessary dependencies
import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import multer from 'multer';
import AWS from 'aws-sdk';


// Configure AWS
AWS.config.update({
    //CREATE YOUR AWS S3 ACCOUNT AND PUT IN YOUR CREDENTIALS
    accessKeyId: '',
    secretAccessKey: '',
    region: 'ap-southeast-2',
});

const s3 = new AWS.S3();

// Set up multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Create an instance of the Express router
const router = express.Router();

// parse application/json
router.use(bodyParser.json());

router.post('/', upload.array('prodImages'), createProduct);

// Get all products
router.get('/', getAllProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product by ID
router.put('/:id', updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

// Get products by name or description
router.get('/search/:search', getProductsBySearch);

// Get products by cost range
router.get('/cost/:min_cost/:max_cost', getProductsByCostRange);

// Get products by variant
router.get('/variant/:variant', getProductsByVariant);

// Get products by creation date
router.get('/createdAt/:createdAt', getProductsByCreationDate);


async function uploadImageToS3(file: Express.Multer.File) {
  console.log('Uploading image to S3:', file.originalname);

  const params = {
    Bucket: 'torneloproduct',
    Key: `images/${file.originalname}`,
    Body: file.buffer,
  };

  return new Promise<AWS.S3.ManagedUpload.SendData>((resolve, reject) => {
    s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
      if (err) {
        console.error('S3 Upload Error:', err);
        reject(err);
      } else {
        console.log('S3 Upload Successful:', data.Location);
        resolve(data);
      }
    });
  });
}

// Define a function to get all products
async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving products',
    });
  }
}

// Define a function to get a single product by ID
async function getProductById(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error retrieving product with ID ${id}`,
    });
  }
}

// Define a function to create a new product
async function createProduct(req: Request, res: Response) {
  try {
    const { prodName, prodDesc, prodCost, prodVariant, stockCount} = req.body;

    // Convert prodCost from string to integer
    const parsedProdCost = parseInt(prodCost);

    const parsedStockCount = stockCount === "0" ? 0 : parseInt(stockCount);

    const files = req.files as Express.Multer.File[]; // Cast the files to an array

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const imageUrls = [];

    // Upload each image to S3 and collect their URLs
    for (const file of files) {
      const imageUploadResponse = await uploadImageToS3(file);
      if (!imageUploadResponse || !imageUploadResponse.Location) {
        return res.status(500).json({ error: 'Image upload failed' });
      }
      imageUrls.push(imageUploadResponse.Location);
    }

    // Create product with image links
    const product = await prisma.product.create({
      data: {
        prodName,
        prodDesc,
        prodCost: parsedProdCost,
        prodVariant,
        prodImg: imageUrls, // Array of image URLs
        stockCount: parsedStockCount,
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}


// Define a function to update a product by ID
async function updateProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { prodName, prodDesc, prodCost, prodVariant, stockCount } = req.body;
  const files = req.files as Express.Multer.File[]; // Cast the files to an array

  try {
    // Fetch the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: `Product with ID ${id} not found`,
      });
    }

    const imageUrls = [];

    if (files && files.length > 0){
      // Upload each image to S3 and collect their URLs
      for (const file of files) {
        const imageUploadResponse = await uploadImageToS3(file);
        if (!imageUploadResponse || !imageUploadResponse.Location) {
          return res.status(500).json({ error: 'Image upload failed' });
        }
        imageUrls.push(imageUploadResponse.Location);
      }
    }

    // Use the existing prodImg if imageUrls is empty
    const updatedProdImg = imageUrls.length > 0 ? imageUrls : existingProduct.prodImg;

    // Prepare the data object with the fields to be updated
    const updateData: {
      prodName?: string;
      prodDesc?: string;
      prodCost?: number;
      prodVariant?: string;
      prodImg: string[];
      stockCount?: number;
    } = {
      prodName: prodName || existingProduct.prodName,
      prodDesc: prodDesc || existingProduct.prodDesc,
      prodCost: prodCost || existingProduct.prodCost,
      prodVariant: prodVariant || existingProduct.prodVariant,
      prodImg: updatedProdImg, // Replace the existing prodImg with the new array
    };


    // Conditionally include stockCount if it's provided in the request body
    if (stockCount !== undefined) {
      updateData.stockCount = stockCount === "0" ? 0 : parseInt(stockCount);
    }

    // Update the product with the new image URLs and stockCount if provided
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error updating product with ID ${id}`,
    });
  }
}



// Define a function to delete a product by ID
async function deleteProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const product = await prisma.product.delete({ where: { id } });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error deleting product with ID ${id}`,
    });
  }
}

//Get products by name or description
async function getProductsBySearch(req: Request, res: Response) {
  const { search } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { prodName: { contains: search } },
          { prodDesc: { contains: search } },
        ],
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
}


//Get products by cost range
//eg: /products/cost/10/50
async function getProductsByCostRange(req: Request, res: Response) {
  const { min_cost, max_cost } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        prodCost: {
          gte: Number(min_cost),
          lte: Number(max_cost),
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
}



//Get products by variant
async function getProductsByVariant(req: Request, res: Response) {
  const { variant } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        prodVariant: {
          equals: variant,
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
}


//Get products by creation date

async function getProductsByCreationDate(req: Request, res: Response) {
  const { createdAt } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: {
        createdAt: {
          equals: new Date(createdAt),
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
}

export default router;
