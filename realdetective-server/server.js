const express = require('express');
const cors = require('cors');
const { AlipaySdk } = require('alipay-sdk');
const app = express();

// 1. 中间件配置
app.use(cors()); // 允许所有跨域请求，解决前端 5173 调用 3000 的问题
app.use(express.json()); // 解析前端传来的 JSON 数据

// 2. 支付宝沙盒 SDK 配置
const alipaySdk = new AlipaySdk({
  // 必须与你沙盒控制台的信息严格对应
  appId: '9021000163603956',
  // 1. 应用私钥：确保是你生成的那个私钥
  privateKey: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCbjYOKvr/gNWgyZW8pnUA+tbEoRNc5OEMZr8lsW9HK2iV+7w6HTgaMJTcWJZN7HXL0BLtfHgn8rlz8maApSqyq49fOFrlm/wBi0hxzb/4FWEuym010KtpFkG7S67pIrJXnijRbtpFihFAgjagP4h6UTw6scSw8okU+iN3sW+bF5R7Kiv3xX6M+lFi8VxYWWhZ0Cn1ma2u1hLnil/XenuBiT28SXbIkIlajywjOzYYrJTA2mvN5d6XZO+gT8s7bUsgLVogfwVZ3uK/4NoNACQCSxY01I/cyQeWF5JS32yljA0tVpy83wT74ruunQqAOTOLdkZxOYpMZmjsd7zeMu2B1AgMBAAECggEADaBW7peJHW3wQ8Ho+/8/en7WFw34wJVyI1Tn0ysz9I4pjLYKUsX+AtbbvX/rLHTG9iNX+pwaCd2IXcRjaFqXR50P8YjCEwixkvaO8XnVCcjTUMEUBuIeHsvpOWbW+bjMpOzRa1tR3wxyLHfcSg/n19wZD/gWBPW+FR1OO39NdvZYlZ23VZMqwPSvKWUHo8pHA6LmQiOlRS0ypOBv/uh6uaf/v7vnrV+g1adKAs/itD7mscA0oKjAzwgaihRamcPe+OWPU1VOIOWPMrQmqO8YvEkdMoOm8ipT4BaUpY/DZCS85ACinDzoJpvZkruSYf7buPU3KJdog10tWQ53Exh+YQKBgQDza2jlxCvhMF2LrY3mz0AP+LB1ISClPH/yrgHt0Rr7yvIaQBzwH0O9mI6y5RZOo9QUKEdT3X+leCH0zecHpGkm4ya2bPXgBrel8g1beWooqH8I0RwAwjfW/a7HYvl58hZbKIr5G48hGKeFfw2Q8XLvo3RaWrRi9K4hZ3uABchZrQKBgQCjl5KZ4V/MwIQeE7ocd9gJ3+jRsFxTeqXOYZ6wGlYdIJXEIjiUTN8I0oJ+OBy6k8aFkzbBgT3PmxMDXO0dDEMXg2W4a3b8Vz57aJpyPWxWAMGc41i98sT7j+d3cSJjxgAcbC8L19Bazwoca9idmhkmHTjD8d8ZriTsQ3VzO4UK6QKBgQCtEX0vf97C6SRZnzf5FvmxYVv0q20OjolZ/iYY9Ed/JrgjudnZUCFVuBYdU4wctZagDlNIaX/MIjHiYFMWt+qbX32yzp2yfpQsRIECvLyh08seda63S19wWEXgNZqy/VCv14+XteR535Gb9M2sdD8H6utbIoqGoPj9fxnr2DCusQKBgA3n/ZNNIDqkhtaTsLdozJmSShVBG6gQ/fU8QSQRKQ7SzUhd7FdW7YKvel5GYNLPawnByN7MILf8I7KefJ2ChFWEWupBYFz1AZ+19aMOa54n9E1k2g9TisEjq3ZwzI6Urz+7RoiIMPL3NJHT7RcAmXCu/TtS3TcuoX7gASTpg1a5AoGBAMSCwRgfop2PIVSiEknvzbfO1ihUkFeX8T9Z/EBnMVkgxAjwsFB3Rpa//0VzL1HnVBCrrsFDBfYnu3bnLFWZlibPfRiur6fMzIKTui/6yZnCn+7rjTZTQNahrJCZucdmUp1IEQuYlUP3rcrXFJCWTDWz/zCU9dvc3Ju6a9bthVPj'.replace(/\s+/g, ''), 
  
  // 2. 支付宝公钥：使用你刚才发给我的那个
  alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAi5rb+NlFWweOlgckoVT7VoOOTZHxisv9flGgAu5ViAOJM+RPNZ0REcxUplmHFWlwO+qP91z36VuPS4w6Gz3qj9C+LW3ioQEVYe2MFXJa9eprKWh+aJaZTG2nixsb1+U8bj6bPLJJEof5MhFmGam5CpuipTyD1uToH58sXnOMaiO2UMkQNCVA+JdKnlfzjVtNcvHJShdEOMN/T2QW1+jZyJNEaz5Xk+Pf2TzvcY9ZmBacqyobWMWw4OifUiQcvzEKK4/JRlQNwxziL1fdzASH/QxvmNgrLzFkjVFxowOuNbrqnZlpDgyyHSrz+FaRH+t7bFa9qOiyxHcpvUjq/3MQBwIDAQAB'.replace(/\s+/g, ''),

  gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
  signType: 'RSA2' // 沙盒网关
});

// 3. 根路径测试接口 (解决浏览器访问 3000 报错的问题)
app.get('/', (req, res) => {
  res.send('<h1>Awakening Project 后端已启动</h1><p>状态：就绪 (Ready)</p>');
});

// 4. 核心支付接口
app.post('/api/pay', async (req, res) => {
  try {
    const { amount, planName } = req.body;
    console.log(`收到下单请求: ${planName}, 金额: ${amount}`);

    // 调用支付宝“当面付”预下单接口
    const result = await alipaySdk.exec('alipay.trade.precreate', {
      bizContent: {
        out_trade_no: 'ORD_' + Date.now(), // 生成唯一的订单号
        total_amount: amount,              // 订单金额
        subject: planName,                 // 订单标题
      },
    });

    // 打印支付宝返回的完整结果供调试
    console.log('支付宝接口返回结果:', result);

    if (result.qrCode) {
      console.log('成功提取 qrCode:', result.qrCode);
      // 将 qr_code 返回给前端
      res.json({ 
        success: true, 
        qr_code: result.qrCode 
      });
    } else {
      console.error('下单失败，支付宝未返回 qrCode');
      res.json({ success: false, msg: '支付宝网关返回异常' });
    }
  } catch (err) {
    console.error('API 异常:', err);
    res.status(500).json({ success: false, msg: '服务器内部错误: ' + err.message });
  }
});

// 5. 启动服务
const PORT = 3000;
app.listen(PORT, () => {
  console.log('====================================');
  console.log(`服务启动成功！`);
  console.log(`本地测试地址: http://localhost:${PORT}`);
  console.log(`支付接口地址: http://localhost:${PORT}/api/pay`);
  console.log('====================================');
});