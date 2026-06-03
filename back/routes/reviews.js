const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: true, product: true },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET reviews by product
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(req.params.productId) },
      include: { user: true },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create review
router.post("/", async (req, res) => {
  try {
    const review = await prisma.review.create({
      data: {
        rating: parseInt(req.body.rating),
        comment: req.body.comment,
        userId: parseInt(req.body.userId),
        productId: parseInt(req.body.productId),
      },
      include: { user: true, product: true },
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update review
router.put("/:id", async (req, res) => {
  try {
    const review = await prisma.review.update({
      where: { id: parseInt(req.params.id) },
      data: {
        rating: req.body.rating ? parseInt(req.body.rating) : undefined,
        comment: req.body.comment,
      },
      include: { user: true, product: true },
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE review
router.delete("/:id", async (req, res) => {
  try {
    await prisma.review.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
