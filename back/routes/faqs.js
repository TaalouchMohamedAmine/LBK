const prisma = require("../config/prisma");
const { createCrudRouter } = require("./createCrudRouter");

module.exports = createCrudRouter({
  prisma,
  model: "faq",
  orderBy: { sortOrder: "asc" },
  mapCreate: (body) => ({
    question: body.question,
    answer: body.answer,
    sortOrder: body.sortOrder ? parseInt(body.sortOrder, 10) : 0,
  }),
  mapUpdate: (body) => ({
    question: body.question,
    answer: body.answer,
    sortOrder:
      body.sortOrder === undefined ? undefined : parseInt(body.sortOrder, 10),
  }),
});
