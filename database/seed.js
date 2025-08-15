import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ceylon_eye_tour",
};

// -----------------------------
// Sample Users
// -----------------------------
const ADMIN = {
  id: uuidv4(),
  email: "admin@ceyloneye.com",
  pw: "$2b$10$EXAMPLEHASHEDPASSWORD",
};

const CUSTOMERS = [
  {
    id: uuidv4(),
    email: "customer1@example.com",
    pw: "$2b$10$EXAMPLEHASHEDPASSWORD1",
    phoneno: "0771234567",
    country: "Sri Lanka",
    name: "John Doe",
  },
  {
    id: uuidv4(),
    email: "customer2@example.com",
    pw: "$2b$10$EXAMPLEHASHEDPASSWORD2",
    phoneno: "0769876543",
    country: "India",
    name: "Jane Smith",
  },
];

// -----------------------------
// Sample Data Generator
// -----------------------------
function generateSampleData(tableName, count) {
  const data = [];

  for (let i = 1; i <= count; i++) {
    switch (tableName) {
      case "categories":
        data.push({
          id: uuidv4(),
          name: `Category ${i}`,
          description: `Description for category ${i}`,
          hero_description: `Hero description for category ${i}`,
          image_url: `https://picsum.photos/1920/1080?random=${i}`,
          url_prefix: `category-${i}`,
        });
        break;
      case "activities":
        data.push({
          id: uuidv4(),
          name: `Activity ${i}`,
          description: `Description for activity ${i}`,
          image_url: `https://picsum.photos/1920/1080?random=${i}`,
        });
        break;
      case "places":
        data.push({
          id: uuidv4(),
          location: `Location ${i}`,
          longitude: (79 + Math.random()).toFixed(6),
          latitude: (6 + Math.random()).toFixed(6),
          name: `Place ${i}`,
          url_prefix: `place-${i}`,
          description: `Description for place ${i}`,
          image_url: `https://picsum.photos/1920/1080?random=${i}`,
        });
        break;
    }
  }

  return data;
}

