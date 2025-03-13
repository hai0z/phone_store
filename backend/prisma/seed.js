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
    prisma.ram.deleteMany(),
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
  await prisma.$executeRaw`ALTER TABLE Ram AUTO_INCREMENT = 1`;
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
      { category_name: "Điện thoại di động" },
      { category_name: "Máy tính bảng" },
    ],
  });

  // Create Brands
  const brands = await prisma.brands.createMany({
    data: [
      { brand_name: "Apple", image_url: "brands/apple.png" },
      { brand_name: "Samsung", image_url: "brands/samsung.png" },
      { brand_name: "Xiaomi", image_url: "brands/xiaomi.png" },
      { brand_name: "OPPO", image_url: "brands/oppo.png" },
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

  // Create RAM options
  const ramOptions = await prisma.ram.createMany({
    data: [{ capacity: "8GB" }, { capacity: "12GB" }, { capacity: "16GB" }],
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
      release_date: new Date("2022-09-16"),
      specs: JSON.stringify({
        screen: "6.7-inch OLED",
        processor: "A16 Bionic",
        camera: "48MP + 12MP + 12MP",
        battery: "4323 mAh",
      }),
      article:
        "Experience the ultimate iPhone with the new iPhone 14 Pro Max...",
    },
    {
      product_name: "Samsung Galaxy S23 Ultra",
      category_id: 1,
      brand_id: 2,
      description: "Samsung's premium flagship smartphone",
      release_date: new Date("2023-02-17"),
      specs: JSON.stringify({
        screen: "6.8-inch Dynamic AMOLED",
        processor: "Snapdragon 8 Gen 2",
        camera: "200MP + 12MP + 10MP + 10MP",
        battery: "5000 mAh",
      }),
      article: "Discover the power of Galaxy with the S23 Ultra...",
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.products.create({
      data: product,
    });

    // Create variants for each product
    const variants = [];
    for (let colorId = 1; colorId <= 3; colorId++) {
      // Create variants with different storage and RAM combinations
      for (let storageId = 1; storageId <= 3; storageId++) {
        for (let ramId = 1; ramId <= 2; ramId++) {
          // Calculate prices based on storage capacity
          const basePrice = 20000000;
          const storageMultiplier = 5000000;
          const originalPrice = basePrice + storageId * storageMultiplier;

          variants.push({
            product_id: createdProduct.product_id,
            variant_id: variants.length + 1, // Add variant_id as required
            color_id: colorId,
            storage_id: storageId,
            ram_id: ramId,
            original_price: originalPrice,
            sale_price: originalPrice, // Keep same as original price
            promotional_price: originalPrice - 1000000 || null, // Set promotional price 1M less or null
            promotion_start: new Date() || null,
            promotion_end:
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) || null, // 30 days from now
            stock: 50,
          });
        }
      }

      // Create product images for each color
      await prisma.productImages.createMany({
        data: [
          {
            product_id: createdProduct.product_id,
            color_id: colorId,
            image_url: `products/${createdProduct.product_name
              .replace(/ /g, "-")
              .toLowerCase()}/main-${colorId}.jpg`,
          },
          {
            product_id: createdProduct.product_id,
            color_id: colorId,
            image_url: `products/${createdProduct.product_name
              .replace(/ /g, "-")
              .toLowerCase()}/thumbnail-${colorId}.jpg`,
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
