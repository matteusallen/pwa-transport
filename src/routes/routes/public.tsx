import { Navigate, RouteObject } from "react-router-dom";
// import { lazy } from "react";
// import { Loadable } from "../../components/Loadable";
import { useAuthState } from "../../contexts/AuthContext";
import { Landing, Onboard, Login, UpdatePassword, SetPassword } from "../../pages/onboarding";
import TermsConditions from "../../pages/onboarding/TermsConditions";

// const Landing = lazy(() => import('../../pages/onboarding/Landing'));
// const Login = lazy(() => import('../../pages/onboarding/Login'));
// const Onboard = lazy(() => import('../../pages/onboarding/Onboard'));
// const TermsConditions = lazy(() => import('../../pages/onboarding/TermsConditions'));
// const UpdatePassword = lazy(() => import('../../pages/onboarding/UpdatePassword'));

const PublicAuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAuthState();
    
    if (isAuthenticated && user?.role?.includes("CARRIER" || "DISPATCHER")) {
      return <Navigate to='/carrier/personnel' />
    }
      
    if (isAuthenticated) {
        return <Navigate to='/survey' />
    }
      

      return <>{children}</>;
}

export const publicRoutes: RouteObject[] = [
    {
        path: '/',
        index: true,
        element: (
            <PublicAuthGuard>
                <Landing />
            </PublicAuthGuard>
        )
    },
    {
        path: '/onboard',
        element: <Onboard />
    },
    {
        path: '/login',
        element: (
            <PublicAuthGuard>
                <Login />
            </PublicAuthGuard>
        ) 
    },
    {
        path: 'set-password',
        element: (
            <PublicAuthGuard>
                <SetPassword email="" />
            </PublicAuthGuard>
        )
    },
    {
        path: '/terms-conditions',
        element: <TermsConditions />
    },
    {
        path: '/reset-password',
        element: <UpdatePassword />
    },
];