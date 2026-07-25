import '@testing-library/jest-dom'

process.env.AUTH_SECRET ||= 'test-secret-do-not-use-in-production'
process.env.AUTH_GOOGLE_ID ||= 'test-google-client-id'
process.env.AUTH_GOOGLE_SECRET ||= 'test-google-client-secret'
