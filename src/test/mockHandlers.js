// frontend/src/test/mockHandlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('*/auth/login', async ({ request }) => {
    const body = await request.json();

    if (body.email === 'fail@test.com') {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (body.email === 'slow@test.com') {
      await new Promise((r) => setTimeout(r, 50));
      return HttpResponse.json({
        token: 'slow-token',
        user: { _id: 'u-slow', role: 'customer', emailVerified: true },
      });
    }

    if (body.email === 'badshape@test.com') {
      return HttpResponse.json({ token: 'x' }, { status: 200 });
    }

    return HttpResponse.json({
      token: 'test-token',
      user: {
        _id: 'u1',
        name: 'Test User',
        email: body.email,
        role: 'customer',
        emailVerified: true,
      },
    });
  }),

  http.get('*/users/me', () =>
    HttpResponse.json({
      _id: 'u1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'customer',
      emailVerified: true,
    })
  ),
];
