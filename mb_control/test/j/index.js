'use strict';

/* ==========================================================
 * v201801220
 * ==========================================================
 * Copyright huhuiling
 *
 * 年会抽奖控制端
 * ========================================================== */

(function () {
  var oUrl = window.oPageConfig.oUrl;
  var aHistoryList = [];
  var curInfo = {
    id: '',
    titleName: '',
    count: 0,
    num: 0
    // remainCount: 0,
  };
  var curStarted = 0; // 0 1 已开始抽奖
  var prizeInfo = []; //奖项 奖品信息
  var ui = {
    $prizeSelect: $('.js-prize-select'),
    $curPrize: $('.js-cur-prize'),
    $curPrizeImg: $('.js-cur-prize-img'),
    $btnHistory: $('.js-history'),
    $btnShowPrize: $('.js-btn-show-prize'),
    $btnStart: $('.js-btn-start'),
    $btnIng: $('.js-btn-ing'),
    $btnStop: $('.js-btn-stop'),
    $countDown: $('.js-count-down'),
    $usedNum: $('.js-usedNum'),
    $prizeList: $('.js-prize-list'),
    $inputNum: $('.js-input-num'),
    $popHistory: $('.pop-history-info'),
    $popConfig: $('.pop-config'),
    $popMask: $('.pop-mask'),
    $btnOk: $('.btn-ok'),
    $btnCancel: $('.btn-cancel'),
    $btncloseHistory: $('.js-close-history'),
    $popAlert: $('.pop-alert')
  };
  var oPage = {
    init: function init() {
      this.view();
      this.listen();
      this.initPrizeInfo(true);
      // this.initHistory();
    },
    view: function view() {
      var self = this;
    },
    listen: function listen() {
      var self = this;
      // 奖品select 变化
      $('.js-select').click(function () {
        $('.js-select-content').css('height', 'auto');
      });
      // 抽奖人数变化
      ui.$inputNum.on('change', function () {
        localStorage.setItem("curNum", ui.$inputNum.val());
      });
      $('.js-prize-list').on('click', '.el-select-dropdown__item', function (e) {
        var id = $(this).attr('data-id');
        $(this).addClass('selected').siblings().removeClass('selected');
        $('.js-select').val(e.target.innerHTML);
        $('.js-select-content').css('height', '0');
        // 存值
        localStorage.setItem("curId", id);
        prizeInfo.forEach(function (item, idx) {
          if (id == item.id) {
            // 存值 id
            curInfo.id = item.id;
            curInfo.titleName = item.title + '—' + item.name;
            // curInfo.remainCount = remainCount
            ui.$curPrize.html(item.name);
            ui.$usedNum.html(Number(item.used_num));
            ui.$curPrizeImg[0].src = httpUrl + '/' + item.small_pic;
            // ui.$curPrizeImg[0].src = item.small_pic 
            return;
          }
        });
      });
      // 抽奖历史
      ui.$btnHistory.on('click', function () {
        self.initHistory();
        ui.$popMask.removeClass('hide');
        ui.$popHistory.removeClass('hide');
      });
      ui.$btncloseHistory.on('click', function () {
        ui.$popMask.addClass('hide');
        ui.$popHistory.addClass('hide');
      });
      //奖品投屏
      ui.$btnShowPrize.on('click', function () {
        var prizeNum = ui.$inputNum.val();
        curInfo.num = prizeNum;
        if (!prizeNum) {
          $('.error-info').removeClass('hide');
        } else {
          $('.error-info').addClass('hide');
          // 确认框
          ui.$popMask.removeClass('hide');
          ui.$popConfig.removeClass('hide');
          // 获取抽奖信息 数量
          ui.$popConfig.find('.confirm-prize-type').html(curInfo.titleName);
          ui.$popConfig.find('.confirm-prize-num').html(prizeNum);
        }
      });
      // 停止抽奖
      ui.$btnStop.on('click', function () {
        self.stopLottery();
      });
      // 确认投屏
      ui.$btnOk.on('click', function () {
        self.throwScreen();
      });
      // 开始抽奖
      ui.$btnStart.on('click', function () {
        self.startLottery();
      });
      ui.$btnCancel.on('click', function () {
        ui.$popMask.addClass('hide');
        ui.$popConfig.addClass('hide');
      });
    },

    //奖品信息
    initPrizeInfo: function initPrizeInfo(bInit) {
      var self = this;
      $.ajax({
        url: oUrl.getPrizeInfo,
        type: 'GET',
        dataType: 'JSON',
        data: {}
      }).done(function (msg, textStatus, jqXHR) {
        prizeInfo = msg;
        if (bInit) {
          self.initPageInfo();
        }
      }).fail(function (jqXHR) {
        self.reload(jqXHR);
      });
    },
    initPageInfo: function initPageInfo() {
      var self = this;
      var prizeListHtml = '';
      prizeInfo.forEach(function (e, idx) {
        prizeListHtml += '<li class="el-select-dropdown__item" data-id="' + e.id + '">' + e.title + ' - ' + e.name + '</li>';
      });
      ui.$prizeList.html(prizeListHtml);

      // 根据localStorage中id 选择当前奖项，若无，则默认选中第一个
      var id = localStorage.getItem('curId');
      var curNum = localStorage.getItem("curNum");
      curStarted = localStorage.getItem("curStarted");

      var idx = 0;
      ui.$inputNum.val(curNum);
      if (id) {
        idx = prizeInfo.findIndex(function (item) {
          return item.id == id;
        });
      }
      $('.el-select-dropdown__item').eq(idx).click();
      // 开始抽奖按钮状态
      if (curStarted == 1) {
        //已开始 奖品，抽奖人数不可选，开始按钮变成挺迟按钮
        ui.$prizeList.attr('disabled', true);
        ui.$inputNum.attr('disabled', true);
        ui.$btnStart.addClass('hide');
        ui.$btnStop.removeClass('hide');
      }
      // 当前选中的信息
      var cur = prizeInfo[idx];
      curInfo.id = cur.id;
      curInfo.titleName = cur.title + '—' + cur.name;
      curInfo.count = cur.count;

      ui.$curPrize.html(prizeInfo[idx].name);
      ui.$usedNum.html(cur.used_num);
      ui.$curPrizeImg[0].src = httpUrl + '/' + cur.small_pic;
    },
    // 抽奖历史
    initHistory: function initHistory() {
      var self = this;
      $.ajax({
        url: oUrl.getHistory,
        type: 'POST',
        dataType: 'JSON',
        data: {}
      }).done(function (msg) {
        aHistoryList = msg;
        var h = '';
        aHistoryList = msg;
        aHistoryList.forEach(function (item, index) {
          h += '<li><span>' + (index + 1) + '</span><span>' + item.award_title + '-' + item.award_name + '</span><span>' + item.num + '</span></li>';
        });
        $('.history-list-inner').html(h);
      }).fail(function (jqXHR) {
        self.reload(jqXHR);
      });
    },
    // 投屏
    throwScreen: function throwScreen() {
      var self = this;
      // 确认框消失
      ui.$popMask.addClass('hide');
      ui.$popConfig.addClass('hide');

      $.ajax({
        url: oUrl.throwScreen,
        type: 'POST',
        dataType: 'JSON',
        data: {
          id: curInfo.id,
          num: curInfo.num
        }
      }).done(function (msg) {
        // alert
        self.popAlert('奖品已投屏！');
      }).fail(function (jqXHR) {
        self.reload(jqXHR);
      });
    },
    // 开始抽奖 
    startLottery: function startLottery() {
      var self = this;
      var curLotteryNum = Number(ui.$inputNum.val());
      var usedNum = Number(ui.$usedNum.html());

      $.ajax({
        url: oUrl.startLottery,
        type: 'POST',
        dataType: 'JSON',
        data: {
          id: curInfo.id,
          num: curLotteryNum
        }
      }).done(function (msg) {
        // 开始抽奖提示
        self.popAlert('抽奖已开始~');
        curStarted = 1;
        localStorage.setItem("curStarted", curStarted);
        $('.pop-alert').css('top', '0');
        setTimeout(function () {
          $('.pop-alert').css('top', '-50px');
        }, 1000);
        // 开始抽奖倒计时
        var time = 2;
        $('.js-time').html(time);
        // 已抽奖件数更新
        ui.$usedNum.html(Number(usedNum + curLotteryNum));
        // 抽奖奖品、抽奖人数不可以变
        ui.$prizeList.attr('disabled', true);
        ui.$inputNum.attr('disabled', true);
        // 按钮先变成 抽奖中 再变成 停止抽奖
        ui.$btnStart.addClass('hide');
        ui.$btnIng.removeClass('hide');
        ui.$countDown.removeClass('hide');
        //抽奖中
        var t = setInterval(function () {
          if (time == 0) {
            clearInterval(t);
            ui.$btnIng.addClass('hide');
            ui.$countDown.addClass('hide');
            ui.$btnStop.removeClass('hide');
            $('.js-time').html(2);
          } else {
            time -= 1;
            $('.js-time').html(time);
          }
        }, 1000);
        // 重新加载奖品信息
        self.initPrizeInfo(false);
      }).fail(function (jqXHR) {
        self.reload(jqXHR);
      });
    },
    stopLottery: function stopLottery() {
      var self = this;
      $.ajax({
        url: oUrl.stopLottery,
        type: 'POST',
        dataType: 'JSON',
        data: {
          id: curInfo.id,
          num: ui.$inputNum.val()
        }
      }).done(function (msg) {
        curStarted = 0;
        localStorage.setItem("curStarted", curStarted);
        // 抽奖奖品、抽奖人数可变
        ui.$prizeList.attr('disabled', false);
        ui.$inputNum.attr('disabled', false);
        //按钮变成 停止抽奖
        ui.$btnStop.addClass('hide');
        ui.$btnStart.removeClass('hide');
        self.popAlert('抽奖已结束~');
      }).fail(function (jqXHR) {
        self.reload(jqXHR);
      });
    },
    // 弹窗展示
    popAlert: function popAlert(text, type) {
      if (type == 'error') {
        ui.$popAlert.removeClass('pop-alert--success').addClass('pop-alert--error');
      } else {
        ui.$popAlert.removeClass('pop-alert--error').addClass('pop-alert--success');
      }
      ui.$popAlert.css('top', '0');
      setTimeout(function () {
        ui.$popAlert.css('top', '-50px');
      }, 1000);
      $('.alert-text').html(text);
    },
    reload: function reload(jqXHR) {
      console.log(jqXHR);
      var self = this;
      var xErrorCode = jqXHR.getResponseHeader('X-Error-Code');
      console.log(xErrorCode);
      if (xErrorCode == 302) {
        self.popAlert('登录信息已失效', 'error');

        setTimeout(function () {
          window.location.reload();
        }, 1000);
      } else {
        var text = jqXHR.responseText ? jqXHR.responseText : '操作失败';
        self.popAlert(text, 'error');
      }
    }
  };
  oPage.init();
})($);