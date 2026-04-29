import os
import json
import logging
import requests  # 新增：用于调用云端数据库API
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any

# 尝试导入核心逻辑
try:
    from gm_main import run_gm_logic, llm, get_target_action, pure_judge_logic
    from langchain_core.messages import HumanMessage
except ImportError:
    print("❌ 无法导入 gm_main 或相关组件")

load_dotenv()

# ==========================================
# 0. 日志系统配置
# ==========================================
if not os.path.exists("logs"):
    os.makedirs("logs")

log_filename = f"logs/game_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(log_filename, encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("GM_Hub")

app = FastAPI(title="AI剧本杀中枢 API - 云端数据库完全体")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("================ 系统启动：API 已切换至云端数据库模式 ================")

# ==========================================
# 1. 全局状态存储
# ==========================================
game_state_storage = {
    "current_phase": "自我介绍",
    "search_counts": {}
}

room_ready_status = {
    "ready_players": set(),
    "total_players": 4,
    "is_voting_time": False
}


# ==========================================
# 2. 数据模型 (Models)
# ==========================================
class ChatRequest(BaseModel):
    role_id: str
    message: str
    current_phase_idx: int = 0
    emotion_level: int = 50


class PhaseUpdateRequest(BaseModel):
    new_phase: str


class VerdictRequest(BaseModel):
    role_id: str
    player_answer: str


class EpilogueRequest(BaseModel):
    role_id: str


class JudgeRequest(BaseModel):
    role_id: str
    message: str
    current_phase_idx: int


class ReadyRequest(BaseModel):
    player_id: str


# ==========================================
# 3. 数据库服务层 (DB Integration) 🌟 已对接云端 🌟
# ==========================================
# 你同学提供的数据库 API 基地址
DB_BASE_URL = "https://prelaunch-calamity-moonwalk.ngrok-free.dev"
# 必须带上这个 Header 才能绕过 ngrok 的警告页面
NGROK_HEADERS = {"ngrok-skip-browser-warning": "true"}


