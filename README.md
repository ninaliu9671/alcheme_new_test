# Alcheme ✨

> 一个温柔的日记炼金术士 — 把你的随笔提炼成"我"开头的精华句子，存进魔法盒慢慢回看。

手绘 + 像素混搭风格的移动端日记 web app。用户写下今日感受，AI 提炼成几句"我..."开头的闪光碎片，每张卡片可翻面查看原始日记。

## 截图

| 炼制（输入） | 提炼结果 | 魔法盒（历史卡片） |
|---|---|---|
| 女巫骑扫帚 + 纸条输入框 | 女巫煮锅 + ✨ 精华句列表 | 宝箱 + 可翻面卡片堆 |

设计参考见 `UI_v1.png`。

## 技术栈

- **Next.js 14** App Router + **TypeScript**
- **Tailwind CSS** + 自定义纸张/虚线工具类
- **Framer Motion** — 女巫漂浮、锅蒸汽、列表 stagger、飞入魔法盒、3D 翻卡、Tab 切换
- **Zustand** + localStorage 持久化
- **@fontsource** 本地字体（Press Start 2P / Caveat / Noto Sans SC）— 无 Google Fonts 依赖
- AI 调用走 **服务端 Route Handler**（`/api/extract`），密钥不进浏览器

## 本地运行

```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

不配置 AI 时自动走 `lib/mock.ts` 的假数据，前端流程依然可用。

## 配置真实 AI

1. 复制环境变量示例：
   ```bash
   cp .env.local.example .env.local
   ```
2. 编辑 `.env.local`：
   ```env
   AI_URL=https://api.deepseek.com/chat/completions
   AI_KEY=sk-xxxxxxxxxxxx
   AI_MODEL=deepseek-chat
   ```
   其它兼容 OpenAI chat-completions 协议的提供商同理（OpenAI / Moonshot / 智谱 / 通义千问 ...）。
3. **重启** `npm run dev`（env 改了必须重启）

⚠️ **绝不要**给变量加 `NEXT_PUBLIC_` 前缀 — 那会暴露到浏览器。

### 调试

直接打 API：
```bash
curl -s -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"rawText":"今天早上喝了咖啡"}'
```

返回里的 `source` 字段：
- `ai` — 真实 AI 成功 ✅
- `mock` — 没读到 env（重启 dev）
- `mock-error` — AI 报错（看 dev server 控制台详细日志）
- `mock-fallback` — AI 返回了但没找到合法 JSON 数组（调 prompt）

## 自定义提炼提示词

编辑 [`lib/prompt.ts`](lib/prompt.ts) 的 `EXTRACT_PROMPT` 常量。**必须保留 `{{INPUT}}` 占位符** — 服务端会把它替换成用户的真实日记。

## 部署到 Vercel

1. 把仓库 import 到 https://vercel.com/new
2. Framework Preset 自动识别为 Next.js
3. **Environment Variables** 面板里添加：
   - `AI_URL`
   - `AI_KEY`
   - `AI_MODEL`

   （同样**不加** `NEXT_PUBLIC_` 前缀）
4. Deploy

## 项目结构

```
app/
  page.tsx                  # 炼制（输入页）
  result/page.tsx           # 提炼结果
  box/page.tsx              # 魔法盒（卡片列表）
  api/extract/route.ts      # 服务端 AI 调用 ← 在这里替换 AI 提供商
  layout.tsx
  globals.css

components/
  PhoneFrame.tsx            # 手机视口外框 + 雪花莲装饰
  TopBar.tsx                # 顶栏（tab/sub 两种变体）
  BottomTabs.tsx            # 底部 Tab：炼制 / 魔法盒
  PaperCard.tsx             # 米色纸卡 + 横线 + 虚线内框
  PillButton.tsx            # 黑色胶囊 + 金星按钮
  StarBullet.tsx            # 金色五角星 SVG
  FlipCard.tsx              # 双面翻卡（正：精华 / 背：原文）
  PageTransitionProvider.tsx

lib/
  ai.ts                     # 浏览器侧 wrapper（只调本地 /api/extract）
  prompt.ts                 # AI 提示词 ← 在这里改提炼风格
  mock.ts                   # 假数据
  store.ts                  # zustand + localStorage
  types.ts

public/assets/              # 6 张透明 PNG 素材
scripts/slice-assets.mjs    # 从原图切素材的脚本（已用过）
```

## License

MIT
