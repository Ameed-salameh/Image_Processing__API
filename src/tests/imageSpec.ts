import { resizeImage, ResizeOptions } from '../utilities/resizeImage';
import fs from 'fs';
import path from 'path';

describe('Image Processing Utility', () => {
  const testImagePath = path.join(
    process.cwd(),
    'images',
    'full',
    'example.jpg'
  );
  const testOutputDir = path.join(process.cwd(), 'images', 'thumb');

  beforeAll(() => {
    if (!fs.existsSync(path.join(process.cwd(), 'images', 'full'))) {
      fs.mkdirSync(path.join(process.cwd(), 'images', 'full'), {
        recursive: true,
      });
    }
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  describe('resizeImage function', () => {
    it('should return error when filename is missing', async () => {
      const options: ResizeOptions = {
        filename: '',
        width: 100,
        height: 100,
      };

      const result = await resizeImage(options);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Filename is required');
    });

    it('should return error when width is missing', async () => {
      const options: ResizeOptions = {
        filename: 'test.jpg',
        width: 0,
        height: 100,
      };

      const result = await resizeImage(options);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Width and height are required');
    });

    it('should return error when height is missing', async () => {
      const options: ResizeOptions = {
        filename: 'test.jpg',
        width: 100,
        height: 0,
      };

      const result = await resizeImage(options);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Width and height are required');
    });

    it('should return error when width is negative', async () => {
      const options: ResizeOptions = {
        filename: 'test.jpg',
        width: -100,
        height: 100,
      };

      const result = await resizeImage(options);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Width and height must be positive numbers');
    });

    it('should return error when height is negative', async () => {
      const options: ResizeOptions = {
        filename: 'test.jpg',
        width: 100,
        height: -100,
      };

      const result = await resizeImage(options);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Width and height must be positive numbers');
    });

    it('should return error when source image does not exist', async () => {
      const options: ResizeOptions = {
        filename: 'nonexistent.jpg',
        width: 100,
        height: 100,
      };

      const result = await resizeImage(options);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Source image file not found');
    });

    it('should successfully resize an existing image and reuse the cached version', async () => {
      const filename = path.basename(testImagePath);
      const width = 200;
      const height = 200;

      const options: ResizeOptions = {
        filename,
        width,
        height,
      };

      const outputFilename = `${path.parse(filename).name}_${width}_${height}${
        path.parse(filename).ext
      }`;
      const outputPath = path.join(testOutputDir, outputFilename);

      expect(fs.existsSync(testImagePath)).toBeTrue();

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      const result1 = await resizeImage(options);
      expect(result1.success).toBe(true);
      expect(result1.outputPath).toBe(outputPath);
      expect(fs.existsSync(outputPath)).toBeTrue();

      const statsBefore = fs.statSync(outputPath);
      const result2 = await resizeImage(options);
      const statsAfter = fs.statSync(outputPath);

      expect(result2.success).toBe(true);
      expect(result2.outputPath).toBe(outputPath);
      expect(statsAfter.mtimeMs).toBe(statsBefore.mtimeMs);
    });
  });
});

