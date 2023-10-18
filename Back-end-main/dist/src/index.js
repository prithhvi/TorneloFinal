"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary dependencies
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("../routes/productRoutes"));
const shoppingCartRoutes_1 = __importDefault(require("../routes/shoppingCartRoutes"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create an instance of the Express app
const app = (0, express_1.default)();
// Allow all domains to access the API endpoint
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
// Use the router for all product-related routes
app.use('/api/products', productRoutes_1.default);
// Use the router for all shopping cart-related routes
app.use('/api/shoppingCart', shoppingCartRoutes_1.default);
const port = process.env.PORT || 5100;
prisma.$connect()
    .then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
})
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map