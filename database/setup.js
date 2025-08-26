import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

const SQL_STATEMENTS = [
  `DROP DATABASE IF EXISTS ${process.env.DB_NAME || "ceylon_eye_tour"}`,
  `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "ceylon_eye_tour"}`,
  `USE ${process.env.DB_NAME || "ceylon_eye_tour"}`,
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    pw VARCHAR(255) NOT NULL,
    phoneno VARCHAR(20),
    country VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    hero_description TEXT,
    image_url VARCHAR(500),
    url_prefix VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS places (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    location VARCHAR(255) NOT NULL,
    longitude DECIMAL DEFAULT NULL,
    latitude DECIMAL DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    url_prefix VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS place_activities (
    place_id VARCHAR(36) NOT NULL,
    activity_id VARCHAR(36) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    PRIMARY KEY (place_id, activity_id),
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS packages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    package_highlights TEXT,
    price DECIMAL(10, 2) NOT NULL,
    tour_type INT NOT NULL,
    departure_location VARCHAR(255) NOT NULL,
    departure_description TEXT,
    arrival_location VARCHAR(255) NOT NULL,
    arrival_description TEXT,
    duration VARCHAR(255) NOT NULL,
    excludes TEXT,
    includes TEXT,
    url_prefix VARCHAR(255) UNIQUE NOT NULL,
    rating INT NOT NULL DEFAULT 0,
    user_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS package_categories (
  package_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (package_id, category_id),
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS package_places (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    package_id VARCHAR(36) NOT NULL,
    place_id VARCHAR(36) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL,
    day_no INT NOT NULL,
    events TEXT,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS package_images (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    package_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    adult_count INT NOT NULL,
    child_count INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    start_date DATE NOT NULL,
    package_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id),
    FOREIGN KEY (customer_id) REFERENCES users(id)
)`,
  `CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id VARCHAR(36) NOT NULL,
    payment_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
)`,
  `CREATE TABLE IF NOT EXISTS hotel_types (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  url_prefix VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS hotels (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    place_id VARCHAR(36) NOT NULL,
    type_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    facilities TEXT,
    images TEXT,
    rooms_details TEXT,
    rating INT NOT NULL DEFAULT 0,
    url_prefix VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id),
    FOREIGN KEY (type_id) REFERENCES hotel_types(id)
)`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    booking_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL DEFAULT 0,
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
)`,
  `CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  customer_id VARCHAR(36) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_approved BOOL NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id)
)`,
  `CREATE TABLE IF NOT EXISTS vehicles (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  descriptions TEXT,
  images TEXT,
  excludes TEXT,
  facilities TEXT,
  terms TEXT,
  owner VARCHAR(255) NOT NULL,
  owner_contact VARCHAR(255) NOT NULL,
  url_prefix VARCHAR(255) UNIQUE NOT NULL,
  passenger_capacity INT NOT NULL,
  location VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  `CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  sender_id VARCHAR(36) NOT NULL,
  receiver_id VARCHAR(36) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sender_id (sender_id),
  INDEX idx_receiver_id (receiver_id),
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS customize_packages (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  required_day_count INT,
  is_approved BOOL NOT NULL DEFAULT 0,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS customize_package_places (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  customize_package_id VARCHAR(36) NOT NULL,
  place_id VARCHAR(36) NOT NULL,
  sort_order INT,
  day_no INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customize_package_id) REFERENCES customize_packages(id) ON DELETE CASCADE,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);`,
  `CREATE TABLE IF NOT EXISTS customize_package_place_activities (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  customize_package_place_id VARCHAR(36) NOT NULL,
  activity_id VARCHAR(36) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customize_package_place_id) REFERENCES customize_package_places(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);`,
];

async function setupDatabase() {
  let connection;
  try {
    // 1. Connect to MySQL server (without specifying a database)
    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✅ Connected to MySQL server");

    // Execute statements one by one
    for (const sql of SQL_STATEMENTS) {
      try {
        await connection.query(sql);
        console.log(`✓ Executed: ${sql.split(" ").slice(0, 6).join(" ")}...`);
      } catch (error) {
        console.error(`⚠️ Error executing: ${sql.substring(0, 50)}...`);
        throw error;
      }
    }
    console.log("🎉 Database and tables created successfully!");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  } finally {
    // 3. Close the connection
    if (connection) await connection.end();
  }
}

// Execute the setup
setupDatabase();
