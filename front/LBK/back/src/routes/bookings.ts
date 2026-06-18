import { Router, Request, Response } from 'express';

const router = Router();

// POST /bookings — public form submission creates a reservation
router.post('/', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const { name, email, phone, service, preferredDate, notes } = req.body;

    if (!name || !email || !service) {
      return res.status(400).json({ error: 'name, email and service are required' });
    }

    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone: phone || null,
        service,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        notes: notes || null,
        status: 'NEW',
      },
    });

    // Notify admin via Socket.io
    const io = req.app.get('io');
    if (io) io.emit('reservation:new', reservation);

    res.status(201).json(reservation);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to create reservation', detail: e?.message });
  }
});

export default router;
