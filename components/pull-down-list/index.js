const itemHeight = 112;
Component({
    data: {
        childBoxHeight: 0,
    },
    externalClasses: ['t-class'],
    properties: {
        defaultOpen: {
            type: Boolean,
            value: false,
        },
        name: {
            type: String,
            value: '',
        },
        icon: {
            type: String,
            value: '',
        },
        childArr: {
            type: Array,
            value: [],
            observer(childArr) {
                if (childArr && childArr.length > 0) {
                    this.setData({
                        childBoxHeight: this.data.defaultOpen ? itemHeight * childArr.length : 0,
                    });
                }
            },
        },
    },
    methods: {
        switchHandle() {
            const { childArr, childBoxHeight } = this.data;
            if (childArr && childArr.length > 0) {
                this.setData({
                    childBoxHeight: childBoxHeight > 0 ? 0 : itemHeight * childArr.length,
                });
            }
        },
        tapChild(e) {
            if (e.target && e.target.dataset) {
                this.triggerEvent('click', e.target.dataset);
            }
        },
    },
});
