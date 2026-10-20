/**
 * Website Chúc Mừng 20/10 — Dành tặng Thúy Hường từ Sơn
 * Tông màu: Hồng Pastel dịu nhẹ
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CONFIGURATION (CẤU HÌNH)
  // ==========================================
  const CONFIG = {
    // Ngày bắt đầu yêu: 10/04/2026
    loveStartDate: '2026-04-10T00:00:00',
    recipientName: 'Thúy Hường',
    senderName: 'Sơn'
  };

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const welcomeScreen = document.getElementById('welcome-screen');
  const envelope = document.getElementById('envelope');
  const openGiftBtn = document.getElementById('open-gift-btn');
  const mainContent = document.getElementById('main-content');
  const musicControl = document.getElementById('music-control');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const bgMusic = document.getElementById('bg-music');
  const sendLoveBtn = document.getElementById('send-love-btn');
  const openSecretModalBtn = document.getElementById('open-secret-letter-btn');
  const closeSecretModalBtn = document.getElementById('close-modal-btn');
  const secretModal = document.getElementById('secret-modal');

  let isMusicPlaying = false;

  // ==========================================
  // 1. CHUỖI SỰ KIỆN MỞ QUÀ
  // ==========================================
  function openEnvelopeSequence() {
    envelope.classList.add('open');
    playAudio();

    setTimeout(() => {
      welcomeScreen.classList.add('fade-out');
      mainContent.classList.remove('hidden');
      musicControl.classList.remove('hidden');
      
      initLoveTimer();
      createHeartBurst();
    }, 1200);
  }

  envelope.addEventListener('click', openEnvelopeSequence);
  openGiftBtn.addEventListener('click', openEnvelopeSequence);

  // ==========================================
  // 2. PHÁT & QUẢN LÝ ÂM NHẠC
  // ==========================================
  function playAudio() {
    bgMusic.play().then(() => {
      isMusicPlaying = true;
      musicToggleBtn.classList.add('playing');
    }).catch(err => {
      console.log("Audio autoplay prevented:", err);
    });
  }

  musicToggleBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      musicToggleBtn.classList.remove('playing');
      isMusicPlaying = false;
    } else {
      playAudio();
    }
  });

  // ==========================================
  // 3. ĐỒNG HỒ ĐẾM THỜI GIAN YÊU (Tính từ 10/04/2026)
  // ==========================================
  function initLoveTimer() {
    const startDate = new Date(CONFIG.loveStartDate).getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const difference = now - startDate;

      if (difference < 0) {
        // Nếu ngày cấu hình ở tương lai
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.getElementById('days').innerText = String(days).padStart(2, '0');
      document.getElementById('hours').innerText = String(hours).padStart(2, '0');
      document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
      document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // ==========================================
  // 4. MODAL LỜI NHẮN BÍ MẬT
  // ==========================================
  openSecretModalBtn.addEventListener('click', () => secretModal.classList.remove('hidden'));
  closeSecretModalBtn.addEventListener('click', () => secretModal.classList.add('hidden'));
  secretModal.addEventListener('click', (e) => {
    if (e.target === secretModal) secretModal.classList.add('hidden');
  });

  // ==========================================
  // 5. HIỆU ỨNG CANVAS HẠT & CÁNH HOA HỒNG PASTEL
  // ==========================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height - height;
      this.size = Math.random() * 11 + 5;
      this.speedY = Math.random() * 1.4 + 0.6;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.opacity = Math.random() * 0.6 + 0.35;
      this.rotation = Math.random() * 360;
      this.spin = Math.random() * 2 - 1;
      this.type = Math.random() > 0.45 ? 'petal' : 'heart';
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) + this.speedX;
      this.rotation += this.spin;

      if (this.y > height + 20) {
        this.reset();
        this.y = -20;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        // Cánh hoa Pastel
        ctx.fillStyle = '#ff8fa3';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size, -this.size, -this.size, this.size, 0, this.size * 1.5);
        ctx.bezierCurveTo(this.size, this.size, this.size, -this.size, 0, 0);
        ctx.fill();
      } else {
        // Trái tim Hồng Pastel
        ctx.fillStyle = '#ff758f';
        ctx.beginPath();
        ctx.arc(-this.size/4, -this.size/4, this.size/4, 0, Math.PI * 2);
        ctx.arc(this.size/4, -this.size/4, this.size/4, 0, Math.PI * 2);
        ctx.lineTo(0, this.size/2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  const particlesArray = Array.from({ length: 35 }, () => new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particlesArray.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // ==========================================
  // 6. HIỆU ỨNG PHÁO TIM KHI BẤM NÚT
  // ==========================================
  function createHeartBurst() {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '🌸';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-20px';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.zIndex = '999';
        heart.style.pointerEvents = 'none';
        heart.style.transition = 'transform 3s ease-out, opacity 3s ease-out';
        
        document.body.appendChild(heart);

        setTimeout(() => {
          heart.style.transform = `translateY(-${window.innerHeight + 50}px) rotate(${Math.random() * 360}deg)`;
          heart.style.opacity = '0';
        }, 50);

        setTimeout(() => heart.remove(), 3200);
      }, i * 100);
    }
  }

  sendLoveBtn.addEventListener('click', createHeartBurst);

});

/* =========================================
   ROMANTIC EFFECTS — 20/10
   Thêm vào cuối js/script.js
========================================= */

