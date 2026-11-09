import type { Request, Response } from "express";
import { StallService } from "../services/stallService.ts";
import { ReviewService } from "../services/reviewService.ts";
import type {
  CreateReviewBody,
  CreateStallBody,
  ListStallsQuery,
  UpdateStallBody,
} from "../schemas/stallSchema.ts";

// Semua input diambil dari req.validated (sudah dicek Zod), bukan req.body mentah.
export class StallController {
  private stallService: StallService;
  private reviewService: ReviewService;

  constructor(
    stallService: StallService = new StallService(),
    reviewService: ReviewService = new ReviewService(),
  ) {
    this.stallService = stallService;
    this.reviewService = reviewService;
  }

  getStalls = async (req: Request, res: Response) => {
    const query = req.validated!.query as ListStallsQuery;
    const { data, total } = await this.stallService.getAllStalls(query);
    res.status(200).json({
      status: "success",
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      data,
    });
  };

  getStallById = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const stall = await this.stallService.getStallById(id);
    res.status(200).json({ status: "success", data: stall });
  };

  getStallMenus = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const menus = await this.stallService.getStallMenus(id);
    res.status(200).json({ status: "success", data: menus });
  };

  createStall = async (req: Request, res: Response) => {
    const stall = await this.stallService.createStall(
      req.validated!.body as CreateStallBody,
      req.user!,
    );
    res.status(201).json({
      status: "success",
      message: "Warung berhasil dibuat",
      data: stall,
    });
  };

  updateStall = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const stall = await this.stallService.updateStall(
      id,
      req.validated!.body as UpdateStallBody,
      req.user!,
    );
    res.status(200).json({
      status: "success",
      message: "Warung berhasil diperbarui",
      data: stall,
    });
  };

  deleteStall = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const stall = await this.stallService.deleteStall(id);
    res.status(200).json({
      status: "success",
      message: "Warung berhasil dihapus",
      data: stall,
    });
  };

  createReview = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const review = await this.reviewService.createReview(
      id,
      req.user!.id,
      req.validated!.body as CreateReviewBody,
    );
    res.status(201).json({
      status: "success",
      message: "Review berhasil ditambahkan",
      data: review,
    });
  };
}
