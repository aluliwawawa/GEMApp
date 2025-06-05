Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onConfirm() {
      this.triggerEvent('confirm');
      this.setData({ visible: false });
    }
  }
}); 