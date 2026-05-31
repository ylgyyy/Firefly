---
title: Rclone 挂载 WebDAV 远程存储到本地
published: 2026-05-31
description: 本文以挂载 Alist WebDAV 为例，适用于所有支持 WebDAV 协议的远程存储。
image: ./cover.jpg
tags: [rclone, webdav]
category: 教程
draft: false
---

> 本文以挂载 Alist WebDAV 为例，适用于所有支持 WebDAV 协议的远程存储。

---

## 1. 安装 Rclone

将下载好的 `rclone` 二进制文件复制到系统路径并赋予执行权限：

```bash
rm -f /usr/bin/rclone
cp /path/to/rclone /usr/bin
chmod +x /usr/bin/rclone
```

验证安装：

```bash
rclone version
```

## 2. 安装依赖组件

```bash
apt-get update
apt-get install fuse3
```

## 3. 配置远程存储

```bash
rclone config
```

按提示操作：

1. 输入 `n` 新建远程存储
2. 输入名称（例如 `myremote`）
3. 选择存储类型，WebDAV 对应 `webdav`
4. 填写 WebDAV 地址，例如 `http://127.0.0.1:5244/dav`
5. 选择认证方式并填写用户名、密码
6. 确认保存

验证配置是否正确：

```bash
rclone lsd myremote:
```

## 4. 创建本地挂载点

```bash
mkdir /home/remote
```

## 5. 挂载到本地

```bash
rclone mount myremote: /home/remote \
  --header "Referer:" \
  --multi-thread-streams 6 \
  --buffer-size 512M \
  --vfs-fast-fingerprint \
  --vfs-cache-mode full \
  --no-modtime \
  --file-perms 0777 \
  --copy-links \
  --allow-other \
  --allow-non-empty \
  --umask 000 \
  --daemon \
  --cache-dir /home/cache/rclone \
  --vfs-cache-max-size 15G \
  --vfs-cache-max-age 24h \
  --dir-cache-time 1h
```

### 常用参数说明

| 参数 | 说明 |
|------|------|
| `--vfs-cache-mode full` | 启用完整缓存，支持随机读写 |
| `--multi-thread-streams 6` | 多线程并发传输 |
| `--buffer-size 512M` | 读写缓冲区大小 |
| `--vfs-cache-max-size 15G` | 缓存目录最大容量 |
| `--vfs-cache-max-age 24h` | 缓存文件最大存活时间 |
| `--dir-cache-time 1h` | 目录列表缓存时间 |
| `--allow-other` | 允许其他用户访问挂载点 |
| `--daemon` | 后台运行 |

### 自定义缓存目录

如果系统盘空间不足，可通过 `--cache-dir` 指定缓存位置：

```bash
--cache-dir /mnt/mydisk/Caches/rclone
```

## 6. 卸载挂载

```bash
fusermount -qzu /home/remote
```

## 7. 设置开机自启动

### 7.1 创建 systemd 服务文件

```bash
nano /etc/systemd/system/myremote.service
```

写入以下内容（将 `myremote` 和挂载路径替换为实际值）：

```ini
[Unit]
Description=Rclone Mount - myremote
After=network.target

[Service]
Type=simple
ExecStartPre=-/bin/sleep 30
ExecStart=rclone mount myremote: /home/remote \
  --header "Referer:" \
  --multi-thread-streams 6 \
  --buffer-size 512M \
  --vfs-fast-fingerprint \
  --vfs-cache-mode full \
  --no-modtime \
  --file-perms 0777 \
  --copy-links \
  --allow-other \
  --allow-non-empty \
  --umask 000 \
  --cache-dir /home/cache/rclone \
  --vfs-cache-max-size 15G \
  --vfs-cache-max-age 24h \
  --dir-cache-time 1h

[Install]
WantedBy=default.target
```

### 7.2 启用并启动服务

```bash
systemctl daemon-reload
systemctl enable myremote.service
systemctl start myremote.service
```

### 7.3 查看服务状态

```bash
systemctl status myremote.service
```
