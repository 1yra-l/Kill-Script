import { provinceAndCityData } from 'element-china-area-data'
import request from '@/utils/request';

export default {
  name: 'PersonalInformation',
  data() {
    return {
      avatar: "",
      province: "",
      provinces: provinceAndCityData,
      form: {
        name: "",
        signature: "",
        gender: "",
        birthday: ""
      }
    }
  },
  methods: {
    // 修改这里：点击头像跳转到avatar-upload页面
    triggerAvatar() {
      this.$router.push("/avatar-upload");
    },

    async save() {
        // 1. 构造发送给后端的数据对象
        // 注意：字段名必须与后端 UserProfileUpdate 模型完全一致
        const updateData = {
            nickname: this.form.name,       // 前端 form.name 对应后端 nickname
            signature: this.form.signature,
            gender: this.form.gender,
            birthday: this.form.birthday,
            location: this.province,        // 前端 province 对应后端 location
            avatar_url: this.avatar
        };

        try {
            // 2. 调用后端接口
            const res = await request.put("/api/user/profile", updateData);
            const responseData = res.data || res;

            if (res.status === 200 || responseData.status === "success") {
                alert("📂 档案已成功存入数据库");
                localStorage.removeItem("temp_selected_avatar");

                const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                localStorage.setItem("user", JSON.stringify({
                    ...currentUser,
                    form: { ...this.form },
                    province: this.province,
                    avatar: this.avatar
                }));
            }
        } catch (error) {
            console.error("更新失败:", error);
            alert("⚠️ 系统错误：档案未能成功保存，请检查网络或登录状态");
        }
    },

    goUserCenter() {
      this.$router.push("/user")
    }
  },
  created() {
    // 可选：加载保存的数据
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.avatar = data.avatar || "";
        this.province = data.province || "";
        this.form = { ...this.form, ...data.form };
      } catch (e) {
        console.error("加载用户数据失败:", e);
      }
    }
    const tempAvatar = localStorage.getItem("temp_selected_avatar");
    if (tempAvatar) {
        this.avatar = tempAvatar; // 覆盖掉旧头像，实现“带回”效果
    }
  }
}