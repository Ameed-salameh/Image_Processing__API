"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const server_1 = __importDefault(require("../server"));
describe('Image API Endpoints', () => {
    describe('GET /', () => {
        it('should return 200 status and API information', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/');
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.message).toBe('Image Processing API is running');
            expect(response.body.version).toBeDefined();
            expect(response.body.endpoints).toBeDefined();
        });
    });
    describe('GET /api/images', () => {
        it('should return 400 when filename parameter is missing', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?width=100&height=100');
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Filename parameter is required');
        });
        it('should return 400 when width parameter is missing', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=test.jpg&height=100');
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Width and height parameters are required');
        });
        it('should return 400 when height parameter is missing', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=test.jpg&width=100');
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Width and height parameters are required');
        });
        it('should return 400 when width is not a number', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=test.jpg&width=abc&height=100');
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Width and height must be valid numbers');
        });
        it('should return 400 when height is not a number', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=test.jpg&width=100&height=xyz');
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Width and height must be valid numbers');
        });
        it('should return 400 when width is zero', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=test.jpg&width=0&height=100');
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Width and height must be positive numbers');
        });
        it('should return 400 when height is zero', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=test.jpg&width=100&height=0');
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Width and height must be positive numbers');
        });
        it('should return 400 when width is negative', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=test.jpg&width=-100&height=100');
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Width and height must be positive numbers');
        });
        it('should return 400 when height is negative', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=test.jpg&width=100&height=-100');
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Width and height must be positive numbers');
        });
        it('should return 404 when image file does not exist', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=nonexistent.jpg&width=100&height=100');
            expect(response.status).toBe(404);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBe('Source image file not found');
        });
        it('should return 404 when all parameters are valid but the image does not exist', async () => {
            const response = await (0, supertest_1.default)(server_1.default).get('/api/images?filename=test.jpg&width=100&height=100');
            expect(response.status).toBe(404);
            expect(response.body).toBeDefined();
            expect(response.body.error).toBeDefined();
        });
        it('should return 200 and create a cached thumbnail when valid parameters and source image exist', async () => {
            const filename = 'example.jpg';
            const width = 200;
            const height = 200;
            const thumbDir = path_1.default.join(process.cwd(), 'images', 'thumb');
            const thumbFilename = `${path_1.default.parse(filename).name}_${width}_${height}${path_1.default.parse(filename).ext}`;
            const thumbPath = path_1.default.join(thumbDir, thumbFilename);
            const sourcePath = path_1.default.join(process.cwd(), 'images', 'full', filename);
            expect(fs_1.default.existsSync(sourcePath)).toBeTrue();
            if (fs_1.default.existsSync(thumbPath)) {
                fs_1.default.unlinkSync(thumbPath);
            }
            const response = await (0, supertest_1.default)(server_1.default).get(`/api/images?filename=${filename}&width=${width}&height=${height}`);
            expect(response.status).toBe(200);
            expect(fs_1.default.existsSync(thumbPath)).toBeTrue();
        });
    });
});
