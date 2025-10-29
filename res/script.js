function fastCos(x) {
    x = Math.abs(x) % (2 * Math.PI);
    if (2 * x > Math.PI) return -fastCos(x - Math.PI);
    const x2 = x * x / 2;
    return 1 - x2 * (1 - x2 / 6);
}

(function initWaveOverlay() {
    function createAnimatedDecoration(el, stroke) {
        const decSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const decPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        decPath.setAttribute('fill', 'none');
        decPath.setAttribute('stroke', stroke);
        decPath.setAttribute('stroke-width', '5');
        decSvg.appendChild(decPath);
        el.appendChild(decSvg);

        let phase = Math.random();
        function draw() {
            const r = el.getBoundingClientRect();
            decSvg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);

            let d = '';
            for (let i = 0; i <= 1; i += 1 / 64)
                d += (i === 0 ? 'M' : 'L') + `${r.width * (1 + i * fastCos(9 * i + phase)) / 2} ${i * r.height}`;
            decPath.setAttribute('d', d);

            phase += Math.random() / 9;
            return requestAnimationFrame(draw);
        }

        const rafId = draw();
        return { stop() { cancelAnimationFrame(rafId); } };
    }

    // Create animated decorations for left/right
    const animHandles = [
        createAnimatedDecoration(document.getElementById('left-decoration'), 'purple'),
        createAnimatedDecoration(document.getElementById('right-decoration'), 'orange')
    ];

    // Stop animations on unload to avoid dangling RAFs
    window.addEventListener('beforeunload', () => {
        animHandles.forEach(h => { if (h && typeof h.stop === 'function') h.stop(); });
    });
})();

document.querySelectorAll('.showcase').forEach(el =>
    [...el.children].forEach(child => child.classList.add('reveal', 'visible'))
);

// Simple scroll reveal effect
function handleScrollReveal() {
    const revDis = 50; // px before element enters viewport
    document.querySelectorAll('.reveal').forEach(rev => {
        const rect = rev.getBoundingClientRect();
        if (window.innerHeight - rect.top > revDis && rect.bottom > revDis) rev.classList.add('visible');
        else rev.classList.remove('visible');
    });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);