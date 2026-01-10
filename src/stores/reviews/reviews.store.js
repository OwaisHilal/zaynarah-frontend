// frontend/src/stores/reviews/reviews.store.js
import { create } from 'zustand';
import { produce } from 'immer';
import * as api from '../../features/reviews/reviewsApi';

const useReviewsStore = create((set, get) => ({
  byId: {},
  byProduct: {},
  loading: {},
  error: {},

  fetchReviews: async ({
    productId,
    page = 1,
    limit = 10,
    sort = 'newest',
  }) => {
    const cacheKey = `${productId}_${page}_${sort}`;

    if (get().loading[cacheKey]) return;

    set(
      produce((draft) => {
        draft.loading[cacheKey] = true;
        draft.error[cacheKey] = null;
      })
    );

    try {
      const res = await api.fetchReviews({ productId, page, limit, sort });

      const items = Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.reviews)
        ? res.reviews
        : [];

      const summary =
        res?.summary && typeof res.summary === 'object' ? res.summary : null;

      set(
        produce((draft) => {
          items.forEach((r) => {
            if (r && r._id) {
              draft.byId[r._id] = r;
            }
          });

          if (!draft.byProduct[productId]) {
            draft.byProduct[productId] = {
              pages: {},
              meta: {},
            };
          }

          draft.byProduct[productId].pages[page] = items.map((i) => i._id);

          if (summary) {
            draft.byProduct[productId].meta = summary;
          }

          draft.loading[cacheKey] = false;
        })
      );

      return res;
    } catch (err) {
      set(
        produce((draft) => {
          draft.loading[cacheKey] = false;
          draft.error[cacheKey] = err?.message || 'Failed to load reviews';
        })
      );
      throw err;
    }
  },

  fetchSummary: async (productId) => {
    try {
      const res = await api.fetchSummary(productId);

      if (!res || typeof res !== 'object') return null;

      set(
        produce((draft) => {
          if (!draft.byProduct[productId]) {
            draft.byProduct[productId] = {
              pages: {},
              meta: {},
            };
          }

          draft.byProduct[productId].meta = res;
        })
      );

      return res;
    } catch {
      return null;
    }
  },

  createReview: async ({ productId, rating, title, body }) => {
    const res = await api.postReview({ productId, rating, title, body });

    if (!res || !res._id) return res;

    set(
      produce((draft) => {
        draft.byId[res._id] = res;

        if (!draft.byProduct[productId]) {
          draft.byProduct[productId] = {
            pages: {},
            meta: {},
          };
        }

        const firstPage = draft.byProduct[productId].pages[1] || [];

        draft.byProduct[productId].pages[1] = [res._id, ...firstPage];

        const meta = draft.byProduct[productId].meta || {};

        draft.byProduct[productId].meta = {
          ...meta,
          totalReviews: (meta.totalReviews || 0) + 1,
          avgRating: meta.avgRating || rating,
        };
      })
    );

    return res;
  },

  editReview: async (id, payload) => {
    const res = await api.putReview(id, payload);

    if (!res || !id) return res;

    set(
      produce((draft) => {
        draft.byId[id] = res;
      })
    );

    return res;
  },

  deleteReview: async (id) => {
    const res = await api.deleteReview(id);

    set(
      produce((draft) => {
        const review = draft.byId[id];
        if (!review) return;

        const productId = review.productId;
        delete draft.byId[id];

        const product = draft.byProduct[productId];
        if (!product) return;

        Object.keys(product.pages).forEach((page) => {
          product.pages[page] = product.pages[page].filter(
            (revId) => revId !== id
          );
        });

        if (product.meta?.totalReviews) {
          product.meta.totalReviews -= 1;
        }
      })
    );

    return res;
  },
}));

export default useReviewsStore;
