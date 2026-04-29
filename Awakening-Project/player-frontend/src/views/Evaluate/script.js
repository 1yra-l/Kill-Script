import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    let list = ref([])
    let score = ref(0)
    let type = ref('script-kill')
    let content = ref('')
    let filterType = ref('all')
    let search = ref('')

    const typeMap = {
      'script-kill': '剧本杀',
      'customer-service': '客服',
      'background-sound': '背景音',
      'gameplay': '游戏玩法',
      'interface': '界面设计'
    }

    onMounted(() => {
      list.value = JSON.parse(localStorage.getItem('reviews')) || []
    })

    const total = computed(() => list.value.length)
    const avg = computed(() => {
      if (!list.value.length) return '0.0'
      return (list.value.reduce((s, n) => s + n.score, 0) / list.value.length).toFixed(1)
    })

    const showList = computed(() => {
      let res = [...list.value]
      if (filterType.value !== 'all') res = res.filter(i => i.type === filterType.value)
      if (search.value) res = res.filter(i => i.content.includes(search.value) || i.typeName.includes(search.value))
      return res
    })

    function submit() {
      if (!score.value) return alert('请评分')
      if (!content.value) return alert('请输入内容')
      list.value.unshift({
        id: Date.now(),
        type: type.value,
        typeName: typeMap[type.value],
        score: score.value,
        content: content.value.trim(),
        time: new Date().toLocaleString()
      })
      localStorage.setItem('reviews', JSON.stringify(list.value))
      score.value = 0
      content.value = ''
    }

    function refresh() {
      list.value = JSON.parse(localStorage.getItem('reviews')) || []
    }

    function clearAll() {
      if (confirm('确定清空？')) {
        list.value = []
        localStorage.removeItem('reviews')
      }
    }
    function goBack() {
      // 请确保此处的路径与你路由配置中 UserCenter 的 path 保持一致
      router.push('/user')
    }

    return {
      list, score, type, content, filterType, search,
      total, avg, showList, submit, refresh, clearAll,
      goBack
    }
  }
}