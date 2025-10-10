document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // 1. Animated Tron: Ares Beacon Lines Background
    // ------------------------------------
    const canvas = document.getElementById('tronGrid');
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Set initial size

    const lines = [];
    const maxLines = 150; // Number of lines
    const lineSpeed = 0.5; // Speed of lines moving across
    const lineHeight = 1; // Thickness of lines
    const glowStrength = 0.2; // Opacity of the base lines
    const spawnRate = 3; // How often new lines are added (lower is more frequent)

    // Function to generate a random Tron red color with transparency
    function getTronRed(opacity = 1) {
        return `rgba(255, 0, 85, ${opacity})`;
    }

    class MovingLine {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.length = Math.random() * (canvas.width / 5) + (canvas.width / 10); // Random length
            this.speed = lineSpeed * (0.5 + Math.random()); // Vary speed slightly
            this.hue = 0; // Fixed red for Tron Ares
            this.brightness = 0.5 + Math.random() * 0.5; // Random brightness for subtle variation
            this.opacity = glowStrength * this.brightness; // Base opacity
            this.direction = Math.random() < 0.5 ? 1 : -1; // Random horizontal direction
            this.glowOffset = Math.random() * Math.PI * 2; // For unique glow pulse start
        }

        update() {
            this.x += this.speed * this.direction;
            // Loop lines when they go off screen
            if (this.direction === 1 && this.x > canvas.width + this.length) {
                this.x = -this.length;
            } else if (this.direction === -1 && this.x < -this.length) {
                this.x = canvas.width + this.length;
            }
        }

        draw() {
            // Calculate a pulsating opacity for extra glow effect
            const glowPulse = Math.sin(Date.now() * 0.005 + this.glowOffset) * 0.2 + 0.3; // Pulses between 0.1 and 0.5
            const currentOpacity = Math.min(1, this.opacity + glowPulse);

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.length * this.direction, this.y); // Draw line in its direction
            ctx.lineWidth = lineHeight;
            
            // Outer glow (subtle)
            ctx.shadowBlur = 10;
            ctx.shadowColor = getTronRed(0.8);
            ctx.strokeStyle = getTronRed(currentOpacity);
            ctx.stroke();

            // Inner brighter line (more prominent)
            ctx.shadowBlur = 0; // Reset shadow for inner line
            ctx.strokeStyle = getTronRed(Math.min(1, currentOpacity * 1.5)); // Brighter center
            ctx.lineWidth = lineHeight * 0.7; // Thinner inner line
            ctx.stroke();
            
            ctx.shadowBlur = 0; // Reset shadow for next draw
        }
    }

    function initLines() {
        for (let i = 0; i < maxLines; i++) {
            lines.push(new MovingLine());
        }
    }

    function animateBeacons(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // Optional: Add a very subtle, transparent overlay to create a trailing effect
        // ctx.fillStyle = 'rgba(10, 10, 15, 0.05)'; // A very slight fade out effect
        // ctx.fillRect(0, 0, canvas.width, canvas.height);


        if (lines.length < maxLines && Math.random() < 1 / spawnRate) { // Add new lines gradually
            lines.push(new MovingLine());
        }

        for (let i = 0; i < lines.length; i++) {
            lines[i].update();
            lines[i].draw();
        }

        animationFrameId = requestAnimationFrame(animateBeacons);
    }

    initLines(); // Populate initial lines
    animateBeacons(0); // Start the animation

    // ------------------------------------
    // 2. Active Navigation Link Highlighting (No changes)
    // ------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.tron-section');

    function highlightNavLink() {
        let currentActive = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                currentActive = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(currentActive)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();

    // ------------------------------------
    // 3. Dynamic Footer Year (No changes)
    // ------------------------------------
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
