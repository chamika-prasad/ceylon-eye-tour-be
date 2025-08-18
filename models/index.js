import Activity from "./Activity.model.js";
import Admin from "./Admin.model.js";
import Booking from "./Booking.model.js";
import Category from "./Category.model.js";
import Customer from "./Customer.model.js";
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
  Customer.hasMany(Review, {
    foreignKey: "customer_id",
    as: "Reviews",
  });

  Review.belongsTo(Customer, {
    foreignKey: "customer_id",
    as: "Customer",
  });

  // Customer - Gallery (one-to-many)
  Customer.hasMany(Gallery, {
    foreignKey: "customer_id",
    as: "Galleries",
  });

  Gallery.belongsTo(Customer, {
    foreignKey: "customer_id",
    as: "Customer",
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

  // Customer - Booking (one-to-many)
  Customer.hasMany(Booking, {
    foreignKey: "customer_id",
    as: "Bookings", // Alias for including bookings with customer
  });

  Booking.belongsTo(Customer, {
    foreignKey: "customer_id",
    as: "Customer", // Alias for including customer with booking
  });
};

initModels(); // Call it immediately so models are ready when exported

export {
  Activity,
  Admin,
  Booking,
  Category,
  Customer,
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
};
