import { reactive } from 'vue';

export function useSettings() {
  // 1. 静态配置数据
  const audioList = [
    { id: 'music', name: '音乐', en: 'Music' },
    { id: 'sfx', name: '音效', en: 'Sound FX' },
    { id: 'voice', name: '语音', en: 'Voice' }
  ];

  // 2. 响应式状态管理
  const settings = reactive({
    autoplay: true,
    isFullscreen: false,
    returnToTitle: true,
    volumes: {
      music: 80,
      sfx: 65,
      voice: 90
    },
    mutes: {
      music: false,
      sfx: false,
      voice: false
    },
    prevVolumes: {
      music: 80,
      sfx: 65,
      voice: 90
    }
  });

  // 3. 交互逻辑函数
  const onSliderInput = (id) => {
    // 如果用户手动滑动，自动解除静音状态
    if (settings.volumes[id] > 0) {
      settings.mutes[id] = false;
    }
  };

  const toggleMute = (id) => {
    settings.mutes[id] = !settings.mutes[id];
    if (settings.mutes[id]) {
      // 记录静音前的值，并将音量设为0
      settings.prevVolumes[id] = settings.volumes[id];
      settings.volumes[id] = 0;
    } else {
      // 恢复静音前的值
      settings.volumes[id] = settings.prevVolumes[id];
    }
  };

  // 4. 将模板需要用到的东西暴露出去
  return {
    audioList,
    settings,
    onSliderInput,
    toggleMute
  };
}