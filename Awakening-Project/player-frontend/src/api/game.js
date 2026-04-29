import request from './request';

export const gameApi = {
    // 1. 对接你的 FastAPI 聊天接口 (已替换为你的 ngrok 公网地址)
    chat: (data) => {
        return request({
            // Axios 遇到 http 开头的绝对路径时，会自动忽略原来的 baseURL
            url: 'https://unwoven-catalyst-filth.ngrok-free.dev',
            method: 'post',
            data, // 包含 role_id, user_message, current_phase_idx 等
            // 【核心防坑】：绕过 ngrok 免费版的拦截警告页面，确保直接返回 JSON
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
    },

    // 2. 对接你同学提供的数据库接口
    fetchExternalDb: (params) => {
        return request({
            url: 'https://prelaunch-calamity-moonwalk.ngrok-free.dev/your-endpoint',
            method: 'get',
            params,
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
    },

    // 3. 获取搜证线索 (同样替换为你的 ngrok 地址)
    getClues: (roleId) => {
        return request({
            url: `https://unwoven-catalyst-filth.ngrok-free.dev/api/clues?role_id=${roleId}`,
            method: 'get',
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
    }
};