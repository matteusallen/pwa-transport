import { Suspense } from "react";
import FullSpinner from "../Loaders/FullSpinner";

export const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) =>
(
  <Suspense fallback={<FullSpinner />}>
    <Component {...props} />
  </Suspense>
);