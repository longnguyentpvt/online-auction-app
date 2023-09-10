import { lazy } from "react";

export const LoginPage = lazy((): Promise<any> => import("./login-page"));
export const MarketItemsPage = lazy((): Promise<any> => import("./market-page"));
