import { lazy } from "react";

export const LoginPage = lazy((): Promise<any> => import("./login-page"));
export const RegisterPage = lazy((): Promise<any> => import("./register-page"));
export const MarketItemsPage = lazy((): Promise<any> => import("./market-page"));
export const NotFoundPage = lazy((): Promise<any> => import("./not-found-page"));
