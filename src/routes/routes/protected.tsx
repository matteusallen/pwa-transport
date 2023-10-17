import { RouteObject } from "react-router-dom";
import { truckerRoutes } from "../authenticated/truckers";
import { adminRoutes } from "../authenticated/admin";

export const protectedRoutes: RouteObject[] = [...truckerRoutes, ...adminRoutes];