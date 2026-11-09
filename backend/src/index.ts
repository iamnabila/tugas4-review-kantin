import "dotenv/config";
import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import { sql } from "drizzle-orm";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./docs/openapi.ts";
import { getDb } from "./db/index.ts";
import { authRouter } from "./routes/authRouter.ts";
import { stallRouter } from "./routes/stallRouter.ts";
import { userRouter } from "./routes/userRouter.ts";
import { menuItemRouter } from "./routes/menuItemRouter.ts";
import { likeRouter } from "./routes/likeRouter.ts";
import { flagRouter } from "./routes/flagRouter.ts";
import { auditLogRouter } from "./routes/auditLogRouter.ts";
import { reviewRouter } from "./routes/reviewRouter.ts";
import { adminForWrites, authenticate, authorize } from "./middlewares/auth.ts";
import { errorHandler, notFound } from "./middlewares/errorHandler.ts";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET belum diisi di file .env");
}

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());

// Dokumentasi API (Swagger UI)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/health", async (_req: Request, res: Response) => {
  const db = await getDb();
  await db.execute(sql`SELECT 1 AS ok`);
  res
    .status(200)
    .json({ status: "success", message: "Server dan database terhubung" });
});

// Endpoint utama Tugas 3
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/stalls", stallRouter);

// Endpoint lama Tugas 2 (admin = semua endpoint)
app.use("/users", authenticate, authorize("admin"), userRouter);
app.use("/menu-items", adminForWrites, menuItemRouter);
app.use("/likes", authenticate, authorize("admin"), likeRouter);
app.use("/flags", authenticate, authorize("admin"), flagRouter);
app.use("/audit-logs", authenticate, authorize("admin"), auditLogRouter);
app.use("/reviews", reviewRouter);

app.use(notFound); // wajib setelah semua route
app.use(errorHandler); // wajib paling akhir

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
