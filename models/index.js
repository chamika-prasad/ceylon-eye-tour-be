import Activity from "./Activity.model.js";
import Booking from "./Booking.model.js";
import Category from "./Category.model.js";
import User from "./User.model.js";
import Package from "./Package.model.js";
import PackagePlace from "./PackagePlace.model.js";
import Payment from "./Payment.model.js";
import Place from "./Place.model.js";
import PlaceActivity from "./PlaceActivity.model.js";
import PackageCategory from "./PackageCategory.model.js";
import PackageImage from "./packageImage.model.js";
import Review from "./Review.model.js";
import Hotel from "./Hotel.model.js";
import Gallery from "./Gallery.model.js";
import HotelType from "./HotelType.model.js";
import Vehicle from "./Vehicle.model.js";
import Message from "./Message.model.js";
import CustomizePackage from "./CustomizePackage.model.js";
import CustomizePackagePlace from "./CustomizePackagePlace.model.js";
import CustomizePackagePlaceActivity from "./CustomizePackagePlaceActivity.model.js";

// Define all associations here
const initModels = () => {
  //Place - Package
  Place.belongsToMany(Package, {
    through: PackagePlace,
    foreignKey: "place_id",
    otherKey: "package_id",
    as: "Packages",
  });

  Package.belongsToMany(Place, {
    through: PackagePlace,
    foreignKey: "package_id",
    otherKey: "place_id",
    as: "Places",
  });

  PackagePlace.belongsTo(Package, {
    foreignKey: "package_id",
    as: "Package", // Match the alias used in include
  });
  PackagePlace.belongsTo(Place, {
    foreignKey: "place_id",
    as: "Place", // Match the alias used in include
  });

  //Place - Activity
  Place.belongsToMany(Activity, {
    through: PlaceActivity,
    foreignKey: "place_id",
    otherKey: "activity_id",
    as: "Activities",
  });
  Activity.belongsToMany(Place, {
    through: PlaceActivity,
    foreignKey: "activity_id",
    otherKey: "place_id",
    as: "Places",
  });

  PlaceActivity.belongsTo(Activity, {
    foreignKey: "activity_id",
    as: "Activity", // Match the alias used in include
  });
  PlaceActivity.belongsTo(Place, {
    foreignKey: "place_id",
    as: "Place", // Match the alias used in include
  });

  // Package - PackageImage (one-to-many)
  Package.hasMany(PackageImage, {
    foreignKey: "package_id",
    as: "Images",
  });

  PackageImage.belongsTo(Package, {
    foreignKey: "package_id",
    as: "Package",
  });

  // Package - Category (many-to-many)
  Package.belongsToMany(Category, {
    through: PackageCategory,
    foreignKey: "package_id",
    otherKey: "category_id",
    as: "Categories",
  });

  Category.belongsToMany(Package, {
    through: PackageCategory,
    foreignKey: "category_id",
    otherKey: "package_id",
    as: "Packages",
  });

  PackageCategory.belongsTo(Package, {
    foreignKey: "package_id",
    as: "Package",
  });

  PackageCategory.belongsTo(Category, {
    foreignKey: "category_id",
    as: "Category",
  });

  // Place - Hotel (one-to-many)
  Place.hasMany(Hotel, {
    foreignKey: "place_id",
    as: "Hotels",
  });

  Hotel.belongsTo(Place, {
    foreignKey: "place_id",
    as: "Place",
  });

  // Customer - Review (one-to-many)
  User.hasMany(Review, {
    foreignKey: "customer_id",
    as: "Reviews",
  });

  Review.belongsTo(User, {
    foreignKey: "customer_id",
    as: "User",
  });

  // Customer - Gallery (one-to-many)
  User.hasMany(Gallery, {
    foreignKey: "customer_id",
    as: "Galleries",
  });

  Gallery.belongsTo(User, {
    foreignKey: "customer_id",
    as: "User",
  });

  // ✅ HotelType - Hotel (one-to-many)
  HotelType.hasMany(Hotel, {
    foreignKey: "type_id",
    as: "Hotels",
  });

  Hotel.belongsTo(HotelType, {
    foreignKey: "type_id",
    as: "Type",
  });

  // Booking - Review (one-to-one)
  Booking.hasOne(Review, {
    foreignKey: "booking_id",
    as: "Review",
  });

  Review.belongsTo(Booking, {
    foreignKey: "booking_id",
    as: "Booking",
  });

  // Package - Booking (one-to-many)
  Package.hasMany(Booking, {
    foreignKey: "package_id",
    as: "Bookings", // Alias for including bookings with package
  });

  Booking.belongsTo(Package, {
    foreignKey: "package_id",
    as: "Package", // Alias for including package with booking
  });

    // Customize Package - Booking (one-to-many)
    CustomizePackage.hasMany(Booking, {
      foreignKey: "custom_package_id",
      as: "CustomeBookings", // Alias for including bookings with package
    });
  
    Booking.belongsTo(CustomizePackage, {
      foreignKey: "custom_package_id",
      as: "CustomPackage", // Alias for including package with booking
    });

  // Customer - Booking (one-to-many)
  User.hasMany(Booking, {
    foreignKey: "customer_id",
    as: "Bookings", // Alias for including bookings with customer
  });

  Booking.belongsTo(User, {
    foreignKey: "customer_id",
    as: "User", // Alias for including customer with booking
  });

  // Booking - Payment (one-to-one)
  Booking.hasOne(Payment, {
    foreignKey: "booking_id",
    as: "Payment",
  });

  Payment.belongsTo(Booking, {
    foreignKey: "booking_id",
    as: "Booking",
  });

  // A User can send many messages
  User.hasMany(Message, {
    foreignKey: "sender_id",
    as: "sentMessages",
  });

  // A User can receive many messages
  User.hasMany(Message, {
    foreignKey: "receiver_id",
    as: "receivedMessages",
  });

   // A User can have many messages
  User.hasMany(Message, {
    foreignKey: "user_id",
    as: "userMessages",
  });

  // A Message belongs to a sender (User)
  Message.belongsTo(User, {
    foreignKey: "sender_id",
    as: "sender",
  });

  // A Message belongs to a receiver (User)
  Message.belongsTo(User, {
    foreignKey: "receiver_id",
    as: "receiver",
  });

   // A Message belongs to a user
  Message.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  // ✅ User - CustomizePackage (One-to-Many)
  User.hasMany(CustomizePackage, {
    foreignKey: "user_id",
    as: "CustomizePackages",
  });

  CustomizePackage.belongsTo(User, {
    foreignKey: "user_id",
    as: "User",
  });

  // ✅ CustomizePackage ↔ Place (Many-to-Many) through CustomizePackagePlace
  CustomizePackage.belongsToMany(Place, {
    through: CustomizePackagePlace,
    foreignKey: "customize_package_id",
    otherKey: "place_id",
    as: "Places",
  });

  Place.belongsToMany(CustomizePackage, {
    through: CustomizePackagePlace,
    foreignKey: "place_id",
    otherKey: "customize_package_id",
    as: "CustomizePackages",
  });

  // ✅ One CustomizePackage can have many CustomizePackagePlaces
  CustomizePackage.hasMany(CustomizePackagePlace, {
    foreignKey: "customize_package_id",
    as: "CustomizePackagePlaces",
  });

  CustomizePackagePlace.belongsTo(CustomizePackage, {
    foreignKey: "customize_package_id",
    as: "CustomizePackage",
  });

  CustomizePackagePlace.belongsTo(Place, {
    foreignKey: "place_id",
    as: "Place",
  });

  // ✅ CustomizePackagePlace ↔ Activity (Many-to-Many) through CustomizePackagePlaceActivity
  CustomizePackagePlace.belongsToMany(Activity, {
    through: CustomizePackagePlaceActivity,
    foreignKey: "customize_package_place_id",
    otherKey: "activity_id",
    as: "Activities",
  });

  Activity.belongsToMany(CustomizePackagePlace, {
    through: CustomizePackagePlaceActivity,
    foreignKey: "activity_id",
    otherKey: "customize_package_place_id",
    as: "CustomizePackagePlaces",
  });

  // ✅ CustomizePackagePlaceActivity belongsTo CustomizePackagePlace and Activity
  CustomizePackagePlaceActivity.belongsTo(CustomizePackagePlace, {
    foreignKey: "customize_package_place_id",
    as: "CustomizePackagePlace",
  });

  CustomizePackagePlaceActivity.belongsTo(Activity, {
    foreignKey: "activity_id",
    as: "Activity",
  });
};

initModels(); // Call it immediately so models are ready when exported

export {
  Activity,
  Booking,
  Category,
  User,
  Package,
  PackagePlace,
  Payment,
  Place,
  PlaceActivity,
  PackageCategory,
  PackageImage,
  Hotel,
  Review,
  Gallery,
  HotelType,
  Vehicle,
  Message,
  CustomizePackage,
  CustomizePackagePlace,
  CustomizePackagePlaceActivity,
};
