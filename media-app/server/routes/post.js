import express from "express";
import {getFeedPosts,getUSerPosts,likePost} from "../controllers/post.js"
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/",verifyToken,getFeedPosts);
router.get("/:userId/posts",verifyToken,getUSerPosts);
router.patch("/:id/like",verifyToken,likePost)

export default router;