import { Router, Request, Response } from 'express';
import { resizeImage, ResizeOptions } from '../utilities/resizeImage';

const router = Router();

router.get(
  '/api/images',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { filename, width, height } = req.query;

      // Validate required parameters
      if (!filename) {
        res.status(400).json({ error: 'Filename parameter is required' });
        return;
      }

      if (!width || !height) {
        res
          .status(400)
          .json({ error: 'Width and height parameters are required' });
        return;
      }

      // Parse and validate width and height
      const parsedWidth = parseInt(width as string, 10);
      const parsedHeight = parseInt(height as string, 10);

      if (Number.isNaN(parsedWidth) || Number.isNaN(parsedHeight)) {
        res
          .status(400)
          .json({ error: 'Width and height must be valid numbers' });
        return;
      }

      if (parsedWidth <= 0 || parsedHeight <= 0) {
        res
          .status(400)
          .json({ error: 'Width and height must be positive numbers' });
        return;
      }

      // Resize image
      const options: ResizeOptions = {
        filename: filename as string,
        width: parsedWidth,
        height: parsedHeight,
      };

      const result = await resizeImage(options);

      if (!result.success) {
        if (result.error === 'Source image file not found') {
          res.status(404).json({ error: result.error });
        } else {
          res.status(400).json({ error: result.error });
        }
        return;
      }

      // Send the resized image
      res.sendFile(result.outputPath!, (err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('Error sending file:', err);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;

