declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: "admin" | "owner" | "customer" };
      validated?: { body?: any; params?: any; query?: any };
    }
  }
}
export {};
