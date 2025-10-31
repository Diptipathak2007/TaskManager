import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/auth/auth-layout.tsx", [
    index("routes/root/home.tsx"),
    route("auth/Signin", "routes/auth/sign-in.tsx"),
    route("auth/Signup", "routes/auth/sign-up.tsx"),
    route("auth/ForgotPassword", "routes/auth/forgot-password.tsx"),
    route("auth/ResetPassword", "routes/auth/reset-password.tsx"),
    route("auth/verify-email", "routes/auth/verify-email.tsx"),
  ]),
] satisfies RouteConfig;

