/**
 * Telegram 通知脚本
 * 检测 git push 中新增的文章，通过 Telegram Bot 发送通知到频道
 *
 * 用法: node scripts/notify-telegram.js
 * 环境变量:
 *   TELEGRAM_BOT_TOKEN  - Bot 的 API Token
 *   TELEGRAM_CHANNEL_ID  - 目标频道 ID（如 @xiziccc）
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const POSTS_DIR = "src/content/posts";
const SITE_URL = "https://blog.trrr.top";

if (!BOT_TOKEN) {
  console.error("❌ 缺少环境变量 TELEGRAM_BOT_TOKEN");
  process.exit(1);
}
if (!CHANNEL_ID) {
  console.error("❌ 缺少环境变量 TELEGRAM_CHANNEL_ID");
  process.exit(1);
}

/**
 * 将文件路径转换为文章 URL
 * src/content/posts/blog/My-Post.md → https://blog.trrr.top/posts/blog/my-post/
 */
function filePathToUrl(filePath) {
  // 去掉 src/content/posts/ 前缀和文件扩展名
  let slug = filePath
    .replace(/^src\/content\/posts\//, "")
    .replace(/\.(md|mdx)$/i, "");

  // 将路径中的空格替换为连字符
  slug = slug.replace(/\s+/g, "-");

  // 确保没有前导或尾部斜杠
  slug = slug.replace(/^\/+/, "").replace(/\/+$/, "");

  return `${SITE_URL}/posts/${slug}/`;
}

/**
 * 获取本次 push 中新增的文章文件列表
 */
function getNewPostFiles() {
  try {
    // 获取变更的文件列表，只保留新增的 (A) 和修改的 (M)
    const changedFiles = execSync(
      'git diff --name-only --diff-filter=A HEAD~1 HEAD -- "src/content/posts/"',
      { encoding: "utf-8" }
    ).trim();

    if (!changedFiles) {
      console.log("📝 没有新增的文章文件");
      return [];
    }

    const files = changedFiles
      .split("\n")
      .filter((f) => /\.(md|mdx)$/i.test(f.trim()));

    console.log(`📝 检测到 ${files.length} 个新增/修改的文章文件`);
    return files;
  } catch (err) {
    // 如果是首次提交，尝试获取所有文件
    console.log("⚠️  无法比较 HEAD~1，尝试获取仓库中所有文章文件");
    try {
      const allFiles = execSync(
        'git ls-files -- "src/content/posts/*.md" "src/content/posts/*.mdx"',
        { encoding: "utf-8" }
      ).trim();
      return allFiles ? allFiles.split("\n") : [];
    } catch {
      console.error("❌ 无法获取文章文件列表");
      return [];
    }
  }
}

/**
 * 解析文章 frontmatter，提取标题和元数据
 */
function parsePost(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    return {
      title: data.title || path.basename(filePath, path.extname(filePath)),
      draft: data.draft === true,
      description: data.description || "",
      tags: data.tags || [],
    };
  } catch (err) {
    console.error(`⚠️  无法解析文件 ${filePath}: ${err.message}`);
    return null;
  }
}

/**
 * 发送消息到 Telegram 频道
 */
async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: CHANNEL_ID,
    text: text,
    parse_mode: "HTML",
    disable_web_page_preview: false,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Telegram API 错误: ${data.description}`);
  }

  return data;
}

/**
 * 格式化文章通知消息
 */
function formatMessage(post, url) {
  const tags =
    post.tags.length > 0
      ? post.tags.map((t) => `#${t.replace(/\s+/g, "_")}`).join(" ")
      : "";

  let message = `📝 <b>新文章发布</b>\n\n`;
  message += `<a href="${url}">${escapeHtml(post.title)}</a>\n`;
  if (post.description) {
    message += `\n${escapeHtml(post.description)}`;
  }
  if (tags) {
    message += `\n\n${tags}`;
  }
  return message;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function main() {
  console.log("🔍 检查新文章...");

  const newFiles = getNewPostFiles();

  if (newFiles.length === 0) {
    console.log("✅ 没有需要通知的新文章");
    return;
  }

  let notified = 0;
  let skipped = 0;

  for (const file of newFiles) {
    const post = parsePost(file);

    if (!post) {
      skipped++;
      continue;
    }

    if (post.draft) {
      console.log(`⏭️  跳过草稿: ${post.title}`);
      skipped++;
      continue;
    }

    const url = filePathToUrl(file);
    const message = formatMessage(post, url);

    console.log(`📤 发送通知: ${post.title}`);
    console.log(`   链接: ${url}`);

    try {
      await sendTelegramMessage(message);
      console.log(`   ✅ 发送成功`);
      notified++;
    } catch (err) {
      console.error(`   ❌ 发送失败: ${err.message}`);
    }
  }

  console.log(`\n✅ 完成: ${notified} 条通知已发送, ${skipped} 条跳过`);
}

main().catch((err) => {
  console.error("❌ 脚本执行失败:", err);
  process.exit(1);
});
