/**
 * 方案 2 专用逻辑文件
 * 图片存放在：src/assets/medals/
 * 引用方式：动态解析 URL 路径
 */

export default {
  name: 'AchievementsPage',
  data() {
    return {
      // 模拟总览数据
      stats: {
        total: 10,
        unlocked: 4
      },
      // 成就奖章数据列表
      medals: [
        {
          id: 'a01',
          name: '初级权限授权',
          description: '首次成功完成任意一份档案的调查。',
          comment: '“欢迎加入联邦调查局，菜鸟。希望你能活到退休。”',
          unlocked: true,
          unlockDate: '2026.04.10',
          // 使用 new URL 动态引入 assets 目录下的图片
          frontImg: new URL('../../assets/medals/medal_01_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_01_back.png', import.meta.url).href
        },
        {
          id: 'a02',
          name: 'S级受托人',
          description: '累计侦破积分达到 2000 分以上。',
          comment: '“你的名字已经列入局长办公桌上的特别关注名单。”',
          unlocked: false,
          unlockDate: '--',
          frontImg: new URL('../../assets/medals/medal_02_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_02_back.png', import.meta.url).href
        },
        {
          id: 'a03',
          name: '真相解剖者',
          description: '以 100% 准确率还原案件真相，无任何错误推理。',
          comment: '“尸体不会撒谎，而你听懂了它们的语言。”',
          unlocked: true,
          unlockDate: '2026.04.12',
          frontImg: new URL('../../assets/medals/medal_03_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_03_back.png', import.meta.url).href
        },
        {
          id: 'a04',
          name: '情报网络',
          description: '通讯录中添加超过 10 名受托人，且至少建立 3 次通讯。',
          comment: '“在这个暗流涌动的世界里，情报就是生命线。”',
          unlocked: false,
          unlockDate: '--',
          frontImg: new URL('../../assets/medals/medal_07_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_07_back.png', import.meta.url).href
        },
        {
          id: 'a05',
          name: '午夜潜行者',
          description: '在现实时间凌晨 0:00 - 4:00 期间完成一次调查。',
          comment: '“黑暗是最好的掩护。夜深了，调查才刚刚开始。”',
          unlocked: false,
          unlockDate: '--',
          frontImg: new URL('../../assets/medals/medal_06_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_06_back.png', import.meta.url).href
        },
        {
          id: 'a06',
          name: '细节猎人',
          description: '在一次调查中发现并正确解读至少3处隐藏线索（如照片背景、票据日期、物品磨损等）。',
          comment: '“真相从来不在表面，而在你愿意多看一眼的缝隙里。”',
          unlocked: true,
          unlockDate: '2026.04.15',
          frontImg: new URL('../../assets/medals/medal_05_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_05_back.png', import.meta.url).href
        },
        {
          id: 'a07',
          name: '亦正亦邪',
          description: '在阵营机制类调查中，成功骗取所有阵营的信任并达成个人胜利。',
          comment: '“站在每一张牌桌中间，但永远不属于任何一方。”',
          unlocked: true,
          unlockDate: '2026.04.19',
          frontImg: new URL('../../assets/medals/medal_04_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_04_back.png', import.meta.url).href
        },
        {
          id: 'a08',
          name: '新手光环',
          description: '在人生首次参与的调查中，所在阵营或个人获得最终胜利。',
          comment: '“有人说是运气，但我们更愿意称之为——天赋。”',
          unlocked: false,
          unlockDate: '--',
          frontImg: new URL('../../assets/medals/medal_08_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_08_back.png', import.meta.url).href
        },
        {
          id: 'a09',
          name: '欧皇降世',
          description: '连续两次抽中凶手身份，且两次均成功逃脱未被投票指认。',
          comment: '“概率在你面前低头，命运为你重掷骰子。”',
          unlocked: false,
          unlockDate: '--',
          frontImg: new URL('../../assets/medals/medal_09_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_09_back.png', import.meta.url).href
        },
        {
          id: 'a10',
          name: '结局改写者',
          description: '触发任意档案的隐藏结局、真结局或未被写明的角色命运线。',
          comment: '“剧本是别人的，结局是你自己的。”',
          unlocked: false,
          unlockDate: '--',
          frontImg: new URL('../../assets/medals/medal_10_front.png', import.meta.url).href,
          backImg: new URL('../../assets/medals/medal_10_back.png', import.meta.url).href
        }
      ]
    }
  },
  methods: {
    goToLobby() {
      this.$router.push('/user');
    }
  }
}