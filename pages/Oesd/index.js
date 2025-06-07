const image = 'https://tdesign.gtimg.com/mobile/demos/example2.png';

// 为每个分类创建不同的内容
const examInfoItems = [
  { label: '考试时间：2025年8月15日', image },
  { label: '考试地点：长沙芙蓉区旺德府12楼慕尼黑大学', image },
  { label: '考试类型：B1', image },
  { label: '这里可以放考试信息', image }
];

const courseItems = [
  { label: '备考语法课程', image },
  { label: '备考训练课程', image },
  { label: '备考练习课程', image },
  { label: '这里可以放备考课', image },
];

const scoreItems = [
  { label: '本次考试总分：85分', image },
  { label: '听力得分：90分', image },
  { label: '阅读得分：85分', image },
  { label: '写作得分：80分', image },
  { label: '口语得分：85分', image }
];

Page({
  offsetTopList: [],
  data: {
    sideBarIndex: 0,
    scrollTop: 0,
    showBearbeitungDialog: false,
    categories: [
      {
        label: '考试信息',
        items: examInfoItems,
      },
      {
        label: '备考课程',
        items: courseItems,
      },
      {
        label: '我的成绩',
        items: scoreItems,
      }
    ],
    navbarHeight: 0,
  },
  onLoad() {
    this.getCustomNavbarHeight();
  },

  getCustomNavbarHeight() {
    const query = wx.createSelectorQuery();
    query.select('.custom-navbar').boundingClientRect();
    query.exec((res) => {
      const { height = 0 } = res[0] || {};
      this.setData({ navbarHeight: height });
    });
  },

  onSideBarChange(e) {
    const { value } = e.detail;
    console.log('切换分类:', value);
    this.setData({ sideBarIndex: value, scrollTop: 0 });
  },

  onFabClick() {
    console.log('点击报名按钮');
    this.setData({
      showBearbeitungDialog: true
    });
  },

  onBearbeitungDialogConfirm() {
    console.log('关闭 bearbeitung 对话框');
    this.setData({
      showBearbeitungDialog: false
    });
  },
}); 