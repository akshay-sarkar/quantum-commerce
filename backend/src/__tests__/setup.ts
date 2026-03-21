// Set required env vars before any module loads
process.env.JWT_SECRET = 'test-secret-for-jest-do-not-use-in-production';
process.env.NODE_ENV = 'test';
