// frontend/src/features/reviews/reviewsApi.js
import axios from 'axios';

const base = '/api/reviews';

export async function fetchReviews({
  productId,
  page = 1,
  limit = 10,
  sort = 'newest',
}) {
  const res = await axios.get(base, {
    params: { productId, page, limit, sort },
  });
  return res.data.data;
}

export async function fetchSummary(productId) {
  const res = await axios.get(`${base}/summary`, { params: { productId } });
  return res.data.data;
}

export async function postReview(payload) {
  const res = await axios.post(base, payload);
  return res.data.data;
}

export async function putReview(id, payload) {
  const res = await axios.put(`${base}/${id}`, payload);
  return res.data.data;
}

export async function deleteReview(id) {
  const res = await axios.delete(`${base}/${id}`);
  return res.data.data;
}
