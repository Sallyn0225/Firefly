import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	// 头像
	avatar: "/assets/images/avatar.webp",
	// 名字
	name: "Sallyn",
	// 个人签名
	bio: "Hello, I'm Sallyn.",

	// 链接配置
	// 已经预装的图标集：fa6-brands，fa6-regular，fa6-solid，material-symbols，simple-icons
	// 访问https://icones.js.org/ 获取图标代码，
	// 如果想使用尚未包含相应的图标集，则需要安装它
	// `pnpm add @iconify-json/<icon-set-name>`
	// showName: true 时显示图标和名称，false 时只显示图标
	links: [
		{
			name: "Bilibli",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/85829166",
			showName: false,
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Sallyn0225",
			showName: false,
		},
		{
			name: "X (Twitter)",
			icon: "fa6-brands:x-twitter",
			url: "https://x.com/XiaoLing_Arisa",
			showName: false,
		},
		{
			name: "Email",
			icon: "fa6-solid:envelope",
			url: "mailto:sallyn0225@foxmail.com",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa6-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
