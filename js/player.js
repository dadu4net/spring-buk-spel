// Barbie & Lion King Run - Player Controller & Vector Renderer
class Player {
  constructor(canvas, groundY) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.groundY = groundY;

    // Character selection ('barbie' | 'ken' | 'simba' | 'nala')
    this.character = 'barbie';

    // Position & Dimensions
    this.x = 100;
    this.y = this.groundY;
    this.standWidth = 44;
    this.standHeight = 84;
    this.slideWidth = 64;
    this.slideHeight = 44;

    this.width = this.standWidth;
    this.height = this.standHeight;

    // Physics
    this.vy = 0;
    this.gravity = 1450;
    this.jumpForce = -640;
    this.isGrounded = true;
    this.isDucking = false;
    this.isDead = false;

    // Animation timers
    this.animTime = 0;
    this.sparkleTimer = 0;
    this.particles = [];

    // Invincibility Power-Up
    this.isInvincible = false;
    this.invincibleTimer = 0;
  }

  setCharacter(charName) {
    this.character = charName;
    if (this.isLion()) {
      this.standWidth = 52;
      this.standHeight = 65;
      this.slideWidth = 68;
      this.slideHeight = 36;
    } else {
      this.standWidth = 44;
      this.standHeight = 84;
      this.slideWidth = 64;
      this.slideHeight = 44;
    }
    this.width = this.isDucking ? this.slideWidth : this.standWidth;
    this.height = this.isDucking ? this.slideHeight : this.standHeight;
  }

  isLion() {
    return this.character === 'simba' || this.character === 'nala';
  }

  reset() {
    this.y = this.groundY;
    this.vy = 0;
    this.isGrounded = true;
    this.isDucking = false;
    this.isDead = false;
    this.animTime = 0;
    this.particles = [];
    this.isInvincible = false;
    this.invincibleTimer = 0;
    this.width = this.standWidth;
    this.height = this.standHeight;
  }

  jump() {
    if (this.isGrounded && !this.isDead) {
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.isDucking = false;
      const burstColor = this.isLion() ? '#f39c12' : '#ffe600';
      this.createSparkleBurst(this.x + 20, this.groundY, 6, burstColor);
      return true;
    }
    return false;
  }

  duck(isDown) {
    if (this.isDead) return;
    this.isDucking = isDown;
    if (isDown) {
      this.width = this.slideWidth;
      this.height = this.slideHeight;
      if (!this.isGrounded) {
        this.vy += 450;
      }
    } else {
      this.width = this.standWidth;
      this.height = this.standHeight;
    }
  }

  applyPowerup(durationSeconds) {
    this.isInvincible = true;
    this.invincibleTimer = durationSeconds;
  }

  update(dt, speedMultiplier) {
    this.animTime += dt * 10 * speedMultiplier;

    // Power-up timer countdown
    if (this.isInvincible) {
      this.invincibleTimer -= dt;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
        this.invincibleTimer = 0;
      }
    }

    // Gravity & Vertical Movement
    if (!this.isGrounded) {
      this.vy += this.gravity * dt;
      this.y += this.vy * dt;

      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.vy = 0;
        this.isGrounded = true;
        const landColor = this.isLion() ? '#d35400' : '#ff69b4';
        this.createSparkleBurst(this.x + 20, this.groundY, 4, landColor);
      }
    }

    // Footstep / Skate sparkle trail
    this.sparkleTimer += dt;
    if (this.sparkleTimer > 0.06 && !this.isDead) {
      this.sparkleTimer = 0;
      let pColor;
      if (this.isInvincible) {
        pColor = '#ffe600';
      } else if (this.character === 'simba') {
        pColor = Math.random() > 0.5 ? '#f39c12' : '#e67e22';
      } else if (this.character === 'nala') {
        pColor = Math.random() > 0.5 ? '#f5cba7' : '#f39c12';
      } else if (this.character === 'ken') {
        pColor = Math.random() > 0.5 ? '#00b4d8' : '#ffe600';
      } else {
        pColor = Math.random() > 0.5 ? '#ff1493' : '#00d2ff';
      }

      this.particles.push({
        x: this.x + (this.isDucking ? 5 : 12),
        y: this.y - (this.isGrounded ? 4 : 10),
        vx: -(Math.random() * 80 + 120),
        vy: (Math.random() - 0.5) * 40,
        size: Math.random() * 4 + 2,
        color: pColor,
        alpha: 1,
        life: 0.4
      });
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / 0.4);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  createSparkleBurst(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 200,
        vy: -(Math.random() * 150 + 50),
        size: Math.random() * 5 + 3,
        color: color || '#ff69b4',
        alpha: 1,
        life: 0.5
      });
    }
  }

  getHitbox() {
    if (this.isLion()) {
      if (this.isDucking) {
        return {
          x: this.x + 2,
          y: this.y - this.slideHeight + 2,
          width: this.slideWidth - 4,
          height: this.slideHeight - 4
        };
      }
      return {
        x: this.x + 4,
        y: this.y - this.standHeight + 4,
        width: this.standWidth - 6,
        height: this.standHeight - 6
      };
    }

    if (this.isDucking) {
      return {
        x: this.x + 4,
        y: this.y - this.slideHeight + 2,
        width: this.slideWidth - 8,
        height: this.slideHeight - 4
      };
    }
    return {
      x: this.x + 8,
      y: this.y - this.standHeight + 4,
      width: this.standWidth - 14,
      height: this.standHeight - 6
    };
  }

  draw() {
    const ctx = this.ctx;
    this.drawParticles();

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.isInvincible) {
      this.drawShieldAura();
    }

    if (this.isLion()) {
      // Draw Simba or Nala
      if (this.isDead) {
        this.drawLionDeadPose();
      } else if (this.isDucking) {
        this.drawLionSlidePose();
      } else if (!this.isGrounded) {
        this.drawLionJumpPose();
      } else {
        this.drawLionRunPose();
      }
    } else {
      // Draw Barbie or Ken
      if (this.isDead) {
        this.drawHumanDeadPose();
      } else if (this.isDucking) {
        this.drawHumanSlidePose();
      } else if (!this.isGrounded) {
        this.drawHumanJumpPose();
      } else {
        this.drawHumanRunPose();
      }
    }

    ctx.restore();
  }

  drawParticles() {
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
  }

  drawShieldAura() {
    const ctx = this.ctx;
    const t = performance.now() * 0.006;
    const cx = this.isDucking ? 28 : 20;
    const cy = this.isDucking ? -20 : -38;
    const radius = this.isDucking ? 36 : 46;

    ctx.save();
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius);
    if (this.isLion()) {
      glow.addColorStop(0, 'rgba(255, 230, 0, 0.2)');
      glow.addColorStop(0.8, 'rgba(230, 126, 34, 0.4)');
      glow.addColorStop(1, 'rgba(255, 255, 255, 0.85)');
    } else {
      glow.addColorStop(0, 'rgba(255, 230, 0, 0.15)');
      glow.addColorStop(0.8, 'rgba(255, 20, 147, 0.35)');
      glow.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    }

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting sun/star emblems
    for (let i = 0; i < 4; i++) {
      const angle = t + (i * Math.PI * 0.5);
      const sx = cx + Math.cos(angle) * (radius + 4);
      const sy = cy + Math.sin(angle) * (radius * 0.7);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ===================================================================
  // LION KING (SIMBA & NALA) RENDERING
  // ===================================================================
  drawLionRunPose() {
    const ctx = this.ctx;
    const isSimba = this.character === 'simba';
    const furColor = isSimba ? '#e69500' : '#e0b97a';
    const underFur = isSimba ? '#ffe6b3' : '#fff5e6';
    const noseColor = '#b83b5e';
    const cycle = Math.sin(this.animTime);
    const bob = Math.abs(Math.sin(this.animTime * 2)) * 5;

    ctx.save();
    ctx.translate(0, -bob);

    // 1. Playful Lion Tail
    ctx.strokeStyle = furColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(8, -26);
    ctx.quadraticCurveTo(-6, -42 + cycle * 8, -12, -32 - cycle * 6);
    ctx.stroke();
    // Tail tuft
    ctx.fillStyle = isSimba ? '#8b2500' : '#b9770e';
    ctx.beginPath();
    ctx.arc(-12, -32 - cycle * 6, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Back legs (galloping)
    this.drawLionLeg(14, -14, -cycle * 0.7, furColor);
    this.drawLionLeg(34, -14, cycle * 0.7, furColor);

    // 3. Lion Cub Body
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.ellipse(24, -24, 20, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly fluff
    ctx.fillStyle = underFur;
    ctx.beginPath();
    ctx.ellipse(24, -20, 14, 7, 0, 0, Math.PI);
    ctx.fill();

    // 4. Front legs
    this.drawLionLeg(18, -14, cycle * 0.7, furColor);
    this.drawLionLeg(38, -14, -cycle * 0.7, furColor);

    // 5. Lion Head & Face
    this.drawLionHead(38, -38, isSimba, furColor, underFur, noseColor, cycle);

    ctx.restore();
  }

  drawLionJumpPose() {
    const ctx = this.ctx;
    const isSimba = this.character === 'simba';
    const furColor = isSimba ? '#e69500' : '#e0b97a';
    const underFur = isSimba ? '#ffe6b3' : '#fff5e6';
    const noseColor = '#b83b5e';

    ctx.save();

    // Tail extended in leap
    ctx.strokeStyle = furColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(8, -28);
    ctx.quadraticCurveTo(-10, -38, -16, -26);
    ctx.stroke();
    ctx.fillStyle = isSimba ? '#8b2500' : '#b9770e';
    ctx.beginPath();
    ctx.arc(-16, -26, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Hind paws trailing
    this.drawLionLeg(10, -18, -0.6, furColor);
    this.drawLionLeg(14, -18, -0.4, furColor);

    // Body arched in air
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.ellipse(24, -26, 21, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Front paws reaching forward
    this.drawLionLeg(36, -20, 0.8, furColor);
    this.drawLionLeg(40, -20, 0.9, furColor);

    // Head looking joyfully upward
    this.drawLionHead(42, -42, isSimba, furColor, underFur, noseColor, 0.4);

    ctx.restore();
  }

  drawLionSlidePose() {
    const ctx = this.ctx;
    const isSimba = this.character === 'simba';
    const furColor = isSimba ? '#e69500' : '#e0b97a';
    const underFur = isSimba ? '#ffe6b3' : '#fff5e6';
    const noseColor = '#b83b5e';

    ctx.save();

    // Tail flat behind
    ctx.strokeStyle = furColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(8, -12);
    ctx.lineTo(-8, -10);
    ctx.stroke();
    ctx.fillStyle = isSimba ? '#8b2500' : '#b9770e';
    ctx.beginPath();
    ctx.arc(-8, -10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Low creeping body (tijgeren)
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.ellipse(28, -14, 25, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Extended paws sliding
    ctx.strokeStyle = furColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(12, -8); ctx.lineTo(4, -4);
    ctx.moveTo(44, -8); ctx.lineTo(58, -4);
    ctx.stroke();

    // Low stealth head
    this.drawLionHead(50, -20, isSimba, furColor, underFur, noseColor, -0.4, true);

    ctx.restore();
  }

  drawLionDeadPose() {
    const ctx = this.ctx;
    const isSimba = this.character === 'simba';
    const furColor = isSimba ? '#e69500' : '#e0b97a';

    ctx.save();
    ctx.rotate(0.3);

    // Body
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.ellipse(20, -18, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Paws in air
    ctx.strokeStyle = furColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(10, -22); ctx.lineTo(6, -34);
    ctx.moveTo(28, -22); ctx.lineTo(34, -34);
    ctx.stroke();

    // Dizzy Head
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.arc(36, -26, 11, 0, Math.PI * 2);
    ctx.fill();

    // X eyes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(33, -28); ctx.lineTo(37, -24);
    ctx.moveTo(37, -28); ctx.lineTo(33, -24);
    ctx.stroke();

    ctx.restore();
  }

  drawLionLeg(x, y, angle, furColor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.strokeStyle = furColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 14);
    ctx.stroke();

    // Cute rounded paw
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.arc(2, 14, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawLionHead(x, y, isSimba, furColor, underFur, noseColor, sway, isSliding = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Rounded Lion Ears
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.arc(-7, -8, 5.5, 0, Math.PI * 2); // Left ear
    ctx.arc(7, -8, 5.5, 0, Math.PI * 2);  // Right ear
    ctx.fill();
    // Inner ear pinkish
    ctx.fillStyle = '#f1948a';
    ctx.beginPath();
    ctx.arc(-7, -8, 3, 0, Math.PI * 2);
    ctx.arc(7, -8, 3, 0, Math.PI * 2);
    ctx.fill();

    // Head Base
    ctx.fillStyle = furColor;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    // Simba's iconic little head hair tuft / mane fluff
    if (isSimba) {
      ctx.fillStyle = '#9e2a2b';
      ctx.beginPath();
      ctx.moveTo(-4, -10);
      ctx.quadraticCurveTo(0, -18, 4, -10);
      ctx.closePath();
      ctx.fill();
    }

    // Muzzle / Snout
    ctx.fillStyle = underFur;
    ctx.beginPath();
    ctx.ellipse(3, 4, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Pink/Brown Triangular Nose
    ctx.fillStyle = noseColor;
    ctx.beginPath();
    ctx.moveTo(4, 2);
    ctx.lineTo(8, 2);
    ctx.lineTo(6, 5);
    ctx.closePath();
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, 4); ctx.lineTo(13, 3);
    ctx.moveTo(8, 5); ctx.lineTo(13, 6);
    ctx.stroke();

    // Big expressive Lion Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(1, -2, 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Iris
    ctx.fillStyle = isSimba ? '#b9770e' : '#27ae60';
    ctx.beginPath();
    ctx.arc(2, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Pupil & shine
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(2.5, -2, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(1.5, -3, 0.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ===================================================================
  // BARBIE & KEN HUMAN RENDERING
  // ===================================================================
  drawHumanRunPose() {
    const ctx = this.ctx;
    const isKen = this.character === 'ken';
    const cycle = Math.sin(this.animTime);
    const bob = Math.abs(Math.sin(this.animTime * 2)) * 4;

    ctx.save();
    ctx.translate(0, -bob);

    const skinColorBack = isKen ? '#e0a96d' : '#fcd0a1';
    const skinColorFront = isKen ? '#f5cba7' : '#ffe0b2';
    const bootColorBack = isKen ? '#0077b6' : '#00d2ff';
    const bootColorFront = isKen ? '#00b4d8' : '#ff1493';

    // 1. Back Arm
    ctx.strokeStyle = skinColorBack;
    ctx.lineWidth = isKen ? 6 : 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(14, -54);
    ctx.lineTo(14 - cycle * 12, -40);
    ctx.stroke();

    // 2. Legs & Rollerblades
    this.drawRollerLeg(12, -26, -cycle * 0.6, skinColorBack, bootColorBack);
    this.drawRollerLeg(16, -26, cycle * 0.6, skinColorFront, bootColorFront);

    // 3. Torso
    if (isKen) {
      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(7, -34, 18, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(7, -34, 18, 2);
      ctx.fillStyle = '#00b4d8';
      ctx.fillRect(7, -54, 18, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(11, -54, 3, 20);
      ctx.fillRect(17, -54, 3, 20);
    } else {
      ctx.fillStyle = '#00d2ff';
      ctx.fillRect(8, -32, 16, 10);
      ctx.fillStyle = '#ff1493';
      ctx.fillRect(8, -52, 16, 18);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12, -50, 8, 3);
    }

    // 4. Head
    this.drawHumanHead(16, -64, cycle);

    // 5. Front Arm
    ctx.strokeStyle = skinColorFront;
    ctx.lineWidth = isKen ? 6 : 5;
    ctx.beginPath();
    ctx.moveTo(18, -52);
    ctx.lineTo(18 + cycle * 14, -38);
    ctx.stroke();

    ctx.restore();
  }

  drawHumanJumpPose() {
    const ctx = this.ctx;
    const isKen = this.character === 'ken';
    ctx.save();

    const skinColorBack = isKen ? '#e0a96d' : '#fcd0a1';
    const skinColorFront = isKen ? '#f5cba7' : '#ffe0b2';
    const bootColorBack = isKen ? '#0077b6' : '#00d2ff';
    const bootColorFront = isKen ? '#00b4d8' : '#ff1493';

    this.drawRollerLeg(10, -28, -0.7, skinColorBack, bootColorBack);
    this.drawRollerLeg(16, -28, -0.3, skinColorFront, bootColorFront);

    if (isKen) {
      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(7, -34, 18, 12);
      ctx.fillStyle = '#00b4d8';
      ctx.fillRect(7, -54, 18, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(11, -54, 3, 20);
      ctx.fillRect(17, -54, 3, 20);
    } else {
      ctx.fillStyle = '#00d2ff';
      ctx.fillRect(8, -34, 16, 10);
      ctx.fillStyle = '#ff1493';
      ctx.fillRect(8, -54, 16, 18);
    }

    ctx.strokeStyle = skinColorFront;
    ctx.lineWidth = isKen ? 6 : 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(8, -52);
    ctx.lineTo(0, -68);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(22, -52);
    ctx.lineTo(30, -68);
    ctx.stroke();

    this.drawHumanHead(16, -66, 0.4);

    ctx.restore();
  }

  drawHumanSlidePose() {
    const ctx = this.ctx;
    const isKen = this.character === 'ken';
    ctx.save();

    const skinColorBack = isKen ? '#e0a96d' : '#fcd0a1';
    const skinColorFront = isKen ? '#f5cba7' : '#ffe0b2';
    const bootColorBack = isKen ? '#0077b6' : '#00d2ff';
    const bootColorFront = isKen ? '#00b4d8' : '#ff1493';

    this.drawRollerLeg(12, -14, 1.4, skinColorBack, bootColorBack);
    this.drawRollerLeg(22, -14, 1.3, skinColorFront, bootColorFront);

    if (isKen) {
      ctx.fillStyle = '#ff69b4';
      ctx.fillRect(10, -20, 14, 10);
      ctx.fillStyle = '#00b4d8';
      ctx.fillRect(20, -22, 18, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(24, -22, 3, 12);
    } else {
      ctx.fillStyle = '#00d2ff';
      ctx.fillRect(10, -20, 14, 10);
      ctx.fillStyle = '#ff1493';
      ctx.fillRect(20, -22, 18, 12);
    }

    ctx.strokeStyle = skinColorFront;
    ctx.lineWidth = isKen ? 6 : 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(32, -18);
    ctx.lineTo(48, -12);
    ctx.stroke();

    this.drawHumanHead(40, -24, -0.6, true);

    ctx.restore();
  }

  drawHumanDeadPose() {
    const ctx = this.ctx;
    const isKen = this.character === 'ken';
    ctx.save();
    ctx.rotate(0.3);

    const skinColorBack = isKen ? '#e0a96d' : '#fcd0a1';
    const skinColorFront = isKen ? '#f5cba7' : '#ffe0b2';
    const bootColorBack = isKen ? '#0077b6' : '#00d2ff';
    const bootColorFront = isKen ? '#00b4d8' : '#ff1493';

    this.drawRollerLeg(8, -18, 0.8, skinColorBack, bootColorBack);
    this.drawRollerLeg(18, -18, -0.8, skinColorFront, bootColorFront);

    ctx.fillStyle = isKen ? '#00b4d8' : '#ff1493';
    ctx.fillRect(6, -36, 16, 16);

    ctx.fillStyle = skinColorFront;
    ctx.beginPath();
    ctx.arc(14, -46, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffe066';
    ctx.beginPath();
    ctx.arc(14, -50, 11, Math.PI, 0);
    ctx.fill();

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(11, -48); ctx.lineTo(15, -44);
    ctx.moveTo(15, -48); ctx.lineTo(11, -44);
    ctx.stroke();

    ctx.restore();
  }

  drawRollerLeg(x, y, angle, skinColor, bootColor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.strokeStyle = skinColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 16);
    ctx.stroke();

    ctx.fillStyle = bootColor;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-4, 14, 14, 8, 2) : ctx.fillRect(-4, 14, 14, 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, 22, 14, 2);

    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(-2, 25, 2.5, 0, Math.PI * 2);
    ctx.arc(3, 25, 2.5, 0, Math.PI * 2);
    ctx.arc(8, 25, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawHumanHead(x, y, hairSway, isSliding = false) {
    const ctx = this.ctx;
    const isKen = this.character === 'ken';
    ctx.save();
    ctx.translate(x, y);

    const skinColor = isKen ? '#f5cba7' : '#ffe0b2';

    if (isKen) {
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fce570';
      ctx.beginPath();
      ctx.moveTo(-10, -3);
      ctx.quadraticCurveTo(-12, -14, 0, -14);
      ctx.quadraticCurveTo(12, -14, 11, -4);
      ctx.quadraticCurveTo(6, -8, -6, -5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fff494';
      ctx.beginPath();
      ctx.ellipse(-1, -11, 7, 3, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0077b6';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(1, -3, 9, 6, 2) : ctx.fillRect(1, -3, 9, 6);
      ctx.fill();
      ctx.fillStyle = '#023e8a';
      ctx.fillRect(2, -2, 7, 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillRect(3, -2, 2, 4);

      ctx.strokeStyle = '#c67d5a';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(5, 5, 2.5, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

    } else {
      ctx.fillStyle = '#ffd13b';
      ctx.beginPath();
      const hairOffset = isSliding ? -22 : (-16 + hairSway * 6);
      const hairH = isSliding ? -4 : (8 + hairSway * 4);
      ctx.ellipse(hairOffset, hairH, 14, 8, isSliding ? 0.2 : 0.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ff1493';
      ctx.beginPath();
      ctx.arc(isSliding ? -8 : -6, isSliding ? -2 : 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffd13b';
      ctx.beginPath();
      ctx.arc(0, -3, 10, Math.PI, 0.1);
      ctx.fill();

      ctx.fillStyle = '#ff1493';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(1, -3, 9, 6, 2) : ctx.fillRect(1, -3, 9, 6);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(3, -2, 2, 4);

      ctx.fillStyle = '#e91e63';
      ctx.beginPath();
      ctx.arc(5, 5, 2.5, 0, Math.PI);
      ctx.fill();
    }

    ctx.restore();
  }
}

window.Player = Player;
