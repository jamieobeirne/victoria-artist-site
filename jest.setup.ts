import '@testing-library/jest-dom'

process.env.AUTH_SECRET ||= 'test-secret-do-not-use-in-production'
process.env.AUTH_GOOGLE_ID ||= 'test-google-client-id'
process.env.AUTH_GOOGLE_SECRET ||= 'test-google-client-secret'

// Route handlers are invoked directly in tests, outside a Next.js request, so
// revalidatePath has no static generation store to reach and throws an invariant.
// Mock it here; the calls themselves are asserted in the route tests.
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))
