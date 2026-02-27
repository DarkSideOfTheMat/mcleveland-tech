// Nav: add .scrolled class when page scrolls past the nav height
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ── THEME TOGGLE ────────────────────────────────────────────────
(function () {
    const toggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Determine initial theme: localStorage > prefers-color-scheme > dark
    function getPreferred() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
        // Dispatch event so node graph can refresh colors
        window.dispatchEvent(new CustomEvent('themechange'));
    }

    // Apply on load
    applyTheme(getPreferred());

    // Toggle on click
    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }
})();

// ── NODE GRAPH ──────────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('node-graph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Read Monokai palette from computed CSS custom properties
    function readColors() {
        const cs = getComputedStyle(document.documentElement);
        const getVar = (v) => cs.getPropertyValue(v).trim();
        return {
            cyan:   getVar('--mk-cyan')   || '#66d9e8',
            pink:   getVar('--mk-pink')   || '#f92672',
            yellow: getVar('--mk-yellow') || '#e6db74',
            orange: getVar('--mk-orange') || '#fd971f',
            purple: getVar('--mk-purple') || '#ae81ff',
            green:  getVar('--mk-green')  || '#a6e22e',
            muted:  getVar('--mk-comment')|| '#75715e',
            bg:     getVar('--mk-bg')     || '#272822',
        };
    }

    let COLORS = readColors();

    function getColorPool() {
        return [
            COLORS.cyan, COLORS.pink, COLORS.green,
            COLORS.purple, COLORS.yellow, COLORS.orange,
        ];
    }

    // Color pool
    let COLOR_POOL = getColorPool();

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
        { label: 'Hive' },           // 9
        { label: 'Presto' },         // 10
        { label: 'Postgres' },       // 11
        { label: 'Chess' },          // 12
        { label: 'Guitar' },         // 13
        { label: 'Baseball' },       // 14
        { label: 'Insights' },       // 15
        { label: 'Engagement' },     // 16
        { label: 'Growth' },         // 17
        { label: 'Logging' }, // 18
    ];

    // Edges: index pairs representing connections
    const EDGES = [
        [0, 1],   // Python — SQL
        [0, 5],   // Python — R
        [5, 4],   // R — JS
        [3, 2],   // PHP — Go
        [2, 0],   // Go — Python
        [0, 3],   // Python — PHP
        [0, 4],   // Python — JS
        [6, 7],   // Pipelines — Data Modeling
        [7, 8],   // Data Modeling — Visualizations
        [9, 10],  // Hive — Presto
        [10, 11], // Presto — Postgres
        [12, 13], // Chess — Guitar
        [13, 14], // Guitar — Baseball
        [12, 14], // Chess — Baseball
        [7, 15],  // Data Modeling — Insights
        [15, 8],  // Insights — Visualizations
        [16, 17], // Engagement — Growth
        [6, 18], // Pipelines - Logging
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

    // Physics params — exposed on window.nodeParams for settings panel
    const DEFAULTS = {
        NODE_RADIUS: 4,
        MOUSE_RADIUS: 100,
        REPULSE_STRENGTH: 0.4,
        NODE_REPULSE_RADIUS: 120,
        NODE_REPULSE_STRENGTH: 0.06,
        ATTRACT_STRENGTH: 0.008,
        ATTRACT_REST_DIST: 100,
        VELOCITY_TRANSFER: 0.015,
        DAMPING: 0.97,
        DRIFT_FORCE: 0.06,
        ORBIT_FORCE: 0.04,
        EDGE_MARGIN: 100,
        EDGE_FORCE: 0.6,
    };
    const P = { ...DEFAULTS };
    window.nodeParams = P;

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
        // Find connected components
        const visited = new Array(NODE_DEFS.length).fill(false);
        const components = [];
        for (let i = 0; i < NODE_DEFS.length; i++) {
            if (visited[i]) continue;
            const comp = [];
            const queue = [i];
            visited[i] = true;
            while (queue.length) {
                const idx = queue.shift();
                comp.push(idx);
                for (const nb of adj[idx]) {
                    if (!visited[nb]) {
                        visited[nb] = true;
                        queue.push(nb);
                    }
                }
            }
            components.push(comp);
        }

        // Assign each cluster a spawn center spread across the canvas
        const pad = 0.15;
        const areaW = W * (1 - pad * 2);
        const areaH = H * (1 - pad * 2);
        const cols = Math.ceil(Math.sqrt(components.length));
        const rows = Math.ceil(components.length / cols);
        const cellW = areaW / cols;
        const cellH = areaH / rows;
        const clusterRadius = Math.min(cellW, cellH) * 0.2;

        const shuffledComponents = shuffle(components);

        const spawnPositions = new Array(NODE_DEFS.length);
        shuffledComponents.forEach((comp, ci) => {
            const col = ci % cols;
            const row = Math.floor(ci / cols);
            const cx = W * pad + cellW * (col + 0.5);
            const cy = H * pad + cellH * (row + 0.5);
            for (const idx of comp) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * clusterRadius;
                spawnPositions[idx] = {
                    x: cx + Math.cos(angle) * r,
                    y: cy + Math.sin(angle) * r,
                };
            }
        });

        nodes = NODE_DEFS.map((def, i) => ({
            x: spawnPositions[i].x,
            y: spawnPositions[i].y,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            label: def.label,
            color: def.color,
            radius: P.NODE_RADIUS,
            phase: Math.random() * Math.PI * 2,
            freq: 0.005 + Math.random() * 0.01,
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
                    const delta = dist - P.ATTRACT_REST_DIST;
                    const force = delta * P.ATTRACT_STRENGTH;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    a.vx -= fx;  a.vy -= fy;
                    b.vx += fx;  b.vy += fy;
                    // Velocity coupling — drag neighbor along
                    const dvx = b.vx - a.vx;
                    const dvy = b.vy - a.vy;
                    a.vx += dvx * P.VELOCITY_TRANSFER;
                    a.vy += dvy * P.VELOCITY_TRANSFER;
                    b.vx -= dvx * P.VELOCITY_TRANSFER;
                    b.vy -= dvy * P.VELOCITY_TRANSFER;
                } else if (dist < P.NODE_REPULSE_RADIUS) {
                    // Unconnected: repel
                    const force = (P.NODE_REPULSE_RADIUS - dist) / P.NODE_REPULSE_RADIUS * P.NODE_REPULSE_STRENGTH;
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    a.vx += fx;  a.vy += fy;
                    b.vx -= fx;  b.vy -= fy;

                    // Collision velocity transfer when close enough
                    if (dist < P.NODE_RADIUS * 8) {
                        const dvx = b.vx - a.vx;
                        const dvy = b.vy - a.vy;
                        a.vx += dvx * P.VELOCITY_TRANSFER;
                        a.vy += dvy * P.VELOCITY_TRANSFER;
                        b.vx -= dvx * P.VELOCITY_TRANSFER;
                        b.vy -= dvy * P.VELOCITY_TRANSFER;
                    }
                }
            }
        }

        const t = performance.now() * 0.001;
        for (const n of nodes) {
            // Orbital drift — smooth sinusoidal push unique to each node
            const angle = t * n.freq * Math.PI * 2 + n.phase;
            n.vx += Math.cos(angle) * P.ORBIT_FORCE;
            n.vy += Math.sin(angle) * P.ORBIT_FORCE;

            // Random jitter
            n.vx += (Math.random() - 0.5) * P.DRIFT_FORCE;
            n.vy += (Math.random() - 0.5) * P.DRIFT_FORCE;

            // Mouse repulsion
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < P.MOUSE_RADIUS && dist > 0) {
                const force = (P.MOUSE_RADIUS - dist) / P.MOUSE_RADIUS * P.REPULSE_STRENGTH;
                n.vx += (dx / dist) * force;
                n.vy += (dy / dist) * force;
            }

            // Damping
            n.vx *= P.DAMPING;
            n.vy *= P.DAMPING;

            // Move
            n.x += n.vx;
            n.y += n.vy;

            // Soft edge repulsion
            if (n.x < P.EDGE_MARGIN) {
                n.vx += (P.EDGE_MARGIN - n.x) / P.EDGE_MARGIN * P.EDGE_FORCE;
            }
            if (n.x > W - P.EDGE_MARGIN) {
                n.vx -= (n.x - (W - P.EDGE_MARGIN)) / P.EDGE_MARGIN * P.EDGE_FORCE;
            }
            if (n.y < P.EDGE_MARGIN) {
                n.vy += (P.EDGE_MARGIN - n.y) / P.EDGE_MARGIN * P.EDGE_FORCE;
            }
            if (n.y > H - P.EDGE_MARGIN) {
                n.vy -= (n.y - (H - P.EDGE_MARGIN)) / P.EDGE_MARGIN * P.EDGE_FORCE;
            }

            // Keep node radius in sync with param
            n.radius = P.NODE_RADIUS;
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
            const glow = distToMouse < P.MOUSE_RADIUS * 1.5
                ? 0.15 + 0.25 * (1 - distToMouse / (P.MOUSE_RADIUS * 1.5))
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
            const isNear = distToMouse < P.MOUSE_RADIUS;
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

    // Theme change: re-read colors, re-color nodes, rebuild color pool
    window.addEventListener('themechange', () => {
        COLORS = readColors();
        COLOR_POOL = getColorPool();

        // Re-run BFS coloring with new palette
        const recolored = new Array(NODE_DEFS.length).fill(null);
        for (let start = 0; start < NODE_DEFS.length; start++) {
            if (recolored[start]) continue;
            const pool = shuffle(COLOR_POOL);
            let poolIdx = 0;
            const queue = [start];
            recolored[start] = '?';
            while (queue.length) {
                const idx = queue.shift();
                const neighborColors = adj[idx].map((n) => recolored[n]).filter(Boolean);
                let chosen = null;
                for (let tries = 0; tries < COLOR_POOL.length; tries++) {
                    const candidate = pool[(poolIdx + tries) % pool.length];
                    if (!neighborColors.includes(candidate)) {
                        chosen = candidate;
                        poolIdx = (poolIdx + tries + 1) % pool.length;
                        break;
                    }
                }
                if (!chosen) {
                    chosen = pool[poolIdx % pool.length];
                    poolIdx++;
                }
                recolored[idx] = chosen;
                NODE_DEFS[idx].color = chosen;
                if (nodes[idx]) nodes[idx].color = chosen;
                for (const nb of adj[idx]) {
                    if (!recolored[nb] || recolored[nb] === '?') {
                        if (!recolored[nb]) {
                            recolored[nb] = '?';
                            queue.push(nb);
                        }
                    }
                }
            }
        }
    });

    // Expose defaults for reset
    window.nodeDefaults = DEFAULTS;
})();

