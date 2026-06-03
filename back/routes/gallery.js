const prisma = require("../config/prisma");
const { createCrudRouter } = require("./createCrudRouter");

module.exports = createCrudRouter({
  prisma,
  model: "galleryItem",
  orderBy: { sortOrder: "asc" },
  mapCreate: (body) => ({
    title: body.title,
    category: body.category,
    image: body.image,
    featured: body.featured === undefined ? false : Boolean(body.featured),
    sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
  }),
  mapUpdate: (body) => ({
    title: body.title,
    category: body.category,
    image: body.image,
    featured: body.featured === undefined ? undefined : Boolean(body.featured),
    sortOrder:
      body.sortOrder === undefined ? undefined : parseInt(body.sortOrder, 10),
  }),
});
