import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/auth/auth-layout.tsx", [
        index("routes/root/home.tsx"),
        route("Signin", "routes/auth/sign-in.tsx"),
        route("Signup", "routes/auth/sign-up.tsx"),
        route("ForgotPassword", "routes/auth/forgot-password.tsx"),
        route("ResetPassword", "routes/auth/reset-password.tsx"),
        route("VerifyEmail", "routes/auth/verify-email.tsx"),
    ]),
] satisfies RouteConfig;
