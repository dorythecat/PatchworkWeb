const leftDecoration = document.getElementById('left-decoration');
const rightDecoration = document.getElementById('right-decoration');

// Ensure decorations and svg overlay are created and updated to cover both sides
(function initWaveOverlay() {
    // Create an animated sine stroke inside a decoration element
    function createAnimatedDecoration(el, stroke, cycles) {
        const decSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const decPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        decPath.setAttribute('fill', 'none');
        decPath.setAttribute('stroke', stroke);
        decPath.setAttribute('stroke-width', '5');
        decSvg.appendChild(decPath);
        el.appendChild(decSvg);

        const cyc = 2 * Math.PI * cycles;
        let phase = 2 * Math.PI * Math.random();
        let rafId = null;

        function draw() {
            const rect = el.getBoundingClientRect();
            const w = Math.max(40, rect.width || 120);
            const w2 = w / 2;
            const h = Math.max(24, rect.height || 80);

            // keep svg coordinate system in element size
            decSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);

            // For vertical waves, amplitude should fit within element width
            const amp = w2 > 28 ? w2 - 4 : 24;

            // Build the path down the element height (top-to-bottom)
            let d = '';
            for (let i = 0; i < 1; i += 1 / Math.max(40, h >> 1))
                d += (i === 0 ? 'M' : 'L') + `${w2 + amp * Math.sin(cyc * i + phase) * i} ${i * h}`;
            decPath.setAttribute('d', d);

            // phase motion for animation
            phase += Math.random() / 10;

            // Schedule next frame
            rafId = requestAnimationFrame(draw);
        }

        // Start animation
        draw();

        // Return a handle to stop later if needed
        return { stop() { if (rafId) cancelAnimationFrame(rafId); } };
    }

    // Create animated decorations for left/right
    const animHandles = [
        createAnimatedDecoration(leftDecoration, 'purple', Math.random()),
        createAnimatedDecoration(rightDecoration, 'orange', Math.random())
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