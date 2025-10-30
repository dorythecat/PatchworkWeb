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

        let p = Math.random() * 2 * Math.PI;
        function draw() { // We assume that the width is 100px and that only height varies
            const h = el.getBoundingClientRect().height;
            decSvg.setAttribute('viewBox', `0 0 100 ${h}`);

            const step = 1 / 64; // More steps = smoother wave but more CPU and memory usage
            let d = `M 50 0`;
            for (let i = step; i <= 1; i += step) d += `L ${50 + 50 * i * fastCos(9 * i + p)} ${i * h}`;
            decPath.setAttribute('d', d);

            p += 1 / 16;
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
    window.addEventListener('beforeunload', () => animHandles.forEach(h => h.stop()));
})();

// Simple scroll reveal effect
function handleScrollReveal() {
    const revDis = 50; // px before element enters viewport
    document.querySelectorAll('.reveal').forEach(rev => {
        const rect = rev.getBoundingClientRect();
        rev.classList.toggle('visible', window.innerHeight - rect.top > revDis && rect.bottom > revDis);
    });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);