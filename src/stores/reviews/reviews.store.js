// frontend/src/stores/reviews/reviews.store.js
import { create } from 'zustand';
import { produce } from 'immer';
import * as api from '@/features/reviews/services/reviewsApi';

const getKey = ({ productId, page, limit, sort }) =>
  `${productId}|${page}|${limit}|${sort}`;

const ensureProduct = (d, productId) => {
  if (!d.byProduct[productId]) {
    d.byProduct[productId] = {
      pages: {},
      meta: {
        avgRating: 0,
        totalReviews: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
    };
  }
};

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
    const key = getKey({ productId, page, limit, sort });

    if (get().loading[key]) return;
    if (get().byProduct[productId]?.pages?.[page]) return;

    set(
      produce((d) => {
        d.loading[key] = true;
        d.error[key] = null;
      })
    );

    try {
      const { items, summary } = await api.fetchReviews({
        productId,
        page,
        limit,
        sort,
      });

      set(
        produce((d) => {
          ensureProduct(d, productId);

          items.forEach((r) => {
            d.byId[r._id] = r;
          });

          d.byProduct[productId].pages[page] = items.map((i) => i._id);
          d.byProduct[productId].meta = summary;

          d.loading[key] = false;
        })
      );
    } catch (err) {
      set(
        produce((d) => {
          d.loading[key] = false;
          d.error[key] = err?.message || 'Failed to load reviews';
        })
      );
      throw err;
    }
  },

  refreshProduct: async (productId) => {
    set(
      produce((d) => {
        delete d.byProduct[productId];
        Object.keys(d.loading).forEach((k) => {
          if (k.startsWith(`${productId}|`)) delete d.loading[k];
        });
        Object.keys(d.error).forEach((k) => {
          if (k.startsWith(`${productId}|`)) delete d.error[k];
        });
      })
    );
  },

  createReview: async ({ productId, rating, title, body }) => {
    const review = await api.createReview({ productId, rating, title, body });

    set(
      produce((d) => {
        ensureProduct(d, productId);

        d.byId[review._id] = review;

        const firstPage = d.byProduct[productId].pages[1] || [];
        d.byProduct[productId].pages[1] = [review._id, ...firstPage];

        const meta = d.byProduct[productId].meta;
        const total = (meta.totalReviews || 0) + 1;
        const sum = meta.avgRating * (total - 1) + rating;

        d.byProduct[productId].meta = {
          ...meta,
          totalReviews: total,
          avgRating: sum / total,
          ratingCounts: {
            ...meta.ratingCounts,
            [rating]: (meta.ratingCounts[rating] || 0) + 1,
          },
        };
      })
    );

    return review;
  },

  removeReview: async ({ productId, reviewId }) => {
    await api.removeReview(reviewId);

    set(
      produce((d) => {
        const review = d.byId[reviewId];
        if (!review) return;

        const rating = review.rating;

        delete d.byId[reviewId];

        const product = d.byProduct[productId];
        if (!product) return;

        Object.keys(product.pages).forEach((p) => {
          product.pages[p] = product.pages[p].filter((id) => id !== reviewId);
        });

        const meta = product.meta;
        const total = Math.max((meta.totalReviews || 1) - 1, 0);

        const sum = meta.avgRating * (total + 1) - rating;

        product.meta = {
          ...meta,
          totalReviews: total,
          avgRating: total === 0 ? 0 : sum / total,
          ratingCounts: {
            ...meta.ratingCounts,
            [rating]: Math.max((meta.ratingCounts[rating] || 1) - 1, 0),
          },
        };
      })
    );
  },
}));

export default useReviewsStore;
