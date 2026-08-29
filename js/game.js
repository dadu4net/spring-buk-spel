// Barbie & Lion King Run - Master Game Engine & Multi-Theme State Manager
class MultiThemeRunnerGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // UI Elements
    this.mainLogoEl = document.getElementById('main-logo');
    this.themeBtn = document.getElementById('theme-btn');
    this.pageTitleEl = document.getElementById('page-title');

    this.scoreValEl = document.getElementById('score-val');
    this.heartsValEl = document.getElementById('hearts-val');
    this.collectibleLabelEl = document.getElementById('collectible-label');
    this.highscoreValEl = document.getElementById('highscore-val');
    this.powerupBadgeEl = document.getElementById('powerup-indicator');

    this.startScreenEl = document.getElementById('start-screen');
    this.pauseScreenEl = document.getElementById('pause-screen');
    this.gameoverScreenEl = document.getElementById('gameover-screen');

    this.startTitleEl = document.getElementById('start-title');
    this.startTaglineEl = document.getElementById('start-tagline');
    this.pauseTitleEl = document.getElementById('pause-title');
    this.pauseMessageEl = document.getElementById('pause-message');
    this.gameoverTitleEl = document.getElementById('gameover-title');
    this.finalCollectibleLabelEl = document.getElementById('final-collectible-label');

    this.finalScoreEl = document.getElementById('final-score');
    this.finalHeartsEl = document.getElementById('final-hearts');
    this.finalHighscoreEl = document.getElementById('final-highscore');

    this.charPickerStartEl = document.getElementById('char-picker-start');
    this.charPickerGameoverEl = document.getElementById('char-picker-gameover');

    this.startBtn = document.getElementById('start-btn');
    this.resumeBtn = document.getElementById('resume-btn');
    this.restartBtn = document.getElementById('restart-btn');
    this.soundBtn = document.getElementById('sound-btn');
    this.pauseBtn = document.getElementById('pause-btn');

    // Ground position
    this.groundY = this.canvas.height - 70;

    // Theme Management ('barbie' | 'lionking')
    this.theme = localStorage.getItem('runner_theme') || 'barbie';
    this.selectedCharacter = localStorage.getItem(`runner_char_${this.theme}`) || (this.theme === 'lionking' ? 'simba' : 'barbie');

    // Subsystems
    this.sound = new SoundController();
    this.background = new ParallaxBackground(this.canvas);
    this.player = new Player(this.canvas, this.groundY);
    this.obstacles = new ObstacleManager(this.canvas, this.groundY);
    this.collectibles = new CollectibleManager(this.canvas, this.groundY);
    this.input = new InputController(this);

    // Apply active theme to subsystems
    this.applyTheme(this.theme, false);

    // Game Variables
    this.state = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'
    this.distance = 0;
    this.score = 0;
    this.collectiblesCount = 0;
    this.highscore = parseInt(localStorage.getItem(`runner_highscore_${this.theme}`) || '0', 10);
    this.baseSpeed = 5.5;
    this.speed = this.baseSpeed;
    this.lastTime = 0;
    this.lastMilestone = 0;
    this.popups = [];

    this.initUI();
    this.updateHUD();

    // Start animation loop
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  initUI() {
    this.themeBtn.addEventListener('click', () => {
      this.sound.init();
      this.toggleTheme();
    });

    this.startBtn.addEventListener('click', () => {
      this.sound.init();
      this.start();
    });

    this.resumeBtn.addEventListener('click', () => {
      this.togglePause();
    });

    this.restartBtn.addEventListener('click', () => {
      this.sound.init();
      this.start();
    });

    this.soundBtn.addEventListener('click', () => {
      this.sound.init();
      const muted = this.sound.toggleMute();
      this.soundBtn.textContent = muted ? '🔇' : '🔊';
      this.soundBtn.title = muted ? 'Geluid aanzetten' : 'Geluid dempen';
    });

    this.pauseBtn.addEventListener('click', () => {
      this.togglePause();
    });
  }

  toggleTheme() {
    const newTheme = this.theme === 'barbie' ? 'lionking' : 'barbie';
    this.applyTheme(newTheme, true);
  }

  applyTheme(themeName, resetGameIfPlaying = true) {
    this.theme = themeName;
    localStorage.setItem('runner_theme', themeName);

    // Update body theme class
    document.body.className = `theme-${themeName}`;

    // Update default character for this theme
    const savedChar = localStorage.getItem(`runner_char_${themeName}`);
    if (themeName === 'lionking') {
      this.selectedCharacter = (savedChar === 'simba' || savedChar === 'nala') ? savedChar : 'simba';
    } else {
      this.selectedCharacter = (savedChar === 'barbie' || savedChar === 'ken') ? savedChar : 'barbie';
    }

    // Update Subsystems
    this.sound.setTheme(themeName);
    this.background.setTheme(themeName);
    this.obstacles.setTheme(themeName);
    this.collectibles.setTheme(themeName);
    this.player.setCharacter(this.selectedCharacter);

    // Highscore for this specific theme
    this.highscore = parseInt(localStorage.getItem(`runner_highscore_${themeName}`) || '0', 10);
    this.highscoreValEl.textContent = `${this.highscore} m`;

    // Update Theme-specific Text & Buttons
    if (themeName === 'lionking') {
      this.pageTitleEl.textContent = 'De Leeuwenkoning - Savanne Safari Run';
      this.mainLogoEl.textContent = '🦁 Lion King Safari 👑';
      this.themeBtn.textContent = '🎀 Barbie Land';
      this.collectibleLabelEl.textContent = 'RUPSEN';
      this.finalCollectibleLabelEl.textContent = 'Verzamelde Rupsen:';
      this.startTitleEl.textContent = 'Savanne Safari!';
      this.startTaglineEl.textContent = 'Ren door het koninkrijk, beuk hyena\'s weg (+100m!) en eet sappige rupsen & het zon-embleem!';
      this.gameoverTitleEl.textContent = 'Oeps! Uitgegleden in de savanne! 🦁';
      this.pauseTitleEl.textContent = 'Even Rusten... 🌳';
      document.getElementById('touch-slide-label').textContent = 'TIJGEREN';
      document.getElementById('guide-slide-text').textContent = 'Bukken / Tijgeren';
    } else {
      this.pageTitleEl.textContent = 'Barbie Run - Malibu Endless Runner';
      this.mainLogoEl.textContent = '💖 Barbie Run 💖';
      this.themeBtn.textContent = '🦁 Leeuwenkoning';
      this.collectibleLabelEl.textContent = 'HARTJES';
      this.finalCollectibleLabelEl.textContent = 'Verzamelde Hartjes:';
      this.startTitleEl.textContent = 'Malibu Adventure!';
      this.startTaglineEl.textContent = 'Rol door Malibu, beuk make-up tassen open (+100m!) en verzamel hartjes & glitter sterren!';
      this.gameoverTitleEl.textContent = 'Oeps! Uit de bocht! 💅';
      this.pauseTitleEl.textContent = 'Even Pauzeren... 🏖️';
      document.getElementById('touch-slide-label').textContent = 'BUKKEN';
      document.getElementById('guide-slide-text').textContent = 'Bukken / Sliden';
    }

    // Render Character picker buttons
    this.renderCharacterPickers();

    if (resetGameIfPlaying && this.state === 'PLAYING') {
      this.start();
    }
  }

  renderCharacterPickers() {
    const characters = this.theme === 'lionking'
      ? [
          { id: 'simba', name: 'Simba', icon: '🦁' },
          { id: 'nala', name: 'Nala', icon: '🐾' }
        ]
      : [
          { id: 'barbie', name: 'Barbie', icon: '💖' },
          { id: 'ken', name: 'Ken', icon: '🏄‍♂️' }
        ];

    const generateHTML = (isGo) => characters.map(c => `
      <button class="char-btn ${isGo ? 'char-btn-go' : ''} ${c.id === this.selectedCharacter ? 'active' : ''}" data-char="${c.id}">
        <span class="char-avatar">${c.icon}</span>
        <span class="char-name">${c.name}</span>
      </button>
    `).join('');

    this.charPickerStartEl.innerHTML = generateHTML(false);
    this.charPickerGameoverEl.innerHTML = generateHTML(true);

    // Wire up event listeners
    document.querySelectorAll('.char-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const charName = e.currentTarget.dataset.char;
        if (charName) {
          this.sound.init();
          this.sound.playCollectHeart();
          this.selectCharacter(charName);
        }
      });
    });

    this.updatePauseText();
  }

  selectCharacter(charName) {
    this.selectedCharacter = charName;
    localStorage.setItem(`runner_char_${this.theme}`, charName);
    this.player.setCharacter(charName);

    // Update active class
    document.querySelectorAll('.char-btn').forEach(btn => {
      if (btn.dataset.char === charName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.updatePauseText();
  }

  updatePauseText() {
    if (this.selectedCharacter === 'simba') {
      this.pauseMessageEl.textContent = 'Simba oefent even zijn welpenbrul bij de waterpoel! 🦁';
    } else if (this.selectedCharacter === 'nala') {
      this.pauseMessageEl.textContent = 'Nala speurt even naar insecten in het savannegras! 🐾';
    } else if (this.selectedCharacter === 'ken') {
      this.pauseMessageEl.textContent = 'Ken neemt even een proteïneshake op het strand! 🏄‍♂️';
    } else {
      this.pauseMessageEl.textContent = 'Barbie neemt even een slokje van haar smoothie! 🍹';
    }
  }

  start() {
    this.state = 'PLAYING';
    this.distance = 0;
    this.score = 0;
    this.collectiblesCount = 0;
    this.speed = this.baseSpeed;
    this.lastMilestone = 0;
    this.popups = [];

    this.player.reset();
    this.obstacles.reset();
    this.collectibles.reset();

    this.startScreenEl.classList.add('hidden');
    this.pauseScreenEl.classList.add('hidden');
    this.gameoverScreenEl.classList.add('hidden');
    this.powerupBadgeEl.classList.add('hidden');

    this.sound.startBgm();
    this.updateHUD();
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.pauseScreenEl.classList.remove('hidden');
      this.sound.stopBgm();
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.pauseScreenEl.classList.add('hidden');
      this.lastTime = performance.now();
      this.sound.startBgm();
    }
  }

  gameOver() {
    this.state = 'GAMEOVER';
    this.player.isDead = true;
    this.sound.stopBgm();
    this.sound.playHit();

    const finalScore = Math.floor(this.distance);
    if (finalScore > this.highscore) {
      this.highscore = finalScore;
      localStorage.setItem(`runner_highscore_${this.theme}`, this.highscore.toString());
    }

    this.finalScoreEl.textContent = `${finalScore} m`;
    const icon = this.theme === 'lionking' ? '🐛' : '💖';
    this.finalHeartsEl.textContent = `${icon} ${this.collectiblesCount}`;
    this.finalHighscoreEl.textContent = `${this.highscore} m`;

    setTimeout(() => {
      this.gameoverScreenEl.classList.remove('hidden');
    }, 450);
  }

  handleJump() {
    if (this.state === 'PLAYING') {
      if (this.player.jump()) {
        this.sound.playJump();
      }
    }
  }

  handleDuck(isDown) {
    if (this.state === 'PLAYING') {
      this.player.duck(isDown);
      if (isDown) {
        this.sound.playSlide();
      }
    }
  }

  addPopup(text, x, y, color = '#ff1493') {
    this.popups.push({
      text,
      x,
      y,
      color,
      alpha: 1.0,
      life: 0.8
    });
  }

  update(dt) {
    if (this.state !== 'PLAYING') {
      this.background.update(0.8, dt);
      return;
    }

    this.speed = this.baseSpeed + Math.min(this.distance * 0.0035, 6.5);
    this.distance += this.speed * dt * 3.2;
    this.score = Math.floor(this.distance);

    if (Math.floor(this.distance / 100) > this.lastMilestone) {
      this.lastMilestone = Math.floor(this.distance / 100);
      this.sound.playMilestone();
      const popupColor = this.theme === 'lionking' ? '#d35400' : '#ff1493';
      this.addPopup(`🎉 ${this.lastMilestone * 100}m!`, this.player.x + 30, this.player.y - 80, popupColor);
    }

    this.background.update(this.speed, dt);
    this.player.update(dt, this.speed / this.baseSpeed);
    this.obstacles.update(dt, this.speed, this.distance);
    this.collectibles.update(dt, this.speed);

    // Check Collectibles
    const playerHitbox = this.player.getHitbox();
    const collected = this.collectibles.checkCollection(playerHitbox);

    for (const item of collected) {
      if (item.type === 'HEART' || item.type === 'GRUB') {
        this.collectiblesCount += 1;
        this.distance += 15;
        this.sound.playCollectHeart();
        const popupText = item.type === 'GRUB' ? '+🐛' : '+💖';
        const popupColor = item.type === 'GRUB' ? '#27ae60' : '#ff1493';
        this.addPopup(popupText, item.x, item.y, popupColor);
      } else if (item.type === 'STAR' || item.type === 'SUN_EMBLEM') {
        this.player.applyPowerup(6.0);
        this.distance += 40;
        this.sound.playPowerup();
        let label = '✨ SHIELD! ✨';
        if (this.selectedCharacter === 'ken') label = '⚡ KENERGY! ⚡';
        else if (this.theme === 'lionking') label = '👑 ROAR! 🦁';
        this.addPopup(label, item.x, item.y - 10, '#ffe600');
      } else if (item.type === 'DIAMOND' || item.type === 'PAW') {
        this.distance += 25;
        this.sound.playCollectHeart();
        const popupText = item.type === 'PAW' ? '+🐾' : '+💎';
        const popupColor = item.type === 'PAW' ? '#e67e22' : '#00d2ff';
        this.addPopup(popupText, item.x, item.y, popupColor);
      }
    }

    // Check Obstacles & Smashable Targets
    const hitObstacle = this.obstacles.checkCollision(playerHitbox);
    if (hitObstacle) {
      if (hitObstacle.isSmashable) {
        // Smash & Knock away Hyena (Lion King) or Make-up Bag (Barbie)!
        this.obstacles.knockAway(hitObstacle);
        this.sound.playKnockaway();
        this.distance += 100; // Big bonus distance!

        if (this.theme === 'lionking') {
          this.addPopup('💥 HYENA WEGGEBEUKT! +100', hitObstacle.x, hitObstacle.y - 15, '#ffd700');
        } else {
          this.addPopup('💄 MAKE-UP SPLASH! +100', hitObstacle.x, hitObstacle.y - 15, '#ff1493');
        }
      } else if (this.player.isInvincible) {
        // Invincible shield crushes regular obstacles
        this.obstacles.knockAway(hitObstacle);
        this.sound.playMilestone();
        this.addPopup('💥 BOOM!', hitObstacle.x, hitObstacle.y, '#ffe600');
      } else {
        // Lethal obstacle collision
        this.gameOver();
      }
    }

    // Update Popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.y -= 35 * dt;
      pop.life -= dt;
      pop.alpha = Math.max(0, pop.life / 0.8);
      if (pop.life <= 0) {
        this.popups.splice(i, 1);
      }
    }

    this.updateHUD();
  }

  updateHUD() {
    this.scoreValEl.textContent = `${Math.floor(this.distance)} m`;
    const icon = this.theme === 'lionking' ? '🐛' : '💖';
    this.heartsValEl.textContent = `${icon} ${this.collectiblesCount}`;
    this.highscoreValEl.textContent = `${Math.max(this.highscore, Math.floor(this.distance))} m`;

    if (this.player.isInvincible) {
      this.powerupBadgeEl.classList.remove('hidden');
      let badgeTitle = '✨ SPARKLE SHIELD: ';
      if (this.selectedCharacter === 'ken') badgeTitle = '⚡ KENERGY SHIELD: ';
      else if (this.theme === 'lionking') badgeTitle = '🦁 LEEUWENBRUL: ';
      this.powerupBadgeEl.innerHTML = `${badgeTitle}<span id="powerup-timer">${Math.ceil(this.player.invincibleTimer)}s</span>`;
    } else {
      this.powerupBadgeEl.classList.add('hidden');
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.draw(this.distance);
    this.collectibles.draw();
    this.obstacles.draw();
    this.player.draw();
    this.drawPopups();
  }

  drawPopups() {
    const ctx = this.ctx;
    for (const pop of this.popups) {
      ctx.save();
      ctx.globalAlpha = pop.alpha;
      ctx.font = 'bold 20px Fredoka, sans-serif';
      ctx.fillStyle = pop.color;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 6;
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    }
  }

  gameLoop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    let dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    if (dt > 0.1) dt = 0.1;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new MultiThemeRunnerGame();
});
