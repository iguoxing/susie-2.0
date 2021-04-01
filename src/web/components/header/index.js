var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!',
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('');
    },
  },
});
const header = {
  init() {
    console.log('我是添加图书的JS 📚');
    $(document).on('click', '#js-h3-btn', function () {
      alert('段落被点击了。');
    });
  },
};
export default header;
