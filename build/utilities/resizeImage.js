"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const resizeImage = async (options) => {
    const { filename, width, height } = options;
    // Validate input parameters
    if (!filename) {
        return {
            success: false,
            error: 'Filename is required',
        };
    }
    if (!width || !height) {
        return {
            success: false,
            error: 'Width and height are required',
        };
    }
    if (width <= 0 || height <= 0) {
        return {
            success: false,
            error: 'Width and height must be positive numbers',
        };
    }
    if (isNaN(width) || isNaN(height)) {
        return {
            success: false,
            error: 'Width and height must be valid numbers',
        };
    }
    try {
        // Define paths
        const inputPath = path_1.default.join(process.cwd(), 'assets', 'full', filename);
        const outputDir = path_1.default.join(process.cwd(), 'assets', 'thumb');
        const outputFilename = `${path_1.default.parse(filename).name}_${width}_${height}${path_1.default.parse(filename).ext}`;
        const outputPath = path_1.default.join(outputDir, outputFilename);
        // Check if input file exists
        if (!fs_1.default.existsSync(inputPath)) {
            return {
                success: false,
                error: 'Source image file not found',
            };
        }
        // Check if resized image already exists (caching)
        if (fs_1.default.existsSync(outputPath)) {
            return {
                success: true,
                outputPath,
            };
        }
        // Ensure output directory exists
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        // Resize and save the image
        await (0, sharp_1.default)(inputPath).resize(width, height).toFile(outputPath);
        return {
            success: true,
            outputPath,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};
exports.resizeImage = resizeImage;
//# sourceMappingURL=resizeImage.js.map