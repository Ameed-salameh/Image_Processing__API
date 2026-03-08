import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export interface ResizeOptions {
  filename: string;
  width: number;
  height: number;
}

export interface ResizeResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

export const resizeImage = async (
  options: ResizeOptions
): Promise<ResizeResult> => {
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

  if (Number.isNaN(width) || Number.isNaN(height)) {
    return {
      success: false,
      error: 'Width and height must be valid numbers',
    };
  }

  try {
    const inputPath = path.join(process.cwd(), 'images', 'full', filename);
    const outputDir = path.join(process.cwd(), 'images', 'thumb');
    const parsed = path.parse(filename);
    const outputFilename = `${parsed.name}_${width}_${height}${parsed.ext}`;
    const outputPath = path.join(outputDir, outputFilename);

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      return {
        success: false,
        error: 'Source image file not found',
      };
    }

    // Caching: if resized image already exists, reuse it
    if (fs.existsSync(outputPath)) {
      return {
        success: true,
        outputPath,
      };
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Resize and save the image
    await sharp(inputPath).resize(width, height).toFile(outputPath);

    return {
      success: true,
      outputPath,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

