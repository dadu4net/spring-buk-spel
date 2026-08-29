// Barbie Run - Unified Keyboard, Touch & Mouse Input Handler
class InputController {
  constructor(game) {
    this.game = game;
    this.keys = {};
    this.touchStartY = 0;
    this.touchStartX = 0;

    this.bindKeyboard();
    this.bindTouch();
    this.bindButtons();
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Prevent scrolling default behavior for arrow keys & spacebar
      if (['Space', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyS'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (!this.keys['jump']) {
          this.keys['jump'] = true;
          this.game.handleJump();
        }
      }

      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        if (!this.keys['duck']) {
          this.keys['duck'] = true;
          this.game.handleDuck(true);
        }
      }

      if (e.code === 'KeyP' || e.code === 'Escape') {
        this.game.togglePause();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.keys['jump'] = false;
      }

      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        this.keys['duck'] = false;
        this.game.handleDuck(false);
      }
    });
  }

  bindTouch() {
    const canvas = this.game.canvas;

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;

      if (this.game.state === 'START' || this.game.state === 'GAMEOVER') {
        this.game.start();
        return;
      }

      // Tap on upper half -> Jump, lower half -> Duck
      const rect = canvas.getBoundingClientRect();
      const relativeY = touch.clientY - rect.top;
      if (relativeY < rect.height * 0.6) {
        this.game.handleJump();
      } else {
        this.game.handleDuck(true);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!this.touchStartY) return;
      const touch = e.touches[0];
      const diffY = touch.clientY - this.touchStartY;

      if (diffY < -35) {
        // Swipe Up -> Jump
        this.game.handleJump();
        this.touchStartY = 0;
      } else if (diffY > 35) {
        // Swipe Down -> Duck
        this.game.handleDuck(true);
        this.touchStartY = 0;
      }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.game.handleDuck(false);
      this.touchStartY = 0;
    }, { passive: false });
  }

  bindButtons() {
    // Touch UI Buttons
    const jumpBtn = document.getElementById('touch-jump');
    const slideBtn = document.getElementById('touch-slide');

    if (jumpBtn) {
      jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.game.handleJump();
      }, { passive: false });
      jumpBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.game.handleJump();
      });
    }

    if (slideBtn) {
      slideBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.game.handleDuck(true);
      }, { passive: false });
      slideBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.game.handleDuck(false);
      }, { passive: false });
      slideBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.game.handleDuck(true);
      });
      slideBtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        this.game.handleDuck(false);
      });
    }
  }
}

window.InputController = InputController;
