import { lazy } from "react"
import {
  ABOUT,
  ACCOUNT_ORDERS,
  ACCOUNT_PROFILE,
  CART,
  CURRENT_ADMIN,
  CURRENT_CUSTOMER,
  FAQ,
  HOME,
  LOGIN,
  NOT_FOUND,
  ORDER_SUMMARY,
  PAYMENT,
  PRODUCTS,
  PRODUCTS_CREATE,
  PRODUCTS_MANAGEMENT,
  SHOP,
  SIGN_UP,
  SIGN_UP_ADMIN,
  USERS_CREATE,
  USERS_MANAGEMENT,
} from "@/constants/routes"
const About = lazy(() =>
  import("@/pages/About").then((module) => ({ default: module.About })),
)
const Admin = lazy(() =>
  import("@/pages/Admin").then((module) => ({ default: module.Admin })),
)
const Cart = lazy(() =>
  import("@/pages/Cart").then((module) => ({ default: module.Cart })),
)
const CreateProduct = lazy(() =>
  import("@/pages/CreateProduct").then((module) => ({
    default: module.CreateProduct,
  })),
)
const CreateUser = lazy(() =>
  import("@/pages/CreateUser").then((module) => ({
    default: module.CreateUser,
  })),
)
const Faq = lazy(() =>
  import("@/pages/Faq").then((module) => ({ default: module.Faq })),
)
const Home = lazy(() =>
  import("@/pages/Home").then((module) => ({ default: module.Home })),
)
const Login = lazy(() =>
  import("@/pages/Login").then((module) => ({ default: module.Login })),
)
const NotFound = lazy(() =>
  import("@/pages/NotFound").then((module) => ({ default: module.NotFound })),
)
const Orders = lazy(() =>
  import("@/pages/Orders").then((module) => ({ default: module.Orders })),
)
const OrderSummary = lazy(() =>
  import("@/pages/OrderSummary").then((module) => ({
    default: module.OrderSummary,
  })),
)
const Payment = lazy(() =>
  import("@/pages/Payment").then((module) => ({ default: module.Payment })),
)
const ProductDetails = lazy(() =>
  import("@/pages/ProductDetails").then((module) => ({
    default: module.ProductDetails,
  })),
)
const ProductsManagement = lazy(() =>
  import("@/pages/ProductsManagement").then((module) => ({
    default: module.ProductsManagement,
  })),
)
const Profile = lazy(() =>
  import("@/pages/Profile").then((module) => ({ default: module.Profile })),
)
const Shop = lazy(() =>
  import("@/pages/Shop").then((module) => ({ default: module.Shop })),
)
const SignUp = lazy(() =>
  import("@/pages/SignUp").then((module) => ({ default: module.SignUp })),
)
const User = lazy(() =>
  import("@/pages/User").then((module) => ({ default: module.User })),
)
const UsersManagement = lazy(() =>
  import("@/pages/UsersManagement").then((module) => ({
    default: module.UsersManagement,
  })),
)

export const routes = [
  { path: ABOUT, element: <About /> },
  { path: CURRENT_ADMIN, element: <Admin /> },
  { path: CART, element: <Cart /> },
  { path: FAQ, element: <Faq /> },
  { path: HOME, element: <Home /> },
  { path: LOGIN, element: <Login /> },
  { path: NOT_FOUND, element: <NotFound /> },
  { path: ORDER_SUMMARY, element: <OrderSummary /> },
  { path: PAYMENT, element: <Payment /> },
  { path: `${PRODUCTS}/:id`, element: <ProductDetails /> },
  { path: SIGN_UP, element: <SignUp /> },
  { path: SIGN_UP_ADMIN, element: <SignUp /> },
  { path: SHOP, element: <Shop /> },
  { path: CURRENT_CUSTOMER, element: <User /> },
  { path: ACCOUNT_ORDERS, element: <Orders /> },
  { path: ACCOUNT_PROFILE, element: <Profile /> },
  { path: USERS_MANAGEMENT, element: <UsersManagement /> },
  { path: PRODUCTS_MANAGEMENT, element: <ProductsManagement /> },
  { path: PRODUCTS_CREATE, element: <CreateProduct /> },
  { path: USERS_CREATE, element: <CreateUser /> },
]
