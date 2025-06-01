// utils/api.js
const BASE_URL = 'http://111.229.111.28:5000';

// 封装wx.request为Promise
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: (res) => {
        console.log('请求成功:', res);
        resolve(res);
      },
      fail: (err) => {
        console.error('请求失败:', err);
        reject(err);
      }
    });
  });
}

// 获取用户信息的封装函数
export async function getUserInfo(userId) {
  try {
    console.log('正在获取用户信息，用户ID:', userId);
    console.log('请求URL:', `${BASE_URL}/api/user/${userId}`);
    
    const response = await request({
      url: `${BASE_URL}/api/user/${userId}`,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    });
    
    console.log('API响应:', response);
    
    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(`请求失败: ${response.statusCode}, ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
}

// 获取所有用户信息
export async function getAllUsers() {
  try {
    console.log('正在获取所有用户信息');
    const response = await request({
      url: `${BASE_URL}/api/users`,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      }
    });
    
    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(`请求失败: ${response.statusCode}`);
    }
  } catch (error) {
    console.error('获取所有用户信息失败:', error);
    throw error;
  }
}

// 更新用户信息
export async function updateUserInfo(userId, data) {
  try {
    console.log('正在更新用户信息:', userId, data);
    const response = await request({
      url: `${BASE_URL}/api/user/${userId}`,
      method: 'PUT',
      data: data,
      header: {
        'content-type': 'application/json'
      }
    });
    
    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(`请求失败: ${response.statusCode}`);
    }
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
}

// 创建新用户
export async function createUser(data) {
  try {
    console.log('正在创建新用户:', data);
    const response = await request({
      url: `${BASE_URL}/api/user`,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json'
      }
    });
    
    if (response.statusCode === 201 && response.data) {
      return response.data;
    } else {
      throw new Error(`请求失败: ${response.statusCode}`);
    }
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
}