// -----------------------------
// Seeding Logic
// -----------------------------
async function seedDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Connected to MySQL");

    // Seed Admin
    await connection.query(
      "INSERT INTO admin SET ? ON DUPLICATE KEY UPDATE email = email",
      ADMIN
    );
    console.log("✓ Admin seeded");

    // Seed Customers
    for (const customer of CUSTOMERS) {
      await connection.query(
        "INSERT INTO customers SET ? ON DUPLICATE KEY UPDATE email = email",
        customer
      );
    }
    console.log("✓ Customers seeded");

    // Seed Tables: categories, activities, places
    const tableNames = ["categories", "activities", "places"];

    for (const table of tableNames) {
      const data = generateSampleData(table, 10);

      for (const record of data) {
        try {
          await connection.query(
            `INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE id = id`,
            record
          );
        } catch (err) {
          console.error(`⚠️ Failed to insert into ${table}:`, err.message);
        }
      }

      console.log(`✓ ${table} seeded with 10 records`);
    }

    // Seed Packages
    const packageData = [];

    for (let i = 1; i <= 10; i++) {
      const locations = ["Katunayaka", "Mattala"];
      const arrival = locations[Math.floor(Math.random() * locations.length)];
      const departure = locations[Math.floor(Math.random() * locations.length)];
      const days = Math.floor(Math.random() * 5) + 1;

      packageData.push({
        id: uuidv4(),
        title: `Package ${i}`,
        description: `["description 1", "description 2", "description 3"]`,
        package_highlights: `["highlight1", "highlight2", "highlight3"]`,
        price: (Math.random() * 500 + 50).toFixed(2),
        tour_type: Math.round(Math.random()),
        departure_location: departure,
        departure_description: `${departure} Departure description for package ${i}`,
        arrival_location: arrival,
        arrival_description: `${arrival} Arrival description for package ${i}`,
        duration: `${days} days / ${days - 1} nights`,
        excludes: `["Meals", "Insurance", "Tips"]`,
        includes: `["Accommodation", "Transport", "Guide"]`,
        url_prefix: `package-${i}`,
      });
    }

    for (const packageItem of packageData) {
      try {
        await connection.query(
          "INSERT INTO packages SET ? ON DUPLICATE KEY UPDATE id = id",
          packageItem
        );
      } catch (err) {
        console.error("⚠️ Failed to insert package:", err.message);
      }
    }
    console.log("✓ Packages seeded with 10 records");

    // Fetch IDs for relationships
    const [places] = await connection.query("SELECT id FROM places LIMIT 10");
    const [activities] = await connection.query(
      "SELECT id FROM activities LIMIT 10"
    );
    const [packages] = await connection.query(
      "SELECT id FROM packages LIMIT 10"
    );
    const [categories] = await connection.query(
      "SELECT id FROM categories LIMIT 10"
    );
    const [customers] = await connection.query("SELECT id FROM customers");

    // Seed Hotels
    for (let i = 0; i < 10; i++) {
      const place = places[Math.floor(Math.random() * places.length)];
      try {
        await connection.query("INSERT INTO hotels SET ?", {
          id: uuidv4(),
          place_id: place.id,
          name: `Hotel ${i + 1}`,
          description: `["description 1", "description 2", "description 3"]`,
          facilities: `["facility 1", "facility 2", "facility 3"]`,
          images: `["https://picsum.photos/seed/hotel${i}/600/400", "https://picsum.photos/seed/hotel${i}/600/400", "https://picsum.photos/seed/hotel${i}/600/400"]`,
          rooms_details: `["rooms details 1", "rooms details 2", "rooms details 3"]`,
          rating: Math.floor(Math.random() * 5) + 1,
        });
      } catch (error) {
        console.error("⚠️ Failed to insert hotel:", error.message);
      }
    }
    console.log("✓ Hotels seeded with 10 records");

    // Seed Reviews
    for (let i = 0; i < 10; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      try {
        await connection.query("INSERT INTO reviews SET ?", {
          id: uuidv4(),
          customer_id: customer.id,
          rating: Math.floor(Math.random() * 5) + 1,
          review: `This is review ${i + 1}`,
        });
      } catch (error) {
        console.error("⚠️ Failed to insert review:", error.message);
      }
    }
    console.log("✓ Reviews seeded with 10 records");

    // ✅ Seed Gallery
    for (let i = 0; i < 10; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      try {
        await connection.query("INSERT INTO gallery SET ?", {
          id: uuidv4(),
          customer_id: customer.id,
          image_url: `https://picsum.photos/seed/gallery${i}/800/600`,
          is_approved: Math.random() > 0.5 ? 1 : 0,
        });
      } catch (error) {
        console.error("⚠️ Failed to insert gallery:", error.message);
      }
    }
    console.log("✓ Gallery seeded with 10 records");

    // Seed Junction Tables and Bookings
    for (let i = 0; i < 10; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const place = places[i];
      const activity = activities[i];
      const packageItem = packages[i];
      const category =
        categories[Math.floor(Math.random() * categories.length)];

      try {
        // Junction: place_activities
        await connection.query("INSERT IGNORE INTO place_activities SET ?", {
          place_id: place.id,
          activity_id: activity.id,
          description: `Description for activity ${i}`,
          price: (Math.random() * 100 + 10).toFixed(2),
          image_url: `https://example.com/place-activity-${i}.jpg`,
        });

        // Junction: package_places
        await connection.query("INSERT IGNORE INTO package_places SET ?", {
          package_id: packages[0].id,
          place_id: place.id,
          description: `Description for place ${i}`,
          sort_order: i + 1,
          day_no: i + 1,
        });

        // Junction: package_categories
        await connection.query("INSERT IGNORE INTO package_categories SET ?", {
          package_id: packageItem.id,
          category_id: category.id,
        });

        // Bookings
        await connection.query("INSERT INTO booking SET ?", {
          id: uuidv4(),
          passenger_count: Math.floor(Math.random() * 5) + 1,
          status: ["pending", "confirmed", "completed", "cancelled"][
            Math.floor(Math.random() * 4)
          ],
          start_date: new Date(
            Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          package_id: packageItem.id,
          customer_id: customer.id,
        });
      } catch (error) {
        console.error("⚠️ Insert failed (junction/bookings):", error.message);
      }
    }

    // Seed Payments
    const [bookings] = await connection.query(
      "SELECT id FROM booking LIMIT 10"
    );

    for (let i = 0; i < 10; i++) {
      try {
        await connection.query("INSERT IGNORE INTO payments SET ?", {
          id: uuidv4(),
          booking_id: bookings[i].id,
          payment_id: `pay_${uuidv4().substring(0, 8)}`,
          amount: (Math.random() * 500 + 50).toFixed(2),
          status: ["pending", "completed", "failed"][
            Math.floor(Math.random() * 3)
          ],
        });
      } catch (error) {
        console.error("⚠️ Failed to seed payments:", error.message);
      }
    }

    console.log("✓ Junction tables and payments seeded");
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

// Run Seeding
seedDatabase();
