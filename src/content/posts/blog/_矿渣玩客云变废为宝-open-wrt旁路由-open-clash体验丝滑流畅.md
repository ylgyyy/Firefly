---
title: 矿渣玩客云变废为宝：OpenWrt旁路由 + OpenClash，体验丝滑流畅
published: 2026-06-11
updated: 2026-06-11
description: 果你家里也有一台吃灰的“矿渣”——**玩客云**，千万别急着把它卖掉或扔进垃圾桶
image: api
tags:
  - 玩客云
  - 旁路由
  - Openwrt
category: 技术分享
draft: false
author: 杨了个羊
---
## **🚀** **前言**

如果你家里也有一台吃灰的“矿渣”——**玩客云**，千万别急着把它卖掉或扔进垃圾桶！💡
只要花上十几分钟，它就能摇身一变，成为你家庭网络中**又快又省**的“旁路由”。不仅能实现全屋网络去广告，还能轻松搞定各种复杂的网络需求。最关键的是，它的功耗仅有几瓦，24小时开机也完全不心疼电费！⚡

俗话说，“工欲善其事，必先利其器”。在开始这场“变废为宝”的旅程前，让我们先准备好必要的装备。

## **🛠️ 准备工作：工欲善其事**

在开搞之前，请确保你手边有以下物品：

| 序号 | 物品/软件            | 说明                                     |
| :--: | :------------------- | :--------------------------------------- |
|  1️⃣   | **玩客云**           | 闲置设备即可 (V1.0 或 V1.3 版本)         |
|  2️⃣   | **双公头 USB 线**    | 两头均为 USB-A 接口，刷机数据传输必备 🔌  |
|  3️⃣   | **镊子 / 回形针**    | 用于短接主板触点进入刷机模式 🔧           |
|  4️⃣   | **网线**             | 连接玩客云与主路由器 🌐                   |
|  5️⃣   | **USB Burning Tool** | 电脑端烧录工具 (Amlogic 官方)            |
|  6️⃣   | **OpenWrt 固件**     | 推荐 `shiyu1314` 大神版本，简洁稳定 💾    |
|  7️⃣   | **XTerminal**        | SSH 连接工具，用于修改配置和输入命令 💻   |
|  8️⃣   | **OpenClash 插件**   | 核心代理插件文件 (`.apk`)，需手动上传 🧩  |
|  9️⃣   | **OpenClash 内核**   | 推荐 `Clash Meta` 内核，需赋予执行权限 ⚙️ |

OpenWrt玩客云固件下载：

https://github.com/shiyu1314/openwrt-onecloud/releases

OpenClash插件下载：

（国际）：https://github.com/vernesong/OpenClash

（国内）：https://wwbsy.lanzoue.com/iEHZb3j8rona 密码:2bqj

OpenClash内核下载：

