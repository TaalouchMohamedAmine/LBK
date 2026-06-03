const prisma = require("../config/prisma");
const { createCrudRouter } = require("./createCrudRouter");

module.exports = createCrudRouter({
  prisma,
  model: "bookingRequest",
  orderBy: { createdAt: "desc" },
  mapCreate: (body) => ({
    name: body.name,
    email: body.email,
    phone: body.phone,
    service: body.service,
    preferredDate: body.preferredDate ? new Date(body.preferredDate) : null,
    eventType: body.eventType,
    notes: body.notes,
    status: body.status || "NEW",
  }),
  mapUpdate: (body) => ({
    name: body.name,
    email: body.email,
    phone: body.phone,
    service: body.service,
    preferredDate:
      body.preferredDate === undefined
        ? undefined
        : body.preferredDate
          ? new Date(body.preferredDate)
          : null,
    eventType: body.eventType,
    notes: body.notes,
    status: body.status,
  }),
});
