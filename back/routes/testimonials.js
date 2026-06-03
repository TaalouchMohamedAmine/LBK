const prisma = require("../config/prisma");
const { createCrudRouter } = require("./createCrudRouter");

module.exports = createCrudRouter({
  prisma,
  model: "testimonial",
  orderBy: { sortOrder: "asc" },
  mapCreate: (body) => ({
    name: body.name,
    role: body.role,
    quote: body.quote,
    rating: body.rating ? parseInt(body.rating, 10) : 5,
    avatar: body.avatar,
    featured: body.featured === undefined ? true : Boolean(body.featured),
    sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
  }),
  mapUpdate: (body) => ({
    name: body.name,
    role: body.role,
    quote: body.quote,
    rating: body.rating === undefined ? undefined : parseInt(body.rating, 10),
    avatar: body.avatar,
    featured: body.featured === undefined ? undefined : Boolean(body.featured),
    sortOrder:
      body.sortOrder === undefined ? undefined : parseInt(body.sortOrder, 10),
  }),
});