// ── SETTINGS PANEL ──────────────────────────────────────────────
(function () {
    const toggle = document.getElementById('settings-toggle');
    const panel = document.getElementById('settings-panel');
    const reset = document.getElementById('settings-reset');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
        panel.classList.toggle('open');
    });

    const SLIDERS = [
        { id: 's-mouse-radius',    val: 'v-mouse-radius',    key: 'MOUSE_RADIUS',          decimals: 0 },
        { id: 's-mouse-strength',  val: 'v-mouse-strength',  key: 'REPULSE_STRENGTH',       decimals: 2 },
        { id: 's-node-repulse-r',  val: 'v-node-repulse-r',  key: 'NODE_REPULSE_RADIUS',    decimals: 0 },
        { id: 's-node-repulse-s',  val: 'v-node-repulse-s',  key: 'NODE_REPULSE_STRENGTH',  decimals: 3 },
        { id: 's-attract-s',       val: 'v-attract-s',       key: 'ATTRACT_STRENGTH',       decimals: 3 },
        { id: 's-attract-d',       val: 'v-attract-d',       key: 'ATTRACT_REST_DIST',      decimals: 0 },
        { id: 's-vel-transfer',    val: 'v-vel-transfer',    key: 'VELOCITY_TRANSFER',      decimals: 3 },
        { id: 's-damping',         val: 'v-damping',         key: 'DAMPING',                decimals: 3 },
        { id: 's-drift',           val: 'v-drift',           key: 'DRIFT_FORCE',            decimals: 3 },
        { id: 's-orbit',           val: 'v-orbit',           key: 'ORBIT_FORCE',            decimals: 3 },
        { id: 's-edge-margin',     val: 'v-edge-margin',     key: 'EDGE_MARGIN',            decimals: 0 },
        { id: 's-edge-force',      val: 'v-edge-force',      key: 'EDGE_FORCE',             decimals: 2 },
        { id: 's-node-radius',     val: 'v-node-radius',     key: 'NODE_RADIUS',            decimals: 1 },
    ];

    const P = window.nodeParams;

    for (const s of SLIDERS) {
        const input = document.getElementById(s.id);
        const display = document.getElementById(s.val);
        if (!input || !display) continue;

        input.addEventListener('input', () => {
            const v = parseFloat(input.value);
            P[s.key] = v;
            display.textContent = v.toFixed(s.decimals);
        });
    }

    if (reset) {
        reset.addEventListener('click', () => {
            const defaults = window.nodeDefaults;
            for (const s of SLIDERS) {
                const input = document.getElementById(s.id);
                const display = document.getElementById(s.val);
                if (!input || !display || !defaults) continue;
                P[s.key] = defaults[s.key];
                input.value = defaults[s.key];
                display.textContent = defaults[s.key].toFixed(s.decimals);
            }
        });
    }
})();
