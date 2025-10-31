// Commented gist for fast cosine: https://gist.github.com/dorythecat/3244d3c87a9a906dd8e595b46262e03c
const facMap = new Map();
function cosTaylor(x, n = 2) {
    const x2 = x * x;
    let sum = 1, term = 1;
    for (let i = 2; i <= 2 * n; i += 2) {
        if (!facMap.has(i)) facMap.set(i, i * i - i);
        term *= -x2 / facMap.get(i);
        sum += term;
    } return sum;
}

function fastCos(x, n = 2) {
    x %= 2 * Math.PI;
    if (2 * x > Math.PI) return -fastCos(x - Math.PI);
    return cosTaylor(x,n);
}

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

    let p = Math.random();
    function draw() {
        const h = el.getBoundingClientRect().height;
        svg.setAttribute('viewBox', `0 0 100 ${h}`);

        // Step size; smaller value means a smoother wave, but more CPU and memory usage
        const s = 1 / 32;
        let d = `M 50 0`;
        for (let i = s; i < 1; i += s) d += `L ${50 + 50 * i * fastCos(9 * i + p)} ${i * h}`;
        path.setAttribute('d', d);

        p += 1 / 16;
        return requestAnimationFrame(draw);
    }

    const rafId = draw();
    return { stop() { cancelAnimationFrame(rafId); } };
}

function handleScrollReveal() {
    const revDis = 50; // px before element enters viewport
    document.querySelectorAll('.reveal').forEach(rev => {
        const rec = rev.getBoundingClientRect();
        rev.classList.toggle('visible', window.innerHeight - rec.top > revDis && rec.bottom > revDis);
    });
}

const animHandles = [
    createAnimatedDecoration(document.getElementById('left-decoration'), 'purple'),
    createAnimatedDecoration(document.getElementById('right-decoration'), 'orange')
];

window.addEventListener('beforeunload', () => animHandles.forEach(h => h.stop()));
window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('load', handleScrollReveal);