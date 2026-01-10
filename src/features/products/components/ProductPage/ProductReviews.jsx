// src/features/products/components/ProductPage/ProductReviews.jsx
import ProductReviewsConnector from './ProductReviewsConnector';

export default function ProductReviews({ product }) {
  if (!product?._id) return null;
  return <ProductReviewsConnector productId={product._id} />;
}
