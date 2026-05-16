---
title: 在 Linux 上安装 Docker 和 Docker Compose
published: 2026-05-16
description: 安装 Docker 和 Docker Compose
image: ./cover.jpg
tags:
  - docker
  - docker-compose
category: 技术分享
draft: false
author: xizicc
---
**配置 Docker 官方源（替代阿里云源，适配国外网络）：**

```
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
```

国外服务器可以省略配置docker官方源直接执行下面的

**更新环境**

```
apt update -y && apt upgrade -y
```

**安装docker和docker-compose**

```
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

**设置开机自动启动**

```
systemctl enable --now docker
```

**查看 Docker 版本**

```
docker --version
```

**查看 Docker Compose 版本**

```
docker-compose --version
```