(() => {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    // Cánh hoa hồng rơi nhẹ nhàng
    const petals = ["🌸", "🌹", "✿", "♡"];
    let petalTimer;

    function createPetal() {
        if (document.hidden) return;

        const petal = document.createElement("span");
        petal.className = "floating-petal";
        petal.textContent =
            petals[Math.floor(Math.random() * petals.length)];

        const size = 12 + Math.random() * 15;
        const duration = 9 + Math.random() * 9;

        petal.style.left = Math.random() * 100 + "vw";
        petal.style.fontSize = size + "px";
        petal.style.animationDuration = duration + "s";
        petal.style.setProperty(
            "--drift",
            (Math.random() * 180 - 90) + "px"
        );
        petal.style.setProperty(
            "--rotation",
            (180 + Math.random() * 540) + "deg"
        );

        document.body.appendChild(petal);

        window.setTimeout(() => petal.remove(), duration * 1000 + 500);
    }

    function startPetals() {
        if (petalTimer || document.hidden) return;

        createPetal();
        petalTimer = window.setInterval(createPetal, 850);
    }

    function stopPetals() {
        window.clearInterval(petalTimer);
        petalTimer = null;
    }

    startPetals();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopPetals();
        } else {
            startPetals();
        }
    });

    // Hiệu ứng trái tim bay khi nhấn nút gửi yêu thương
    const loveButton = document.getElementById("send-love-btn");

    if (loveButton) {
        loveButton.addEventListener("click", () => {
            const hearts = ["💗", "💖", "💕", "❤️", "💘"];
            const total = window.innerWidth < 600 ? 18 : 32;

            for (let i = 0; i < total; i++) {
                window.setTimeout(() => {
                    const heart = document.createElement("span");
                    heart.className = "floating-heart";
                    heart.textContent =
                        hearts[Math.floor(Math.random() * hearts.length)];

                    heart.style.left = Math.random() * 100 + "vw";
                    heart.style.fontSize = (15 + Math.random() * 22) + "px";
                    heart.style.animationDuration =
                        (2.2 + Math.random() * 1.8) + "s";

                    heart.style.setProperty(
                        "--drift",
                        (Math.random() * 160 - 80) + "px"
                    );

                    document.body.appendChild(heart);

                    window.setTimeout(() => heart.remove(), 4500);
                }, i * 65);
            }
        });
    }

    // Hiệu ứng các trái tim bung ra từ phong bì
    const giftButton = document.getElementById("open-gift-btn");
    const envelope = document.getElementById("envelope");
    const burstContainer = document.getElementById("hearts-burst");

    if (giftButton && envelope && burstContainer) {
        giftButton.addEventListener("click", () => {
            envelope.classList.add("open");

            const hearts = ["♥", "♡", "💗", "✧"];

            for (let i = 0; i < 18; i++) {
                const heart = document.createElement("span");
                const angle = (Math.PI * 2 * i) / 18;
                const distance = 65 + Math.random() * 90;

                heart.className = "burst-heart";
                heart.textContent =
                    hearts[Math.floor(Math.random() * hearts.length)];

                heart.style.setProperty(
                    "--x",
                    Math.cos(angle) * distance + "px"
                );
                heart.style.setProperty(
                    "--y",
                    Math.sin(angle) * distance + "px"
                );
                heart.style.setProperty(
                    "--rotate",
                    (Math.random() * 70 - 35) + "deg"
                );

                burstContainer.appendChild(heart);

                window.setTimeout(() => heart.remove(), 1600);
            }
        });
    }

    // Xuất hiện nhẹ nhàng khi cuộn tới từng khu vực
    const revealItems = document.querySelectorAll(
        ".love-timer-card, .photo-gallery, " +
        ".wishes-section, .footer"
    );

    if ("IntersectionObserver" in window) {
        revealItems.forEach(item => item.classList.add("reveal"));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealItems.forEach(item => observer.observe(item));
    }
})();
