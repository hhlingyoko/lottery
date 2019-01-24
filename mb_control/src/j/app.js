/* ==========================================================
 * v20170714
 * ==========================================================
 * Copyright 石华
 *
 * fis3移动端demo - es6编译
 * ========================================================== */

(function() {
  let oConfig = window.oPageConfig;
  let ui = {
    $btnGame: document.querySelectorAll('.js-game-button')
  };
  let oPage = {
    init() {
      this.view();
      this.listen();
    },
    view() {
      let self = this;

    },
    listen() {
      let self = this;

      // 事件绑定示例
      for (let i = 0; i < ui.$btnGame.length; i++) {
        let $btn = ui.$btnGame[i];
        $btn.addEventListener('click', function(e) {

          // ajax模拟数据示例
          axios.get(oConfig.oUrl.getUserInfo, {
            params: {id: 12345}
          }).then((response) => {
            console.info(response.data);
          }).catch((error) => {
            console.log(error);
          });

        }, false);
      };

    },
  }
  oPage.init();
})();