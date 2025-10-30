function fastCos(x) {
    x = Math.abs(x) % (2 * Math.PI);
    if (2 * x > Math.PI) return -fastCos(x - Math.PI);
    const x2 = x * x / 2;
    return 1 - x2 * (1 - x2 / 6);
}

(function initWaveOverlay() {
    function createAnimatedDecoration(el, stroke) {
        el.style.width = "100px"; // Make sure the width is fixed at 100px
        const namespace = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(namespace, 'svg');
        const path = document.createElementNS(namespace, 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', stroke);
        path.setAttribute('stroke-width', '5');
        svg.appendChild(path);
        el.appendChild(svg);

        let p = Math.random() * 2 * Math.PI;
        function draw() {
            const h = el.getBoundingClientRect().height;
            svg.setAttribute('viewBox', `0 0 100 ${h}`);

            const s = 1 / 64; // Step size; smaller value means a smoother wave, but more CPU and memory usage
            let d = `M 50 0`;
            for (let i = s; i <= 1; i += s) d += `L ${50 + 50 * i * fastCos(9 * i + p)} ${i * h}`;
            path.setAttribute('d', d);

            p += 1 / 16;
            return requestAnimationFrame(draw);
        }

        const rafId = draw();
        return { stop() { cancelAnimationFrame(rafId); } };
    }

    const animHandles = [ // Create animated decorations for left/right
        createAnimatedDecoration(document.getElementById('left-decoration'), 'purple'),
        createAnimatedDecoration(document.getElementById('right-decoration'), 'orange')
    ];

    // Stop animations on unload to avoid dangling RAFs
    window.addEventListener('beforeunload', () => animHandles.forEach(h => h.stop()));
})();

function handleScrollReveal() { // Simple scroll reveal effect
    const revDis = 50; // px before element enters viewport
    document.querySelectorAll('.reveal').forEach(rev => {
        const rect = rev.getBoundingClientRect();
        rev.classList.toggle('visible', window.innerHeight - rect.top > revDis && rect.bottom > revDis);
    });
}

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);