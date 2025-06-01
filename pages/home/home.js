import themeChangeBehavior from 'tdesign-miniprogram/mixins/theme-change';
import { list, skylineList } from './data/index';
import { getUserInfo, updateUserInfo } from '../../utils/api';

Page({
    behaviors: [themeChangeBehavior],
    data: {
        list: [],
        currentYear: 2026,
        isSkyline: false,
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

    onLoad(options) {
        const { path, q, skyline, userId } = options;
        console.log('页面加载参数:', options);
        let compList = [];
        this.skyline = skyline;
        if (this.skyline) {
            compList = skylineList;
        }
        else {
            compList = list;
        }
        compList = compList.slice(2);
        this.setData({
            list: compList,
            isSkyline: !!skyline,
            userId: userId || '1'
        });

        // 获取用户信息
        this.loadUserInfo();

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
            path = `/pages/${name}/${this.skyline ? 'skyline/' : ''}${name}`;
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
    goSkyline() {
        wx.navigateTo({
            url: '/pages/home/home?skyline=1',
        });
    },
});
