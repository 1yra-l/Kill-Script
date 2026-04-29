import { createRouter, createWebHistory } from 'vue-router'

// 1. 导入页面级组件
import Achievements from '@/views/Achievements/Achievements.vue'
import Authentication from '@/views/Authentication/authentication.vue'
import AvatarUpload from '@/views/AvatarUpload/AvatarUpload.vue'
import CharacterSelect from '@/views/CharacterSelect/CharacterSelect.vue'
import ChatRoom from '@/views/ChatRoom/chatroom.vue'
import ClueSearch from '@/views/ClueSearch/ClueSearch.vue'
import Ending from '@/views/Ending/Ending.vue'
import Evaluate from '@/views/Evaluate/Evaluate.vue'
import FriendsPage from '@/views/Friends/Friends.vue'
import GameRecap from '@/views/GameRecap/GameRecap.vue'
import HistoryRecord from '@/views/HistoryRecord/HistoryRecord.vue'
import InterrogationPage from '@/views/InterrogationPage/InterrogationPage.vue'
import LoginPage from '@/views/Login/Login.vue'
import MessageCenter from '@/views/MessageCenter/messagecenter.vue'
import PersonalInformation from '@/views/PersonalInformation/PersonalInformation.vue'
import ResetPassword from '@/views/ResetPassword/ResetPassword.vue'
import ResultPage from '@/views/ResultPage/ResultPage.vue'
import RoomHall from '@/views/RoomHall/RoomHall.vue'
import ScriptDetails from '@/views/ScriptDetails/ScriptDetails.vue'
import ScriptView from '@/views/ScriptView/ScriptView.vue'
import ServiceCenter from '@/views/ServiceCenter/ServiceCenter.vue'
import Settings from '@/views/Settings/Settings.vue'
import SettlementPage from '@/views/Settlement/Settlement.vue'
import UserSignIn from '@/views/UserSignIn/UserSignIn.vue'
import UserCenter from '@/views/UserCenter/UserCenter.vue'
import VotePage from '@/views/VotePage/VotePage.vue'
import Woodendoor from '@/views/Woodendoor/woodendoor.vue'
import Start from '@/views/Start/start.vue'
import MemberCenter from '@/views/MemberCenter/MemberCenter.vue'
// index.js 顶部导入区域
import PaymentGateway from '@/views/PaymentGateway/PaymentGateway.vue'
import ClubCard from '@/views/ClubCard/ClubCard.vue'
import Exchange from '@/views/Exchange/Exchange.vue'


