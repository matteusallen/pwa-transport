import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    transformRequest: [function (data, headers) {
        headers["Content-Type"] = "application/json"
        // You may modify the headers object here
        if(!data?.isLogin) {
            headers['Authorization'] = `Bearer ${JSON.parse(sessionStorage?.getItem("ud") || '{}')?.idToken}`;
            headers['accessToken'] = JSON.parse(sessionStorage?.getItem("ud") || '{}')?.accessToken;
        } else if (data.isLogin) {
            delete data.isLogin;
        }
    
        // Do not change data        
        return JSON.stringify(data);
    }],
    data: {
        community: import.meta.env.VITE_COMMUNITY
    }
});

// Add a request interceptor
api.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (config.url === "/api/user/login") {
        const addedData = {...config.data, isLogin: true}
        config.data = addedData;
    }
    return config;
});


export default api;