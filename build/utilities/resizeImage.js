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
    if (Number.isNaN(width) || Number.isNaN(height)) {
        return {
            success: false,
            error: 'Width and height must be valid numbers',
        };
    }
    try {
        const inputPath = path_1.default.join(process.cwd(), 'images', 'full', filename);
        const outputDir = path_1.default.join(process.cwd(), 'images', 'thumb');
        const parsed = path_1.default.parse(filename);
        const outputFilename = `${parsed.name}_${width}_${height}${parsed.ext}`;
        const outputPath = path_1.default.join(outputDir, outputFilename);
        if (!fs_1.default.existsSync(inputPath)) {
            return {
                success: false,
                error: 'Source image file not found',
            };
        }
        if (fs_1.default.existsSync(outputPath)) {
            return {
                success: true,
                outputPath,
            };
        }
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
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
