export class MoodManager {
    constructor(mixer) {
        this.mixer = mixer;
        this.filter = this.mixer.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.value = 20000;

        this.mixer.bgmGain.disconnect();
        this.mixer.bgmGain.connect(this.filter);
        this.filter.connect(this.mixer.ctx.destination);
    }

    handleMoodChange(mood, url) {
        const now = this.mixer.ctx.currentTime;
        this.mixer.playMusic(url);

        if (mood === 'intense') {
            // 紧张：声音极闷，语速变快
            this.filter.frequency.setTargetAtTime(800, now, 0.5);
            this.setPlaybackRate(1.15);
        }
        else if (mood === 'suspicious') {
            // 怀疑：声音中等频率
            this.filter.frequency.setTargetAtTime(3000, now, 1.0);
            this.setPlaybackRate(0.95);
        }
        else if (mood === 'uneasy') {
            // 不安：稍微压抑，语速稍慢营造拖沓感
            this.filter.frequency.setTargetAtTime(5000, now, 1.5);
            this.setPlaybackRate(0.9);
        }
        else {
            // 正常：全频率
            this.filter.frequency.setTargetAtTime(20000, now, 1.0);
            this.setPlaybackRate(1.0);
        }
    }

    setPlaybackRate(rate) {
        setTimeout(() => {
            const activeAudio = this.mixer.bgmChannels[this.mixer.activeChannel].audio;
            if (activeAudio) activeAudio.playbackRate = rate;
        }, 100);
    }
}