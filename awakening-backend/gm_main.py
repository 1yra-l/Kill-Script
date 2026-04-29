import os
import json
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, END

load_dotenv()

# 初始化 DeepSeek 模型
llm = ChatOpenAI(
    model='deepseek-chat',
    openai_api_key=os.getenv("DEEPSEEK_API_KEY"),
    openai_api_base=os.getenv("DEEPSEEK_BASE_URL"),
    temperature=0.7 # 略微提高随机性，让安娜说话更自然
)

def phase_monitor_node(state: dict) -> dict:
    idx = state.get('current_phase_idx', 0)
    msg = state.get('user_message', '')
    script_data = state.get('script_data', {})
    timeline = script_data.get('timeline', [])
    persona = script_data.get('persona', '冷静、高傲、心思缜密')

    current_target = timeline[idx].get('action', '无') if idx < len(timeline) else "已完成所有指控"

    prompt = f"""
    你现在是剧本杀里的角色【安娜】。
    你的性格：{persona}
    玩家当前的剧情目标：{current_target}
    玩家对你说："{msg}"

    任务：
    1. 判定玩家是否提到了目标相关的关键词：是则输出 "YES"，否则 "NO"。
    2. 以安娜的身份回一句台词。
       - 如果判定为 YES，你要表现出被戳穿的慌乱或强行镇定。
       - 如果判定为 NO，你要冷嘲热讽，嫌弃玩家浪费时间。

    请严格按此JSON格式输出，不要有任何其他文字或代码块符号：
    {{ "judge": "YES或NO", "reply": "你的台词" }}
    """

    try:
        res = llm.invoke([HumanMessage(content=prompt)]).content.strip()
        # 核心防错：清洗掉所有可能干扰 JSON 解析的字符
        res_clean = res.replace("```json", "").replace("```", "").strip()
        data = json.loads(res_clean)
        judge = data.get("judge", "NO").upper()
        announcement = data.get("reply", "（安娜只是冷冷地看着你，一言不发）")
    except Exception as e:
        print(f"解析异常: {e}")
        judge = "NO"
        announcement = "（安娜优雅地整理了一下衣角，似乎没听见你的话。）"

    return {**state, "judge_result": judge, "gm_announcement": announcement}

# 构建工作流 (极简版)
workflow = StateGraph(dict)
workflow.add_node("phase_monitor", phase_monitor_node)
workflow.set_entry_point("phase_monitor")
workflow.add_edge("phase_monitor", END)
app = workflow.compile()

def run_gm_logic(role_id, message, current_idx, phase, private_data, common_data):
    initial_state = {
        "role_id": role_id,
        "current_phase": phase,
        "current_phase_idx": int(current_idx),
        "user_message": message,
        "script_data": private_data,
        "common_data": common_data
    }
    return app.invoke(initial_state)
# ==========================================
# 🛠️ 纯净版工具函数 (供其他成员或极速接口直接调用)
# ==========================================

def get_target_action(private_data: dict, current_idx: int) -> str:
    """
    辅助函数：从私有剧本中提取当前阶段的具体剧情目标
    """
    timeline = private_data.get('timeline', [])
    if timeline and isinstance(current_idx, int) and current_idx < len(timeline):
        return timeline[current_idx].get('action', '无目标')
    return "无目标"

def pure_judge_logic(user_message: str, current_target: str) -> str:
    """
    极速裁判函数：只做一件事，判断玩家的话有没有命中目标！
    - 响应极快，不包含任何多余的状态流转。
    - 返回值严格为 "YES" 或 "NO"。
    """
    if current_target == "无目标":
        return "NO"

    prompt = f"""
    你是一个极其客观、果断的剧本杀裁判。
    当前玩家需要完成的剧情目标是：【{current_target}】
    玩家的实际发言内容是："{user_message}"

    请执行以下逻辑判断：
    1. 玩家是否在对话中明确提及了目标中的核心信息（如特定时间、地点、物品或关键动作）？
    2. 只要玩家的描述与目标大体吻合（即玩家正在通过盘问引出这段剧情），就必须输出 "YES"。
    3. 只有当玩家发言与剧本目标完全无关、或者只是毫无意义的寒暄时，才输出 "NO"。

    注意：你只需要输出 "YES" 或 "NO"，不要输出任何其他标点符号或解释！
    """

    try:
        # 调用已经初始化好的 llm
        res = llm.invoke([HumanMessage(content=prompt)]).content.strip().upper()
        return "YES" if "YES" in res else "NO"
    except Exception as e:
        print(f"⚠️ 极速判定异常: {e}")
        return "NO"