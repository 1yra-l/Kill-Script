import axios from 'axios';
import router from '@/router'; // 引入路由用于处理 401 跳转

// 1. 创建 axios 实例
const request = axios.create({
  // 将你 main.py 所在的 ngrok 地址填在这里
  baseURL: 'https://prelaunch-calamity-moonwalk.ngrok-free.dev',
  timeout: 10000 // 请求超时时间
});

// 2. 请求拦截器 (Request Interceptor)
// 作用：在请求发出去之前，自动在 Header 里塞入 Token
request.interceptors.request.use(
  config => {
    // 从本地存储获取 Token
    const token = localStorage.getItem('token');

    if (token) {
      // 按照你后端 OAuth2PasswordBearer 的要求，必须加 Bearer 前缀
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 针对你使用的 ngrok，统一添加跳过警告的 Header
    config.headers['ngrok-skip-browser-warning'] = '69420';

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 3. 响应拦截器 (Response Interceptor)
// 作用：统一处理后端返回的数据和错误（比如 Token 失效）
request.interceptors.response.use(
  response => {
    // 统一返回数据部分，简化页面代码
    return response.data;
  },
  error => {
    // 处理身份认证失败（后端返回 401）
    if (error.response && error.response.status === 401) {
      console.error('身份凭证失效，请重新登录');
      // 清除本地过期的 Token
      localStorage.removeItem('token');
      // 强制跳转回登录页面
      router.push('/user-signin');
    }
    return Promise.reject(error);
  }
);

export default request;