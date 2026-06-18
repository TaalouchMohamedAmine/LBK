import { Router, Request, Response } from 'express';

const router = Router();

// GET all notifications (messages + reservations)
router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    const reservations = await prisma.reservation.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ messages, reservations });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// POST mark message as read
router.patch('/messages/:id/read', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const msg = await prisma.message.update({
      where: { id: Number(req.params.id) },
      data: { read: true },
    });
    res.json(msg);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE message
router.delete('/messages/:id', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.message.delete({ where: { id: Number(req.params.id) } });
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
