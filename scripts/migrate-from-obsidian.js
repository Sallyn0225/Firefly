/**
 * Obsidian/Quartz to Firefly Migration Script
 *
 * 将 Obsidian/Quartz 格式的文章迁移到 Firefly/Astro
 *
 * 运行: node scripts/migrate-from-obsidian.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import grayMatter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONFIG = {
	sourceDir: path.join(__dirname, '../src/obsidian_quartz'),
	targetDir: path.join(__dirname, '../src/content/posts'),
	imageSourceDir: path.join(__dirname, '../src/obsidian_quartz/images'),
	imageTargetDir: path.join(__dirname, '../src/content/posts/images'),
	dryRun: false, // 设置为 false 开始真正迁移
}

// 根据目录结构确定分类
function getCategoryFromPath(filePath) {
	const relativePath = path.relative(CONFIG.sourceDir, filePath)
	const parts = relativePath.split(path.sep)

	if (parts.length > 1) {
		const category = parts[0]
		// 映射中文分类到你想要的名称
		const categoryMap = {
			'学习': '学习',
			'实用': '实用',
			'随笔': '随笔',
		}
		return categoryMap[category] || category
	}
	return ''
}

// 转换日期格式为 Date 对象或 YYYY-MM-DD 字符串
function formatDate(date) {
	if (!date) return new Date()

	// 如果已经是字符串格式 YYYY-MM-DD，转换为 Date
	if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return new Date(date)
	}

	// 如果已经是 Date 对象，直接返回
	if (date instanceof Date) {
		return date
	}

	// 其他格式尝试转换
	return new Date(date)
}

// 转换 frontmatter
function transformFrontmatter(data, filePath) {
	const transformed = {
		title: data.title || '',
		published: formatDate(data.date),
		description: data.description || '',
		image: 'api', // 使用随机封面
		tags: Array.isArray(data.tags) ? data.tags : [],
		category: getCategoryFromPath(filePath) || '',
		draft: data.draft === true,
		lang: '', // 如果需要可以设置
	}

	// 如果有 updated 字段
	if (data.updated) {
		transformed.updated = data.updated
	}

	return transformed
}

// 转换图片引用: ![[image.webp]] -> ![](./images/image.webp)
function transformImageReferences(content) {
	// Obsidian 格式: ![[filename.ext]]
	// 转换为相对路径,指向 src/content/posts/images/
	return content.replace(/!\[\[([^\]]+)\]\]/g, (match, filename) => {
		return `![](./images/${filename})`
	})
}

// 转换内部链接: [[link|text]] -> [text](/posts/link/)
// [[link]] -> [link](/posts/link/)
function transformInternalLinks(content) {
	// 格式: [[link|display text]]
	content = content.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (match, link, text) => {
		// 清理链接中的特殊字符
		const cleanLink = link.trim()
		return `[${text}](/posts/${cleanLink}/)`
	})

	// 格式: [[link]]
	content = content.replace(/\[\[([^\]|]+)\]\]/g, (match, link) => {
		const cleanLink = link.trim()
		return `[${cleanLink}](/posts/${cleanLink}/)`
	})

	return content
}

// 处理单个文件
function processFile(filePath) {
	const content = fs.readFileSync(filePath, 'utf-8')

	// 解析 frontmatter
	const { data, content: body } = grayMatter(content)

	// 转换 frontmatter
	const newFrontmatter = transformFrontmatter(data, filePath)

	// 转换内容
	let newBody = body
	newBody = transformImageReferences(newBody)
	newBody = transformInternalLinks(newBody)

	// 生成新文件
	const newContent = grayMatter.stringify(newBody, newFrontmatter)

	return {
		originalPath: filePath,
		newContent,
		frontmatter: newFrontmatter,
	}
}

// 获取目标文件路径
function getTargetPath(sourcePath) {
	const relativePath = path.relative(CONFIG.sourceDir, sourcePath)
	const filename = path.basename(sourcePath)

	// 忽略 index.md 和其他非文章文件
	if (filename === 'index.md' || filename === 'robots.txt') {
		return null
	}

	// 直接放到 posts 目录下,保持原文件名
	return path.join(CONFIG.targetDir, filename)
}

// 递归获取所有 markdown 文件
function getAllMarkdownFiles(dir) {
	const files = []

	function traverse(currentDir) {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name)

			if (entry.isDirectory()) {
				traverse(fullPath)
			} else if (entry.isFile() && /\.md$/.test(entry.name)) {
				files.push(fullPath)
			}
		}
	}

	traverse(dir)
	return files
}

// 主函数
function migrate() {
	console.log('🚀 开始迁移 Obsidian/Quartz 文章到 Firefly...\n')
	console.log(`模式: ${CONFIG.dryRun ? '预览模式 (不会实际修改文件)' : '执行模式'}\n`)

	// 获取所有 markdown 文件
	const files = getAllMarkdownFiles(CONFIG.sourceDir)
	console.log(`📁 找到 ${files.length} 个 markdown 文件\n`)

	let processed = 0
	let skipped = 0
	const errors = []

	// 处理每个文件
	for (const file of files) {
		try {
			const targetPath = getTargetPath(file)

			if (!targetPath) {
				console.log(`⏭️  跳过: ${path.basename(file)}`)
				skipped++
				continue
			}

			const result = processFile(file)

			if (!CONFIG.dryRun) {
				// 确保目标目录存在
				const targetDir = path.dirname(targetPath)
				if (!fs.existsSync(targetDir)) {
					fs.mkdirSync(targetDir, { recursive: true })
				}

				// 写入新文件
				fs.writeFileSync(targetPath, result.newContent, 'utf-8')
				console.log(`✅ 已迁移: ${path.basename(file)} -> ${path.basename(targetPath)}`)
			} else {
				console.log(`🔍 预览: ${path.basename(file)}`)
				console.log(`   分类: ${result.frontmatter.category}`)
				console.log(`   标签: ${result.frontmatter.tags.join(', ')}`)
				console.log(`   日期: ${result.frontmatter.published}`)
			}

			processed++
		} catch (error) {
			errors.push({ file, error: error.message })
			console.error(`❌ 错误: ${path.basename(file)} - ${error.message}`)
		}
	}

	// 处理图片
	console.log('\n📸 处理图片文件...')
	if (fs.existsSync(CONFIG.imageSourceDir)) {
		const imageFiles = fs.readdirSync(CONFIG.imageSourceDir)
		console.log(`找到 ${imageFiles.length} 个图片文件`)

		if (!CONFIG.dryRun) {
			// 确保目标目录存在
			if (!fs.existsSync(CONFIG.imageTargetDir)) {
				fs.mkdirSync(CONFIG.imageTargetDir, { recursive: true })
			}

			// 复制图片
			for (const imageFile of imageFiles) {
				const sourcePath = path.join(CONFIG.imageSourceDir, imageFile)
				const targetPath = path.join(CONFIG.imageTargetDir, imageFile)
				fs.copyFileSync(sourcePath, targetPath)
			}
			console.log(`✅ 已复制 ${imageFiles.length} 个图片到 ${CONFIG.imageTargetDir}`)
		} else {
			console.log(`🔍 预览: 将复制图片到 ${CONFIG.imageTargetDir}`)
		}
	}

	// 总结
	console.log('\n' + '='.repeat(50))
	console.log('📊 迁移总结:')
	console.log(`   已处理: ${processed} 个文件`)
	console.log(`   已跳过: ${skipped} 个文件`)
	console.log(`   错误: ${errors.length} 个`)

	if (errors.length > 0) {
		console.log('\n❌ 错误详情:')
		for (const { file, error } of errors) {
			console.log(`   ${path.basename(file)}: ${error}`)
		}
	}

	if (CONFIG.dryRun) {
		console.log('\n⚠️  这是预览模式,没有实际修改任何文件')
		console.log('💡 修改 CONFIG.dryRun = false 开始真正迁移')
	} else {
		console.log('\n✅ 迁移完成!')
		console.log('💡 请检查 src/content/posts/ 目录确认结果')
	}
}

// 运行迁移
migrate()
