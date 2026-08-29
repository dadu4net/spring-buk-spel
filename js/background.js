// Barbie & Lion King Run - Parallax Background System
class ParallaxBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.theme = 'barbie'; // 'barbie' | 'lionking'
    
    // Parallax scroll offsets
    this.cloudOffset = 0;
    this.hillsOffset = 0;
    this.dreamhouseOffset = 0;
    this.palmOffset = 0;
    this.groundOffset = 0;

    // Ground settings
    this.groundHeight = 70;
    this.groundY = canvas.height - this.groundHeight;

    // Clouds
    this.clouds = [
      { x: 100, y: 40, w: 110, h: 45, speed: 0.3 },
      { x: 380, y: 70, w: 140, h: 55, speed: 0.25 },
      { x: 690, y: 35, w: 100, h: 40, speed: 0.35 },
      { x: 920, y: 60, w: 120, h: 50, speed: 0.28 }
    ];

    // Sparkles / Savanna Fireflies
    this.sparkles = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height - 100),
      size: Math.random() * 3 + 1,
      phase: Math.random() * Math.PI * 2
    }));

    // Barbie Dreamhouses
    this.dreamhouses = [
      { x: 50, w: 140, h: 100, roofColor: '#ff69b4', wallColor: '#fff0f5' },
      { x: 280, w: 110, h: 80, roofColor: '#00d2ff', wallColor: '#f0f9ff' },
      { x: 480, w: 160, h: 115, roofColor: '#ff1493', wallColor: '#fff5f8' },
      { x: 740, w: 130, h: 90, roofColor: '#c042ff', wallColor: '#faf0ff' }
    ];

    // Barbie Palm trees
    this.palmTrees = [
      { x: 120, scale: 1 },
      { x: 360, scale: 1.1 },
      { x: 620, scale: 0.95 },
      { x: 880, scale: 1.05 }
    ];

    // Lion King Acacia Trees
    this.acaciaTrees = [
      { x: 90, scale: 1.0 },
      { x: 320, scale: 1.2 },
      { x: 580, scale: 0.85 },
      { x: 830, scale: 1.15 }
    ];
  }

  setTheme(theme) {
    this.theme = theme;
  }

  update(speed, dt) {
    const baseSpeed = speed * dt * 60;
    this.cloudOffset += baseSpeed * 0.15;
    this.hillsOffset += baseSpeed * 0.3;
    this.dreamhouseOffset += baseSpeed * 0.55;
    this.palmOffset += baseSpeed * 0.85;
    this.groundOffset += baseSpeed;

    // Wrap offsets
    if (this.cloudOffset > this.canvas.width) this.cloudOffset %= this.canvas.width;
    if (this.hillsOffset > this.canvas.width) this.hillsOffset %= this.canvas.width;
    if (this.dreamhouseOffset > this.canvas.width) this.dreamhouseOffset %= this.canvas.width;
    if (this.palmOffset > this.canvas.width) this.palmOffset %= this.canvas.width;
    if (this.groundOffset > 40) this.groundOffset %= 40;
  }

  draw(distance) {
    if (this.theme === 'lionking') {
      this.drawSavannah(distance);
    } else {
      this.drawMalibu(distance);
    }
  }

  // ===================================================================
  // BARBIE MALIBU WORLD
  // ===================================================================
  drawMalibu(distance) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Sky Gradient (Day -> Sunset -> Twilight)
    const cycle = (distance / 500) % 3;
    let skyTop, skyMid, skyBottom;

    if (cycle < 1) {
      skyTop = '#a0e7ff';
      skyMid = '#ffc2eb';
      skyBottom = '#fff2b2';
    } else if (cycle < 2) {
      skyTop = '#ff758c';
      skyMid = '#ff7eb3';
      skyBottom = '#ffe066';
    } else {
      skyTop = '#3a1c71';
      skyMid = '#d76d77';
      skyBottom = '#ffaf7b';
    }

    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.groundY);
    skyGrad.addColorStop(0, skyTop);
    skyGrad.addColorStop(0.55, skyMid);
    skyGrad.addColorStop(1, skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Malibu Sun with Sunglasses
    this.drawMalibuSun(w * 0.82, 85, cycle);

    // 3. Sparkles
    this.drawSkySparkles('#ffffff');

    // 4. Clouds
    this.drawClouds('rgba(255, 255, 255, 0.75)');

    // 5. Hills
    this.drawHills('#ffb3d9');

    // 6. Dreamhouse Mansions
    this.drawDreamhouses();

    // 7. Palm Trees
    this.drawPalmTrees();

    // 8. Boulevard Ground
    this.drawMalibuGround();
  }

  drawMalibuSun(x, y, cycle) {
    const ctx = this.ctx;
    ctx.save();
    
    const rad = ctx.createRadialGradient(x, y, 10, x, y, 48);
    rad.addColorStop(0, cycle >= 2 ? '#ffecb3' : '#fff799');
    rad.addColorStop(0.6, cycle >= 2 ? 'rgba(255, 180, 220, 0.4)' : 'rgba(255, 220, 100, 0.4)');
    rad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(x, y, 48, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = cycle >= 2 ? '#fff' : '#fff066';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    if (cycle < 2) {
      ctx.fillStyle = '#ff1493';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x - 18, y - 6, 14, 10, 3) : ctx.fillRect(x - 18, y - 6, 14, 10);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x + 4, y - 6, 14, 10, 3) : ctx.fillRect(x + 4, y - 6, 14, 10);
      ctx.fill();
      ctx.fillRect(x - 5, y - 4, 10, 2);
      ctx.strokeStyle = '#e60073';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y + 5, 8, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawMalibuGround() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const gy = this.groundY;
    const gh = this.groundHeight;

    ctx.fillStyle = '#fce4ec';
    ctx.fillRect(0, gy, w, gh);

    const kerbH = 10;
    const segW = 30;
    const offset = this.groundOffset % (segW * 2);

    for (let x = -segW * 2; x < w + segW * 2; x += segW) {
      const idx = Math.floor((x + offset) / segW);
      ctx.fillStyle = (idx % 2 === 0) ? '#ff1493' : '#ffffff';
      ctx.fillRect(x - offset, gy, segW, kerbH);
    }

    ctx.fillStyle = '#f8bbd0';
    ctx.fillRect(0, gy + kerbH, w, gh - kerbH);

    ctx.fillStyle = '#ffffff';
    const dashW = 40;
    const gapW = 35;
    const dashTotal = dashW + gapW;
    const dashOffset = (this.groundOffset * 1.5) % dashTotal;

    for (let x = -dashTotal; x < w + dashTotal; x += dashTotal) {
      ctx.fillRect(x - dashOffset, gy + 36, dashW, 4);
    }

    ctx.fillStyle = '#e91e63';
    ctx.fillRect(0, this.canvas.height - 6, w, 6);
  }

  // ===================================================================
  // LION KING SAVANNA WORLD
  // ===================================================================
  drawSavannah(distance) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. African Savanna Sky (Sunrise -> Golden Noon -> Dramatic Sunset)
    const cycle = (distance / 500) % 3;
    let skyTop, skyMid, skyBottom;

    if (cycle < 1) {
      // Golden Savanna Morning
      skyTop = '#e65c00';
      skyMid = '#f9d423';
      skyBottom = '#fff2b2';
    } else if (cycle < 2) {
      // Deep Crimson Sunset (Circle of Life)
      skyTop = '#780206';
      skyMid = '#e65c00';
      skyBottom = '#f9d423';
    } else {
      // African Twilight Night
      skyTop = '#1a002c';
      skyMid = '#51123c';
      skyBottom = '#b83b5e';
    }

    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.groundY);
    skyGrad.addColorStop(0, skyTop);
    skyGrad.addColorStop(0.6, skyMid);
    skyGrad.addColorStop(1, skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Majestic Giant African Sun
    this.drawSavannaSun(w * 0.78, 100, cycle);

    // 3. Savanna Fireflies / Golden Motes
    this.drawSkySparkles('#ffe600');

    // 4. Distant Kilimanjaro Mountain Silhouette
    this.drawKilimanjaro();

    // 5. Pride Rock (Koningsrots) in Midground Parallax
    this.drawPrideRock();

    // 6. Iconic Acacia (Umbrella Thorn) Trees
    this.drawAcaciaTrees();

    // 7. Savanna Dust Ground with Grass & Tracks
    this.drawSavannaGround();
  }

  drawSavannaSun(x, y, cycle) {
    const ctx = this.ctx;
    ctx.save();

    // Giant Glowing Solar Halo
    const rad = ctx.createRadialGradient(x, y, 15, x, y, 70);
    rad.addColorStop(0, '#ffffff');
    rad.addColorStop(0.3, '#ffe066');
    rad.addColorStop(0.7, 'rgba(255, 115, 0, 0.4)');
    rad.addColorStop(1, 'rgba(255, 60, 0, 0)');
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(x, y, 70, 0, Math.PI * 2);
    ctx.fill();

    // Core Sun
    ctx.fillStyle = cycle >= 2 ? '#ffecb3' : '#fff7b2';
    ctx.beginPath();
    ctx.arc(x, y, 36, 0, Math.PI * 2);
    ctx.fill();

    // Distant birds silhouetted against sun
    ctx.strokeStyle = '#4a1500';
    ctx.lineWidth = 1.8;
    this.drawFlyingBirdSilhouette(x - 30, y - 20, 10);
    this.drawFlyingBirdSilhouette(x + 18, y - 35, 8);
    this.drawFlyingBirdSilhouette(x - 10, y - 42, 6);

    ctx.restore();
  }

  drawFlyingBirdSilhouette(bx, by, size) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(bx - size, by);
    ctx.quadraticCurveTo(bx - size * 0.5, by - size * 0.6, bx, by);
    ctx.quadraticCurveTo(bx + size * 0.5, by - size * 0.6, bx + size, by);
    ctx.stroke();
  }

  drawKilimanjaro() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const gy = this.groundY;

    // Distant soft silhouette
    ctx.fillStyle = 'rgba(80, 20, 30, 0.35)';
    ctx.beginPath();
    const kx = ((w * 0.15 - this.hillsOffset * 0.4) + w * 2) % (w + 400) - 200;
    ctx.moveTo(kx, gy);
    ctx.lineTo(kx + 160, gy - 120);
    ctx.lineTo(kx + 220, gy - 120); // flat volcanic plateau
    ctx.lineTo(kx + 380, gy);
    ctx.closePath();
    ctx.fill();

    // Faint snowcap
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(kx + 140, gy - 105);
    ctx.lineTo(kx + 160, gy - 120);
    ctx.lineTo(kx + 220, gy - 120);
    ctx.lineTo(kx + 240, gy - 105);
    ctx.closePath();
    ctx.fill();
  }

  drawPrideRock() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const gy = this.groundY;

    const prX = ((180 - this.dreamhouseOffset * 0.6) + (w + 400) * 2) % (w + 500) - 250;
    const prY = gy;

    ctx.save();
    ctx.translate(prX, prY);

    // Pride Rock base mound
    ctx.fillStyle = '#6e2c00';
    ctx.beginPath();
    ctx.moveTo(-100, 0);
    ctx.quadraticCurveTo(-40, -110, 40, -120);
    // The famous jutting promontory peak
    ctx.lineTo(130, -145);
    ctx.lineTo(110, -100);
    ctx.lineTo(160, -70);
    ctx.lineTo(200, 0);
    ctx.closePath();
    ctx.fill();

    // Rocky texture highlights
    ctx.fillStyle = '#935116';
    ctx.beginPath();
    ctx.moveTo(0, -105);
    ctx.lineTo(130, -145);
    ctx.lineTo(80, -110);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawAcaciaTrees() {
    const ctx = this.ctx;
    const w = this.canvas.width;

    this.acaciaTrees.forEach(t => {
      const rx = (t.x - this.palmOffset + w * 2) % (w + 140) - 70;
      const baseY = this.groundY + 4;
      const scale = t.scale;

      ctx.save();
      ctx.translate(rx, baseY);

      // Slender Dark Trunk branching out
      ctx.strokeStyle = '#3e1b00';
      ctx.lineWidth = 8 * scale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(10 * scale, -50 * scale, 5 * scale, -90 * scale);
      ctx.stroke();

      // Branches
      ctx.lineWidth = 4 * scale;
      ctx.beginPath();
      ctx.moveTo(5 * scale, -80 * scale);
      ctx.lineTo(-30 * scale, -105 * scale);
      ctx.moveTo(5 * scale, -80 * scale);
      ctx.lineTo(38 * scale, -110 * scale);
      ctx.stroke();

      // Flat Umbrella Canopy Top (Signature African Acacia)
      ctx.fillStyle = '#1e3810';
      // Center canopy
      ctx.beginPath();
      ctx.ellipse(5 * scale, -100 * scale, 38 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      // Left canopy tier
      ctx.beginPath();
      ctx.ellipse(-30 * scale, -112 * scale, 26 * scale, 6 * scale, -0.1, 0, Math.PI * 2);
      ctx.fill();
      // Right canopy tier
      ctx.beginPath();
      ctx.ellipse(38 * scale, -116 * scale, 28 * scale, 6 * scale, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  drawSavannaGround() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const gy = this.groundY;
    const gh = this.groundHeight;

    // Savanna earth base
    ctx.fillStyle = '#b9770e';
    ctx.fillRect(0, gy, w, gh);

    // Top grass layer
    ctx.fillStyle = '#d4ac0d';
    ctx.fillRect(0, gy, w, 12);

    // Safari wheel track & dust streaks
    ctx.fillStyle = '#7e5109';
    ctx.fillRect(0, gy + 12, w, gh - 12);

    // Track dash markings
    ctx.fillStyle = '#a04000';
    const dashW = 45;
    const gapW = 40;
    const dashTotal = dashW + gapW;
    const dashOffset = (this.groundOffset * 1.5) % dashTotal;

    for (let x = -dashTotal; x < w + dashTotal; x += dashTotal) {
      ctx.fillRect(x - dashOffset, gy + 32, dashW, 5);
      // Small savanna grass tufts
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(x - dashOffset + 8, gy - 4, 3, 5);
      ctx.fillRect(x - dashOffset + 14, gy - 6, 4, 7);
      ctx.fillStyle = '#a04000';
    }

    // Bottom African border
    ctx.fillStyle = '#4a235a';
    ctx.fillRect(0, this.canvas.height - 6, w, 6);
  }

  // ===================================================================
  // SHARED HELPERS
  // ===================================================================
  drawSkySparkles(color) {
    const ctx = this.ctx;
    const time = performance.now() * 0.003;
    ctx.fillStyle = color || '#ffffff';
    for (const sp of this.sparkles) {
      const alpha = 0.3 + 0.7 * Math.sin(time + sp.phase);
      if (alpha > 0) {
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.beginPath();
        const s = sp.size;
        ctx.moveTo(sp.x, sp.y - s * 2);
        ctx.lineTo(sp.x + s * 0.5, sp.y - s * 0.5);
        ctx.lineTo(sp.x + s * 2, sp.y);
        ctx.lineTo(sp.x + s * 0.5, sp.y + s * 0.5);
        ctx.lineTo(sp.x, sp.y + s * 2);
        ctx.lineTo(sp.x - s * 0.5, sp.y + s * 0.5);
        ctx.lineTo(sp.x - s * 2, sp.y);
        ctx.lineTo(sp.x - s * 0.5, sp.y - s * 0.5);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  }

  drawClouds(color) {
    const ctx = this.ctx;
    const w = this.canvas.width;

    ctx.fillStyle = color || 'rgba(255, 255, 255, 0.75)';
    this.clouds.forEach(c => {
      const rx = (c.x - this.cloudOffset * c.speed + w * 2) % (w + c.w) - c.w * 0.5;
      const ry = c.y;
      
      ctx.beginPath();
      ctx.arc(rx, ry, c.h * 0.5, 0, Math.PI * 2);
      ctx.arc(rx + c.w * 0.25, ry - c.h * 0.25, c.h * 0.6, 0, Math.PI * 2);
      ctx.arc(rx + c.w * 0.55, ry, c.h * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawHills(color) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const baseLine = this.groundY - 30;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, this.groundY);

    const step = 60;
    for (let x = 0; x <= w + step; x += step) {
      const worldX = x + this.hillsOffset;
      const y = baseLine - Math.sin(worldX * 0.005) * 45 - Math.cos(worldX * 0.012) * 20;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, this.groundY);
    ctx.closePath();
    ctx.fill();
  }

  drawDreamhouses() {
    const ctx = this.ctx;
    const w = this.canvas.width;

    this.dreamhouses.forEach(dh => {
      const rx = (dh.x - this.dreamhouseOffset + w * 2) % (w + dh.w * 2) - dh.w;
      const ry = this.groundY - dh.h;

      ctx.fillStyle = dh.wallColor;
      ctx.fillRect(rx, ry, dh.w, dh.h);

      ctx.fillStyle = dh.roofColor;
      ctx.beginPath();
      ctx.moveTo(rx - 8, ry);
      ctx.lineTo(rx + dh.w * 0.5, ry - 30);
      ctx.lineTo(rx + dh.w + 8, ry);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ff1493';
      ctx.beginPath();
      ctx.arc(rx + dh.w * 0.5, ry - 10, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a0e7ff';
      ctx.fillRect(rx + 14, ry + 16, 24, 28);
      ctx.fillRect(rx + dh.w - 38, ry + 16, 24, 28);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx + 14, ry + 16, 24, 28);
      ctx.strokeRect(rx + dh.w - 38, ry + 16, 24, 28);

      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(rx + dh.w * 0.5 - 12, ry + dh.h - 36, 24, 36);
    });
  }

  drawPalmTrees() {
    const ctx = this.ctx;
    const w = this.canvas.width;

    this.palmTrees.forEach(p => {
      const rx = (p.x - this.palmOffset + w * 2) % (w + 100) - 50;
      const baseY = this.groundY + 5;
      const trunkH = 130 * p.scale;

      ctx.save();
      ctx.translate(rx, baseY);

      ctx.strokeStyle = '#c48b59';
      ctx.lineWidth = 10 * p.scale;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(15 * p.scale, -trunkH * 0.5, 5 * p.scale, -trunkH);
      ctx.stroke();

      const topX = 5 * p.scale;
      const topY = -trunkH;
      ctx.fillStyle = '#2ec4b6';

      const leafAngles = [-2.4, -1.8, -1.2, -0.6, 0, 0.6];
      leafAngles.forEach(angle => {
        ctx.save();
        ctx.translate(topX, topY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(30 * p.scale, 0, 36 * p.scale, 12 * p.scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.fillStyle = '#ff69b4';
      ctx.beginPath();
      ctx.arc(topX, topY, 6 * p.scale, 0, Math.PI * 2);
      ctx.arc(topX - 6 * p.scale, topY + 4 * p.scale, 5 * p.scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }
}

window.ParallaxBackground = ParallaxBackground;
