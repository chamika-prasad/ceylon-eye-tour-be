import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import passwordService from "./../services/password.service.js";

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ceylon_eye_tour",
};

async function isTableEmpty(connection, tableName) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS count FROM ${tableName}`
  );
  return rows[0].count === 0;
}

// -----------------------------
// Sample Users
// -----------------------------

const ADMIN = {
  id: uuidv4(),
  email: "admin@ceyloneye.com",
  pw: await passwordService.hashPassword("123456"),
  role: "admin",
  name: "Admin",
};

const CUSTOMERS = [
  {
    id: uuidv4(),
    email: "customer1@example.com",
    pw: await passwordService.hashPassword("123456"),
    phoneno: "0771234567",
    country: "Sri Lanka",
    name: "John Doe",
  },
  {
    id: uuidv4(),
    email: "customer2@example.com",
    pw: await passwordService.hashPassword("123456"),
    phoneno: "0769876543",
    country: "India",
    name: "Jane Smith",
  },
];

// ✅ Hotel Types
const HOTEL_TYPES = [
  "Galle Fort",
  "City",
  "Country side",
  "Nature",
  "WILD",
].map((name, index) => ({
  id: uuidv4(),
  name,
  description: `Description for ${name}`,
  image_url: `/uploads/seeds/temp.jpg`,
  url_prefix: `${name.toLowerCase().replace(/\s+/g, "-")}`,
}));

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
          image_url: `/uploads/seeds/temp.jpg`,
          url_prefix: `category-${i}`,
        });
        break;
      case "activities":
        data.push({
          id: uuidv4(),
          name: `Activity ${i}`,
          description: `Description for activity ${i}`,
          image_url: `/uploads/seeds/temp.jpg`,
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
          image_url: `/uploads/seeds/temp.jpg`,
        });
        break;
      case "vehicles":
        data.push({
          id: uuidv4(),
          name: `Vehicle ${i}`,
          descriptions: `["description 1", "description 2", "description 3"]`,
          images: JSON.stringify([
            `/uploads/seeds/temp.jpg`,
            `/uploads/seeds/temp.jpg`,
            `/uploads/seeds/temp.jpg`,
          ]),
          excludes: JSON.stringify([
            "Fuel not included",
            "Driver tips",
            "Parking charges",
          ]),
          facilities: JSON.stringify(["AC", "WiFi", "Comfortable seats"]),
          terms: `["Terms 1", "Terms 2", "Terms 3"]`,
          price: (Math.random() * 100 + 20).toFixed(2),
          owner: `Owner ${i}`,
          owner_contact: `07${Math.floor(10000000 + Math.random() * 89999999)}`,
          url_prefix: `vehicle-${i}`,
          passenger_capacity: Math.floor(Math.random() * 6) + 2, // between 2 and 7
          location: ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo"][
            Math.floor(Math.random() * 5)
          ],
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

    // Seed Users
    if (await isTableEmpty(connection, "users")) {
      await connection.query(
        "INSERT INTO users SET ? ON DUPLICATE KEY UPDATE email = email",
        ADMIN
      );

      for (const customer of CUSTOMERS) {
        await connection.query(
          "INSERT INTO users SET ? ON DUPLICATE KEY UPDATE email = email",
          customer
        );
      }

      console.log("✓ Users seeded");
    } else {
      console.log("⏩ users already has data, skipping");
    }

    // ✅ Seed Hotel Types
    if (await isTableEmpty(connection, "hotel_types")) {
      for (const hotelType of HOTEL_TYPES) {
        await connection.query(
          "INSERT INTO hotel_types SET ? ON DUPLICATE KEY UPDATE name = name",
          hotelType
        );
      }
      console.log("✓ Hotel Types seeded");
    } else {
      console.log("⏩ hotel_types already has data, skipping");
    }

    // Seed Tables: categories, activities, places
    const tableNames = ["categories", "activities", "places", "vehicles"];

    for (const table of tableNames) {
      if (!(await isTableEmpty(connection, table))) {
        console.log(`⏩ ${table} already has data, skipping`);
        continue;
      }

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
    if (await isTableEmpty(connection, "packages")) {
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
    } else {
      console.log("⏩ packages already has data, skipping");
    }

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
    const [customers] = await connection.query(
      "SELECT id FROM users WHERE role != 'admin'"
    );

    const [hotelTypes] = await connection.query(
      "SELECT id FROM hotel_types LIMIT 5"
    );

    const [admins] = await connection.query(
      "SELECT id FROM users WHERE role = 'admin'"
    );

    // Seed Hotels
    if (await isTableEmpty(connection, "hotels")) {
      for (let i = 0; i < 10; i++) {
        const place = places[Math.floor(Math.random() * places.length)];
        const type = hotelTypes[Math.floor(Math.random() * hotelTypes.length)];
        try {
          await connection.query("INSERT INTO hotels SET ?", {
            id: uuidv4(),
            place_id: place.id,
            type_id: type.id,
            name: `Hotel ${i + 1}`,
            description: `["description 1", "description 2", "description 3"]`,
            facilities: `["facility 1", "facility 2", "facility 3"]`,
            images: `["/uploads/seeds/temp.jpg", "/uploads/seeds/temp.jpg", "/uploads/seeds/temp.jpg"]`,
            rooms_details: `["rooms details 1", "rooms details 2", "rooms details 3"]`,
            rating: Math.floor(Math.random() * 5) + 1,
            url_prefix: `hotel-${i + 1}`,
          });
        } catch (error) {
          console.error("⚠️ Failed to insert hotel:", error.message);
        }
      }
      console.log("✓ Hotels seeded with 10 records");
    } else {
      console.log("⏩ hotels already has data, skipping");
    }

    // ✅ Seed Gallery
    if (await isTableEmpty(connection, "gallery")) {
      for (let i = 0; i < 10; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        try {
          await connection.query("INSERT INTO gallery SET ?", {
            id: uuidv4(),
            customer_id: customer.id,
            image_url: `/uploads/seeds/temp.jpg`,
            is_approved: Math.random() > 0.5 ? 1 : 0,
          });
        } catch (error) {
          console.error("⚠️ Failed to insert gallery:", error.message);
        }
      }
      console.log("✓ Gallery seeded with 10 records");
    } else {
      console.log("⏩ gallery already has data, skipping");
    }

    // Seed Junction Tables and Bookings
    const shouldSeedPlaceActivities = await isTableEmpty(
      connection,
      "place_activities"
    );
    const shouldSeedPackagePlaces = await isTableEmpty(
      connection,
      "package_places"
    );
    const shouldSeedPackageCategories = await isTableEmpty(
      connection,
      "package_categories"
    );
    const shouldSeedBookings = await isTableEmpty(connection, "bookings");

    if (
      shouldSeedPlaceActivities ||
      shouldSeedPackagePlaces ||
      shouldSeedPackageCategories ||
      shouldSeedBookings
    ) {
      for (let i = 0; i < 10; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const place = places[i];
        const activity = activities[i];
        const packageItem = packages[i];
        const category =
          categories[Math.floor(Math.random() * categories.length)];

        try {
          if (shouldSeedPlaceActivities) {
            await connection.query("INSERT IGNORE INTO place_activities SET ?", {
              place_id: place.id,
              activity_id: activity.id,
              description: `Description for activity ${i}`,
              price: (Math.random() * 100 + 10).toFixed(2),
              image_url: `/uploads/seeds/temp.jpg`,
            });

            if (i < 8) {
              await connection.query(
                "INSERT IGNORE INTO place_activities SET ?",
                {
                  place_id: place.id,
                  activity_id: activities[i + 1].id,
                  description: `Description for activity ${i}`,
                  price: (Math.random() * 100 + 10).toFixed(2),
                  image_url: `/uploads/seeds/temp.jpg`,
                }
              );

              await connection.query(
                "INSERT IGNORE INTO place_activities SET ?",
                {
                  place_id: place.id,
                  activity_id: activities[i + 2].id,
                  description: `Description for activity ${i}`,
                  price: (Math.random() * 100 + 10).toFixed(2),
                  image_url: `/uploads/seeds/temp.jpg`,
                }
              );
            }
          }

          if (shouldSeedPackagePlaces) {
            await connection.query("INSERT IGNORE INTO package_places SET ?", {
              id: uuidv4(),
              package_id: packages[0].id,
              place_id: place.id,
              description: `Description for place ${i}`,
              events: `["event 1", "event 2", "event 3"]`,
              sort_order: i + 1,
              day_no: i + 1,
            });
          }

          if (shouldSeedPackageCategories) {
            await connection.query("INSERT IGNORE INTO package_categories SET ?", {
              package_id: packageItem.id,
              category_id: category.id,
            });
          }

          if (shouldSeedBookings) {
            await connection.query("INSERT INTO bookings SET ?", {
              id: uuidv4(),
              adult_count: Math.floor(Math.random() * 5) + 1,
              child_count: Math.floor(Math.random() * 5) + 1,
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
              message: `Booking message for ${customer.name} on package ${packageItem.title}`,
            });
          }
        } catch (error) {
          console.error("⚠️ Insert failed (junction/bookings):", error.message);
        }
      }

      if (shouldSeedPlaceActivities) {
        console.log("✓ place_activities seeded with sample records");
      } else {
        console.log("⏩ place_activities already has data, skipping");
      }

      if (shouldSeedPackagePlaces) {
        console.log("✓ package_places seeded with sample records");
      } else {
        console.log("⏩ package_places already has data, skipping");
      }

      if (shouldSeedPackageCategories) {
        console.log("✓ package_categories seeded with sample records");
      } else {
        console.log("⏩ package_categories already has data, skipping");
      }

      if (shouldSeedBookings) {
        console.log("✓ Bookings seeded with 10 records");
      } else {
        console.log("⏩ bookings already has data, skipping");
      }
    } else {
      console.log("⏩ junction tables and bookings already have data, skipping");
    }

    // Seed Messages
    if (await isTableEmpty(connection, "messages")) {
      for (let i = 0; i < 10; i++) {
        const user = customers[Math.floor(Math.random() * customers.length)];
        const admin = admins[Math.floor(Math.random() * admins.length)];

        const isUserSender = Math.random() > 0.5;
        const senderId = isUserSender ? user.id : admin.id;
        const receiverId = isUserSender ? admin.id : user.id;

        try {
          await connection.query("INSERT INTO messages SET ?", {
            id: uuidv4(),
            sender_id: senderId,
            receiver_id: receiverId,
            message: `Message ${i + 1} from ${
              isUserSender ? user.id : "Admin"
            } to ${isUserSender ? "Admin" : user.name}`,
            user_id: user.id,
          });
        } catch (error) {
          console.error("⚠️ Failed to insert message:", error.message);
        }
      }
      console.log("✓ Messages seeded with 10 records");
    } else {
      console.log("⏩ messages already has data, skipping");
    }

    // ✅ Seed Customize Packages
    const customizePackages = [];
    if (await isTableEmpty(connection, "customize_packages")) {
      for (let i = 1; i <= 10; i++) {
        customizePackages.push({
          id: uuidv4(),
          required_day_count: 10,
          message: `description for customize package ${i}`,
          user_id: customers[Math.floor(Math.random() * customers.length)].id,
          price: 0,
        });
      }

      for (const customizePackage of customizePackages) {
        try {
          await connection.query(
            "INSERT INTO customize_packages SET ?",
            customizePackage
          );
        } catch (error) {
          console.error("⚠️ Failed to insert customize_package:", error.message);
        }
      }
      console.log("✓ Customize Packages seeded with 10 records");
    } else {
      console.log("⏩ customize_packages already has data, skipping");

      const [existingCustomizePackages] = await connection.query(
        "SELECT id FROM customize_packages LIMIT 10"
      );
      existingCustomizePackages.forEach((item) =>
        customizePackages.push({ id: item.id })
      );
    }

    // ✅ Seed Customize Package Places
    const customizePackagePlaces = [];
    for (const customizePackage of customizePackages) {
      const placeCount = Math.floor(Math.random() * 3) + 2; // 2–4 places per package
      const selectedPlaces = [...places]
        .sort(() => 0.5 - Math.random())
        .slice(0, placeCount);

      selectedPlaces.forEach((place, index) => {
        customizePackagePlaces.push({
          id: uuidv4(),
          customize_package_id: customizePackage.id,
          place_id: place.id,
          description: `Description for customized place ${place.id}`,
          day_no: index + 1,
          sort_order: index + 1,
        });
      });
    }

    if (await isTableEmpty(connection, "customize_package_places")) {
      for (const cpp of customizePackagePlaces) {
        try {
          await connection.query(
            "INSERT INTO customize_package_places SET ?",
            cpp
          );
        } catch (error) {
          console.error(
            "⚠️ Failed to insert customize_package_place:",
            error.message
          );
        }
      }
      console.log(
        `✓ Customize Package Places seeded with ${customizePackagePlaces.length} records`
      );
    } else {
      console.log("⏩ customize_package_places already has data, skipping");
    }

    // ✅ Seed Customize Package Place Activities
    const customizePackagePlaceActivities = [];
    for (const cpp of customizePackagePlaces) {
      const activityCount = Math.floor(Math.random() * 3) + 1; // 1–3 activities per place

      const [placeActivitiesRows] = await connection.query(
        "SELECT activity_id FROM place_activities WHERE place_id = ?",
        [cpp.place_id]
      );
      const placeActivities = placeActivitiesRows.map((row) => ({
        id: row.activity_id,
      }));
      // const selectedActivities = [...activities]
      //   .sort(() => 0.5 - Math.random())
      //   .slice(0, activityCount);

      const selectedActivities = [...placeActivities];

      selectedActivities.forEach((activity) => {
        customizePackagePlaceActivities.push({
          id: uuidv4(),
          customize_package_place_id: cpp.id,
          activity_id: activity.id,
        });
      });
    }

    if (await isTableEmpty(connection, "customize_package_place_activities")) {
      for (const cpActivity of customizePackagePlaceActivities) {
        try {
          await connection.query(
            "INSERT INTO customize_package_place_activities SET ?",
            cpActivity
          );
        } catch (error) {
          console.error(
            "⚠️ Failed to insert customize_package_place_activity:",
            error.message
          );
        }
      }
      console.log(
        `✓ Customize Package Place Activities seeded with ${customizePackagePlaceActivities.length} records`
      );
    } else {
      console.log("⏩ customize_package_place_activities already has data, skipping");
    }

    const shouldSeedPayments = await isTableEmpty(connection, "payments");
    const shouldSeedReviews = await isTableEmpty(connection, "reviews");
    const shouldSeedCustomReviews = await isTableEmpty(connection, "custom_reviews");

    if (shouldSeedBookings) {
      for (let i = 0; i < 10; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const customPackageItem = customizePackages[i] || customizePackages[0];

        try {
          await connection.query("INSERT INTO bookings SET ?", {
            id: uuidv4(),
            adult_count: Math.floor(Math.random() * 5) + 1,
            child_count: Math.floor(Math.random() * 5) + 1,
            status: ["pending", "confirmed", "completed", "cancelled"][
              Math.floor(Math.random() * 4)
            ],
            start_date: new Date(
              Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0],
            custom_package_id: customPackageItem.id,
            customer_id: customer.id,
            message: `Booking message for ${customer.name} on customize package ${
              customPackageItem.title || customPackageItem.id
            }`,
          });
        } catch (error) {
          console.error("⚠️ Failed to insert customize package booking:", error.message);
        }
      }
      console.log("✓ Bookings seeded with custom package records");
    } else {
      console.log("⏩ bookings already has data, skipping customize package bookings");
    }

    const [bookings] = await connection.query(
      "SELECT id FROM bookings LIMIT 20"
    );

    const shouldSeedSecondPayments = await isTableEmpty(connection, "second_payments");

    if (shouldSeedPayments) {
      for (let i = 0; i < 20; i = i + 2) {
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
      console.log("✓ Payments seeded with sample records");
    } else {
      console.log("⏩ payments already has data, skipping");
    }

    if (shouldSeedSecondPayments) {
      const [existingPayments] = await connection.query(
        "SELECT id, booking_id FROM payments LIMIT 20"
      );

      if (existingPayments.length > 0) {
        for (const payment of existingPayments) {
          try {
            await connection.query("INSERT IGNORE INTO second_payments SET ?", {
              id: uuidv4(),
              booking_id: payment.booking_id,
              payment_id: `second_${uuidv4().substring(0, 8)}`,
              amount: (Math.random() * 250 + 20).toFixed(2),
              currency: "USD",
              status: ["pending", "success", "failed"][
                Math.floor(Math.random() * 3)
              ],
              status_message: "Seeded second payment",
              random_order_id: `sec_${uuidv4().substring(0, 8)}`,
              paymentType: 1,
              sourceUrl: null,
              first_payment_id: payment.id,
            });
          } catch (error) {
            console.error("⚠️ Failed to seed second_payments:", error.message);
          }
        }
        console.log("✓ Second payments seeded with sample records");
      } else {
        console.log(
          "⏩ no existing payments found to create second payments, skipping"
        );
      }
    } else {
      console.log("⏩ second_payments already has data, skipping");
    }

    if (shouldSeedReviews) {
      for (let i = 0; i < 10; i = i + 2) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const booking = bookings[Math.floor(Math.random() * bookings.length)];
        try {
          await connection.query("INSERT INTO reviews SET ?", {
            id: uuidv4(),
            customer_id: customer.id,
            booking_id: booking.id,
            rating: Math.floor(Math.random() * 5) + 1,
            review: `This is review ${i + 1}`,
            description: `Detailed description for review ${i + 1}`,
          });
        } catch (error) {
          console.error("⚠️ Failed to insert review:", error.message);
        }
      }
      console.log("✓ Reviews seeded with sample records");
    } else {
      console.log("⏩ reviews already has data, skipping");
    }

    if (shouldSeedCustomReviews) {
      for (let i = 1; i <= 10; i++) {
        try {
          await connection.query("INSERT INTO custom_reviews SET ?", {
            id: uuidv4(),
            first_name: `FirstName${i}`,
            last_name: `LastName${i}`,
            email: `custom_review${i}@example.com`,
            rating: Math.floor(Math.random() * 5) + 1,
            review: `This is custom review ${i}`,
            description: `Detailed description for custom review ${i}`,
          });
        } catch (error) {
          console.error("⚠️ Failed to insert custom_review:", error.message);
        }
      }
      console.log("✓ Custom Reviews seeded with 10 records");
    } else {
      console.log("⏩ custom_reviews already has data, skipping");
    }
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

// Run Seeding
seedDatabase();
