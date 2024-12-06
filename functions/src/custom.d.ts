declare global {
    namespace Express {
      interface Request {
        rawBody: Buffer; // Add rawBody as a Buffer type
      }
    }
  }
  