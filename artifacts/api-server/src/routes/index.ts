import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import deliveryZonesRouter from "./delivery-zones";
import ordersRouter from "./orders";
import statsRouter from "./stats";
import storageRouter from "./storage";
import adminRouter from "./admin";
import paymentsRouter from "./payments";
import waitlistRouter from "./waitlist";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(deliveryZonesRouter);
router.use(ordersRouter);
router.use(statsRouter);
router.use(storageRouter);
router.use(adminRouter);
router.use(paymentsRouter);
router.use(waitlistRouter);

export default router;
