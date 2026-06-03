const prisma = require("../config/prisma");
const { createCrudRouter } = require("./createCrudRouter");

module.exports = createCrudRouter({
  prisma,
  model: "service",
  orderBy: { sortOrder: "asc" },
  mapCreate: (body) => ({
    title: body.title,
    description: body.description,
    priceFrom: body.priceFrom ? parseFloat(body.priceFrom) : null,
    duration: body.duration,
    image: body.image,
    featured: body.featured === undefined ? false : Boolean(body.featured),
    sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
  }),
  mapUpdate: (body) => ({
    title: body.title,
    description: body.description,
    priceFrom:
      body.priceFrom === undefined
        ? undefined
        : body.priceFrom === null
          ? null
          : parseFloat(body.priceFrom),
    duration: body.duration,
    image: body.image,
    featured: body.featured === undefined ? undefined : Boolean(body.featured),
    sortOrder:
      body.sortOrder === undefined ? undefined : parseInt(body.sortOrder, 10),
  }),
});
