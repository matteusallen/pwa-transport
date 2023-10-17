import { useAuthState } from '../contexts/AuthContext';
import api  from '../services/api'

type LoginValues = {
    email: string;
    password: string;
};

const handleLogin = (values: LoginValues) => api.post('/api/user/login', values);

const handleResendTempPass = (email: string) => api.post('/api/user/resend/temporary/password', email);

const refreshToken = () => {
    const userCreds = JSON.parse(sessionStorage.getItem('ud') || '{}');
    const { user } = useAuthState();

        return api.post('/api/user/refreshToken', {
            refreshToken: userCreds?.refreshToken,
            email: user?.email,
            community: import.meta.env.VITE_COMMUNITY
        })
}

const isUserLoggedIn = () => localStorage?.getItem("ud") != undefined

export { handleLogin, refreshToken, isUserLoggedIn, handleResendTempPass }
