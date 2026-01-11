// frontend/src/features/reviews/services/reviewsApi.js
import axios from 'axios';

const BASE_URL = '/api/reviews';

export async function fetchReviews({
  productId,
  page = 1,
  limit = 10,
  sort = 'newest',
}) {
  const res = await axios.get(BASE_URL, {
    params: { productId, page, limit, sort },
  });

  const data = res.data || {};

  return {
    items: Array.isArray(data.items) ? data.items : [],
    meta: data.meta || { page, limit, total: 0 },
    summary: data.summary || {
      avgRating: 0,
      totalReviews: 0,
      ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
  };
}

export async function fetchSummary(productId) {
  const res = await axios.get(`${BASE_URL}/summary`, {
    params: { productId },
  });

  return (
    res.data || {
      avgRating: 0,
      totalReviews: 0,
      ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  );
}

export async function createReview(payload) {
  const res = await axios.post(BASE_URL, payload);
  return res.data;
}

export async function updateReview(id, payload) {
  const res = await axios.put(`${BASE_URL}/${id}`, payload);
  return res.data;
}

export async function removeReview(id) {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
}
