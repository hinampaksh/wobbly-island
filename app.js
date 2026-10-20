/**
 * WOBBLY ISLAND · KINETIC HORIZONTAL STORYBOOK ENGINE
 * 1. 6-Layer GPU Parallax & Velocity-Reactive Submarine Physics
 * 2. Web Audio API Cartoon Sound Synthesizer (0 KB External Audio Bloat)
 * 3. Retro Toon-TV Channel Flipper & Passport Stamp Booth
 * 4. Zero-CLS In-Place Content Hydration from content.json
 */

(function () {
  const runwayDriver = document.getElementById('runway-driver');
  const worldTrack = document.getElementById('world-track');
  const layerSky = document.getElementById('layer-sky');
  const layerClouds = document.getElementById('layer-clouds');
  const layerMountains = document.getElementById('layer-mountains');
  const layerFlora = document.getElementById('layer-flora');
  const spinningSun = document.getElementById('spinning-sun');
  const subVessel = document.getElementById('sub-vessel');
  const subPropeller = document.getElementById('sub-propeller');
  const waypoints = document.querySelectorAll('.map-waypoint');

  let lastScrollY = window.scrollY;
  let currentVelocity = 0;
  let propellerAngle = 0;

  // ==========================================================================
  // 1. MULTI-LAYER PARALLAX & VELOCITY TILT LOOP
  // ==========================================================================
  function updateParallaxStage() {
    if (!runwayDriver || !worldTrack) return;

    const maxScrollY = Math.max(1, runwayDriver.scrollHeight - window.innerHeight);
    const scrollY = Math.max(0, Math.min(window.scrollY, maxScrollY));
    const progress = scrollY / maxScrollY;

    // Calculate scroll velocity for submarine pitch/tilt
    const deltaY = scrollY - lastScrollY;
    lastScrollY = scrollY;
    currentVelocity = Math.max(-22, Math.min(22, deltaY * 0.35));
    propellerAngle += Math.abs(deltaY) * 1.8 + 4;

    // Maximum horizontal travel distance for main world track
    const maxWorldTranslate = Math.max(0, worldTrack.scrollWidth - window.innerWidth);

    // GPU-accelerated 3D translations across all 5 moving depth planes
    const worldX = -progress * maxWorldTranslate;
    worldTrack.style.transform = `translate3d(${worldX}px, 0, 0)`;

    if (layerSky) {
      layerSky.style.transform = `translate3d(${worldX * 0.16}px, 0, 0)`;
    }
    if (layerClouds) {
      layerClouds.style.transform = `translate3d(${worldX * 0.34}px, 0, 0)`;
    }
    if (layerMountains) {
      layerMountains.style.transform = `translate3d(${worldX * 0.55}px, 0, 0)`;
    }
    if (layerFlora) {
      layerFlora.style.transform = `translate3d(${worldX * 1.48}px, 0, 0)`;
    }

    // Rotate the smiling sun as you travel across the island
    if (spinningSun) {
      spinningSun.style.transform = `rotate(${progress * 540}deg)`;
    }

    // Submarine moves horizontally across bottom viewport and pitches nose with velocity
    if (subVessel) {
      const subTravelX = progress * (window.innerWidth * 0.62);
      const bobY = Math.sin(progress * Math.PI * 10) * 8;
      subVessel.style.transform = `translate3d(${subTravelX}px, ${bobY}px, 0) rotate(${currentVelocity * 0.65}deg)`;
    }
    if (subPropeller) {
      subPropeller.style.transform = `rotate(${propellerAngle}deg)`;
    }

    // Update active HUD waypoint pill (Hover-Active Mirroring)
    const activeZoneIndex = Math.min(4, Math.floor(progress * 5 + 0.15));
    waypoints.forEach((btn, idx) => {
      if (idx === activeZoneIndex) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });
  }

  // Smooth spring decay for submarine tilt when scrolling stops
  setInterval(() => {
    if (Math.abs(currentVelocity) > 0.2) {
      currentVelocity *= 0.75;
      updateParallaxStage();
    }
  }, 50);

  window.addEventListener('scroll', updateParallaxStage, { passive: true });
  window.addEventListener('resize', updateParallaxStage, { passive: true });
  updateParallaxStage();

  // Horizontal Trackpad / Shift-Wheel Direct Support
  window.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      window.scrollBy({ top: e.deltaX, behavior: 'instant' });
    }
  }, { passive: true });

  // ==========================================================================
  // 2. WAYPOINT NAVIGATION JUMPER
  // ==========================================================================
  window.jumpToZone = function (zoneIndex) {
    playToonSound('whistle');
    const maxScrollY = Math.max(1, runwayDriver.scrollHeight - window.innerHeight);
    const targetRatios = [0, 0.23, 0.50, 0.76, 0.99];
    const ratio = targetRatios[zoneIndex] ?? 0;
    window.scrollTo({
      top: maxScrollY * ratio,
      behavior: 'smooth'
    });
  };

  // ==========================================================================
  // 3. WEB AUDIO API CARTOON SYNTHESIZER (0 KB External Audio Files)
  // ==========================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playToonSound = function (type) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'boing') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.14);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.28);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.42);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'honk') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.setValueAtTime(310, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.36);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'whistle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(1180, now + 0.26);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === 'bubble') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(780, now + 0.09);
        osc.frequency.setValueAtTime(360, now + 0.11);
        osc.frequency.linearRampToValueAtTime(920, now + 0.22);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'zap') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(980, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
        gain.gain.setValueAtTime(0.26, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'party') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554, now + 0.08);
        osc.frequency.setValueAtTime(659, now + 0.16);
        osc.frequency.setValueAtTime(880, now + 0.24);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.42);
        osc.start(now);
        osc.stop(now + 0.42);
      }
    } catch (_) {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  };

  // ==========================================================================
  // 4. INTERACTIVE CHARACTERS, SUBMARINE, TV CHANNELS & CONFETTI CANNON
  // ==========================================================================
  window.triggerSubmarineHorn = function () {
    playToonSound('honk');
    if (subVessel) {
      subVessel.classList.add('boinging');
      setTimeout(() => subVessel.classList.remove('boinging'), 1400);
    }
    burstCartoonShapes(window.innerWidth * 0.18, window.innerHeight * 0.78);
  };

  window.boingCharacterCard = function (cardEl, soundType) {
    playToonSound(soundType || 'boing');
    cardEl.classList.remove('is-boinging');
    void cardEl.offsetWidth; // Reflow to restart rubber-band animation
    cardEl.classList.add('is-boinging', 'show-speech');
    const rect = cardEl.getBoundingClientRect();
    burstCartoonShapes(rect.left + rect.width / 2, rect.top + 60);
    setTimeout(() => cardEl.classList.remove('show-speech'), 2200);
  };

  // Retro Toon-TV Episode Database
  let episodesList = [
    {
      ch: 'CH 01',
      osd: '📺 CH 01 · MARMALADE GEYSER',
      title: 'The Great Marmalade Geyser',
      desc: 'Barnaby accidentally plugs his toaster backpack into Mount Fizzy-Pop, turning the entire lagoon into warm strawberry jam!',
      filter: 'saturate(1.3) hue-rotate(0deg)'
    },
    {
      ch: 'CH 02',
      osd: '📺 CH 02 · TICKLE-CRABS',
      title: 'Attack of the Tickle-Crabs',
      desc: "A swarm of neon disco crabs steals Captain Pip's favorite compass. Only Professor Squish's bassoon solo can save the day!",
      filter: 'saturate(1.6) hue-rotate(110deg)'
    },
    {
      ch: 'CH 03',
      osd: '📺 CH 03 · CLOUD RACE',
      title: 'The Upside-Down Cloud Race',
      desc: 'Gravity flips upside down at noon! The crew must race flying bathtubs through the Cotton Candy Canyon before dinner.',
      filter: 'saturate(1.5) hue-rotate(240deg)'
    }
  ];

  let currentChIndex = 0;
  let knobRotation = 0;

  window.switchToonChannel = function (index, btnEl) {
    playToonSound('zap');
    currentChIndex = index;
    const ep = episodesList[index] || episodesList[0];

    const osd = document.getElementById('tv-osd-label');
    const title = document.getElementById('ep-title');
    const desc = document.getElementById('ep-desc');
    const video = document.getElementById('toon-tv-video');
    const knob = document.getElementById('tv-knob');

    if (osd) osd.textContent = ep.osd;
    if (title) title.textContent = ep.title;
    if (desc) desc.textContent = ep.desc;
    if (video) {
      video.style.filter = ep.filter;
      video.style.transform = 'scale(1.06)';
      setTimeout(() => { video.style.transform = 'scale(1)'; }, 220);
    }

    knobRotation += 120;
    if (knob) knob.style.transform = `rotate(${knobRotation}deg)`;

    document.querySelectorAll('.ch-btn').forEach((b, i) => {
      b.classList.toggle('active', i === index);
    });
  };

  window.cycleNextChannel = function () {
    const next = (currentChIndex + 1) % episodesList.length;
    const btns = document.querySelectorAll('.ch-btn');
    switchToonChannel(next, btns[next]);
  };

  // Soundboard Gummy Pads
  window.triggerSoundPad = function (padEl, soundType, statusText, fizzPct) {
    playToonSound(soundType);
    padEl.classList.add('pressed');
    setTimeout(() => padEl.classList.remove('pressed'), 180);

    const readout = document.getElementById('factory-readout');
    const fizzBar = document.getElementById('fizz-bar');
    if (readout) readout.textContent = statusText;
    if (fizzBar) fizzBar.style.width = `${fizzPct}%`;

    const rect = padEl.getBoundingClientRect();
    burstCartoonShapes(rect.left + rect.width / 2, rect.top + 20);
  };

  // Passport Stamp Finale
  window.stampPassport = function () {
    playToonSound('party');
    const input = document.getElementById('explorer-name');
    const card = document.getElementById('passport-card');
    const confirm = document.getElementById('passport-confirmation');
    const name = (input && input.value.trim()) ? input.value.trim().toUpperCase() : 'CAPTAIN WOBBLER';

    if (card) card.classList.add('is-stamped');
    if (confirm) {
      confirm.textContent = `🎉 OFFICIAL STAMP GRANTED FOR EXPLORER ${name}! WELCOME ABOARD!`;
    }
    const rect = card.getBoundingClientRect();
    burstCartoonShapes(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  // Pure SVG / DOM Cartoon Particle Burst
  function burstCartoonShapes(originX, originY) {
    const colors = ['#FF542E', '#00D67F', '#7B3FE4', '#FFD41F', '#FF499E', '#00CCF5'];
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('div');
      const size = Math.floor(Math.random() * 14) + 10;
      dot.style.position = 'fixed';
      dot.style.left = `${originX}px`;
      dot.style.top = `${originY}px`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.background = colors[i % colors.length];
      dot.style.border = '2.5px solid #1A142D';
      dot.style.borderRadius = i % 2 === 0 ? '50%' : '4px';
      dot.style.zIndex = '999';
      dot.style.pointerEvents = 'none';
      dot.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s ease';
      document.body.appendChild(dot);

      const angle = (Math.PI * 2 * i) / 12;
      const dist = 50 + Math.random() * 80;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - 30;

      requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${Math.random() * 260}deg) scale(0.3)`;
        dot.style.opacity = '0';
      });
      setTimeout(() => dot.remove(), 800);
    }
  }

  // ==========================================================================
  // 5. ZERO-CLS IN-PLACE HYDRATION FROM CONTENT.JSON
  // ==========================================================================
  fetch('content.json')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data) return;
      if (data.nav && data.nav.brand) {
        const el = document.getElementById('nav-brand-text');
        if (el) el.textContent = data.nav.brand;
      }
      if (data.hero) {
        const subtitle = document.getElementById('hero-subtitle');
        if (subtitle && data.hero.subtitle) subtitle.textContent = data.hero.subtitle;
      }
      if (data.theater && Array.isArray(data.theater.episodes)) {
        episodesList = data.theater.episodes.map((ep, idx) => ({
          ch: ep.ch || `CH 0${idx + 1}`,
          osd: `📺 ${ep.ch || 'CH 0' + (idx + 1)} · ${ep.title.toUpperCase().slice(0, 18)}`,
          title: ep.title,
          desc: ep.desc,
          filter: idx === 0 ? 'saturate(1.3) hue-rotate(0deg)' : idx === 1 ? 'saturate(1.6) hue-rotate(110deg)' : 'saturate(1.5) hue-rotate(240deg)'
        }));
      }
    })
    .catch(() => {});
})();
