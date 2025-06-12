import { getUserId } from '../../utils/auth';

Page({
  data: {
    value: [],
    items: [
      { label: '护照' },
      { label: '照片' },
      { label: '申请表' },
      { label: '邀请函' },
      { label: '资金证明' },
      { label: '其他材料' }
    ]
  },

  onLoad() {
    // 从本地存储加载已保存的选中项
    const userId = getUserId();
    if (userId) {
      const savedValue = wx.getStorageSync(`listeCheckboxValue_${userId}`);
      if (savedValue) {
        this.setData({ value: savedValue });
      }
    }
  },

  onChange(e) {
    const value = e.detail.value;
    this.setData({ value });
    // 保存选中项到本地存储，使用用户ID作为key的一部分
    const userId = getUserId();
    if (userId) {
      wx.setStorageSync(`listeCheckboxValue_${userId}`, value);
    }
  }
}); 