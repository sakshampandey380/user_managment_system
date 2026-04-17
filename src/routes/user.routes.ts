import { Router } from "express";
import {
  blockUser,
  getUser,
  getUsers,
  login,
  register
} from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/users", authenticateToken, asyncHandler(getUsers));
router.get("/users/:id", authenticateToken, asyncHandler(getUser));
router.put("/users/:id/block", authenticateToken, asyncHandler(blockUser));

export default router;
