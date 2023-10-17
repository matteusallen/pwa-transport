import { Navigate, RouteObject } from "react-router-dom";
// import { Register } from "../../pages/onboarding";
// import { Loadable } from "../../components/Loadable";
// import { lazy } from "react";
import { useAuthState } from "../../contexts/AuthContext";
import Survey from "../../pages/truckers/Survey";

// const Survey = lazy(() => import('../../pages/truckers/Survey'))

const UserAuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthState();
    
    if (!isAuthenticated) {
      return <Navigate to='/login' />
    }

    return <>{children}</>;
}

export const truckerRoutes: RouteObject[] =  [
    {
        path: '/survey',
        element: (
            <UserAuthGuard>
                <Survey />
            </UserAuthGuard>
        )
    }
]
