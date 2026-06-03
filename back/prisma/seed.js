require("dotenv").config();

const { ProductStatus } = require("@prisma/client");
const prisma = require("../config/prisma");

async function main() {
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.service.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.contactMessage.deleteMany();

  const [bridal, editorial, beauty] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Bridal",
        image:
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80",
      },
    }),
    prisma.category.create({
      data: {
        name: "Editorial",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
      },
    }),
    prisma.category.create({
      data: {
        name: "Beauty",
        image:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      },
    }),
  ]);

  const [cosmitek, studio] = await Promise.all([
    prisma.brand.create({
      data: {
        name: "Cosmitek",
        logo: "https://images.unsplash.com/photo-1522336549298-1f61e40d0e9a?auto=format&fit=crop&w=900&q=80",
      },
    }),
    prisma.brand.create({
      data: {
        name: "Signature Line",
        logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
      },
    }),
  ]);

  await prisma.product.createMany({
    data: [
      {
        name: "Luxe Bridal Glow Set",
        description: "Curated essentials for long-lasting bridal radiance.",
        price: 68,
        image:
          "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=900&q=80",
        status: ProductStatus.AVAILABLE,
        categoryId: bridal.id,
        brandId: cosmitek.id,
      },
      {
        name: "Soft Sculpt Palette",
        description: "Neutral tones for editorial and daily elegance.",
        price: 54,
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
        status: ProductStatus.AVAILABLE,
        categoryId: editorial.id,
        brandId: studio.id,
      },
      {
        name: "Velvet Finish Lip Trio",
        description: "Three curated shades for every mood.",
        price: 34,
        image:
          "https://images.unsplash.com/photo-1583241800698-1f3b632d6b9f?auto=format&fit=crop&w=900&q=80",
        status: ProductStatus.AVAILABLE,
        categoryId: beauty.id,
        brandId: cosmitek.id,
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      {
        title: "Bridal Makeup",
        description:
          "Soft, luminous, and long-wear artistry for your wedding day.",
        priceFrom: 120,
        duration: "2h 30m",
        image:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Event Glam",
        description:
          "Polished evening looks for launches, galas, and celebrations.",
        priceFrom: 90,
        duration: "1h 30m",
        image:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Editorial & Shoot",
        description: "High-impact looks crafted for campaigns and content.",
        priceFrom: 150,
        duration: "3h",
        image:
          "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=80",
        featured: true,
        sortOrder: 3,
      },
      {
        title: "Private Masterclass",
        description:
          "Personalized lessons to refine your own makeup technique.",
        priceFrom: 180,
        duration: "3h 30m",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
        featured: false,
        sortOrder: 4,
      },
    ],
  });

  await prisma.galleryItem.createMany({
    data: [
      {
        title: "Soft Bridal Shine",
        category: "Bridal",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Golden Hour Glam",
        category: "Editorial",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Red Carpet Eyes",
        category: "Event",
        image:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
        featured: true,
        sortOrder: 3,
      },
      {
        title: "Radiant Skin Focus",
        category: "Beauty",
        image:
          "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80",
        featured: false,
        sortOrder: 4,
      },
      {
        title: "Studio Portrait",
        category: "Editorial",
        image:
          "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80",
        featured: false,
        sortOrder: 5,
      },
      {
        title: "Wedding Guest Glow",
        category: "Bridal",
        image:
          "https://images.unsplash.com/photo-1491349174775-aaafddd81942?auto=format&fit=crop&w=900&q=80",
        featured: false,
        sortOrder: 6,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Sarah M.",
        role: "Bride",
        quote: "The look lasted all day and felt beautifully natural.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
        featured: true,
        sortOrder: 1,
      },
      {
        name: "Nadia T.",
        role: "Creative Director",
        quote: "Editorial precision with a soft luxury finish.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
        featured: true,
        sortOrder: 2,
      },
      {
        name: "Leila B.",
        role: "Client",
        quote: "Professional, warm, and exactly the glam I wanted.",
        rating: 5,
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        featured: true,
        sortOrder: 3,
      },
    ],
  });

  await prisma.faq.createMany({
    data: [
      {
        question: "How far in advance should I book?",
        answer:
          "For weddings and major events, book as early as possible. We recommend 1 to 3 months ahead.",
        sortOrder: 1,
      },
      {
        question: "Do you travel for on-site appointments?",
        answer:
          "Yes, travel and destination appointments are available depending on the event and date.",
        sortOrder: 2,
      },
      {
        question: "Can I request a custom shop item or bundle?",
        answer:
          "Absolutely. We can help tailor beauty sets and product bundles for your needs.",
        sortOrder: 3,
      },
      {
        question: "Do you offer lessons?",
        answer:
          "Yes, private lessons and masterclasses are available for personal makeup coaching.",
        sortOrder: 4,
      },
    ],
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