const routes = [
  {
    path: '/casefile',
    name: 'RoomHall',
    component: RoomHall,
    meta: { title: '卷宗启动页' }
  },
  {
    path: '/woodendoor',
    name: 'Woodendoor',
    component: Woodendoor,
    meta: { title: '木门' }
  },
  {
    path: '/start',
    name: 'Start',
    component: Start,
    meta: { title: '首页' }
  },
  {
    // 选角页面
    path: '/character-select/:roomId?',
    name: 'CharacterSelect',
    component: CharacterSelect,
    props: true,
    meta: { title: '档案库' }
  },
  {
    // 审讯核心页面
    path: '/interrogation-page/:roomId?',
    name: 'InterrogationPage',
    component: InterrogationPage,
    props: true,
    meta: { title: '审讯室' }
  },
  {
    // 阅读剧本页面
    path: '/script-view/:roomId?',
    name: 'ScriptView',
    component: ScriptView,
    props: true,
    meta: { title: '记忆碎片' }
  },
  {
    path: '/vote-page/:roomId?',
    name: 'VotePage',
    component: VotePage,
    props: true,
    meta: { title: '锁定真凶' }
  },
   {
    path: '/result-page/:roomId?',
    name: 'ResultPage',
    component: ResultPage,
    props: true,
    meta: { title: '案件真相' }
  },
  {
    // 3D 搜证页面
    path: '/clues/:roomId?',
    name: 'ClueSearch',
    component: ClueSearch,
    props: true,
    meta: { title: '证物档案' }
  }, // <--- 此处补齐了缺少的逗号
  {
    path: '/user',
    name: 'UserCenter',
    component: UserCenter,
    meta: { title: '个人中心' }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword/ResetPassword.vue'),
    meta: { title: '重置密钥' }
  },
  {
    path: '/history-record',
    name: 'HistoryRecord',
    component: () => import('@/views/HistoryRecord/HistoryRecord.vue'),
    meta: { title: '历史卷宗' }
  },
  {
    path: '/avatar-upload',
    name: 'AvatarUpload',
    component: () => import('@/views/AvatarUpload/AvatarUpload.vue'),
    meta: { title: '重置密钥' }
  },
  {
    path: '/evaluate',
    name: 'Evaluate',
    component: () => import('@/views/Evaluate/Evaluate.vue'),
    meta: { title: '游戏评价' }
  },
  {
    path: '/personal-information',
    name: 'PersonalInformation',
    component: () => import('@/views/PersonalInformation/PersonalInformation.vue'),
    meta: { title: '个人资料' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: '身份录入' }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: FriendsPage,
    meta: { title: '受托人名录' }
  },
  {
  path: '/authentication',
  name: 'Authentication',
  // 注意这里的路径：文件夹是大写 Authentication，文件名是小写 authentication.vue
  component: () => import('@/views/Authentication/authentication.vue'),
  props: true,
  meta: { title: '实名验证' }
  },
  {
  path: '/settings',
  name: 'Settings',
  // 注意这里的路径：文件夹是大写 Authentication，文件名是小写 authentication.vue
  component: () => import('@/views/Settings/Settings.vue'),
  props: true,
  meta: { title: '设置页面' }
  },

  {
  path: '/user-signin',
  name: 'UsersignIn',
  // 注意这里的路径：文件夹是大写 Authentication，文件名是小写 authentication.vue
  component: () => import('@/views/UsersignIn/UsersignIn.vue'),
  props: true,
  meta: { title: '用户登录' }
  },
  {
  path: '/game-recap',
  name: 'GameRecap',
  component: () => import('@/views/GameRecap/GameRecap.vue'),
  props: true,
  meta: { title: '剧情复盘' }
  },
  {
  path: '/achievements',
  name: 'Achievements',
  // 注意这里的路径：文件夹是大写 Authentication，文件名是小写 authentication.vue
  component: () => import('@/views/Achievements/achievements.vue'),
  props: true,
  meta: { title: '游戏成就' }
  },
  {
  path: '/chatroom',
  name: 'ChatRoom',
  // 注意这里的路径：文件夹是大写 Authentication，文件名是小写 authentication.vue
  component: () => import('@/views/ChatRoom/chatroom.vue'),
  props: true,
  meta: { title: '聊天室' }
  },
  {
  path: '/message-center',
  name: 'MessageCenter',
  // 注意这里的路径：文件夹是大写 Authentication，文件名是小写 authentication.vue
  component: () => import('@/views/MessageCenter/messagecenter.vue'),
  props: true,
  meta: { title: '消息中心' }
  },
   {
    path: '/script-detail', // 访问路径：http://localhost:5173/script-detail
    name: 'ScriptDetails',
    component: ScriptDetails,
    meta: { title: '剧本详情' }
  },
   {
    path: '/service-center',
    name: 'ServiceCenter',
    component: ServiceCenter,
    meta: { title: 'AI客服中心' }
  },
  {
    path: '/ending', // 同样建议带上 roomId，方便扩展
    name: 'Ending',
    component: Ending,
    props: true,
    meta: { title: '彩蛋' } // 浏览器标签页标题
  },
  {
    path: '/settlement/:roomId',
    name: 'Settlement',
    component: SettlementPage,
    props: true,
    meta: { title: '结案陈词' }
  },
  // [新增] 会员中心路由映射
  {
    path: '/member-center',
    name: 'MemberCenter',
    component: MemberCenter,
    meta: { title: '充值中心' }
  },
  {
  path: '/payment-gateway',
  name: 'PaymentGateway',
  component: () => import('@/views/PaymentGateway/PaymentGateway.vue'),
  meta: { title: '支付网关' }
  },
  {
    path: '/club-card',
    name: 'ClubCard',
    component:ClubCard,
    meta: { title: '会员中心' }
  },
    {
    path: '/exchange',
    name: 'Exchange',
    component:Exchange,
    meta: { title: '积分兑换' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 沉浸式标题守卫
 */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})

export default router