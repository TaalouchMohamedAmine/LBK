import { Router, Request, Response } from 'express';

const router = Router();

// POST /messages — contact form submission
router.post('/', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required' });
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        content: message,
      },
    });

    // Notify admin via Socket.io
    const io = req.app.get('io');
    if (io) io.emit('message:new', newMessage);

    res.status(201).json(newMessage);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to send message', detail: e?.message });
  }
});

// GET /messages — fetch all messages
router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH /messages/:id/read — mark message as read
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const { read } = req.body;
    const updated = await prisma.message.update({
      where: { id: Number(req.params.id) },
      data: { read: Boolean(read) },
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

export default router;
