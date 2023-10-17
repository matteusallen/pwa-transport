import { Navigate, RouteObject } from "react-router-dom";
import React from "react";
// import { Loadable } from "../../components/Loadable";

import { useAuthState } from "../../contexts/AuthContext";
import Personnel from "../../pages/admin/Personnel";

// const Personnel = lazy(() => import('../../pages/admin/Personnel'));
// Personnel.preload();

const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAuthState();  
    
      if (!isAuthenticated) {
        return <Navigate to='/login' />
      }
      
      if (isAuthenticated && user?.role !== "CARRIER") {
        return <Navigate to='/survey' />
      }

      return <>{children}</>;
}

export const adminRoutes: RouteObject[] =  [
    {
        path: 'carrier',
        children: [
            {
                path: 'personnel',
                element: (
                    <AdminAuthGuard>
                        <Personnel />
                    </AdminAuthGuard> 
                )
            }
        ]
    }
]
