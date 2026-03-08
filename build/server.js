"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const images_1 = __importDefault(require("./routes/images"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/', images_1.default);
// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Image Processing API is running',
        version: '1.0.0',
        endpoints: {
            resizeImage: '/api/images?filename={name}&width={width}&height={height}',
        },
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the API at: http://localhost:${PORT}`);
});
exports.default = app;
