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
  onChange(e) {
    this.setData({ value: e.detail.value });
  },
}); 