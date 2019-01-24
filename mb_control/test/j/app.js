'use strict';

/* ==========================================================
 * v20170714
 * ==========================================================
 * Copyright 石华
 *
 * fis3移动端demo - es6编译
 * ========================================================== */

(function () {
  var oConfig = window.oPageConfig;
  var ui = {
    $btnGame: document.querySelectorAll('.js-game-button')
  };
  var oPage = {
    init: function init() {
      this.view();
      this.listen();
    },
    view: function view() {
      var self = this;
    },
    listen: function listen() {
      var self = this;

      // 事件绑定示例
      for (var i = 0; i < ui.$btnGame.length; i++) {
        var $btn = ui.$btnGame[i];
        $btn.addEventListener('click', function (e) {

          // ajax模拟数据示例
          axios.get(oConfig.oUrl.getUserInfo, {
            params: { id: 12345 }
          }).then(function (response) {
            console.info(response.data);
          }).catch(function (error) {
            console.log(error);
          });
        }, false);
      };
    }
  };
  oPage.init();
})();