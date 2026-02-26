import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, { timestamps: true });

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: false }
});

const productSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    images: [imageSchema],
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    emiPerMonth: { type: Number, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    is49PointChecked: { type: Boolean, required: true, default: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
