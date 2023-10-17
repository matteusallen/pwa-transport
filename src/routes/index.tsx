import { RouteObject } from "react-router-dom";
import { publicRoutes } from "./routes/public";
import { protectedRoutes } from "./routes/protected";

export const routes: RouteObject[] = [...publicRoutes, ...protectedRoutes];