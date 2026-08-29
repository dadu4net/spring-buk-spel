// Barbie & Lion King Run - Collectible Items & Sparkle Effects
class CollectibleManager {
  constructor(canvas, groundY) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.groundY = groundY;
    this.items = [];
    this.particles = [];
    this.spawnTimer = 0;
    this.nextSpawnTime = 2.0;
    this.theme = 'barbie'; // 'barbie' | 'lionking'
  }

  setTheme(theme) {
    this.theme = theme;
  }

  reset() {
    this.items = [];
    this.particles = [];
    this.spawnTimer = 0;
    this.nextSpawnTime = 2.0;
  }

  update(dt, speed) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.x -= speed * dt * 60;
      item.animTime += dt * 4;
      item.y = item.baseY + Math.sin(item.animTime) * 8;

      if (item.x < -40) {
        this.items.splice(i, 1);
      }
    }

    this.spawnTimer += dt;
    if (this.spawnTimer >= this.nextSpawnTime) {
      this.spawnTimer = 0;
      this.nextSpawnTime = 1.8 + Math.random() * 2.5;
      this.spawnItem();
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / 0.5);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  spawnItem() {
    let type;
    const isPowerup = Math.random() < 0.22; // 22% chance for Power-up

    if (this.theme === 'lionking') {
      if (isPowerup) {
        type = 'SUN_EMBLEM';
      } else {
        type = Math.random() < 0.4 ? 'PAW' : 'GRUB';
      }
    } else {
      if (isPowerup) {
        type = 'STAR';
      } else {
        type = Math.random() < 0.4 ? 'DIAMOND' : 'HEART';
      }
    }

    const heights = [this.groundY - 35, this.groundY - 70, this.groundY - 110];
    const baseY = heights[Math.floor(Math.random() * heights.length)];

    this.items.push({
      type,
      x: this.canvas.width + 30,
      baseY,
      y: baseY,
      width: 32,
      height: 32,
      animTime: Math.random() * Math.PI
    });
  }

  checkCollection(playerHitbox) {
    const collected = [];
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (
        playerHitbox.x < item.x + item.width &&
        playerHitbox.x + playerHitbox.width > item.x &&
        playerHitbox.y < item.y + item.height &&
        playerHitbox.y + playerHitbox.height > item.y
      ) {
        collected.push(item);
        this.createPickupEffect(item.x + 16, item.y + 16, item.type);
        this.items.splice(i, 1);
      }
    }
    return collected;
  }

  createPickupEffect(x, y, type) {
    const count = (type === 'STAR' || type === 'SUN_EMBLEM') ? 16 : 10;
    let colors = ['#ffe600', '#ffffff', '#ff9100'];

    if (type === 'HEART') {
      colors = ['#ff1493', '#ff69b4', '#ffffff'];
    } else if (type === 'DIAMOND') {
      colors = ['#00d2ff', '#ffffff', '#e0f7fa'];
    } else if (type === 'GRUB') {
      colors = ['#27ae60', '#2ecc71', '#f1c40f'];
    } else if (type === 'PAW') {
      colors = ['#e67e22', '#f39c12', '#ffe600'];
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 140 + 60;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0.5
      });
    }
  }

  draw() {
    const ctx = this.ctx;

    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const item of this.items) {
      ctx.save();
      ctx.translate(item.x + 16, item.y + 16);

      // Glow behind item
      const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 22);
      glow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      const glowColor = (item.type === 'STAR' || item.type === 'SUN_EMBLEM') ? 'rgba(255, 230, 0, 0.45)' : 'rgba(230, 126, 34, 0.35)';
      glow.addColorStop(0.5, glowColor);
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Draw item shapes
      switch (item.type) {
        case 'HEART':
          this.drawHeartShape(ctx, 12, '#ff1493');
          break;
        case 'STAR':
          this.drawStarShape(ctx, 14, '#ffe600');
          break;
        case 'DIAMOND':
          this.drawDiamondShape(ctx, 13, '#00d2ff');
          break;
        case 'GRUB':
          this.drawGrubShape(ctx);
          break;
        case 'PAW':
          this.drawPawShape(ctx);
          break;
        case 'SUN_EMBLEM':
          this.drawSunEmblemShape(ctx);
          break;
      }

      ctx.restore();
    }
  }

  // 1. Barbie Heart
  drawHeartShape(ctx, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.4);
    ctx.bezierCurveTo(0, 0, -size, 0, -size, -size * 0.5);
    ctx.bezierCurveTo(-size, -size * 1.2, 0, -size * 1.2, 0, -size * 0.4);
    ctx.bezierCurveTo(0, -size * 1.2, size, -size * 1.2, size, -size * 0.5);
    ctx.bezierCurveTo(size, 0, 0, 0, 0, size * 0.4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(-size * 0.4, -size * 0.5, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Barbie Star
  drawStarShape(ctx, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerA = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const innerA = outerA + Math.PI / 5;
      const ox = Math.cos(outerA) * r;
      const oy = Math.sin(outerA) * r;
      const ix = Math.cos(innerA) * (r * 0.45);
      const iy = Math.sin(innerA) * (r * 0.45);

      if (i === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Barbie Diamond
  drawDiamondShape(ctx, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.9, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.9, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 4. Lion King Grub (Slimy yet satisfying!)
  drawGrubShape(ctx) {
    // Striped Caterpillar / Grub body segments
    const colors = ['#27ae60', '#f1c40f', '#27ae60', '#3498db'];
    for (let i = -2; i <= 2; i++) {
      ctx.fillStyle = colors[(i + 2) % colors.length];
      ctx.beginPath();
      ctx.arc(i * 5, Math.sin(i * 1.5) * 3, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Head with cute eyes
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.arc(12, -2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(14, -4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(14.5, -4, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Lion King Paw Print
  drawPawShape(ctx) {
    ctx.fillStyle = '#e67e22';
    // Main palm pad
    ctx.beginPath();
    ctx.ellipse(0, 2, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4 Toe pads
    const toes = [
      { x: -7, y: -7 },
      { x: -2.5, y: -9 },
      { x: 2.5, y: -9 },
      { x: 7, y: -7 }
    ];
    toes.forEach(t => {
      ctx.beginPath();
      ctx.ellipse(t.x, t.y, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Golden shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(-2, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Lion King Sun Emblem (Pride Rock Sun Power-up)
  drawSunEmblemShape(ctx) {
    // Golden Disc
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();

    // Solar Rays
    ctx.fillStyle = '#f1c40f';
    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 4);
      ctx.beginPath();
      ctx.moveTo(11, -3);
      ctx.lineTo(16, 0);
      ctx.lineTo(11, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Carved Lion face silhouette in center
    ctx.fillStyle = '#78281f';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -1, 3, 0, Math.PI);
    ctx.fill();
  }
}

window.CollectibleManager = CollectibleManager;
