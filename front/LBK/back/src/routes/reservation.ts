import { Router, Request, Response } from 'express';

const router = Router();

// ── GET all reservations ─────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(reservations);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// ── GET single reservation ────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!reservation) return res.status(404).json({ error: 'Not found' });
    res.json(reservation);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
});

// ── PATCH status ─────────────────────────────────────────
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const { status } = req.body;
    const updated = await prisma.reservation.update({
      where: { id: Number(req.params.id) },
      data: { status },
    });
    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) io.emit('reservation:updated', updated);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// ── DELETE ───────────────────────────────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.reservation.delete({ where: { id: Number(req.params.id) } });
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

export default router;
