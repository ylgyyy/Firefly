---
title: 安装claude code的详细教程
published: 2026-06-03
description: 安装claude code 的详细方法，手把手教你安装
image: "api"
tags:
  - ai
  - claude
category: 网络智能
draft: false
author: 杨
---

> Claude Code 是 Anthropic 推出的终端 AI 编程助手，支持 Windows / macOS / Linux。

---
## 1. 前置环境

| 依赖                   | 最低版本 | 说明                                                      |
| ---------------------- | -------- | --------------------------------------------------------- |
| **Node.js**            | ≥ 18.0.0 | 推荐使用最新的 LTS 版本                                   |
| **Git**                | ≥ 2.23   | 用于版本控制和自动上下文检测                              |
| **Git Bash** (Windows) | —        | Windows 下必须使用 Git Bash 或 WSL，不支持 CMD/PowerShell |

### 1.1 安装 Node.js

**Windows:**

```bash
# 方式一：官网下载安装包
# https://nodejs.org/zh-cn → 下载 LTS 版本 .msi 安装包，双击安装

# 方式二：使用 winget（Windows 11 自带）
winget install OpenJS.NodeJS.LTS
```

**macOS:**

```bash
# 方式一：官网下载 .pkg 安装包
# 方式二：使用 Homebrew
brew install node
```

**Linux:**

```bash
# Debian / Ubuntu
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 也可以使用 nvm 管理多版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install --lts
nvm use --lts
```

验证安装：

```bash
node -v   # 应输出 ≥ v18.0.0
npm -v    # 应输出 ≥ v9.0.0
```

### 1.2 安装 Git

**Windows:**

```bash
# 下载 Git for Windows：https://git-scm.com/download/win
# 安装时选择 "Use Git from Git Bash only" 或 "Use Git and optional Unix tools from the Command Prompt"
winget install Git.Git
```

**macOS:**

```bash
brew install git
# 或安装 Xcode Command Line Tools（自带 git）
xcode-select --install
```

**Linux:**

```bash
# Debian / Ubuntu
sudo apt install git

# RHEL / Fedora
sudo dnf install git
```

验证安装：

```bash
git --version   # 应输出 ≥ git version 2.23
```

---

## 2. 安装 Claude Code

### 方式一：npm 全局安装（推荐，全平台通用）

```bash
npm install -g @anthropic-ai/claude-code
```

### 方式二：Windows 独立安装包

从 [Claude Code 官方页面](https://docs.anthropic.com/en/docs/claude-code/overview) 下载 `.exe` 安装包，双击运行。

### 方式三：使用 winget（Windows）

```bash
winget install Anthropic.ClaudeCode
```

### 方式四：使用 Homebrew（macOS）

```bash
brew install claude-code
```

验证安装：

```bash
claude --version
```

---

## 3. 登录认证

首次运行 `claude` 时会自动弹出浏览器完成 OAuth 登录授权：

```bash
claude
```

之后无需重复登录。如需重新登录：

```bash
claude login
claude logout   # 登出
```

> 如果你的环境没有浏览器（如服务器、CI），才需要手动设置 `ANTHROPIC_API_KEY` 环境变量。日常使用 OAuth 登录就够了。

---

## 4. 安装 cc-switch（可选但推荐）

`cc-switch` 是一个便捷的模型切换工具，用于快速切换 Claude Code 使用的 AI 模型。

```bash
# 安装
npm install -g cc-switch

# 安装后 claude 命令会自动集成，直接使用即可
```

### 常用切换命令

```bash
cc-switch opus     # 切换到 Claude Opus（最强，适合复杂任务）
cc-switch sonnet   # 切换到 Claude Sonnet（均衡，默认模型）
cc-switch haiku    # 切换到 Claude Haiku（最快，适合简单任务）
```

> **提示：** 在 Claude Code 会话中输入 `/model` 也可以查看和切换模型。

---

## 5. 首次运行

```bash
# 进入你的项目目录
cd /path/to/your/project

# 启动 Claude Code
claude
```

首次运行会引导你完成：

- OAuth 登录或 API Key 验证
- 选择默认模型
- 是否允许 Claude Code 读取文件 / 执行命令等权限设置

---

## 6. 更新 Claude Code

```bash
# npm 安装方式
npm update -g @anthropic-ai/claude-code

# 查看当前版本
claude --version
```

---

## 7. 常见问题

### Q: Windows 下报错 "command not found"

**原因：** 未使用 Git Bash 或 WSL 终端。  
**解决：**

1. 打开 **Git Bash**（右键桌面 → Git Bash Here）

2. 确保 npm 全局路径在 PATH 中：

   ```bash
   npm config get prefix
   # 输出类似 /c/Users/你的用户名/AppData/Roaming/npm
   # 确保该路径在 PATH 环境变量中
   ```

### Q: 提示 "API key is invalid"

**原因：** Key 格式错误或未正确设置环境变量。  
**解决：**

```bash
# 检查环境变量是否生效
echo $ANTHROPIC_API_KEY   # 应输出你的 key

# 检查 key 前缀是否正确，正确格式：
# sk-ant-api03-xxxxxxxxxxxxxxxxxxxx
```

### Q: 提示 Node.js 版本过低

**解决：** 升级到 Node.js 18+：

```bash
node -v  # 查看当前版本
# 使用 nvm 升级
nvm install 22
nvm use 22
```

### Q: npm 全局安装权限错误 (Linux/macOS)

**解决：**

```bash
# 推荐使用 nvm，避免 sudo 权限问题
# 或修改 npm 全局目录：
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Q: 国内网络访问慢 / 无法连接

**解决：**

```bash
# npm 设置镜像
npm config set registry https://registry.npmmirror.com

# 安装时指定镜像
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com
```

---

## 8. 常用命令速查

| 命令                | 说明             |
| ------------------- | ---------------- |
| `claude`            | 启动 Claude Code |
| `claude --version`  | 查看版本         |
| `claude login`      | 重新登录         |
| `claude logout`     | 登出             |
| `claude config`     | 修改配置         |
| `claude update`     | 检查并安装更新   |
| `/help`             | 会话中查看帮助   |
| `/model`            | 会话中切换模型   |
| `/cost`             | 查看当前会话费用 |
| `/clear`            | 清除对话历史     |
| `Ctrl+C`            | 退出当前操作     |
| `Ctrl+D` 或 `/exit` | 退出 Claude Code |

---

## 9. 完整安装脚本（一键参考）

```bash
# ===== 适用于 macOS / Linux =====
# 1. 安装 Node.js（如已安装可跳过）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install --lts

# 2. 安装 Git（通常已自带）
git --version || sudo apt install git -y

# 3. 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 4. 安装 cc-switch
npm install -g cc-switch

# 5. 设置 API Key
echo 'export ANTHROPIC_API_KEY="sk-ant-api03-你的key"' >> ~/.bashrc
source ~/.bashrc

# 6. 启动
claude
```

```powershell
# ===== 适用于 Windows (PowerShell 管理员) =====
# 1. 安装 Node.js LTS
winget install OpenJS.NodeJS.LTS
# 重启终端使 node 生效

# 2. 安装 Git
winget install Git.Git
# 重启终端或打开 Git Bash

# 3. 在 Git Bash 中运行：
npm install -g @anthropic-ai/claude-code
npm install -g cc-switch

# 4. 设置环境变量（系统环境变量 UI），或 ~/.bashrc 中添加
export ANTHROPIC_API_KEY="sk-ant-api03-你的key"

# 5. 启动
claude
```