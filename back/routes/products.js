const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, brand: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true, brand: true, reviews: true },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        image: req.body.image,
        categoryId: parseInt(req.body.categoryId),
        brandId: req.body.brandId ? parseInt(req.body.brandId) : null,
      },
      include: { category: true, brand: true },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        image: req.body.image,
        status: req.body.status,
        categoryId: req.body.categoryId
          ? parseInt(req.body.categoryId)
          : undefined,
        brandId: req.body.brandId ? parseInt(req.body.brandId) : undefined,
      },
      include: { category: true, brand: true },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
