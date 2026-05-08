import { Router, type IRouter } from "express";
import healthRouter from "./health";
import selectionRouter from "./selection";

const router: IRouter = Router();

router.use(healthRouter);
router.use(selectionRouter);

export default router;
