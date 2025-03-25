class CaptionGenerator {
    constructor() {
        this.data = null;
        this.init();
    }

    async init() {
        try {
            const response = await fetch('captions.json');
            this.data = await response.json();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to load captions:', error);
        }
    }

    setupEventListeners() {
        const sceneSelect = document.getElementById('sceneSelect');
        const refreshBtn = document.getElementById('refreshBtn');

        sceneSelect.addEventListener('change', () => this.generateCaptions());
        refreshBtn.addEventListener('click', () => this.generateCaptions());
    }

    getRandomEmoji(scene) {
        const emojis = this.data[scene].emoji;
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    generateCaptions() {
        const scene = document.getElementById('sceneSelect').value;
        if (!scene) return;

        const container = document.getElementById('captionContainer');
        container.innerHTML = '';

        const templates = this.data[scene].templates;
        const shuffled = [...templates].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        selected.forEach(template => {
            const emoji = this.getRandomEmoji(scene);
            const caption = `${template} ${emoji}`;
            this.createCaptionElement(caption, container);
        });
    }

    createCaptionElement(caption, container) {
        const div = document.createElement('div');
        div.className = 'caption-item';
        div.innerHTML = `
            <p>${caption}</p>
            <button class="copy-btn">复制</button>
        `;

        div.querySelector('.copy-btn').addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(caption);
                const btn = div.querySelector('.copy-btn');
                btn.textContent = '已复制';
                setTimeout(() => btn.textContent = '复制', 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });

        container.appendChild(div);
    }
}

// 初始化应用
new CaptionGenerator(); 