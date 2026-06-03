const prisma = require("../config/prisma");
const { createCrudRouter } = require("./createCrudRouter");

module.exports = createCrudRouter({
  prisma,
  model: "contactMessage",
  orderBy: { createdAt: "desc" },
  mapCreate: (body) => ({
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
    status: body.status || "NEW",
  }),
  mapUpdate: (body) => ({
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
    status: body.status,
  }),
});
