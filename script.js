document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // 1. Animated Tron Grid Background
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

    const gridSize = 40; // Size of each grid cell
    const pulseSpeed = 0.05; // Speed of the glow pulse
    const pulseStrength = 0.5; // How much the glow varies

    function drawGrid(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // Calculate a pulsing opacity based on time
        const glowOpacity = Math.sin(time * pulseSpeed) * pulseStrength + (1 - pulseStrength); // From 1-pulseStrength to 1

        ctx.strokeStyle = `rgba(255, 0, 85, ${0.1 * glowOpacity})`; // CHANGED TO RED (ff0055 converted to RGB)
        ctx.lineWidth = 1;

        // Draw horizontal lines
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw vertical lines
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }

    function animateGrid(time) {
        drawGrid(time);
        animationFrameId = requestAnimationFrame(animateGrid);
    }

    animateGrid(0); // Start the animation

    // ------------------------------------
    // 2. Active Navigation Link Highlighting
    // ------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.tron-section');

    function highlightNavLink() {
        let currentActive = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust offset to trigger highlight a bit before the section fully enters view
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
    highlightNavLink(); // Call on load to set initial active link if scrolled

    // ------------------------------------
    // 3. Dynamic Footer Year
    // ------------------------------------
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
