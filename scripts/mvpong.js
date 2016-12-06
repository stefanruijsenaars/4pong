var options = {
  width: 800,
  height: 600,
  velocity: 400,
  maxScore: 11,
  font: {font: '50px Helvetica Neue', fill: '#FFFFFF', align: 'center'}
};

var graphics = {
  ball: {
    url: 'graphics/ball.png',
  },
  paddle: {
    url: 'graphics/paddle.png'
  }
};

var game = new Phaser.Game(options.width, options.height, Phaser.AUTO, 'mvpong');

var mvpongState = function (game) {
  this.dividerLine;
  this.sprites = {
    ball: undefined,
    leftPaddle: undefined,
    rightPaddle: undefined
  };
  this.leftPaddle = {
    upKey: undefined,
    downKey: undefined
  };
  this.rightPaddle = {
    upKey: undefined,
    downKey: undefined
  };
  this.groups = {
    paddle : undefined
  };

  this.scores = {
    textFields: {
      left: '0',
      right: '0'
    },
    score: {
      left: 0,
      right: 0
    }
  }
};

mvpongState.prototype = {
  preload: function () {
    for (var key in graphics) {
      game.load.image(key, graphics[key].url);
    }
  },

  create: function () {
    this.setUpGraphics();
    this.setUpPhysics();
    this.setUpKeys();
  },

  update: function () {
    this.leftPaddleHandler();
    this.rightPaddleHandler();
    game.physics.arcade.overlap(this.groups.paddle, this.sprites.ball, this.paddleOverlapHandler, null, this);
  },

  setUpKeys: function () {
    this.leftPaddle.upKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
    this.leftPaddle.downKey = game.input.keyboard.addKey(Phaser.Keyboard.V);
    this.rightPaddle.upKey = game.input.keyboard.addKey(Phaser.Keyboard.J);
    this.rightPaddle.downKey = game.input.keyboard.addKey(Phaser.Keyboard.N);
  },

  setUpPhysics: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.enable(this.sprites.ball, Phaser.Physics.ARCADE);

    // dispatch event when leaving the world bounds for counting scores.
    this.sprites.ball.checkWorldBounds = true;
    // bounce the ball sprite back into game world on boundaries.
    this.sprites.ball.body.collideWorldBounds = true;
    // Full rebound -- keeps same velocity when colliding with another object.
    this.sprites.ball.body.bounce.set(1);
    this.sprites.ball.body.immovable = true;
    this.sprites.ball.events.onOutOfBounds.add(this.ballOutsideHandler, this);
    this.launchBall();

    this.groups.paddle = game.add.group();
    this.groups.paddle.enableBody = true;
    this.groups.paddle.physicsBodyType = Phaser.Physics.ARCADE;

    this.groups.paddle.add(this.sprites.leftPaddle);
    this.groups.paddle.add(this.sprites.rightPaddle);
    this.groups.paddle.setAll('checkWorldBounds', true);
    this.groups.paddle.setAll('collideWorldBounds', true);
    this.groups.paddle.setAll('immovable', true);

    game.physics.arcade.checkCollision.left = false;
    game.physics.arcade.checkCollision.right = false;

  },

  launchBall: function () {
    this.sprites.ball.reset(window.options.width / 2, window.options.height / 2);
    var max = 1/3 * Math.PI;
    var min = -1/3 * Math.PI;
    var random = Math.random();
    if (random < .25) {
      max = Math.PI;
      min = 2/3 * Math.PI;
    } else if (random > .75) {
      max = -Math.PI;
      min = -2/3 * Math.PI;
    }
    var radians = Math.random() * (max - min) + min;
    game.physics.arcade.velocityFromRotation(radians, window.options.velocity, this.sprites.ball.body.velocity);
  },

  leftPaddleHandler: function () {
    if (this.leftPaddle.upKey.isDown) {
      this.sprites.leftPaddle.body.velocity.y = -500;
    } else if (this.leftPaddle.downKey.isDown) {
      this.sprites.leftPaddle.body.velocity.y = 500;
    } else {
      this.sprites.leftPaddle.body.velocity.y = 0;
    }
  },

  rightPaddleHandler: function () {
    if (this.rightPaddle.upKey.isDown) {
      this.sprites.rightPaddle.body.velocity.y = -500;
    } else if (this.rightPaddle.downKey.isDown) {
      this.sprites.rightPaddle.body.velocity.y = 500;
    } else {
      this.sprites.rightPaddle.body.velocity.y = 0;
    }
  },

  paddleOverlapHandler: function (paddle, ball) {
    var radians;
    // cut paddle in 20
    // assumes the paddle is 60 px, every part is 3px
    var paddleHeight = 60;
    var part = Math.floor((ball.y - paddle.y)/(paddleHeight/20));

    if (paddle.x < window.options.width/2) {
      // left paddle
      radians = part * 0.1;
    } else {
      // right paddle
      radians = Math.PI - (part * 0.1);
      if (radians > Math.PI) {
        radians -= Math.PI * 2;
      }
    }
    game.physics.arcade.velocityFromRotation(radians, window.options.velocity, this.sprites.ball.body.velocity);
  },

  setUpGraphics: function () {
    // Set up divider line
    this.dividerLine = game.add.graphics(0, 0);
    this.dividerLine.lineStyle(2, 0xFFFFFF, 1);

    for (var y = 0; y < window.options.height; y += 10) {
      this.dividerLine.moveTo(window.options.width/2, y)
      y += 10;
      this.dividerLine.lineTo(window.options.width/2, y);
    }

    // Set up ball sprite
    this.sprites.ball = game.add.sprite(window.options.width/2, window.options.height/2, 'ball');
    this.sprites.ball.anchor.set(0.5, 0.5);

    // Set up left paddle sprite
    this.sprites.leftPaddle = game.add.sprite(window.options.width/60, window.options.height/2, 'paddle');
    this.sprites.leftPaddle.anchor.set(0.5, 0.5);

    // Set up right paddle sprite
    this.sprites.rightPaddle = game.add.sprite(window.options.width/60*59, window.options.height/2, 'paddle');
    this.sprites.rightPaddle.anchor.set(0.5, 0.5);

    // Set up scores
    this.scores.textFields.left = game.add.text(window.options.width/4, window.options.height/10, '0', window.options.font);
    this.scores.textFields.left.anchor.set(0.5, 0.5);
    this.scores.textFields.right = game.add.text(window.options.width/4*3, window.options.height/10, '0', window.options.font);
    this.scores.textFields.right.anchor.set(0.5, 0.5);
  },

  ballOutsideHandler: function () {
    if (this.sprites.ball.x <= 0) {
      this.scores.score.right++;
    }
    if (this.sprites.ball.x >= window.options.width) {
      this.scores.score.left++;
    }

    this.updateScore();

    if (this.scores.score.left === window.options.maxScore) {
      alert('left wins!');
      this.scores.score.left = 0;
      this.scores.score.right = 0;
      this.updateScore();
    }
    if (this.scores.score.right === window.options.maxScore) {
      alert('right wins!');
      this.scores.score.left = 0;
      this.scores.score.right = 0;
      this.updateScore();
    }

    this.launchBall();
  },

  updateScore: function () {
    this.scores.textFields.left.text = this.scores.score.left;
    this.scores.textFields.right.text = this.scores.score.right;
  }
};


game.state.add('mvpong', mvpongState);
game.state.start('mvpong');