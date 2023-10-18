"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary dependencies
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("../routes/productRoutes"));
// Create an instance of the Express app
const app = (0, express_1.default)();
// Use the router for all coupon-related routes
app.use('/api/products', productRoutes_1.default);
// Start the server
app.listen(5000, () => {
    console.log('Server started on port 5000');
});
