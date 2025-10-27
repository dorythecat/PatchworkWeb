const leftDecoration = document.getElementById('left-decoration');
const rightDecoration = document.getElementById('right-decoration');

// Ensure decorations and svg overlay are created and updated to cover both sides
(function initWaveOverlay() {
    // Create svg overlay (full page)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('stroke', 'rgba(0,0,0,0.5)');
    pathEl.setAttribute('stroke-width', '5');
    pathEl.setAttribute('stroke-linecap', 'round');
    pathEl.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(pathEl);
    document.body.appendChild(svg);

    // Create an animated sine stroke inside a decoration element
    function createAnimatedDecoration(el, opts = {}) {
        if (!el) return null;
        // Ensure the element can contain positioned children

        const decSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const decPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        decPath.setAttribute('fill', 'none');
        decPath.setAttribute('stroke', opts.stroke || 'rgba(0,0,0,0.5)');
        decPath.setAttribute('stroke-width', opts.strokeWidth || '5');
        decPath.setAttribute('stroke-linecap', 'round');
        decPath.setAttribute('stroke-linejoin', 'round');
        decSvg.appendChild(decPath);
        el.appendChild(decSvg);

        let phase = Math.random() * Math.PI * 2;
        let rafId = null;

        function draw() {
            const rect = el.getBoundingClientRect();
            const w = Math.max(40, rect.width || 120);
            const h = Math.max(24, rect.height || 80);

            // keep svg coordinate system in element size
            decSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);

            // For vertical waves, amplitude should fit within element width
            const amplitude = Math.min((w / 2) - 4, Math.min(24, w * 0.45));
            const segments = Math.max(40, Math.floor(h / 2));

            // Build the path down the element height (top-to-bottom)
            let d = `M ${w / 2 + amplitude * Math.sin(phase)} 0`;
            for (let i = h / segments; i <= h; i += h / segments)
                d += `L ${w / 2 + amplitude * Math.sin(2 * Math.PI * (opts.cycles || 1) * i + phase)} ${i * h}`;

            decPath.setAttribute('d', d);

            // phase motion for animation
            phase += opts.speed || 0.06;

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
        createAnimatedDecoration(leftDecoration, { stroke: 'purple', cycles: Math.random(), speed: Math.random() / 10 }),
        createAnimatedDecoration(rightDecoration, { stroke: 'orange', cycles: Math.random(), speed: Math.random() / 10 })
    ];

    // Stop animations on unload to avoid dangling RAFs
    window.addEventListener('beforeunload', () => {
        animHandles.forEach(h => { if (h && typeof h.stop === 'function') h.stop(); });
    });
})();

const showcases = document.querySelectorAll('.showcase');
showcases.forEach(showcase => {
    for (let i = 0; i < showcase.children.length; i++) showcase.children[i].classList.add('reveal', 'visible');
});

// Simple scroll reveal effect
function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 100; // px before element enters viewport

    reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        const elementBottom = reveal.getBoundingClientRect().bottom;

        if (elementTop < windowHeight - revealPoint && elementBottom > revealPoint) reveal.classList.add('visible');
        else reveal.classList.remove('visible');
    });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);