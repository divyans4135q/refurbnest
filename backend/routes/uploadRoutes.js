import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';
import fileUpload from 'express-fileupload';

const router = express.Router();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// @desc    Upload images to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded.' });
        }

        const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'refurbnest/products',
                resource_type: 'auto'
            })
        );

        const results = await Promise.all(uploadPromises);

        const response = results.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
        }));

        res.json({
            message: 'Images uploaded successfully',
            images: response
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload image(s)', error: error.message });
    }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:public_id
// @access  Private/Admin
router.delete('/:public_id', protect, admin, async (req, res) => {
    try {
        const { public_id } = req.params;
        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'ok') {
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(400).json({ message: 'Image deletion failed', result });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
