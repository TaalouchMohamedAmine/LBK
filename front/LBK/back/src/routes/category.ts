import { Router, Request, Response } from 'express';

const router = Router();

// GET all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const categories = await prisma.category.findMany({ include: { products: true } });
    res.json(categories);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST create category
router.post('/', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const { name, description } = req.body;
    const category = await prisma.category.create({ data: { name, description } });
    res.status(201).json(category);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const { name, description } = req.body;
    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: { name, description },
    });
    res.json(category);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.category.delete({ where: { id: Number(req.params.id) } });
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
