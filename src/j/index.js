$(function(){
  var nMaxPhoto = 500; 
  var personArray = [];
  var CurPersonNum = 0;
  var camera, scene, renderer;
  var initRotation = 0.005;
  var stepAddRotation = 0.002;
  var bFastTurn = false; // 是否加速转动
  var objects = [];
  var targets = { table: [], sphere: [] };
  var animateId = '';
  var table = [];
  // 连接WebSocket
  var ws = null;
  var heartCheck = null;

  var oUrl = window.oPageConfig.oUrl
  var ui = {
    btnStart : $( '#start' ),
    btnStop : $( '#stop' ),
    popWinner : $( '#winner' ),
    container : $( '#container' ),
    prizeNumWrap: $('.js-prize-num-wrap')
  }

  var oPage = {
    init: function() {  
      var self = this;
      self.listen();
      // self.initWebsocket();
      self.loadPersonImg(true,'slow'); 
    },
    view: function() {
      var self = this;
    },
    listen: function() {
      var self = this
      // need delect 
      ui.btnStart.on( 'click', function ( event ) {
        console.log('start---')
        let data = {
          award: {
            name: '电脑',
            large_pic: './i/prize2.png'
          },
          num: 10
        }
        self.startLottery(data)
      });	
      ui.btnStop.on( 'click', function ( event ) {
        console.log('stop---')
        let param = {
          award_users:[{
            avatar:'./i/1.jpg',
            realname: 'xx'
          },{
            avatar:'./i/1.jpg',
            realname: 'xx2'
           },
          {
            avatar:'./i/1.jpg',
            realname: 'xx'
          },
          {
            avatar:'./i/1.jpg',
            realname: 'xx2'
          },
        ]
        }
        self.stopLottery(param)    
      });				
      // end need delect 
    },
    // 初始化图片信息
    loadPersonImg: function(bFirstInit,rotateSpeed) {
      // var self = this; 

      // 随机mock头像信息
      let aImg = []
      for(let i = 0, len = 300 ; i < len; i++) {
      let idx = Math.floor((Math.random()*3) + 1);
        aImg.push('./i/avator_'+ idx + '.jpg')
      }
      // 初始化值 清空球体信息
      TWEEN.removeAll();    
      targets = { table: [], sphere: []};
      objects = []
      personArray = []
      table = [];
      camera = null;
      scene = null;
      renderer = null;
      bFastTurn = false;
      initRotation = 0.005;

      // 处理图片
      let len = Number(aImg.length) > nMaxPhoto ? nMaxPhoto : aImg.length
      for(let i = 0; i < len; i++){
        personArray.push({image: aImg[i]});
      } 
      for (let i = 0; i < personArray.length; i++) {
        table[i] = new Object();
        if (i < personArray.length) {
            table[i] = personArray[i];
            table[i].src = personArray[i].thumb_image;
        } 
        table[i].p_x = i % 20 + 1;
        table[i].p_y = Math.floor(i / 20) + 1;
      }
      this.initSphere();
      if(bFirstInit){
        this.animate(rotateSpeed);
      }      

      // $.ajax({
      //   url: oUrl.personImg,
      //   type: 'GET',
      //   dataType: 'JSON',
      //   data: {}
      // }).done(function (msg) {
      //   // 初始化值 清空球体信息
      //   TWEEN.removeAll();    
      //   targets = { table: [], sphere: []};
      //   objects = []
      //   personArray = []
      //   table = [];
      //   camera = null;
      //   scene = null;
      //   renderer = null;
      //   bFastTurn = false;
      //   initRotation = 0.005;
      //   let len = Number(msg.length) > nMaxPhoto ? nMaxPhoto : msg.length
      //   for(var i = 0; i < len; i++){
      //     personArray.push({image: msg[i]});
      //   } 
      //   for (var i = 0; i < personArray.length; i++) {
      //     table[i] = new Object();
      //     if (i < personArray.length) {
      //         table[i] = personArray[i];
      //         table[i].src = personArray[i].thumb_image;
      //     } 
      //     table[i].p_x = i % 20 + 1;
      //     table[i].p_y = Math.floor(i / 20) + 1;
      //   }
      //   self.initSphere();
      //   if(bFirstInit){
      //     self.animate(rotateSpeed);
      //   }
      // });      
    },
    // initWebsocket: function() {
    //   var self = this
    //  if (ws != null) {  
    //       console.log("现已连接");  
    //       return ;  
    //   }
    //   if ('WebSocket' in window) {
    //     ws = new WebSocket(oUrl.wsUrl);     
    //   } else if ('MozWebSocket' in window) {  
    //       ws = new MozWebSocket(oUrl.wsUrl);  
    //   } else {  
    //       alert("您的浏览器不支持WebSocket。");  
    //       return ;  
    //   } 
    //   ws.onopen = function() {  
    //     console.log('onopen')
    //     // 登录
    //     var login =  {"action":"login", "body":{"user":"happy_new_year_2019","password":"shield!#"}};
    //     ws.send(JSON.stringify(login));  
    //   }
    //   self.checkWsOnline()
    //   ws.onmessage = function(e) { 
    //     var data = JSON.parse(e.data) 
    //     if(data.action == 'show_prize_info') {
    //       // 展示奖品信息
    //       self.throwScreen(data)
    //     }else if(data.action == 'start_draw') {
    //       self.startLottery(data)
    //     } else if (data.action == 'show_prize_result') {
    //       self.stopLottery(data)
    //     }
    //   }  
    //   ws.onclose = function(e) { 
    //     console.log("closed");  
    //     ws = null
    //     self.initWebsocket(); 
    //   }  
    //   ws.onerror = function(e) {  
    //     self.initWebsocket(); 
    //     console.log("error");  
    //   }
    
    // },
    // 检查ws是否连接
    // checkWsOnline: function(){
    //   heartCheck && clearInterval(heartCheck)
    //   heartCheck = setInterval(function () {
    //     var msg = {"action":"ping", "body":{}}
    //     ws.send(JSON.stringify(msg))
    //   }, 3000);
    // },    
    // 投屏奖品信息
    throwScreen: function(data) {
      var self = this
      // console.log(animateId,'animateId--')
      //照片球出现
      ui.container.css('display','block')
      ui.container.removeClass('fadeOut');
      //关闭上轮中奖信息
      ui.popWinner.removeClass('bounceIn').addClass('bounceOut')
      // 数量
      if(ui.prizeNumWrap.hasClass('fadeOut')){
        ui.prizeNumWrap.removeClass('fadeOut').addClass('fadeIn')
      }
      // self.animate('slow');
      // 奖品信息更改
      $('.js-prize-name').html(data.award.name)
      $('.js-prize-num').html(data.num)
      $('.js-prize-pic')[0].src =  data.award.large_pic
      $('.js-prize-pic')[1].src = data.award.large_pic
    },
    // 开始快速旋转
    startLottery: function(data) {
      var self = this;
      // 奖品信息更改
      $('.js-prize-name').html(data.award.name)
      $('.js-prize-num').html(data.num)
      $('.js-prize-pic')[0].src = data.award.large_pic
      $('.js-prize-pic')[1].src = data.award.large_pic
      if(ui.prizeNumWrap.hasClass('fadeOut')){
        ui.prizeNumWrap.removeClass('fadeOut').addClass('fadeIn')
      }
      //关闭上轮中奖信息
      ui.popWinner.removeClass('bounceIn').addClass('bounceOut')
      //照片球出现
      ui.container.css('display','block')
      ui.container.removeClass('fadeOut');
      // 开始快速旋转
      window.cancelAnimationFrame( animateId )
      animateId = requestAnimationFrame( function(){ self.animate('fast') } )
    },  
    // 停止旋转
    stopLottery: function(data) {
      var self = this;
      // console.log(data,1822222)
      // 停止原先动画
      window.cancelAnimationFrame( animateId )
      // 慢速旋转
      animateId = requestAnimationFrame( function(){ self.animate('slow') } )
      // 照片球消失
      ui.container.addClass('fadeOut').removeClass('fadeIn');
      // 中奖信息
      let html = ''
      let len = data.award_users.length
      let type = data.award_users.length > 24 ? 'size--small':'size--big'
      data.award_users.forEach((item,idx) => {
        html += `<li class="winner-item ${type}"><img src=${item.avatar}><div class="winner-item__name ">${item.realname}</span></li>`
      })
      $('.js-winner-list').html(html)
      // 中奖数量隐藏，中奖人员显示
      ui.prizeNumWrap.removeClass('fadeIn').addClass('fadeOut')
      ui.popWinner.css('display','block')
      ui.popWinner.removeClass('bounceOut').addClass('bounceIn')
      // window.cancelAnimationFrame( animateId )
      // 更新照片球的信息
      setTimeout(function() {
        // window.cancelAnimationFrame( animateId )
        self.loadPersonImg(false, 'fast')
      },100)
    },
    initSphere: function() {
      var self = this;
      camera = new THREE.PerspectiveCamera( 40, 1100 / 720, 1, 10000 );
      // camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.z = 3000;
    
      scene = new THREE.Scene();
    
      // table
      for ( var i = 0; i < table.length; i ++ ) {
        var element = document.createElement( 'div' );
        element.className = 'element';
        var img = document.createElement('img');
        img.src = table[ i ].image;
        element.appendChild( img );
        var object = new THREE.CSS3DObject( element );
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add( object );
        objects.push( object );
      }
    
      // sphere
      var vector = new THREE.Vector3();
      var spherical = new THREE.Spherical();
    
      for ( var i = 0, l = objects.length; i < l; i ++ ) {
    
        var phi = Math.acos( -1 + ( 2 * i ) / l );
        var theta = Math.sqrt( l * Math.PI ) * phi;
    
        var object = new THREE.Object3D();
    
        spherical.set( 800, phi, theta );
    
        object.position.setFromSpherical( spherical );
    
        vector.copy( object.position ).multiplyScalar( 2 );
    
        object.lookAt( vector );
    
        targets.sphere.push( object );
    
      }
    
      //渲染
      renderer = new THREE.CSS3DRenderer(
        {
          antialias: true,
        }
        
      );
      // renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setSize( 1100, 720 );
      renderer.domElement.style.position = 'absolute';
      // document.getElementById( 'container' ).
      $( '#container' ).html( renderer.domElement );
    
      self.transform( targets.sphere, 2000 );
      window.addEventListener( 'resize', self.onWindowResize, false );
    
    },    
    transform: function( targets, duration, type ) {

      TWEEN.removeAll();
    
      for ( var i = 0; i < objects.length; i ++ ) {
    
        var object = objects[ i ];
        var target = targets[ i ];
    
        new TWEEN.Tween( object.position )
          .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
          .easing( TWEEN.Easing.Exponential.InOut )
          .start();
    
        new TWEEN.Tween( object.rotation )
          .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
          .easing( TWEEN.Easing.Exponential.InOut )
          .start();
    
      }
      new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( self.render )
        .start();
    },
    
    onWindowResize: function () {
      var self = this;
      camera.aspect = 1100 / 720;
      camera.updateProjectionMatrix();
      renderer.setSize(1100, 720 );
      self.render();    
    },
    // 每一帧时被渲染时调用（正常情况下是60次/秒） 0.01
    animate: function(rotateSpeed) {
      var self = this;
      // 让场景通过y轴旋转  & z,每0.008s动1次
      if(rotateSpeed === 'fast') {
        if(initRotation < 0.3) {
          initRotation += stepAddRotation
          // console.log('fast--0--', initRotation)
        } else {
          initRotation = 0.3
          // console.log('fast--1--',initRotation)
        }
      }else{
        initRotation = 0.005
        // console.log('slow--',initRotation)
      }
      scene.rotation.y += initRotation;
      // 在下一帧开始时调用指定函数
      animateId = requestAnimationFrame( function(){ self.animate(rotateSpeed) } );
      TWEEN.update();

      // 渲染循环
      self.render();      
    },
    
    render: function () {
      renderer.render( scene, camera );
    }    
  };
  oPage.init() 
});