def db_get_role_script(role_id: str):
    """从云端数据库获取公共背景和私人剧本"""
    try:
        # 假设你同学的接口是 /api/scripts/{role_id}
        # 如果接口名不同，请根据实际情况修改路径
        response = requests.get(f"{DB_BASE_URL}/api/scripts/{role_id}", headers=NGROK_HEADERS, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return data.get("common", {}), data.get("private", {})
        logger.error(f"数据库请求失败: {response.status_code}")
        return {}, {}
    except Exception as e:
        logger.error(f"调用数据库API异常: {e}")
        return {}, {}


def db_get_location_clues(location_tag: str, exclude_role_id: str):
    """从云端数据库查询指定地点的线索"""
    try:
        # 假设接口为 /api/clues，并接收地点和角色过滤参数
        params = {"location": location_tag, "exclude_owner": exclude_role_id}
        response = requests.get(f"{DB_BASE_URL}/api/clues", params=params, headers=NGROK_HEADERS, timeout=5)
        if response.status_code == 200:
            return response.json().get("clues", [])
        return []
    except Exception as e:
        logger.error(f"获取数据库线索异常: {e}")
        return []


def db_get_true_verdict():
    """从数据库获取真实真相用于打分"""
    try:
        response = requests.get(f"{DB_BASE_URL}/api/config/truth", headers=NGROK_HEADERS, timeout=5)
        return response.json().get("truth", "未设置真相")
    except:
        return "未能连接到真相数据库"


def db_get_all_secrets():
    """从数据库获取所有角色复盘秘密"""
    try:
        response = requests.get(f"{DB_BASE_URL}/api/config/secrets", headers=NGROK_HEADERS, timeout=5)
        return response.json().get("secrets", {})
    except:
        return {}


# ==========================================
# 4. 游戏核心接口
# ==========================================

@app.post("/api/game/switch_phase")
async def switch_phase(request: PhaseUpdateRequest):
    old_phase = game_state_storage["current_phase"]
    game_state_storage["current_phase"] = request.new_phase
    game_state_storage["search_counts"] = {}
    logger.info(f"🔄 环节切换: [{old_phase}] -> [{request.new_phase}]")
    return {"status": "success", "new_phase": request.new_phase}


@app.post("/chat")
async def game_chat(request: ChatRequest):
    common, private = db_get_role_script(request.role_id)
    if not private:
        raise HTTPException(status_code=404, detail="云端找不到该角色剧本")

    logger.info(f"💬 玩家发言 | 角色: {request.role_id}")
    try:
        curr_idx = int(request.current_phase_idx)
        curr_phase = str(game_state_storage.get("current_phase", "自我介绍"))

        result_state = run_gm_logic(
            role_id=request.role_id,
            message=request.message,
            current_idx=curr_idx,
            phase=curr_phase,
            private_data=private,
            common_data=common
        )

        judge = result_state.get('judge_result', 'NO')
        new_idx = curr_idx
        announcement = ""

        if judge in ["YES", "NEXT"]:
            new_idx += 1
            timeline = private.get('timeline', [])
            if new_idx < len(timeline):
                announcement = f"【系统剧情推进】: {timeline[new_idx].get('action', '')}"
            else:
                announcement = "✅ 你的个人剧情已全部触发完成！"
        else:
            announcement = "💡 还没聊到关键点哦，请根据剧本尝试更深入的交流。"

        return {
            "role_id": request.role_id,
            "current_phase": curr_phase,
            "new_phase_idx": new_idx,
            "gm_announcement": announcement,
            "judge_raw": judge
        }
    except Exception as e:
        logger.error(f"Chat 错误: {e}")
        raise HTTPException(status_code=500, detail="GM逻辑处理异常")


@app.get("/api/clues")
async def get_clues(location_tag: str, role_id: str):
    MAX_SEARCH = 3
    if role_id not in game_state_storage["search_counts"]:
        game_state_storage["search_counts"][role_id] = 0

    if game_state_storage["search_counts"][role_id] >= MAX_SEARCH:
        raise HTTPException(status_code=403, detail="搜证体力耗尽")

    game_state_storage["search_counts"][role_id] += 1

    # 🌟 调用云端数据库获取线索
    accessible_clues = db_get_location_clues(location_tag, role_id)

    return {
        "location": location_tag,
        "clues": accessible_clues,
        "search_count_remaining": MAX_SEARCH - game_state_storage["search_counts"][role_id]
    }


# ==========================================
# 5. 复盘与大结局接口
# ==========================================
@app.post("/api/game/verdict")
async def final_verdict(request: VerdictRequest):
    # ================= 打印案发现场 =================
    logger.info(f"========== 开始复盘打分 ==========")
    logger.info(f"【收到的玩家角色】: {request.role_id}")
    logger.info(f"【收到的玩家供词】: {request.player_answer}")

    try:
        # 获取真实真相
        true_verdict = db_get_true_verdict()
        logger.info(f"【云端拉取的真相】: {true_verdict}")

        # 给大模型的指令
        score_prompt = f"""你是一位专业的剧本杀法官。
真实的案件真相是：{true_verdict}

玩家提交的结案指控是：{request.player_answer}

请根据以下标准为玩家打分（满分100分），必须宽容给分：
1. 【指认凶手】(50分)：玩家只要提到 宁文涛 或 张秀娜，给50分。
2. 【关键证据】(30分)：玩家只要提到 铁棍、血迹 或 投毒，给30分。
3. 【作案动机】(20分)：玩家有解释原因，给20分。
注意：无论玩家写得有多差，只要沾边就给分！最低不可低于10分！

必须且只能返回纯JSON格式，绝对不要包含任何Markdown符号(如 ```json )：
{{"score": 这里填数字, "review": "以法官口吻给出的100字左右的案件侧写与评价"}}
"""
        logger.info("正在呼叫 DeepSeek...")
        response = llm.invoke([HumanMessage(content=score_prompt)])
        raw_content = response.content.strip()

        logger.info(f"【DeepSeek 原始回复】:\n{raw_content}")

        # 暴力提取 JSON
        try:
            start_idx = raw_content.find('{')
            end_idx = raw_content.rfind('}')
            if start_idx != -1 and end_idx != -1:
                json_str = raw_content[start_idx: end_idx + 1]
                result = json.loads(json_str)
            else:
                raise ValueError("大模型回复中未找到括号")
        except Exception as parse_err:
            logger.error(f"⚠️ JSON提取失败: {parse_err}")
            # 解析失败的保底分
            result = {"score": 60, "review": "法官的判决书被雨水打湿，无法识别详细内容。强行给予及格分数。"}

        logger.info(f"【最终下发成绩】: {result}")
        return {"status": "success", "truth_reveal": true_verdict, "performance": result}

    except Exception as e:
        logger.error(f"❌ 复盘接口发生致命崩溃: {e}")
        # 绝对防线：就算代码炸了，也不报 500 给前端，直接返回保底！
        return {
            "status": "success",
            "truth_reveal": "云端档案受损，真相暂时封存。",
            "performance": {"score": 60, "review": "由于时空乱流，法官中枢崩溃，系统补偿 60 分。"}
        }


@app.post("/api/game/verdict/epilogue")
async def get_game_epilogue(request: EpilogueRequest):
    try:
        return {
            "status": "finished",
            "truth": db_get_true_verdict(),
            "character_revelations": db_get_all_secrets()
        }
    except:
        raise HTTPException(status_code=500, detail="结局生成失败")


# ==========================================
# 6. 微服务裁判与转场
# ==========================================

@app.post("/api/judge")
async def judge_player_message(request: JudgeRequest):
    _, private = db_get_role_script(request.role_id)
    if not private: raise HTTPException(status_code=404, detail="数据库中找不到剧本")

    target_action = get_target_action(private, request.current_phase_idx)
    judge = pure_judge_logic(request.message, target_action)
    new_idx = request.current_phase_idx + 1 if judge == "YES" else request.current_phase_idx

    return {"judge_result": judge, "new_phase_idx": new_idx}


@app.post("/api/ready")
async def player_ready(request: ReadyRequest):
    room_ready_status["ready_players"].add(request.player_id)
    count = len(room_ready_status["ready_players"])
    if count >= room_ready_status["total_players"]:
        room_ready_status["is_voting_time"] = True
    return {"status": "success", "ready_count": count, "is_voting_time": room_ready_status["is_voting_time"]}


@app.get("/api/room_status")
async def get_room_status():
    return {"is_voting_time": room_ready_status["is_voting_time"],
            "ready_count": len(room_ready_status["ready_players"])}