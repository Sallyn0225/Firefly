/**
 * 预览单个文件的转换效果
 */
import fs from 'fs'
import grayMatter from 'gray-matter'

// 示例文件
const testFile = 'src/obsidian_quartz/学习/how-to-use-ai-for-free.md'

// 日期格式化
function formatDate(date) {
	if (!date) return new Date().toISOString().split('T')[0]
	if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return date
	}
	const dateObj = new Date(date)
	const year = dateObj.getFullYear()
	const month = String(dateObj.getMonth() + 1).padStart(2, '0')
	const day = String(dateObj.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

// 转换图片
function transformImageReferences(content) {
	return content.replace(/!\[\[([^\]]+)\]\]/g, (match, filename) => {
		return `![](./images/${filename})`
	})
}

// 转换链接
function transformInternalLinks(content) {
	content = content.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (match, link, text) => {
		return `[${text}](/posts/${link.trim()}/)`
	})
	content = content.replace(/\[\[([^\]|]+)\]\]/g, (match, link) => {
		return `[${link.trim()}](/posts/${link.trim()}/)`
	})
	return content
}

const content = fs.readFileSync(testFile, 'utf-8')
const { data, content: body } = grayMatter(content)

console.log('════════════════════════════════════════════════')
console.log('📄 原始文件: how-to-use-ai-for-free.md')
console.log('════════════════════════════════════════════════\n')

console.log('【原始 Frontmatter】')
console.log('---')
console.log(`title: ${data.title}`)
console.log(`description: ${data.description}`)
console.log(`tags:`)
data.tags.forEach(tag => console.log(`  - ${tag}`))
console.log(`date: ${data.date}`)
console.log(`draft: ${data.draft}`)
console.log('---\n')

console.log('【转换后 Frontmatter】')
console.log('---')
console.log(`title: ${data.title}`)
console.log(`published: ${formatDate(data.date)}`)
console.log(`description: ${data.description}`)
console.log(`image: api`)
console.log(`tags:`)
data.tags.forEach(tag => console.log(`  - ${tag}`))
console.log(`category: 学习`)
console.log(`draft: ${data.draft}`)
console.log(`lang: ''`)
console.log('---\n')

console.log('【原始内容片段】')
console.log(body.substring(0, 300))
console.log('\n...\n')

console.log('【转换后内容片段】')
let newBody = transformImageReferences(body)
newBody = transformInternalLinks(newBody)
console.log(newBody.substring(0, 300))
console.log('\n...\n')

console.log('════════════════════════════════════════════════')
console.log('🔍 主要变化:')
console.log('════════════════════════════════════════════════')
console.log('✅ date → published (格式: YYYY-MM-DD)')
console.log('✅ 添加 category: 学习')
console.log('✅ 添加 image: api (随机封面)')
console.log('✅ ![[image.webp]] → ![](./images/image.webp)')
console.log('✅ [[link|text]] → [text](/posts/link/)')
console.log('════════════════════════════════════════════════\n')
