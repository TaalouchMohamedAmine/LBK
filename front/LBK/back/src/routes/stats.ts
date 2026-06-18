import { Router, Request, Response } from 'express';

const router = Router();

// Example endpoint returning simple stats
router.get('/', async (req: Request, res: Response) => {
  const prisma = req.app.get('prisma');
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const reservationCount = await prisma.reservation.count();
  const messageCount = await prisma.message.count();
  res.json({ productCount, categoryCount, reservationCount, messageCount });
});

export default router;
