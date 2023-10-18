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
// Create an instance of the Prisma client
const prisma = new client_1.PrismaClient();
// Create an instance of the Express router
const router = express_1.default.Router();
// parse application/json
router.use(body_parser_1.default.json());
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
function getAllShoppingCarts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const shoppingCarts = yield prisma.shoppingCart.findMany();
            res.json(shoppingCarts);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error retrieving shopping carts',
            });
        }
    });
}
// Define a function to get a single shopping cart item by ID
function getShoppingCartById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        try {
            const shoppingCartItem = yield prisma.shoppingCart.findUnique({ where: { id: id } });
            res.json(shoppingCartItem);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: `Error retrieving shopping cart item with ID ${id}`,
            });
        }
    });
}
// Define a function to create a new shopping cart item
function createShoppingCartItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, prodId, prodQuantity, prodCost, prodName } = req.body;
        try {
            const shoppingCartItem = yield prisma.shoppingCart.create({
                data: {
                    userId: userId || null,
                    prodId: prodId || null,
                    prodQuantity: prodQuantity || null,
                    prodCost: prodCost || null,
                    prodName: prodName || null
                },
            });
            res.json(shoppingCartItem);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    });
}
// Define a function to update a shopping cart item by ID
function updateShoppingCartItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        const { userId, prodId, prodQuantity, prodCost } = req.body;
        try {
            const updatedShoppingCartItem = yield prisma.shoppingCart.update({
                where: { id: id },
                data: {
                    userId: userId || undefined,
                    prodId: prodId || undefined,
                    prodQuantity: prodQuantity || undefined,
                    prodCost: prodCost || undefined,
                },
            });
            res.json(updatedShoppingCartItem);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    });
}
// Define a function to delete a shopping cart item by ID
function deleteShoppingCartItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = Number(req.params.id);
        try {
            yield prisma.shoppingCart.delete({
                where: { id: id },
            });
            res.json({ message: `Shopping cart item with ID ${id} deleted` });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' });
        }
    });
}
// Attach the router to
exports.default = router;
//# sourceMappingURL=shoppingCartRoutes.js.map