const express = require("express");

function createCrudRouter({
  prisma,
  model,
  include,
  orderBy,
  mapCreate,
  mapUpdate,
}) {
  const router = express.Router();
  const delegate = prisma[model];

  router.get("/", async (req, res) => {
    try {
      const items = await delegate.findMany({
        ...(include ? { include } : {}),
        ...(orderBy ? { orderBy } : {}),
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const item = await delegate.findUnique({
        where: { id: parseInt(req.params.id, 10) },
        ...(include ? { include } : {}),
      });

      if (!item) {
        return res.status(404).json({ error: "Record not found" });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const data = mapCreate ? mapCreate(req.body) : req.body;
      const item = await delegate.create({
        data,
        ...(include ? { include } : {}),
      });
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const data = mapUpdate ? mapUpdate(req.body) : req.body;
      const item = await delegate.update({
        where: { id: parseInt(req.params.id, 10) },
        data,
        ...(include ? { include } : {}),
      });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await delegate.delete({
        where: { id: parseInt(req.params.id, 10) },
      });
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = { createCrudRouter };
