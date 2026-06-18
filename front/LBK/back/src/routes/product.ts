import { Router, Request, Response } from 'express';

const router = Router();

// GET all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const products = await prisma.product.findMany({ include: { category: true } });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const { name, description, price, categoryId, imageUrl, label } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: categoryId ? Number(categoryId) : null,
        imageUrl,
        label,
      },
    });
    const io = req.app.get('io');
    io.emit('newProduct', product);
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    const { name, description, price, categoryId, imageUrl, label } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        categoryId: categoryId ? Number(categoryId) : null,
        imageUrl,
        label,
      },
    });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = req.app.get('prisma');
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
