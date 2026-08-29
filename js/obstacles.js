// Barbie & Lion King Run - Obstacle Manager & Smashable Targets
class ObstacleManager {
  constructor(canvas, groundY) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.groundY = groundY;
    this.obstacles = [];
    this.knockedObjects = []; // Flying knocked-away hyenas & makeup bags
    this.particles = [];
    this.spawnTimer = 0;
    this.minSpawnInterval = 1.2;
    this.maxSpawnInterval = 2.4;
    this.nextSpawnTime = 1.5;
    this.theme = 'barbie'; // 'barbie' | 'lionking'
  }

  setTheme(theme) {
    this.theme = theme;
  }

  reset() {
    this.obstacles = [];
    this.knockedObjects = [];
    this.particles = [];
    this.spawnTimer = 0;
    this.nextSpawnTime = 1.5;
  }

  update(dt, speed, currentDistance) {
    // 1. Move normal obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= speed * dt * 60;
      obs.animTime = (obs.animTime || 0) + dt * 5;

      if (obs.isFlying) {
        obs.y = obs.baseY + Math.sin(obs.animTime * 2) * 8;
      }

      if (obs.x + obs.width < -60) {
        this.obstacles.splice(i, 1);
      }
    }

    // 2. Update knocked away flying objects (Hyenas & Makeup bags)
    for (let i = this.knockedObjects.length - 1; i >= 0; i--) {
      const ko = this.knockedObjects[i];
      ko.x += ko.vx * dt;
      ko.y += ko.vy * dt;
      ko.vy += ko.gravity * dt;
      ko.rot += ko.rotSpeed * dt;

      // Trailing stars/sparks
      ko.particleTimer = (ko.particleTimer || 0) + dt;
      if (ko.particleTimer > 0.05) {
        ko.particleTimer = 0;
        this.particles.push({
          x: ko.x + ko.width * 0.5,
          y: ko.y + ko.height * 0.5,
          vx: -(Math.random() * 60 + 40),
          vy: (Math.random() - 0.5) * 60,
          size: Math.random() * 4 + 2,
          color: ko.type === 'HYENA' ? '#ffe600' : '#ff69b4',
          alpha: 1,
          life: 0.35
        });
      }

      // Remove when fallen off screen
      if (ko.y > this.canvas.height + 100 || ko.x > this.canvas.width + 150) {
        this.knockedObjects.splice(i, 1);
      }
    }

    // 3. Update debris particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / 0.35);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 4. Spawn timer
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.nextSpawnTime) {
      this.spawnTimer = 0;
      const speedFactor = Math.min(speed / 6, 1.8);
      const minI = Math.max(0.9, this.minSpawnInterval / speedFactor);
      const maxI = Math.max(1.5, this.maxSpawnInterval / speedFactor);
      this.nextSpawnTime = minI + Math.random() * (maxI - minI);

      this.spawnObstacle(currentDistance);
    }
  }

  spawnObstacle(currentDistance) {
    let types = [];
    
    if (this.theme === 'lionking') {
      // Hyena is the special smashable target!
      types = ['HYENA', 'HYENA', 'LOG', 'THORN_BUSH'];
      if (currentDistance > 120) {
        types.push('ZAZU', 'VULTURE', 'VINE');
      }
    } else {
      // Make-up bag is the special smashable target!
      types = ['MAKEUP_BAG', 'MAKEUP_BAG', 'FLAMINGO', 'BEACHBALL', 'SKATE_CONES'];
      if (currentDistance > 120) {
        types.push('SEAGULL', 'UMBRELLA', 'BALLOONS');
      }
    }

    const type = types[Math.floor(Math.random() * types.length)];
    let obs = null;

    switch (type) {
      // --- SMASHABLE TARGETS ---
      case 'HYENA':
        obs = {
          type,
          x: this.canvas.width + 20,
          y: this.groundY - 50,
          width: 52,
          height: 50,
          isSmashable: true,
          isFlying: false
        };
        break;

      case 'MAKEUP_BAG':
        obs = {
          type,
          x: this.canvas.width + 20,
          y: this.groundY - 44,
          width: 48,
          height: 44,
          isSmashable: true,
          isFlying: false
        };
        break;

      // --- LION KING REGULAR OBSTACLES ---
      case 'LOG':
        obs = {
          type,
          x: this.canvas.width + 20,
          y: this.groundY - 36,
          width: 56,
          height: 36,
          isSmashable: false,
          isFlying: false
        };
        break;

      case 'THORN_BUSH':
        obs = {
          type,
          x: this.canvas.width + 20,
          y: this.groundY - 44,
          width: 46,
          height: 44,
          isSmashable: false,
          isFlying: false
        };
        break;

      case 'ZAZU':
        obs = {
          type,
          x: this.canvas.width + 20,
          baseY: this.groundY - 78,
          y: this.groundY - 78,
          width: 48,
          height: 32,
          isSmashable: false,
          isFlying: true
        };
        break;

      case 'VULTURE':
        obs = {
          type,
          x: this.canvas.width + 20,
          baseY: this.groundY - 84,
          y: this.groundY - 84,
          width: 50,
          height: 36,
          isSmashable: false,
          isFlying: true
        };
        break;

      case 'VINE':
        obs = {
          type,
          x: this.canvas.width + 20,
          baseY: this.groundY - 90,
          y: this.groundY - 90,
          width: 44,
          height: 40,
          isSmashable: false,
          isFlying: true
        };
        break;

      // --- BARBIE REGULAR OBSTACLES ---
      case 'FLAMINGO':
        obs = {
          type,
          x: this.canvas.width + 20,
          y: this.groundY - 52,
          width: 50,
          height: 52,
          isSmashable: false,
          isFlying: false
        };
        break;

      case 'BEACHBALL':
        obs = {
          type,
          x: this.canvas.width + 20,
          y: this.groundY - 42,
          width: 42,
          height: 42,
          isSmashable: false,
          isFlying: false,
          rot: 0
        };
        break;

      case 'SKATE_CONES':
        obs = {
          type,
          x: this.canvas.width + 20,
          y: this.groundY - 38,
          width: 55,
          height: 38,
          isSmashable: false,
          isFlying: false
        };
        break;

      case 'SEAGULL':
        obs = {
          type,
          x: this.canvas.width + 20,
          baseY: this.groundY - 78,
          y: this.groundY - 78,
          width: 46,
          height: 32,
          isSmashable: false,
          isFlying: true
        };
        break;

      case 'UMBRELLA':
        obs = {
          type,
          x: this.canvas.width + 20,
          baseY: this.groundY - 84,
          y: this.groundY - 84,
          width: 52,
          height: 36,
          isSmashable: false,
          isFlying: true
        };
        break;

      case 'BALLOONS':
        obs = {
          type,
          x: this.canvas.width + 20,
          baseY: this.groundY - 90,
          y: this.groundY - 90,
          width: 44,
          height: 42,
          isSmashable: false,
          isFlying: true
        };
        break;
    }

    if (obs) {
      this.obstacles.push(obs);
    }
  }

  // Knock away an obstacle with hilarious physics
  knockAway(obs) {
    const idx = this.obstacles.indexOf(obs);
    if (idx > -1) {
      this.obstacles.splice(idx, 1);
    }

    this.knockedObjects.push({
      ...obs,
      vx: 300 + Math.random() * 140,
      vy: -(540 + Math.random() * 80),
      gravity: 1250,
      rot: 0,
      rotSpeed: 12 + Math.random() * 8,
      isKnocked: true
    });

    // Spawn burst effects
    const burstCount = 14;
    const colors = obs.type === 'HYENA' 
      ? ['#ffe600', '#d35400', '#616161'] 
      : ['#ff1493', '#ff69b4', '#00d2ff', '#ffe600', '#ffffff'];

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 180 + 80;
      this.particles.push({
        x: obs.x + obs.width * 0.5,
        y: obs.y + obs.height * 0.5,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 60,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0.55
      });
    }
  }

  checkCollision(playerHitbox) {
    for (const obs of this.obstacles) {
      const pad = 6;
      const obsHitbox = {
        x: obs.x + pad,
        y: obs.y + pad,
        width: obs.width - pad * 2,
        height: obs.height - pad * 2
      };

      if (
        playerHitbox.x < obsHitbox.x + obsHitbox.width &&
        playerHitbox.x + playerHitbox.width > obsHitbox.x &&
        playerHitbox.y < obsHitbox.y + obsHitbox.height &&
        playerHitbox.y + playerHitbox.height > obsHitbox.y
      ) {
        return obs;
      }
    }
    return null;
  }

  draw() {
    const ctx = this.ctx;

    // 1. Draw Burst Particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Draw Active Obstacles
    for (const obs of this.obstacles) {
      ctx.save();
      ctx.translate(obs.x, obs.y);
      this.renderObstacleType(obs);
      ctx.restore();
    }

    // 3. Draw Knocked-Away Flying Objects
    for (const ko of this.knockedObjects) {
      ctx.save();
      ctx.translate(ko.x + ko.width * 0.5, ko.y + ko.height * 0.5);
      ctx.rotate(ko.rot);
      ctx.translate(-ko.width * 0.5, -ko.height * 0.5);
      this.renderObstacleType(ko);
      ctx.restore();
    }
  }

  renderObstacleType(obs) {
    switch (obs.type) {
      // Smashable Targets
      case 'HYENA':
        this.drawHyena(obs);
        break;
      case 'MAKEUP_BAG':
        this.drawMakeupBag(obs);
        break;

      // Lion King Regular Obstacles
      case 'LOG':
        this.drawLog(obs);
        break;
      case 'THORN_BUSH':
        this.drawThornBush(obs);
        break;
      case 'ZAZU':
        this.drawZazu(obs);
        break;
      case 'VULTURE':
        this.drawVulture(obs);
        break;
      case 'VINE':
        this.drawVine(obs);
        break;

      // Barbie Regular Obstacles
      case 'FLAMINGO':
        this.drawFlamingo(obs);
        break;
      case 'BEACHBALL':
        this.drawBeachBall(obs);
        break;
      case 'SKATE_CONES':
        this.drawSkateCones(obs);
        break;
      case 'SEAGULL':
        this.drawSeagull(obs);
        break;
      case 'UMBRELLA':
        this.drawUmbrella(obs);
        break;
      case 'BALLOONS':
        this.drawBalloons(obs);
        break;
    }
  }

  // ===================================================================
  // SMASHABLE 1: SPOTTED HYENA (LION KING)
  // ===================================================================
  drawHyena(obs) {
    const ctx = this.ctx;
    const isKnocked = obs.isKnocked;
    const chomp = Math.sin((obs.animTime || 0) * 4) * 3;

    // Body
    ctx.fillStyle = '#616161';
    ctx.beginPath();
    ctx.moveTo(14, 38);
    ctx.lineTo(44, 28);
    ctx.lineTo(34, 46);
    ctx.lineTo(10, 46);
    ctx.closePath();
    ctx.fill();

    // Dark spots
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(22, 34, 2.5, 0, Math.PI * 2);
    ctx.arc(30, 36, 3, 0, Math.PI * 2);
    ctx.arc(26, 42, 2, 0, Math.PI * 2);
    ctx.fill();

    // Spiky black mane
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.moveTo(18, 28);
    ctx.lineTo(24, 18);
    ctx.lineTo(28, 26);
    ctx.lineTo(34, 16);
    ctx.lineTo(38, 26);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = '#616161';
    ctx.beginPath();
    ctx.arc(14, 22, 9, 0, Math.PI * 2);
    ctx.fill();

    // Big rounded hyena ears
    ctx.fillStyle = '#424242';
    ctx.beginPath();
    ctx.arc(10, 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#212121';
    ctx.fillRect(2, 22 + (isKnocked ? 2 : chomp * 0.3), 8, 6);

    if (isKnocked) {
      // Dizzy X eyes when knocked away!
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(9, 16); ctx.lineTo(15, 22);
      ctx.moveTo(15, 16); ctx.lineTo(9, 22);
      ctx.stroke();
    } else {
      // Yellow sinister eye
      ctx.fillStyle = '#ffe600';
      ctx.beginPath();
      ctx.arc(12, 19, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(11, 19, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ===================================================================
  // SMASHABLE 2: GLAM MAKE-UP TAS (BARBIE)
  // ===================================================================
  drawMakeupBag(obs) {
    const ctx = this.ctx;
    const isKnocked = obs.isKnocked;

    // 1. Quilted Pink Vanity Bag Body
    ctx.fillStyle = '#ff1493';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(4, 12, 40, 30, 8) : ctx.fillRect(4, 12, 40, 30);
    ctx.fill();

    // Quilted diamond pattern lines
    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(12, 12); ctx.lineTo(36, 42);
    ctx.moveTo(24, 12); ctx.lineTo(44, 38);
    ctx.moveTo(36, 12); ctx.lineTo(12, 42);
    ctx.moveTo(24, 12); ctx.lineTo(4, 38);
    ctx.stroke();

    // 2. Gold Zipper top & Golden Handle
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(24, 12, 10, Math.PI, 0);
    ctx.stroke();

    // Golden zipper line
    ctx.fillStyle = '#ffe600';
    ctx.fillRect(8, 11, 32, 3);
    // Zipper pull tag (Heart charm)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(36, 15, 3, 0, Math.PI * 2);
    ctx.fill();

    // 3. Make-up items peeking / bursting out!
    // Lipstick (Gold tube, bright red/pink tip)
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(8, 2, 6, 10);
    ctx.fillStyle = '#ff0055';
    ctx.beginPath();
    ctx.moveTo(8, 2); ctx.lineTo(14, 2); ctx.lineTo(11, -4);
    ctx.closePath();
    ctx.fill();

    // Fluffy Glitter Makeup Brush
    ctx.fillStyle = '#ff69b4';
    ctx.fillRect(28, 4, 4, 8);
    ctx.fillStyle = '#00d2ff'; // Cyan brush hairs with glitter
    ctx.beginPath();
    ctx.ellipse(30, 0, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle star on bag
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(24, 28, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // ===================================================================
  // LION KING REGULAR OBSTACLES
  // ===================================================================
  drawLog(obs) {
    const ctx = this.ctx;
    ctx.fillStyle = '#6e2c00';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(0, 12, 56, 24, 6) : ctx.fillRect(0, 12, 56, 24);
    ctx.fill();

    ctx.strokeStyle = '#4a235a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, 20); ctx.lineTo(32, 20);
    ctx.moveTo(20, 28); ctx.lineTo(48, 28);
    ctx.stroke();

    ctx.fillStyle = '#b9770e';
    ctx.beginPath();
    ctx.ellipse(50, 24, 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78281f';
    ctx.stroke();

    ctx.fillStyle = '#27ae60';
    ctx.beginPath();
    ctx.arc(16, 12, 5, Math.PI, 0);
    ctx.fill();
  }

  drawThornBush(obs) {
    const ctx = this.ctx;
    ctx.fillStyle = '#7d6608';
    ctx.beginPath();
    ctx.arc(14, 28, 12, 0, Math.PI * 2);
    ctx.arc(28, 22, 14, 0, Math.PI * 2);
    ctx.arc(38, 30, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#3e1b00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 16); ctx.lineTo(4, 8);
    ctx.moveTo(28, 10); ctx.lineTo(28, 2);
    ctx.moveTo(42, 18); ctx.lineTo(48, 10);
    ctx.stroke();

    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.arc(18, 24, 2.5, 0, Math.PI * 2);
    ctx.arc(32, 20, 2.5, 0, Math.PI * 2);
    ctx.arc(26, 32, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawZazu(obs) {
    const ctx = this.ctx;
    const flap = Math.sin(obs.animTime * 3) * 6;

    ctx.fillStyle = '#0077b6';
    ctx.beginPath();
    ctx.ellipse(22, 16, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(20, 19, 10, 5, 0, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = '#00b4d8';
    ctx.beginPath();
    ctx.moveTo(18, 14);
    ctx.lineTo(8, 2 + flap);
    ctx.lineTo(26, 14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffe600';
    ctx.beginPath();
    ctx.moveTo(12, 6 + flap);
    ctx.lineTo(8, 2 + flap);
    ctx.lineTo(16, 8 + flap);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e65c00';
    ctx.beginPath();
    ctx.moveTo(34, 12);
    ctx.quadraticCurveTo(46, 14, 44, 22);
    ctx.lineTo(34, 18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0077b6';
    ctx.fillRect(28, 6, 6, 4);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(32, 14, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(33, 14, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawVulture(obs) {
    const ctx = this.ctx;
    const flap = Math.sin(obs.animTime * 3) * 6;

    ctx.fillStyle = '#2c1a0e';
    ctx.beginPath();
    ctx.ellipse(22, 16, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1c0f08';
    ctx.beginPath();
    ctx.moveTo(18, 14);
    ctx.lineTo(6, 2 + flap);
    ctx.lineTo(26, 14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(32, 16, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f1948a';
    ctx.beginPath();
    ctx.arc(38, 14, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.moveTo(40, 13);
    ctx.lineTo(47, 16);
    ctx.lineTo(40, 17);
    ctx.closePath();
    ctx.fill();
  }

  drawVine(obs) {
    const ctx = this.ctx;
    ctx.strokeStyle = '#5b3a1a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.quadraticCurveTo(24, 28, 40, 36);
    ctx.stroke();

    ctx.fillStyle = '#27ae60';
    const drawLeaf = (lx, ly, rot) => {
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawLeaf(14, 12, 0.4);
    drawLeaf(26, 24, -0.3);
    drawLeaf(38, 34, 0.5);
  }

  // ===================================================================
  // BARBIE REGULAR OBSTACLES
  // ===================================================================
  drawFlamingo(obs) {
    const ctx = this.ctx;
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.ellipse(22, 36, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fce4ec';
    ctx.beginPath();
    ctx.ellipse(22, 36, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ff1493';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(34, 34);
    ctx.quadraticCurveTo(46, 20, 36, 8);
    ctx.stroke();

    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.arc(35, 8, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffe600';
    ctx.fillRect(40, 7, 6, 4);
    ctx.fillStyle = '#111';
    ctx.fillRect(44, 7, 3, 4);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(36, 6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(37, 6, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBeachBall(obs) {
    const ctx = this.ctx;
    const r = obs.width / 2;
    ctx.save();
    ctx.translate(r, r);
    ctx.rotate(obs.animTime || 0);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    const colors = ['#ff1493', '#00d2ff', '#ffe600', '#c042ff'];
    colors.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, (i * Math.PI) / 2, ((i + 0.6) * Math.PI) / 2);
      ctx.closePath();
      ctx.fill();
    });

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawSkateCones(obs) {
    const ctx = this.ctx;
    const drawCone = (cx, cy) => {
      ctx.fillStyle = '#ff1493';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 10, cy + 28);
      ctx.lineTo(cx + 10, cy + 28);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 5, cy + 12, 10, 4);

      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(cx - 12, cy + 28, 24, 4);
    };

    drawCone(14, 6);
    drawCone(38, 6);
  }

  drawSeagull(obs) {
    const ctx = this.ctx;
    const flap = Math.sin(obs.animTime * 3) * 6;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(22, 16, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(18, 14);
    ctx.lineTo(8, 2 + flap);
    ctx.lineTo(26, 14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffb300';
    ctx.beginPath();
    ctx.moveTo(36, 14);
    ctx.lineTo(44, 16);
    ctx.lineTo(36, 18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ff1493';
    ctx.fillRect(30, 12, 6, 4);
  }

  drawUmbrella(obs) {
    const ctx = this.ctx;
    ctx.fillStyle = '#ff1493';
    ctx.beginPath();
    ctx.arc(26, 20, 22, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#ffe600';
    ctx.beginPath();
    ctx.arc(26, 20, 22, Math.PI * 1.25, Math.PI * 1.5);
    ctx.lineTo(26, 20);
    ctx.fill();

    ctx.fillStyle = '#00d2ff';
    ctx.beginPath();
    ctx.arc(26, 20, 22, Math.PI * 1.5, Math.PI * 1.75);
    ctx.lineTo(26, 20);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(26, 20);
    ctx.lineTo(26, 36);
    ctx.stroke();
  }

  drawBalloons(obs) {
    const ctx = this.ctx;
    const drawHeartBalloon = (cx, cy, color, size) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy + size * 0.3);
      ctx.bezierCurveTo(cx, cy, cx - size, cy, cx - size, cy - size * 0.6);
      ctx.bezierCurveTo(-size, -size * 1.3, 0, -size * 1.3, 0, -size * 0.6);
      ctx.bezierCurveTo(0, -size * 1.3, size, -size * 1.3, size, -size * 0.6);
      ctx.bezierCurveTo(size, 0, 0, 0, 0, size * 0.3);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy + size * 0.3);
      ctx.lineTo(22, 40);
      ctx.stroke();
    };

    drawHeartBalloon(14, 16, '#ff1493', 10);
    drawHeartBalloon(28, 12, '#00d2ff', 11);
    drawHeartBalloon(20, 22, '#ffe600', 9);
  }
}

window.ObstacleManager = ObstacleManager;
