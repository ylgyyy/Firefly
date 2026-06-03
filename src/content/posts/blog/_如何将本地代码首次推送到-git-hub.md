---
title: 如何将本地代码首次推送到 GitHub
published: 2026-06-03
updated: 2026-06-03
description: 如何把本地代码推送到github
image: api
tags:
  - Github
category: 教程
draft: false
author: 杨了个羊
---
> 注意：GitHub 目前终端推送不再支持登录密码，必须使用 **个人访问令牌 (PAT)**。

---

## 步骤一：创建 GitHub 空仓库

1. 登录 GitHub，点击右上角 **`+`** → **New repository**。

2. 填写仓库名称。

3. 选择 **Public** 或 **Private**。

4. **不要勾选** `Add a README file` 和 `Add .gitignore`，保持仓库为空。

5. 点击 **Create repository**。

6. 复制页面提供的 **HTTPS 地址**：

   ```
   https://github.com/你的用户名/你的仓库名.git
   ```

---

## 步骤二：生成个人访问令牌 (Token)

Token 是你在终端推送代码时的"通行密码"。

1. 点击 GitHub 右上角头像 → **Settings**。
2. 左侧菜单滑到底部 → **Developer settings**。
3. **Personal access tokens** → **Tokens (classic)**。
4. 点击 **Generate new token (classic)**。
5. 填写 Note（如 `VPS Push`），选择 Expiration。
6. **勾选 `repo` 权限**（完整控制私有仓库）。
7. 点击 **Generate token**。
8. **立即复制 Token**（以 `ghp_` 开头），刷新页面后将永久隐藏，请妥善保存。

---

## 步骤三：初始化 Git 仓库

```bash
# 进入项目目录
cd /你的/项目/路径

# 配置 Git 身份（首次使用）
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub注册邮箱"

# 初始化仓库
git init
```

---

## 步骤四：添加并提交代码

```bash
# 将所有文件加入暂存区（自动应用 .gitignore 规则）
git add .

# 提交并填写备注
git commit -m "Initial commit"
```

---

## 步骤五：推送到 GitHub

```bash
# 将主分支命名为 main
git branch -M main

# 关联远程仓库（替换为步骤一复制的地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送
git push -u origin main
```

执行 `git push` 后，终端会依次提示输入：

| 提示                                     | 输入内容                                                     |
| ---------------------------------------- | ------------------------------------------------------------ |
| `Username for 'https://github.com':`     | 你的 GitHub 用户名                                           |
| `Password for 'https://...@github.com':` | **粘贴 `ghp_` 开头的 Token**（粘贴时无任何显示，按回车即可） |

看到 `Branch 'main' set up to track remote branch 'main' from 'origin'` 即表示上传成功。