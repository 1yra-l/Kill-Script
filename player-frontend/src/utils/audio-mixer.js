// utils/audio-mixer.js
class AudioMixer {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.bgmGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.bgmGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);

        this.bgmChannels = [
            { source: null, gain: this.ctx.createGain(), audio: null },
            { source: null, gain: this.ctx.createGain(), audio: null }
        ];

        this.bgmChannels.forEach(ch => {
            ch.gain.gain.value = 0;
            ch.gain.connect(this.bgmGain);
        });

        this.activeChannel = 0;
        this.fadeTime = 2.5;
    }

    async playMusic(url) {
        if (!url) return;
        const now = this.ctx.currentTime;
        const nextIdx = 1 - this.activeChannel;
        const current = this.bgmChannels[this.activeChannel];
        const next = this.bgmChannels[nextIdx];

        if (next.audio) {
            next.audio.pause();
            next.audio.src = "";
        }

        const audio = new Audio(url);
        audio.loop = true;
        const source = this.ctx.createMediaElementSource(audio);
        source.connect(next.gain);

        next.audio = audio;
        next.source = source;

        current.gain.gain.setValueAtTime(current.gain.gain.value, now);
        current.gain.gain.linearRampToValueAtTime(0, now + this.fadeTime);

        // --- 核心修改：捕获自动播放限制错误 ---
        const playPromise = next.audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("音频播放被浏览器拦截，等待用户交互后恢复:", error);
            });
        }

        next.gain.gain.setValueAtTime(0, now);
        next.gain.gain.linearRampToValueAtTime(1, now + this.fadeTime);

        const oldAudio = current.audio;
        setTimeout(() => {
            if (oldAudio && oldAudio !== next.audio) {
                oldAudio.pause();
            }
        }, this.fadeTime * 1000);

        this.activeChannel = nextIdx;
    }

    playSFX(url) {
        const audio = new Audio(url);
        const source = this.ctx.createMediaElementSource(audio);
        source.connect(this.sfxGain);
        // --- 核心修改：捕获音效播放错误 ---
        audio.play().catch(e => console.warn("音效播放受限"));
        audio.onended = () => { source.disconnect(); };
    }
}

export { AudioMixer };