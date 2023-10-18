"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary dependencies
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const uploadImageToS3_1 = require("./uploadImageToS3");
// Set up multer for image uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Create an instance of the Prisma client
const prisma = new client_1.PrismaClient();
// Create an instance of the Express router
const router = express_1.default.Router();
// parse application/json
router.use(body_parser_1.default.json());
// Get all products
router.get('/', getAllProducts);
// Get a single product by ID
router.get('/:id', getProductById);
// Create a new product
router.post('/', createProduct);
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
// Define a function to get all products
function getAllProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield prisma.product.findMany();
            res.json(products);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error retrieving products',
            });
        }
    });
}
// Define a function to get a single product by ID
function getProductById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        try {
            const product = yield prisma.product.findUnique({ where: { id } });
            res.json(product);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: `Error retrieving product with ID ${id}`,
            });
        }
    });
}
// Define a function to create a new product
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { prodName, prodDesc, prodCost, prodVariant } = req.body;
            // Upload image to S3
            const imageUploadResponse = yield (0, uploadImageToS3_1.uploadImageToS3)(req.file);
            // Create product with image link
            const product = yield prisma.product.create({
                data: {
                    prodName,
                    prodDesc,
                    prodCost,
                    prodVariant,
                    prodImg: [imageUploadResponse.Location],
                },
            });
            res.json(product);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    });
}
// Define a function to update a product by ID
function updateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        const { prodName, prodDesc, prodCost, prodImg, prodVariant } = req.body;
        try {
            const product = yield prisma.product.update({
                where: { id },
                data: {
                    prodName,
                    prodDesc,
                    prodCost,
                    prodImg,
                    prodVariant,
                },
            });
            res.json(product);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: `Error updating product with ID ${id}`,
            });
        }
    });
}
// Define a function to delete a product by ID
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        try {
            const product = yield prisma.product.delete({ where: { id } });
            res.json(product);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: `Error deleting product with ID ${id}`,
            });
        }
    });
}
//Get products by name or description
function getProductsBySearch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { search } = req.params;
        try {
            const products = yield prisma.product.findMany({
                where: {
                    OR: [
                        { prodName: { contains: search } },
                        { prodDesc: { contains: search } },
                    ],
                },
            });
            res.json(products);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving products' });
        }
    });
}
//Get products by cost range
//eg: /products/cost/10/50
function getProductsByCostRange(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { min_cost, max_cost } = req.params;
        try {
            const products = yield prisma.product.findMany({
                where: {
                    prodCost: {
                        gte: Number(min_cost),
                        lte: Number(max_cost),
                    },
                },
            });
            res.json(products);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving products' });
        }
    });
}
//Get products by variant
function getProductsByVariant(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { variant } = req.params;
        try {
            const products = yield prisma.product.findMany({
                where: {
                    prodVariant: {
                        equals: variant,
                    },
                },
            });
            res.json(products);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving products' });
        }
    });
}
//Get products by creation date
function getProductsByCreationDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { createdAt } = req.params;
        try {
            const products = yield prisma.product.findMany({
                where: {
                    createdAt: {
                        equals: new Date(createdAt),
                    },
                },
            });
            res.json(products);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving products' });
        }
    });
}
exports.default = router;
//# sourceMappingURL=productRoutes.js.map