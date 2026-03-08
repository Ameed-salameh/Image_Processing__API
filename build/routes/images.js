"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resizeImage_1 = require("../utilities/resizeImage");
const router = (0, express_1.Router)();
router.get('/api/images', async (req, res) => {
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
        const parsedWidth = parseInt(width, 10);
        const parsedHeight = parseInt(height, 10);
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
        const options = {
            filename: filename,
            width: parsedWidth,
            height: parsedHeight,
        };
        const result = await (0, resizeImage_1.resizeImage)(options);
        if (!result.success) {
            if (result.error === 'Source image file not found') {
                res.status(404).json({ error: result.error });
            }
            else {
                res.status(400).json({ error: result.error });
            }
            return;
        }
        // Send the resized image
        res.sendFile(result.outputPath, (err) => {
            if (err) {
                // eslint-disable-next-line no-console
                console.error('Error sending file:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
