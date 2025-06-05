import { list } from './data/index';
import { getUserInfo, getStepStatus } from '../../utils/api';

Page({
    data: {
        list: [
            {
                name: '德语状态',
                icon: 'chevron-down',
                childArr: [
                    { label: '学习进度', url: 'bearbeitung' }
                ]
            },
            {
                name: '申请状态',
                icon: 'chevron-down',
                childArr: [
                    { label: '申请状态', url: '/pages/bewerbung/bewerbung' }
                ]
            },
            {
                name: '服务状态',
                icon: 'chevron-down',
                childArr: [
                    { label: '服务状态', url: '/pages/dienst/dienst' }
                ]
            }
        ],
        currentYear: new Date().getFullYear(),
        username: '',
        startdatum: '',
        zieldatum: '',
        aktueldatum: '',
        userId: '',
        loading: true,
        homevalue: 1,
        current: 1,
        steps: [
            { title: '未完成', status: 'default', homevalue: 1 },
            { title: '未完成', status: 'default', homevalue: 2 },
            { title: '未完成', status: 'default', homevalue: 3 },
            { title: '未完成', status: 'default', homevalue: 4 },
            { title: '未完成', status: 'default', homevalue: 5 }
        ],
        showBearbeitungDialog: false
    },

    // 格式化日期为 YYYY/MM
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    },

    // 显示 UID 输入弹窗
    showUidInput() {
        wx.showModal({
            title: '请输入 UID',
            editable: true,
            placeholderText: '请输入您的 UID',
            success: (res) => {
                if (res.confirm && res.content) {
                    // 用户点击确定且输入了内容
                    this.setData({ userId: res.content }, () => {
                        this.loadUserInfo();
                    });
                } else if (res.confirm) {
                    // 用户点击确定但没有输入内容
                    wx.showToast({
                        title: '请输入 UID',
                        icon: 'none'
                    });
                    // 不再自动重新显示
                } else {
                    // 用户点击取消
                    wx.showToast({
                        title: '需要输入 UID 才能继续',
                        icon: 'none'
                    });
                    // 不再自动重新显示
                }
            }
        });
    },

    onLoad(options) {
        const { path, q } = options;
        console.log('页面加载参数:', options);
        
        // 直接设置 list 数据
        this.setData({
            list: list
        }, () => {
            console.log('设置后的 list 数据:', this.data.list);
        });

        if (q) {
            const str = this.getQueryByUrl(decodeURIComponent(q));
            console.log(str, str.page);
            wx.navigateTo({
                url: `/pages/${str.page}/${str.page}`,
            });
        }
    },

    onShow() {
        console.log('页面显示，当前 userId:', this.data.userId);
        // 每次显示页面时检查 userId
        if (!this.data.userId) {
            console.log('userId 为空，显示输入框');
            this.showUidInput();
        } else {
            console.log('使用已有 userId:', this.data.userId);
            this.loadUserInfo();
        }
    },

    // 加载用户信息
    async loadUserInfo() {
        try {
            this.setData({ loading: true });
            
            const userData = await getUserInfo(this.data.userId);
            console.log('获取到的用户信息:', userData);
            
            if (userData) {
                // 获取步骤状态
                console.log('开始获取步骤状态，userId:', this.data.userId);
                const stepStatus = await getStepStatus(this.data.userId);
                console.log('获取到的完整stepStatus响应:', stepStatus);
                console.log('获取到的homevalue类型:', typeof stepStatus.homevalue);
                console.log('获取到的homevalue值:', stepStatus.homevalue);

                // 确保 homevalue 是数字类型
                const homevalue = Number(stepStatus.homevalue);
                console.log('转换后的homevalue类型:', typeof homevalue);
                console.log('转换后的homevalue值:', homevalue);

                if (isNaN(homevalue)) {
                    console.error('homevalue 转换失败，原始值:', stepStatus.homevalue);
                    throw new Error('步骤状态数据无效');
                }

                const updatedSteps = [
                    { title: homevalue === 1 ? '当前状态' : (homevalue > 1 ? '已完成' : '未完成'), status: homevalue === 1 ? 'process' : (homevalue > 1 ? 'finish' : 'default'), homevalue: 1 },
                    { title: homevalue === 2 ? '当前状态' : (homevalue > 2 ? '已完成' : '未完成'), status: homevalue === 2 ? 'process' : (homevalue > 2 ? 'finish' : 'default'), homevalue: 2 },
                    { title: homevalue === 3 ? '当前状态' : (homevalue > 3 ? '已完成' : '未完成'), status: homevalue === 3 ? 'process' : (homevalue > 3 ? 'finish' : 'default'), homevalue: 3 },
                    { title: homevalue === 4 ? '当前状态' : (homevalue > 4 ? '已完成' : '未完成'), status: homevalue === 4 ? 'process' : (homevalue > 4 ? 'finish' : 'default'), homevalue: 4 },
                    { title: homevalue === 5 ? '当前状态' : (homevalue > 5 ? '已完成' : '未完成'), status: homevalue === 5 ? 'process' : (homevalue > 5 ? 'finish' : 'default'), homevalue: 5 }
                ];
                console.log('更新后的steps:', updatedSteps);

                this.setData({
                    username: userData.username || '',
                    startdatum: this.formatDate(userData.startdatum) || '',
                    zieldatum: this.formatDate(userData.zieldatum) || '',
                    aktueldatum: this.formatDate(userData.aktueldatum) || '',
                    steps: updatedSteps,
                    homevalue: homevalue,
                    loading: false
                });
                console.log('用户信息加载成功');
            } else {
                throw new Error('未获取到用户信息');
            }
        } catch (error) {
            console.error('加载用户信息失败:', error);
            this.setData({
                loading: false,
                username: '{{username}}',
                startdatum: '{{startdatum}}',
                zieldatum: '{{zieldatum}}',
                aktueldatum: '{{aktueldatum}}'
            });
            
            // 如果加载失败，重新显示 UID 输入框
            wx.showToast({
                title: 'UID 无效，请重新输入',
                icon: 'none',
                duration: 2000
            });
            setTimeout(() => {
                this.showUidInput();
            }, 2000);
        }
    },


    // 下拉刷新
    async onPullDownRefresh() {
        console.log('触发下拉刷新');
        await this.loadUserInfo();
        wx.stopPullDownRefresh();
    },

    showPrivacyWin() {
        this.trdPrivacy.showPrivacyWin();
    },
    clickHandle(e) {
        let { name, path = '' } = e.detail.item;
        if (path === 'bearbeitung') {
            this.setData({ showBearbeitungDialog: true });
            return;
        }
        if (!path) {
            name = name.replace(/^[A-Z]/, (match) => `${match}`.toLocaleLowerCase());
            name = name.replace(/[A-Z]/g, (match) => {
                return `-${match.toLowerCase()}`;
            });
            path = `/pages/${name}/${name}`;
        }
        wx.navigateTo({
            url: path,
            fail: () => {
                wx.navigateTo({
                    url: '/pages/home/navigateFail/navigateFail',
                });
            },
        });
    },

    showPrivacyWin() {
        wx.showModal({
            title: '服务声明',
            content: '本小程序仅用于演示，不收集任何个人信息。',
            showCancel: false
        });
    },

    getQueryByUrl(url) {
        const data = {};
        const queryArr = `${url}`.match(/([^=&#?]+)=[^&#]+/g) || [];
        if (queryArr.length) {
            queryArr.forEach((para) => {
                const d = para.split('=');
                const val = decodeURIComponent(d[1]);
                if (data[d[0]] !== undefined) {
                    data[d[0]] += `,${val}`;
                }
                else {
                    data[d[0]] = val;
                }
            });
        }
        return data;
    },

    // 下拉刷新
    async onPullDownRefresh() {
        console.log('触发下拉刷新');
        await this.loadUserInfo();
        wx.stopPullDownRefresh();
    },

    onBearbeitungDialogConfirm() {
        // 确保状态更新
        this.setData({ 
            showBearbeitungDialog: false 
        }, () => {
            console.log('弹窗已关闭');
        });
    }
});
