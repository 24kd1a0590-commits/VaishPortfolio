/* ==========================================================================
   GANAPATHIRAJU VAISHNAVI - PORTFOLIO INTERACTIVITY ENGINE (script.js)
   Features: Particle Canvas, Typing Effect, Modals, Live Project Simulators, 
             Scroll Spy, Copy-to-Clipboard Toast, Resume Viewer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initScrollAnimations();
  initSkillTabs();
  initProjectFilters();
  initModalSystem();
  initSimulators();
  initContactAndToast();
  initThemeAndNavbar();
});

/* --------------------------------------------------------------------------
   1. PARTICLES CONSTELLATION CANVAS
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.size = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#00f2fe' : '#7f00ff';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 15), 70);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   2. DYNAMIC TYPING EFFECT
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('hero-typing-text');
  if (!typingElement) return;

  const roles = [
    "Computer Science Engineer",
    "IoT & Embedded Wearables Developer",
    "Smart Cities AI System Researcher",
    "Data Analytics & Python Developer",
    "SIH Hackathon Finalist"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400; // Pause before typing new word
    }

    setTimeout(type, typeSpeed);
  }
  type();
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL & COUNTER ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  // Animated Counters
  const counters = document.querySelectorAll('.counter-val');
  let animated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const isDecimal = counter.getAttribute('data-decimal') === 'true';
          let count = 0;
          const duration = 2000;
          const stepTime = 30;
          const increment = target / (duration / stepTime);

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counter.textContent = isDecimal ? target.toFixed(2) : Math.floor(target);
              clearInterval(timer);
            } else {
              counter.textContent = isDecimal ? count.toFixed(2) : Math.floor(count);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObserver.observe(heroStats);

  // Skill Bar Animations on Scroll
  const skillBars = document.querySelectorAll('.skill-progress');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target.getAttribute('data-progress');
        entry.target.style.width = progress + '%';
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => skillObserver.observe(bar));
}

/* --------------------------------------------------------------------------
   4. SKILL TAB SWITCHER
   -------------------------------------------------------------------------- */
function initSkillTabs() {
  const tabs = document.querySelectorAll('.skill-tab-btn');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');
      cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. PROJECT FILTERING SYSTEM
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. MODAL SYSTEM
   -------------------------------------------------------------------------- */
function initModalSystem() {
  const modals = document.querySelectorAll('.modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modals.forEach(m => m.classList.remove('active'));
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Keypress ESC to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => m.classList.remove('active'));
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

/* --------------------------------------------------------------------------
   7. LIVE PROJECT INTERACTIVE SIMULATORS
   -------------------------------------------------------------------------- */
function initSimulators() {
  // 1. Health Patch Simulator
  let patchInterval = null;
  const startPatchBtn = document.getElementById('sim-patch-start');
  const bpmVal = document.getElementById('sim-patch-bpm');
  const tempVal = document.getElementById('sim-patch-temp');
  const statusVal = document.getElementById('sim-patch-status');

  if (startPatchBtn) {
    startPatchBtn.addEventListener('click', () => {
      if (patchInterval) {
        clearInterval(patchInterval);
        patchInterval = null;
        startPatchBtn.textContent = 'Start Live Telemetry';
        statusVal.textContent = 'STANDBY';
        statusVal.style.color = '#94a3b8';
      } else {
        startPatchBtn.textContent = 'Stop Telemetry';
        statusVal.textContent = 'MONITORING ACTIVE (MAX30102)';
        statusVal.style.color = '#00f2fe';
        
        patchInterval = setInterval(() => {
          let bpm = Math.floor(68 + Math.random() * 14);
          let temp = (36.5 + Math.random() * 0.8).toFixed(1);
          bpmVal.textContent = bpm + ' BPM';
          tempVal.textContent = temp + ' °C';
        }, 1200);
      }
    });
  }

  // 2. Smart City Ambulance Dispatch Simulator
  const alertBtn = document.getElementById('sim-city-alert');
  const cityLog = document.getElementById('sim-city-log');
  if (alertBtn && cityLog) {
    alertBtn.addEventListener('click', () => {
      const timestamp = new Date().toLocaleTimeString();
      const logs = [
        `[${timestamp}] 🚨 Emergency Ambulance Request received at Hub-4.`,
        `[${timestamp}] 🟢 Traffic Signals along Route 14 set to Green Priority.`,
        `[${timestamp}] 💨 Air Quality Index (AQI) sensor alert: PM2.5 normalized.`,
        `[${timestamp}] 📱 Phone alert dispatched to emergency responders.`
      ];
      cityLog.innerHTML = logs.map(l => `<div style="margin-bottom:4px;color:#00f2fe;">${l}</div>`).join('');
    });
  }

  // 3. Route Nova Load Matching Simulator
  const matchBtn = document.getElementById('sim-route-match');
  const routeResult = document.getElementById('sim-route-result');
  if (matchBtn && routeResult) {
    matchBtn.addEventListener('click', () => {
      const origin = document.getElementById('sim-route-origin').value;
      const dest = document.getElementById('sim-route-dest').value;
      routeResult.innerHTML = `
        <div style="background:rgba(0,242,254,0.1); border:1px solid #00f2fe; padding:1rem; border-radius:8px; margin-top:1rem;">
          <h4 style="color:#00f2fe; margin-bottom:0.5rem;"><i class="fas fa-route"></i> Optimal Load Match Found!</h4>
          <p><strong>Route:</strong> ${origin} ➔ ${dest}</p>
          <p><strong>Consolidated Capacity:</strong> 94% (Combined 2 Partial Loads)</p>
          <p><strong>Trips Saved:</strong> 1 Vehicle Trip Avoided</p>
          <p><strong>FastAPI Backend Latency:</strong> 28ms</p>
        </div>
      `;
    });
  }
}

/* --------------------------------------------------------------------------
   8. CONTACT FORM, COPY TO CLIPBOARD & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function initContactAndToast() {
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  window.showToast = function(msg) {
    if (!toast) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };

  // Copy buttons
  const copyBtns = document.querySelectorAll('.contact-copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      });
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      showToast(`Thank you, ${name}! Your message has been sent successfully.`);
      contactForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   9. THEME SWITCHER & NAVBAR SCROLL SPY
   -------------------------------------------------------------------------- */
function initThemeAndNavbar() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const navbar = document.querySelector('.navbar');
  const backToTop = document.getElementById('back-to-top');

  // Theme Toggle
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      themeBtn.querySelector('i').className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // Scroll Spy & Navbar Background Change
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Scroll Spy for Nav Links
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
