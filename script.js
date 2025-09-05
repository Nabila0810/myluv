// --- SETUP DASAR ---
const canvas = document.getElementById('magicCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];

// --- VARIABEL KONTROL ---
let isFormingFinale = false;
const finaleTimeout = 12000;
let finaleTextOpacity = 0;

const emitter = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    angle: 0,
    speed: 0.08,
    growth: 0.2
};

const mouse = {
    x: undefined,
    y: undefined
};

// --- KELAS PARTIKEL ---
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.size = Math.random() * 3 + 1;
        const pinkHue = 300 + (Math.random() * 50);
        this.color = `hsl(${pinkHue}, 100%, 70%)`;
        this.lifespan = Math.random() * 60 + 40;
        this.initialLifespan = this.lifespan;
        this.targetX = undefined;
        this.targetY = undefined;
        this.ease = 0.05;
        this.friction = 0.95;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = isFormingFinale ? 1 : this.lifespan / this.initialLifespan;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
    }

    update() {
        if (isFormingFinale) {
            this.vx += (this.targetX - this.x) * this.ease;
            this.vy += (this.targetY - this.y) * this.ease;
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x += this.vx;
            this.y += this.vy;
        } else {
            this.x += this.vx;
            this.y += this.vy;
            this.lifespan -= 1;
        }
    }
}

// --- FUNGSI-FUNGSI UTAMA ---
function startFinale() {
    isFormingFinale = true;
    const scale = Math.min(canvas.width, canvas.height) * 0.03;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2.2;
    for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        const t = (i / particlesArray.length) * 2 * Math.PI;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        p.targetX = x * scale + centerX;
        p.targetY = y * scale + centerY;
    }
}

function drawFinaleText() {
    if (finaleTextOpacity < 1) {
        finaleTextOpacity += 0.01;
    }
    ctx.globalAlpha = finaleTextOpacity;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff69b4';
    ctx.shadowBlur = 20;
    ctx.font = "60px 'Great Vibes', cursive";
    ctx.textAlign = 'center';
    const textYPosition = canvas.height / 2.2;
    ctx.fillText("I Love You", canvas.width / 2, textYPosition);
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
}

function animate() {
    ctx.fillStyle = 'rgba(74, 13, 51, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!isFormingFinale) {
        emitter.angle += emitter.speed;
        emitter.radius += emitter.growth;
        emitter.x = canvas.width / 2 + emitter.radius * Math.cos(emitter.angle);
        emitter.y = canvas.height / 2 + emitter.radius * Math.sin(emitter.angle);
        if (particlesArray.length < 1500) {
            for (let i = 0; i < 3; i++) {
                particlesArray.push(new Particle(emitter.x, emitter.y));
            }
        }
        if (mouse.x && particlesArray.length < 1500) {
            for (let i = 0; i < 2; i++) {
                particlesArray.push(new Particle(mouse.x, mouse.y));
            }
        }
    }
    
    for (let i = particlesArray.length - 1; i >= 0; i--) {
        const p = particlesArray[i];
        p.update();
        p.draw();
        if (!isFormingFinale && p.lifespan <= 0) {
            particlesArray.splice(i, 1);
        }
    }

    if (isFormingFinale) {
        drawFinaleText();
    }

    requestAnimationFrame(animate);
}

// --- EVENT LISTENERS & INISIALISASI ---
window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();
setTimeout(startFinale, finaleTimeout);