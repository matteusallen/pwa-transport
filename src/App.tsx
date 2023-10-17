import { routes } from "./routes"
import { useLocation, useRoutes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from "react";
import api from "./services/api";
import {isUserLoggedIn} from "./services/auth";
import useIdle from "./hooks/useIdle";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
})

function App() {
  const content = useRoutes(routes);
  const location = useLocation();
  const { idleTimer } = useIdle({idleTime: 900});

  useEffect(() => {
    idleTimer.reset();
  }, [location])
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
    
        if(isUserLoggedIn()) {
          api.post('/api/location/user', {
            'longitude' : position.coords.longitude,
            'latitude' : position.coords.latitude,
            'timeStamp' : position.timestamp,
          })
        } else {
          console.log('User not logged in to send location');
        }
      });
    }
  }, []);

  
  return (
    <QueryClientProvider client={queryClient}>
      {content}
    </QueryClientProvider>
  )
}

export default App
