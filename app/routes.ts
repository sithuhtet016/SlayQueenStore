import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("cart", "routes/cart.tsx"),
  route("categories", "routes/categories.tsx"),
  route("orders", "routes/orders.tsx"),
] satisfies RouteConfig;
