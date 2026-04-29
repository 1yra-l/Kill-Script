import axios from 'axios';

// 创建实例
const service = axios.create({
    // 这里建议暂时指向你的 FastAPI 后端地址
    // 至于数据库接口，我们后续可以在具体请求中覆盖此 URL
    baseURL: 'http://localhost:8888',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // ngrok 特有：绕过浏览器警告页（如果不加这个，请求可能会返回 HTML 而不是 JSON）
        config.headers['ngrok-skip-browser-warning'] = '69420';
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 可以在这里统一处理 FastAPI 返回的 {status: "success"}
        return response.data;
    },
    error => {
        console.error('通信错误:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default service;