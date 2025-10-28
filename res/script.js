const leftDecoration = document.getElementById('left-decoration');
const rightDecoration = document.getElementById('right-decoration');

// Ensure decorations and svg overlay are created and updated to cover both sides
(function initWaveOverlay() {
    function createAnimatedDecoration(el, stroke) {
        const decSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const decPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        decPath.setAttribute('fill', 'none');
        decPath.setAttribute('stroke', stroke);
        decPath.setAttribute('stroke-width', '5');
        decSvg.appendChild(decPath);
        el.appendChild(decSvg);

        const cyc = Math.random();
        let phase = Math.random();
        let rafId = null;

        function draw() {
            const rect = el.getBoundingClientRect();
            const w = Math.max(40, rect.width || 120);
            const h = Math.max(24, rect.height || 80);
            decSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);

            const amp = w > 56 ? w / 2 - 4 : 24;
            let d = '';
            for (let i = 0; i < 1; i += 1 / Math.max(40, h >> 1))
                d += (i === 0 ? 'M' : 'L') + `${(w + amp * Math.sin(cyc * i + phase) * i) / 2} ${i * h}`;
            decPath.setAttribute('d', d);

            phase += Math.random() / 9;
            rafId = requestAnimationFrame(draw);
        }

        draw();
        return { stop() { if (rafId) cancelAnimationFrame(rafId); } };
    }

    // Create animated decorations for left/right
    const animHandles = [
        createAnimatedDecoration(leftDecoration, 'purple'),
        createAnimatedDecoration(rightDecoration, 'orange')
    ];

    // Stop animations on unload to avoid dangling RAFs
    window.addEventListener('beforeunload', () => {
        animHandles.forEach(h => { if (h && typeof h.stop === 'function') h.stop(); });
    });
})();

document.querySelectorAll('.showcase').forEach(showcase => {
    for (let i = 0; i < showcase.children.length; i++) showcase.children[i].classList.add('reveal', 'visible');
});

// Simple scroll reveal effect
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 50; // px before element enters viewport

    reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        const elementBottom = reveal.getBoundingClientRect().bottom;

        if (elementTop < windowHeight - revealPoint && elementBottom > revealPoint) reveal.classList.add('visible');
        else reveal.classList.remove('visible');
    });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);