[https://wwbsy.lanzoue.com/i6iyy3j8safe

](https://wwbsy.lanzoue.com/i6iyy3j8safe)烧录工具下载：
[https://androiddatahost.com/c4vk5

](https://androiddatahost.com/c4vk5)XterminalSSH工具下载：
[https://www.terminal.icu](https://www.terminal.icu/)

玩客云openwrt安装包：https://box.trrr.top/#/?code=4PJUP

## **🔓 第一步：玩客云拆机与版本识别**

玩客云的外壳采用**卡扣 + 螺丝**的设计，拆解需要一点耐心。

1. 撬开后盖：从 SD 卡槽处小心抠开背后的贴片。如果是第一次拆机，建议用吹风机稍微加热，软化胶水。
2. 卸下螺丝：揭开贴片后，你会看到藏在里面的 6 颗螺丝，全部卸下。
3. 取出主板：取下塑料挡片，捏住主板边缘左右轻微晃动，慢慢向外拉出即可。

**🧐 如何区分版本？**

玩客云主要有 **V1.0** 和 **V1.3** 两个版本，它们的**短接触点位置不同**，刷机前务必确认：

- V1.3：通常在 SD 卡槽附近印有 “V1.3” 字样。
- V1.0：如果没有标注，大概率是 V1.0。

💡 **提示**：请在网上搜索“玩客云 V1.0/V1.3 短接图”，对照图片找到对应的金属触点位置。

## **💻 第二步：刷入 OpenWrt 固件**

这是最关键的一步，请仔细操作：

1. 连接电脑：将主板靠近 HDMI 接口的 USB 口插入双公头 USB 线，另一端连接电脑。
2. 短接通电：

- 用镊子短接主板上的刷机触点。
- 保持短接状态，插入电源适配器。
- 当电脑端的 USB Burning Tool 软件识别到设备（显示“发现新硬件”或类似提示）时，松开镊子。

导入固件：

- 点击软件左上角 文件 -> 导入烧录包，选择下载好的 OpenWrt 固件。
- 在右侧选项栏勾选 擦除所有 (Erase All)。
- 点击 开始 按钮。

等待完成：进度条走完后变为绿色，并显示 “烧录成功”。 收尾：点击停止，拔掉 USB 线和电源，将玩客云重新组装好。

## **⚙️ 第三步：修改 IP 地址并网**

由于 OpenWrt 默认 IP (192.168.2.2) 可能与你家主路由不在同一网段，我们需要先修改它。

**1. 临时直连修改**

- 将玩客云通电，用网线直接连接电脑和玩客云。
- 使用 SSH 工具（如 XTerminal、Putty）连接：
  - IP: 192.168.2.2
  - 用户名: root
  - 密码: root (默认)

**2. 编辑网络配置**

在命令行中输入以下命令编辑配置文件：

```
vi /etc/config/network
```

- 按 i 键进入编辑模式。
- 找到 option ipaddr '192.168.2.2' 这一行。
- 将其修改为你主路由同网段的空闲 IP，例如：

option ipaddr '10.10.10.249'

*(假设你的主路由是 10.10.10.253)*

- 按 Esc 退出编辑，输入 :wq 保存并退出。

**3. 重启并测试**

```
reboot
```

重启后，使用新 IP (10.10.10.249) 重新 SSH 连接。如果成功，拔出连接电脑的网线，将玩客云通过网线连接到**主路由的 LAN 口**。

## **🌐 第四步：配置旁路由模式**

打开浏览器访问 http://192.168.10.254，登录 OpenWrt 后台（账号密码均为 root）。

**1. 设置 LAN 口网关**

- 进入 网络 -> 接口 -> LAN -> 编辑。
- IPv4 网关：填写主路由 IP（如 10.10.10.253）。
- DNS 服务器：填写 114.114.114.114 或运营商 DNS。
- 点击 保存 & 应用。

**2. 关闭旁路由 DHCP**

- 仍在 LAN 口编辑页面，切换到 DHCP 服务器 标签页。
- 勾选 忽略此接口。
- 取消勾选 动态 DHCP。
- 在 IPv4 设置 中，将 DHCPv4 服务器 选为 已禁用。
- 在 IPv6 设置 中，将 RA 服务 和 DHCPv6 服务 均选为 已禁用。
- 点击 保存 & 应用。

**3. 主路由设置（关键一步）**

- 登录你的主路由器后台。
- 找到 DHCP 服务器 设置。
- 将 默认网关 (或路由器地址) 填写为旁路由的 IP：192.168.10.254。
- 保存设置。

✅ **验证**：回到 OpenWrt 后台，进入 网络 -> 网络诊断，Ping openwrt.org，若能通说明网络配置成功！

## **🚀 第五步：安装 OpenClash 实现科学加速**

为了让网络更强大，我们安装 OpenClash 插件。

**1. 更新源并安装依赖**

通过 SSH 连接旁路由，执行以下命令：

*# 更新软件源*

```
apk update
```

*# 安装 OpenClash 依赖*

```
apk add bash dnsmasq-full curl ca-bundle ip-full ruby ruby-yaml kmod-tun kmod-inet-diag unzip kmod-nft-tproxy luci-compat luci luci-base
```

**2. 上传并安装插件**

- 将提前下载好的 openclash.apk 文件上传到玩客云的 /tmp 目录（可使用 SFTP 工具）。
- 执行安装命令：

```
apk add -q --force-overwrite --clean-protected --allow-untrusted /tmp/openclash.apk
```

**3. 上传内核**

- 创建内核目录：

```
mkdir -p /etc/openclash/core
```

- 将下载好的 clash_meta 内核文件上传至 /etc/openclash/core 目录。
- 赋予执行权限（必须执行）：

```
chmod 755 /etc/openclash/core/clash_meta
```

**4. 启动与配置**

1. 退出并重新登录 OpenWrt 后台。
2. 点击顶部菜单 服务 -> OpenClash。
3. 查看 运行状态，若显示客户端和内核版本号，说明安装成功！🎉
4. 进入 配置文件管理，导入你的订阅链接。
5. 点击 启动 按钮。

一切配置完成后，你的家庭网络将迎来质的飞跃。