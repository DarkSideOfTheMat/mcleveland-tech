// Nav: add .scrolled class when page scrolls past the nav height
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── NODE GRAPH ──────────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('node-graph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Read Monokai palette from computed CSS custom properties
    const root = getComputedStyle(document.documentElement);
    const getVar = (v) => root.getPropertyValue(v).trim();

    const COLORS = {
        cyan:   getVar('--mk-cyan')   || '#66d9e8',
        pink:   getVar('--mk-pink')   || '#f92672',
        yellow: getVar('--mk-yellow') || '#e6db74',
        orange: getVar('--mk-orange') || '#fd971f',
        purple: getVar('--mk-purple') || '#ae81ff',
        green:  getVar('--mk-green')  || '#a6e22e',
        muted:  getVar('--mk-comment')|| '#75715e',
        bg:     getVar('--mk-bg')     || '#272822',
    };

    // Color pool
    const COLOR_POOL = [
        COLORS.cyan, COLORS.pink, COLORS.green,
        COLORS.purple, COLORS.yellow, COLORS.orange,
    ];

    // Shuffle helper
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Node labels
    const NODE_DEFS = [
        { label: 'Python' },         // 0
        { label: 'SQL' },            // 1
        { label: 'Go' },             // 2
        { label: 'PHP' },            // 3
        { label: 'JS' },             // 4
        { label: 'R' },              // 5
        { label: 'Pipelines' },      // 6
        { label: 'Data Modeling' },   // 7
        { label: 'Visualizations' },  // 8
    ];

    // Edges: index pairs representing connections
    const EDGES = [
        [0, 1], // Python — SQL
        [0, 5], // Python — R
        [5, 4], // R — JS
        [3, 2], // PHP — Go
        [2, 0], // Go — Python
        [0, 3], // Python — PHP
        [0, 4], // Python — JS
        [6, 7], // Pipelines — Data Modeling
        [7, 8], // Data Modeling — Visualizations
    ];

    // Assign colors: walk each connected chain, avoid neighbor repeats
    // Build adjacency list
    const adj = NODE_DEFS.map(() => []);
    for (const [a, b] of EDGES) {
        adj[a].push(b);
        adj[b].push(a);
    }
    // BFS-color each connected component
    const colored = new Array(NODE_DEFS.length).fill(null);
    for (let start = 0; start < NODE_DEFS.length; start++) {
        if (colored[start]) continue;
        const pool = shuffle(COLOR_POOL);
        let poolIdx = 0;
        const queue = [start];
        colored[start] = '?'; // mark visited
        while (queue.length) {
            const idx = queue.shift();
            const neighborColors = adj[idx].map((n) => colored[n]).filter(Boolean);
            // Pick next color from shuffled pool that isn't a neighbor's color
            let chosen = null;
            for (let tries = 0; tries < COLOR_POOL.length; tries++) {
                const candidate = pool[(poolIdx + tries) % pool.length];
                if (!neighborColors.includes(candidate)) {
                    chosen = candidate;
                    poolIdx = (poolIdx + tries + 1) % pool.length;
                    break;
                }
            }
            // Fallback if all colors used by neighbors (more nodes than colors)
            if (!chosen) {
                chosen = pool[poolIdx % pool.length];
                poolIdx++;
            }
            colored[idx] = chosen;
            NODE_DEFS[idx].color = chosen;
            for (const nb of adj[idx]) {
                if (!colored[nb] || colored[nb] === '?') {
                    if (!colored[nb]) {
                        colored[nb] = '?';
                        queue.push(nb);
                    }
                }
            }
        }
    }

    // Build a set of connected pairs for quick lookup
    const connectedPairs = new Set();
    for (const [a, b] of EDGES) {
        connectedPairs.add(a < b ? `${a}-${b}` : `${b}-${a}`);
    }

    const NODE_RADIUS = 4;
    const MOUSE_RADIUS = 100;
    const REPULSE_STRENGTH = 0.8;
    const NODE_REPULSE_RADIUS = 120;
    const NODE_REPULSE_STRENGTH = 0.12;
    const ATTRACT_STRENGTH = 0.005;
    const ATTRACT_REST_DIST = 100;
    const DAMPING = 0.96;
    const DRIFT_FORCE = 0.08;
    const EDGE_MARGIN = 40;
    const EDGE_FORCE = 0.3;

    let W, H, dpr;
    let mouse = { x: -9999, y: -9999 };
    let nodes = [];

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
        // Spawn clustered in the right side of the canvas
        const spawnX = W * 0.55;
        const spawnW = W * 0.4;
        const spawnY = H * 0.1;
        const spawnH = H * 0.5;
        nodes = NODE_DEFS.map((def) => ({
            x: spawnX + Math.random() * spawnW,
            y: spawnY + Math.random() * spawnH,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            label: def.label,
            color: def.color,
            radius: NODE_RADIUS,
        }));
    }

    function update() {
        // Node-to-node forces
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist === 0) continue;

                const key = i < j ? `${i}-${j}` : `${j}-${i}`;
                if (connectedPairs.has(key)) {
                    // Connected: attract toward rest distance
                    const delta = dist - ATTRACT_REST_DIST;
                    const force = delta * ATTRACT_STRENGTH;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    a.vx -= fx;  a.vy -= fy;
                    b.vx += fx;  b.vy += fy;
                } else if (dist < NODE_REPULSE_RADIUS) {
                    // Unconnected: repel
                    const force = (NODE_REPULSE_RADIUS - dist) / NODE_REPULSE_RADIUS * NODE_REPULSE_STRENGTH;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    a.vx += fx;  a.vy += fy;
                    b.vx -= fx;  b.vy -= fy;
                }
            }
        }

        for (const n of nodes) {
            // Random drift
            n.vx += (Math.random() - 0.5) * DRIFT_FORCE;
            n.vy += (Math.random() - 0.5) * DRIFT_FORCE;

            // Mouse repulsion
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * REPULSE_STRENGTH;
                n.vx += (dx / dist) * force;
                n.vy += (dy / dist) * force;
            }

            // Damping
            n.vx *= DAMPING;
            n.vy *= DAMPING;

            // Move
            n.x += n.vx;
            n.y += n.vy;

            // Soft edge repulsion
            if (n.x < EDGE_MARGIN) {
                n.vx += (EDGE_MARGIN - n.x) / EDGE_MARGIN * EDGE_FORCE;
            }
            if (n.x > W - EDGE_MARGIN) {
                n.vx -= (n.x - (W - EDGE_MARGIN)) / EDGE_MARGIN * EDGE_FORCE;
            }
            if (n.y < EDGE_MARGIN) {
                n.vy += (EDGE_MARGIN - n.y) / EDGE_MARGIN * EDGE_FORCE;
            }
            if (n.y > H - EDGE_MARGIN) {
                n.vy -= (n.y - (H - EDGE_MARGIN)) / EDGE_MARGIN * EDGE_FORCE;
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Draw edges
        for (const [i, j] of EDGES) {
            const a = nodes[i];
            const b = nodes[j];
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const distToMouse = Math.sqrt(
                (midX - mouse.x) ** 2 + (midY - mouse.y) ** 2
            );
            const glow = distToMouse < MOUSE_RADIUS * 1.5
                ? 0.15 + 0.25 * (1 - distToMouse / (MOUSE_RADIUS * 1.5))
                : 0.15;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = COLORS.muted;
            ctx.globalAlpha = glow;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Draw nodes
        for (const n of nodes) {
            const distToMouse = Math.sqrt(
                (n.x - mouse.x) ** 2 + (n.y - mouse.y) ** 2
            );
            const isNear = distToMouse < MOUSE_RADIUS;
            const scale = isNear ? 1.4 : 1;
            const r = n.radius * scale;

            // Glow
            if (isNear) {
                ctx.beginPath();
                ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
                ctx.fillStyle = n.color;
                ctx.globalAlpha = 0.12;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // Circle
            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
            ctx.fillStyle = n.color;
            ctx.globalAlpha = isNear ? 1 : 0.75;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Label
            ctx.font = '10px "Courier New", monospace';
            ctx.fillStyle = n.color;
            ctx.globalAlpha = isNear ? 1 : 0.6;
            ctx.textAlign = 'center';
            ctx.fillText(n.label, n.x, n.y - r - 6);
            ctx.globalAlpha = 1;
        }
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Touch support
    canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    }, { passive: true });
    canvas.addEventListener('touchend', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Init
    resize();
    initNodes();
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        resize();
        // Re-clamp nodes to new bounds
        for (const n of nodes) {
            n.x = Math.min(Math.max(n.x, 0), W);
            n.y = Math.min(Math.max(n.y, 0), H);
        }
    });
})();
