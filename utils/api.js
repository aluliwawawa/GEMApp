// utils/api.js
const BASE_URL = 'http://111.229.111.28:5000/api';

// 封装请求方法
const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      success: (res) => {
        console.log('请求成功:', res);
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(res.data.message || '请求失败'));
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        reject(err);
      }
    });
  });
};

// 获取用户信息
export const getUserInfo = async (userId) => {
  try {
    console.log('🚨 实际传给后端的 UID 是：', userId, typeof userId);
    const response = await request(`/user/${userId}`, 'GET');
    console.log('API响应:', response);
    if (response.status === 'success' && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取用户信息失败');
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 获取所有用户
export const getAllUsers = async () => {
  try {
    const response = await request('/users', 'GET');
    if (response.status === 'success' && response.data) {
      return response.data;
    }
    throw new Error(response.message || '获取用户列表失败');
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

// 获取用户步骤状态
export const getStepStatus = async (userId) => {
    try {
        const response = await request(`/user/${userId}/status`, 'GET');
        console.log('获取步骤状态响应:', response);
        if (response.status === 'success' && response.data) {
            return response.data;
        }
        throw new Error(response.message || '获取步骤状态失败');
    } catch (error) {
        console.error('获取步骤状态失败:', error);
        throw error;
    }
};

