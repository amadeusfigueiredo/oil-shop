import db from '../models/index.js';

const isAdmin = async (userId) => {
  const user = await db.users.findByPk(userId, {
    include: [{ model: db.roles, as: 'role', attributes: ['name'] }],
  });
  return user?.role?.name === 'admin';
};

// These guards run after decodeJWT; roles are read from the database so a
// demoted administrator cannot retain privileges until their token expires.
export const requireAdmin = async (req, res, next) => {
  if (!(await isAdmin(req.user.id))) {
    return res.status(403).json({ message: 'Administrator access required' });
  }
  next();
};

export const requireUserAccess = (parameter) => async (req, res, next) => {
  if (
    String(req.user.id) !== req.params[parameter] &&
    !(await isAdmin(req.user.id))
  ) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

export const requireOrderAccess = (getOrderId) => async (req, res, next) => {
  const orderId = Number(getOrderId(req));
  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }
  const order = await db.orders.findByPk(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.userId !== req.user.id && !(await isAdmin(req.user.id))) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
