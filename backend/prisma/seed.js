const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.orderDetails.deleteMany(),
    prisma.orders.deleteMany(),
    prisma.comments.deleteMany(),
    prisma.ratings.deleteMany(),
    prisma.productImages.deleteMany(),
    prisma.productVariants.deleteMany(),
    prisma.products.deleteMany(),
    prisma.categories.deleteMany(),
    prisma.brands.deleteMany(),
    prisma.colors.deleteMany(),
    prisma.storages.deleteMany(),
    prisma.customers.deleteMany(),
    prisma.admin.deleteMany(),
    prisma.vouchers.deleteMany(),
  ]);

  // Reset auto-increment counters
  await prisma.$executeRaw`ALTER TABLE OrderDetails AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Orders AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Comments AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Ratings AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE ProductImages AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE ProductVariants AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Products AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Categories AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Brands AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Colors AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Storages AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Customers AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Admin AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Vouchers AUTO_INCREMENT = 1`;

  // Create Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.create({
    data: {
      username: "admin",
      password: adminPassword,
      full_name: "System Admin",
      email: "admin@phonestore.com",
    },
  });

  // Create Categories
  const categories = await prisma.categories.createMany({
    data: [
      { category_name: "Flagship", description: "High-end smartphones" },
      { category_name: "Mid-range", description: "Mid-range smartphones" },
      { category_name: "Budget", description: "Affordable smartphones" },
    ],
  });

  // Create Brands
  const brands = await prisma.brands.createMany({
    data: [
      { brand_name: "Apple" },
      { brand_name: "Samsung" },
      { brand_name: "Xiaomi" },
      { brand_name: "OPPO" },
    ],
  });

  // Create Colors
  const colors = await prisma.colors.createMany({
    data: [
      { color_name: "Black", hex: "#000000" },
      { color_name: "White", hex: "#FFFFFF" },
      { color_name: "Gold", hex: "#FFD700" },
      { color_name: "Silver", hex: "#C0C0C0" },
      { color_name: "Blue", hex: "#0000FF" },
    ],
  });

  // Create Storages
  const storages = await prisma.storages.createMany({
    data: [
      { storage_capacity: "128GB" },
      { storage_capacity: "256GB" },
      { storage_capacity: "512GB" },
      { storage_capacity: "1TB" },
    ],
  });

  // Create Products
  const products = [
    {
      product_name: "iPhone 14 Pro Max",
      category_id: 1,
      brand_id: 1,
      description: "Apple's latest flagship smartphone",
      specs: JSON.stringify({
        screen: "6.7-inch OLED",
        processor: "A16 Bionic",
        camera: "48MP + 12MP + 12MP",
      }),
    },
    {
      product_name: "Samsung Galaxy S23 Ultra",
      category_id: 1,
      brand_id: 2,
      description: "Samsung's premium flagship smartphone",
      specs: JSON.stringify({
        screen: "6.8-inch Dynamic AMOLED",
        processor: "Snapdragon 8 Gen 2",
        camera: "200MP + 12MP + 10MP + 10MP",
      }),
    },
    {
      product_name: "Xiaomi 13 Pro",
      category_id: 1,
      brand_id: 3,
      description: "Xiaomi's flagship device",
      specs: JSON.stringify({
        screen: "6.73-inch AMOLED",
        processor: "Snapdragon 8 Gen 2",
        camera: "50MP + 50MP + 50MP",
      }),
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.products.create({
      data: product,
    });

    // Create variants for each product
    const variants = [];
    for (let colorId = 1; colorId <= 3; colorId++) {
      for (let storageId = 1; storageId <= 3; storageId++) {
        variants.push({
          product_id: createdProduct.product_id,
          color_id: colorId,
          storage_id: storageId,
          original_price: 20000000 + storageId * 5000000,
          sale_price: 20000000 + storageId * 5000000,
          promotional_price: 19000000 + storageId * 5000000,
          promotion_start: new Date(),
          promotion_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          stock: 50,
        });
      }

      // Create product images for each color
      await prisma.productImages.createMany({
        data: [
          {
            product_id: createdProduct.product_id,
            color_id: colorId,
            image_url: `https://example.com/images/${createdProduct.product_name.replace(
              / /g,
              "-"
            )}/main-${colorId}.jpg`,
            image_type: "main",
          },
          {
            product_id: createdProduct.product_id,
            color_id: colorId,
            image_url: `https://example.com/images/${createdProduct.product_name.replace(
              / /g,
              "-"
            )}/thumbnail-${colorId}.jpg`,
            image_type: "thumbnail",
          },
          {
            product_id: createdProduct.product_id,
            color_id: colorId,
            image_url: `https://example.com/images/${createdProduct.product_name.replace(
              / /g,
              "-"
            )}/gallery-1-${colorId}.jpg`,
            image_type: "gallery",
          },
          {
            product_id: createdProduct.product_id,
            color_id: colorId,
            image_url: `https://example.com/images/${createdProduct.product_name.replace(
              / /g,
              "-"
            )}/gallery-2-${colorId}.jpg`,
            image_type: "gallery",
          },
        ],
      });
    }

    await prisma.productVariants.createMany({
      data: variants,
    });
  }

  // Create Customers
  const customerPassword = await bcrypt.hash("customer123", 10);
  const customers = await prisma.customers.createMany({
    data: [
      {
        full_name: "John Doe",
        email: "john@example.com",
        password: customerPassword,
        phone: "0123456789",
        address: "123 Main St",
      },
      {
        full_name: "Jane Smith",
        email: "jane@example.com",
        password: customerPassword,
        phone: "0987654321",
        address: "456 Oak St",
      },
    ],
  });

  // Create Vouchers
  const vouchers = await prisma.vouchers.createMany({
    data: [
      {
        code: "WELCOME20",
        discount_value: 20,
        discount_type: "percent",
        min_order_value: 1000000,
        max_uses: 100,
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        code: "SAVE500K",
        discount_value: 500000,
        discount_type: "fixed",
        min_order_value: 5000000,
        max_uses: 50,
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // Create sample ratings and comments
  await prisma.ratings.createMany({
    data: [
      {
        product_id: 1,
        customer_id: 1,
        rating: 5,
      },
      {
        product_id: 1,
        customer_id: 2,
        rating: 4,
      },
    ],
  });

  await prisma.comments.createMany({
    data: [
      {
        product_id: 1,
        customer_id: 1,
        content: "Great phone, amazing camera!",
      },
      {
        product_id: 1,
        customer_id: 2,
        content: "Battery life is impressive.",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
