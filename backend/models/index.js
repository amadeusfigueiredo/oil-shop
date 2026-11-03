import '../config/env.js';
import Sequelize from 'sequelize';
import orderModel from './order.js';
import orderItemModel from './orderItem.js';
import productModel from './product.js';
import productCategoryModel from './productCategory.js';
import roleModel from './role.js';
import shippingDataModel from './shippingData.js';
import userModel from './user.js';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = userModel(sequelize, Sequelize);
db.products = productModel(sequelize, Sequelize);
db.productCategories = productCategoryModel(sequelize, Sequelize);
db.shippingData = shippingDataModel(sequelize, Sequelize);
db.roles = roleModel(sequelize, Sequelize);
db.orders = orderModel(sequelize, Sequelize);
db.orderItems = orderItemModel(sequelize, Sequelize);

db.products.belongsTo(db.productCategories, {
  foreignKey: 'categoryId',
  as: 'category',
});
db.productCategories.hasMany(db.products, {
  foreignKey: 'categoryId',
});
db.users.hasOne(db.shippingData, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
db.users.hasMany(db.orders, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
db.orders.belongsTo(db.users, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
db.shippingData.belongsTo(db.users, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
db.users.belongsTo(db.roles, {
  foreignKey: 'roleId',
});
db.roles.hasMany(db.users, {
  foreignKey: 'roleId',
});
db.products.hasMany(db.orderItems, {
  foreignKey: 'productId',
});
db.orderItems.belongsTo(db.products, {
  foreignKey: 'productId',
  onDelete: 'CASCADE',
});
db.orders.hasMany(db.orderItems, {
  foreignKey: 'orderId',
  onDelete: 'CASCADE',
});

export default db;
