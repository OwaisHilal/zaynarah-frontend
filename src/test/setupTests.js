// frontend/src/test/setupTests.js
import '@testing-library/jest-dom';
import { server } from './mockServer';
import { afterAll, afterEach, beforeAll } from 'vitest';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
