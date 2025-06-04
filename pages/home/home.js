import themeChangeBehavior from 'tdesign-miniprogram/mixins/theme-change';
import { list } from './data/index';
import { getUserInfo, updateUserInfo } from '../../utils/api';

Page({
    behaviors: [themeChangeBehavior],
    data: {
        list: [],
        currentYear: 2026,
        username: '',
        startdatum: '',
        zieldatum: '',
        aktueldatum: '',
        userId: '',
        loading: true,
        error: null
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
                    this.showUidInput(); // 重新显示输入框
                } else {
                    // 用户点击取消
                    wx.showToast({
                        title: '需要输入 UID 才能继续',
                        icon: 'none'
                    });
                    this.showUidInput(); // 重新显示输入框
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

        // 显示 UID 输入弹窗
        this.showUidInput();

        if (q) {
            const str = this.getQueryByUrl(decodeURIComponent(q));
            console.log(str, str.page);
            wx.navigateTo({
                url: `/pages/${str.page}/${str.page}`,
            });
        }
        this.trdPrivacy = this.selectComponent('#trdPrivacy');
    },

    // 加载用户信息
    async loadUserInfo() {
        try {
            this.setData({ loading: true, error: null });
            
            const userData = await getUserInfo(this.data.userId);
            console.log('获取到的用户信息:', userData);
            
            if (userData) {
                this.setData({
                    username: userData.username || '',
                    startdatum: this.formatDate(userData.startdatum) || '',
                    zieldatum: this.formatDate(userData.zieldatum) || '',
                    aktueldatum: this.formatDate(userData.aktueldatum) || '',
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
                error: error.message,
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

    // 更新用户信息
    async handleUpdateUserInfo(newData) {
        try {
            console.log('开始更新用户信息:', newData);
            this.setData({ loading: true, error: null });
            
            await updateUserInfo(this.data.userId, newData);
            console.log('用户信息更新成功');
            
            // 更新成功后重新加载用户信息
            await this.loadUserInfo();
            
            wx.showToast({
                title: '更新成功',
                icon: 'success'
            });
        } catch (error) {
            console.error('更新用户信息失败:', error);
            this.setData({
                loading: false
            });
            
            wx.showToast({
                title: '更新失败',
                icon: 'none',
                duration: 2000
            });
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
    onShareAppMessage() {
        return {
            title: 'TDesign UI',
            path: '/pages/home/home',
        };
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
});
