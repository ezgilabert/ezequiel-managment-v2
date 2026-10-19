export class RetroTv {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.W = this.canvas.width;
    this.H = this.canvas.height;

    this.retroTv = document.getElementById('retroTv');
    this.osdEl = document.getElementById('tvChannel');
    this.indEl = document.getElementById('tvIndicator');
    this.dialEl = document.getElementById('tvDial');

    this.isTvVisible = false;
    this.current = 0;
    this.changing = false;
    this.lastSwitch = performance.now();
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.channelDuration = this.reduce ? 999999999 : 9000;
    this.lastFrame = 0;

    this.noiseCan = document.createElement('canvas');
    this.noiseCan.width = 160;
    this.noiseCan.height = 120;
    this.noiseCtx = this.noiseCan.getContext('2d');
    this.noiseFrames = [];

    this.stars = [];
    this.mDrops = [];
    this.lastTimeStr = '';
    this.lastTimeUpdate = 0;

    this.initNoise();
    this.initStars();
    this.initMatrix();

    this.channels = [
      { name: 'NO SIGNAL',  draw: this.drawStatic.bind(this)  },
      { name: 'COLOR BARS', draw: this.drawBars.bind(this)    },
      { name: 'PLASMA',     draw: this.drawPlasma.bind(this)  },
      { name: 'KALEIDO',    draw: this.drawKaleido.bind(this) },
      { name: 'SPIRAL',     draw: this.drawSpiral.bind(this)  },
      { name: 'WAVES',      draw: this.drawWaves.bind(this)   },
      { name: 'SYNTHWAVE',  draw: this.drawSynth.bind(this)   },
      { name: 'RGB GLITCH', draw: this.drawRGB.bind(this)     },
      { name: 'CHECKER',    draw: this.drawChecker.bind(this) },
      { name: 'HYPERSPACE', draw: this.drawStars.bind(this)   },
      { name: 'LAVA LAMP',  draw: this.drawLava.bind(this)    },
      { name: 'MATRIX',     draw: this.drawMatrix.bind(this)  }
    ];

    this.initDOMEvents();
    this.initObserver();
    this.updateOSD();
  }

  // --- Utilidades ---
  hsl(h, s, l, a) {
    return (a == null) ? `hsl(${h},${s}%,${l}%)` : `hsla(${h},${s}%,${l}%,${a})`;
  }

  initNoise() {
    for (let nf = 0; nf < 6; nf++) {
      const id = this.noiseCtx.createImageData(160, 120);
      for (let pi = 0; pi < id.data.length; pi += 4) {
        const v = (Math.random() * 255) | 0;
        id.data[pi] = v; id.data[pi+1] = v; id.data[pi+2] = v; id.data[pi+3] = 255;
      }
      this.noiseFrames.push(id);
    }
  }

  initStars() {
    for (let i = 0; i < 140; i++) {
      this.stars.push({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: Math.random() });
    }
  }

  initMatrix() {
    const cols = Math.floor(this.W / 8);
    for (let i = 0; i < cols; i++) this.mDrops.push(Math.random() * this.H);
  }

  // --- Canales ---
  drawStatic(t) {
    const f = Math.floor(t * 30) % this.noiseFrames.length;
    this.noiseCtx.putImageData(this.noiseFrames[f], 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(this.noiseCan, 0, 0, this.W, this.H);
    this.ctx.imageSmoothingEnabled = true;
    if (Math.random() < 0.08) {
      this.ctx.fillStyle = 'rgba(255,0,80,.22)';
      this.ctx.fillRect(0, Math.random() * this.H, this.W, 2);
    }
  }

  drawBars(t) {
    const colors = ['#bfbfbf','#bfbf00','#00bfbf','#00bf00','#bf00bf','#bf0000','#0000bf'];
    const bw = this.W / colors.length;
    for (let i = 0; i < colors.length; i++) { this.ctx.fillStyle = colors[i]; this.ctx.fillRect(i * bw, 0, bw + 1, this.H * 0.72); }
    this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, this.H * 0.72, this.W, this.H * 0.28);
    const shades = ['#0a0a0a','#1a1a1a','#3a3a3a','#666','#999','#ccc','#fff'];
    const sw = this.W / 7;
    for (let j = 0; j < 7; j++) { this.ctx.fillStyle = shades[j]; this.ctx.fillRect(j * sw, this.H * 0.76, sw, this.H * 0.06); }
    const now = performance.now();
    if (now - this.lastTimeUpdate > 500) { this.lastTimeStr = new Date().toLocaleTimeString(); this.lastTimeUpdate = now; }
    this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 10px monospace'; this.ctx.textAlign = 'center';
    this.ctx.fillText('EZE TV · ' + this.lastTimeStr, this.W / 2, this.H * 0.92);
    this.ctx.fillStyle = this.hsl((t * 120) % 360, 100, 60);
    this.ctx.beginPath(); this.ctx.arc(this.W / 2, this.H * 0.97, 2 + Math.sin(t * 6), 0, Math.PI * 2); this.ctx.fill();
    this.ctx.textAlign = 'left';
  }

  drawPlasma(t) {
    const step = 6;
    for (let y = 0; y < this.H; y += step) {
      for (let x = 0; x < this.W; x += step) {
        const v = Math.sin(x * 0.05 + t * 1.4) + Math.sin(y * 0.06 + t * 1.1) + Math.sin((x + y) * 0.04 + t * 0.9) + Math.sin(Math.hypot(x - this.W/2, y - this.H/2) * 0.06 - t * 1.8);
        let hue = (v * 55 + t * 60) % 360; if (hue < 0) hue += 360;
        this.ctx.fillStyle = this.hsl(hue, 100, 55); this.ctx.fillRect(x, y, step, step);
      }
    }
  }

  drawKaleido(t) {
    this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, 0, this.W, this.H);
    const cx = this.W / 2, cy = this.H / 2; const segs = 10;
    for (let s = 0; s < segs; s++) {
      this.ctx.save(); this.ctx.translate(cx, cy); this.ctx.rotate(s * Math.PI * 2 / segs + t * 0.4);
      for (let i = 0; i < 4; i++) {
        const r = 25 + i * 22 + Math.sin(t * 2 + i) * 12; const hue = (t * 70 + i * 45 + s * 22) % 360;
        this.ctx.fillStyle = this.hsl(hue, 100, 55, 0.8); this.ctx.beginPath(); this.ctx.arc(r, 0, 14, 0, Math.PI * 2); this.ctx.fill();
      }
      this.ctx.restore();
    }
  }

  drawSpiral(t) {
    this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, 0, this.W, this.H);
    const cx = this.W / 2, cy = this.H / 2; const max = Math.max(this.W, this.H);
    for (let i = 0; i < 180; i++) {
      const a = i * 0.22 + t * 1.8; const r = i * 1.6; if (r > max) break;
      const x = cx + Math.cos(a) * r; const y = cy + Math.sin(a) * r;
      const hue = (i * 3 + t * 90) % 360; this.ctx.fillStyle = this.hsl(hue, 100, 55);
      this.ctx.beginPath(); this.ctx.arc(x, y, 3, 0, Math.PI * 2); this.ctx.fill();
    }
  }

  drawWaves(t) {
    this.ctx.fillStyle = '#050510'; this.ctx.fillRect(0, 0, this.W, this.H);
    for (let k = 0; k < 6; k++) {
      this.ctx.beginPath();
      for (let x = 0; x <= this.W; x += 3) {
        const y = this.H / 2 + Math.sin(x * 0.035 + t * 2 + k * 0.6) * 55 + Math.sin(x * 0.07 - t * 1.4 + k) * 22;
        if (x === 0) this.ctx.moveTo(x, y); else this.ctx.lineTo(x, y);
      }
      this.ctx.strokeStyle = this.hsl((t * 90 + k * 55) % 360, 100, 60); this.ctx.lineWidth = 3; this.ctx.stroke();
    }
  }

  drawSynth(t) {
    const horizon = this.H * 0.55;
    const g = this.ctx.createLinearGradient(0, 0, 0, horizon);
    g.addColorStop(0, '#1a0033'); g.addColorStop(0.6, '#5a0055'); g.addColorStop(1, '#ff0077');
    this.ctx.fillStyle = g; this.ctx.fillRect(0, 0, this.W, horizon);
    const sy = horizon - 8;
    const sunG = this.ctx.createLinearGradient(0, sy - 40, 0, sy + 4);
    sunG.addColorStop(0, '#ffee55'); sunG.addColorStop(1, '#ff2266');
    this.ctx.fillStyle = sunG; this.ctx.beginPath(); this.ctx.arc(this.W / 2, sy, 38, Math.PI, 0); this.ctx.fill();
    this.ctx.fillStyle = 'rgba(26,0,51,.9)';
    for (let i = 0; i < 5; i++) { this.ctx.fillRect(this.W / 2 - 40, sy - 4 - i * 7 + Math.sin(t * 3) * 2, 80, 2); }
    this.ctx.fillStyle = '#0a0018'; this.ctx.fillRect(0, horizon, this.W, this.H - horizon);
    this.ctx.strokeStyle = '#ff0088'; this.ctx.lineWidth = 2; this.ctx.beginPath(); this.ctx.moveTo(0, horizon); this.ctx.lineTo(this.W, horizon); this.ctx.stroke();
    this.ctx.strokeStyle = 'rgba(255,0,255,.85)'; this.ctx.lineWidth = 1;
    const scroll = (t * 0.6) % 1;
    for (let j = 0; j < 14; j++) {
      const k = (j + scroll) / 14; const y = horizon + Math.pow(k, 2) * (this.H - horizon);
      if (y < this.H + 2) { this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(this.W, y); this.ctx.stroke(); }
    }
    for (let v = -10; v <= 10; v++) { this.ctx.beginPath(); this.ctx.moveTo(this.W / 2 + v * 4, horizon); this.ctx.lineTo(this.W / 2 + v * 40, this.H); this.ctx.stroke(); }
  }

  drawRGB(t) {
    this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, 0, this.W, this.H);
    const cx = this.W / 2, cy = this.H / 2; this.ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      const a = t * 2 + i * Math.PI * 2 / 3;
      const ox = Math.cos(a) * (18 + Math.sin(t * 3) * 6); const oy = Math.sin(a) * (18 + Math.cos(t * 2.4) * 6);
      const r = 46 + Math.sin(t * 3 + i) * 22; this.ctx.fillStyle = ['#ff2a2a','#2aff2a','#2a2aff'][i];
      this.ctx.beginPath(); this.ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2); this.ctx.fill();
    }
    this.ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.sin(t * 6) * 0.2})`; this.ctx.beginPath(); this.ctx.arc(cx, cy, 12, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.globalCompositeOperation = 'source-over';
  }

  drawChecker(t) {
    const size = 16 + Math.sin(t * 1.4) * 6; const ox = (t * 26) % (size * 2); const oy = (t * 18) % (size * 2);
    this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, 0, this.W, this.H);
    const cols = Math.ceil(this.W / size) + 3; const rows = Math.ceil(this.H / size) + 3;
    for (let gy = -2; gy < rows; gy++) {
      for (let gx = -2; gx < cols; gx++) {
        const ii = gx + gy; if ((ii & 1) === 0) continue;
        const hue = ((gx * 22 + gy * 14) + t * 70) % 360;
        this.ctx.fillStyle = this.hsl(hue, 100, 55); this.ctx.fillRect(gx * size - ox, gy * size - oy, size + 1, size + 1);
      }
    }
  }

  drawStars(t) {
    this.ctx.fillStyle = 'rgba(0,0,0,.35)'; this.ctx.fillRect(0, 0, this.W, this.H);
    const speed = 0.6 + Math.sin(t * 0.5) * 0.2;
    for (let i = 0; i < this.stars.length; i++) {
      const st = this.stars[i]; st.z -= speed * 0.012;
      if (st.z <= 0.02) { st.x = (Math.random() - 0.5) * 2; st.y = (Math.random() - 0.5) * 2; st.z = 1; }
      const sx = this.W / 2 + (st.x / st.z) * this.W / 2; const sy = this.H / 2 + (st.y / st.z) * this.H / 2;
      if (sx < -20 || sx > this.W + 20 || sy < -20 || sy > this.H + 20) continue;
      const size = (1 - st.z) * 3 + 0.8; const alpha = 1 - st.z; const hue = (200 + (1 - st.z) * 200) % 360;
      this.ctx.fillStyle = `hsla(${hue},100%,75%,${alpha})`; this.ctx.fillRect(sx, sy, size, size);
    }
  }

  drawLava(t) {
    this.ctx.fillStyle = '#0a0014'; this.ctx.fillRect(0, 0, this.W, this.H); this.ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const a = t * 0.6 + i * 1.05; const x = this.W / 2 + Math.cos(a * 0.9 + i) * this.W * 0.3; const y = this.H / 2 + Math.sin(a * 1.2 + i * 0.7) * this.H * 0.3;
      const r = 42 + Math.sin(t * 1.5 + i) * 18; const hue = (t * 45 + i * 52) % 360;
      const g = this.ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, this.hsl(hue, 100, 60, 0.95)); g.addColorStop(0.6, this.hsl(hue, 100, 45, 0.5)); g.addColorStop(1, this.hsl(hue, 100, 40, 0));
      this.ctx.fillStyle = g; this.ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    this.ctx.globalCompositeOperation = 'source-over';
  }

  drawMatrix() {
    this.ctx.fillStyle = 'rgba(0,0,0,.09)'; this.ctx.fillRect(0, 0, this.W, this.H);
    this.ctx.font = '9px monospace';
    const mChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789';
    for (let i = 0; i < this.mDrops.length; i++) {
      const ch = mChars.charAt(Math.floor(Math.random() * mChars.length)); const y = this.mDrops[i];
      this.ctx.fillStyle = '#cfffd0'; this.ctx.fillText(ch, i * 8, y);
      this.ctx.fillStyle = '#0f0'; this.ctx.fillText(mChars.charAt(Math.floor(Math.random() * mChars.length)), i * 8, y - 8);
      this.mDrops[i] += 3.5; if (this.mDrops[i] > this.H + 20 && Math.random() > 0.96) this.mDrops[i] = 0;
    }
  }

  // --- Lógica del TV ---
  updateOSD() {
    const n = String(this.current + 1).padStart(2, '0');
    if (this.osdEl) this.osdEl.innerHTML = `CH ${n} <small>${this.channels[this.current].name}</small>`;
    if (this.indEl) this.indEl.textContent = `CH ${n}`;
  }

  changeChannel(dir = 1) {
    if (this.changing) return;
    this.changing = true;
    this.current = (this.current + dir + this.channels.length) % this.channels.length;
    this.updateOSD();
    if (this.retroTv) this.retroTv.classList.add('is-changing');
    if (this.dialEl) this.dialEl.style.transform = `rotate(${this.current * 30}deg)`;

    setTimeout(() => {
      if (this.retroTv) this.retroTv.classList.remove('is-changing');
      this.changing = false; this.lastSwitch = performance.now();
    }, 220);
  }

  loop(now) {
    if (!this.isTvVisible) return;
    if (this.reduce && now - this.lastFrame < 500) { requestAnimationFrame(this.loop.bind(this)); return; }
    this.lastFrame = now;
    this.ctx.fillStyle = '#000'; this.ctx.fillRect(0, 0, this.W, this.H);

    try { this.channels[this.current].draw(now / 1000); } catch (e) {}

    if (!this.changing && !this.reduce && now - this.lastSwitch > this.channelDuration) {
      this.changeChannel(1);
    }
    requestAnimationFrame(this.loop.bind(this));
  }

  initObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isTvVisible = true;
          this.lastFrame = performance.now();
          requestAnimationFrame(this.loop.bind(this));
        } else {
          this.isTvVisible = false;
        }
      });
    }, { threshold: 0.1 });

    if (this.retroTv) observer.observe(this.retroTv);
  }

  initDOMEvents() {
    if (this.canvas) {
      this.canvas.setAttribute('tabindex', '0');
      this.canvas.setAttribute('role', 'button');
      this.canvas.addEventListener('click', () => this.changeChannel(1));
      this.canvas.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.changeChannel(1);
        }
      });
    }
    if (this.dialEl) {
      this.dialEl.addEventListener('click', () => this.changeChannel(1));
      this.dialEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.changeChannel(1); }
      });
    }
  }
}