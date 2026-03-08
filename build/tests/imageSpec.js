"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resizeImage_1 = require("../utilities/resizeImage");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
describe('Image Processing Utility', () => {
    const testImagePath = path_1.default.join(process.cwd(), 'images', 'full', 'example.jpg');
    const testOutputDir = path_1.default.join(process.cwd(), 'images', 'thumb');
    beforeAll(() => {
        if (!fs_1.default.existsSync(path_1.default.join(process.cwd(), 'images', 'full'))) {
            fs_1.default.mkdirSync(path_1.default.join(process.cwd(), 'images', 'full'), {
                recursive: true,
            });
        }
        if (!fs_1.default.existsSync(testOutputDir)) {
            fs_1.default.mkdirSync(testOutputDir, { recursive: true });
        }
    });
    describe('resizeImage function', () => {
        it('should return error when filename is missing', async () => {
            const options = {
                filename: '',
                width: 100,
                height: 100,
            };
            const result = await (0, resizeImage_1.resizeImage)(options);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Filename is required');
        });
        it('should return error when width is missing', async () => {
            const options = {
                filename: 'test.jpg',
                width: 0,
                height: 100,
            };
            const result = await (0, resizeImage_1.resizeImage)(options);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Width and height are required');
        });
        it('should return error when height is missing', async () => {
            const options = {
                filename: 'test.jpg',
                width: 100,
                height: 0,
            };
            const result = await (0, resizeImage_1.resizeImage)(options);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Width and height are required');
        });
        it('should return error when width is negative', async () => {
            const options = {
                filename: 'test.jpg',
                width: -100,
                height: 100,
            };
            const result = await (0, resizeImage_1.resizeImage)(options);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Width and height must be positive numbers');
        });
        it('should return error when height is negative', async () => {
            const options = {
                filename: 'test.jpg',
                width: 100,
                height: -100,
            };
            const result = await (0, resizeImage_1.resizeImage)(options);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Width and height must be positive numbers');
        });
        it('should return error when source image does not exist', async () => {
            const options = {
                filename: 'nonexistent.jpg',
                width: 100,
                height: 100,
            };
            const result = await (0, resizeImage_1.resizeImage)(options);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Source image file not found');
        });
        it('should successfully resize an existing image and reuse the cached version', async () => {
            const filename = path_1.default.basename(testImagePath);
            const width = 200;
            const height = 200;
            const options = {
                filename,
                width,
                height,
            };
            const outputFilename = `${path_1.default.parse(filename).name}_${width}_${height}${path_1.default.parse(filename).ext}`;
            const outputPath = path_1.default.join(testOutputDir, outputFilename);
            // Ensure source image exists for a true success scenario
            expect(fs_1.default.existsSync(testImagePath)).toBeTrue();
            // Remove any existing thumbnail so we can verify creation
            if (fs_1.default.existsSync(outputPath)) {
                fs_1.default.unlinkSync(outputPath);
            }
            // First call should create the resized image
            const result1 = await (0, resizeImage_1.resizeImage)(options);
            expect(result1.success).toBe(true);
            expect(result1.outputPath).toBe(outputPath);
            expect(fs_1.default.existsSync(outputPath)).toBeTrue();
            // Second call should use the cached image without recreating it
            const statsBefore = fs_1.default.statSync(outputPath);
            const result2 = await (0, resizeImage_1.resizeImage)(options);
            const statsAfter = fs_1.default.statSync(outputPath);
            expect(result2.success).toBe(true);
            expect(result2.outputPath).toBe(outputPath);
            expect(statsAfter.mtimeMs).toBe(statsBefore.mtimeMs);
        });
    });
});
