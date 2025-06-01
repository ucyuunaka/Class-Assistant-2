# 课堂助手 - Class Assistant

![课堂助手](public/icons/logo_png_cropped.png)

## 📚 项目介绍

课堂助手是一个专为学生设计的学习管理工具，旨在帮助学生更高效地管理他们的学习生活。通过直观的界面和实用的功能，让学生能够专注于学习本身，而不是繁琐的管理工作。

## ✨ 主要功能

### 1. 📅 课程管理

- 创建和自定义个人课表
- 可视化展示每周课程安排
- 支持课表导出和分享
- 支持学期和周次管理

### 2. 📊 成绩管理

- 记录考试和作业成绩
- 自动计算 GPA 和平均分
- 生成成绩趋势分析图表
- 支持加权成绩计算

### 3. ⏰ 考试倒计时

- 设置重要考试日期
- 自动计算剩余时间
- 智能提醒功能
- 帮助制定备考计划

### 4. 💬 课评速记

- 快速记录课程感受
- 使用表情和简短评价
- 支持互动交流
- 分享课堂体验

### 5. 👤 个人资料

- 定制个人学习资料
- 管理专业和课程信息
- 个性化学习服务

### 6. ⚙️ 偏好设置

- 多种界面主题选择
- 语言偏好设置
- 自定义使用体验

## 🛠️ 技术栈

- **前端框架**: 原生 HTML5 + CSS3 + JavaScript (ES6+)
- **UI 图标**: Font Awesome 6.0 + Remix Icon
- **架构设计**: 模块化组件设计
- **响应式设计**: 完美支持桌面端和移动端
- **数据存储**: 本地存储 + 云端同步

## 📂 项目结构

```
Class-Assistant-2/
├── components/          # 可复用组件
│   ├── buttons/        # 按钮组件
│   ├── footer/         # 页脚组件
│   ├── header/         # 页头组件
│   ├── modals/         # 模态框组件
│   ├── notifications/  # 通知组件
│   ├── scrollAnimation/# 滚动动画组件
│   └── sidebar/        # 侧边栏组件
├── css/                # 样式文件
│   ├── pages/          # 页面专属样式
│   └── themes/         # 主题样式
├── js/                 # JavaScript文件
│   └── pages/          # 页面专属脚本
│       ├── countdown/  # 倒计时功能
│       └── schedule/   # 课表功能
├── pages/              # 页面文件
├── public/             # 公共资源
│   ├── icons/          # 图标资源
│   └── lib/            # 第三方库
├── index.html          # 主页
└── 启动本地服务器.bat   # 快速启动脚本
```

## 🚀 快速开始

### 环境要求

- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 本地 Web 服务器（可选）

### 安装步骤

1. **克隆项目**

   ```bash
   git clone https://github.com/yourusername/Class-Assistant-2.git
   cd Class-Assistant-2
   ```

2. **启动项目**

   **方式一：使用批处理文件（Windows）**

   ```bash
   双击运行 "启动本地服务器.bat"
   ```

   **方式二：使用 Python 服务器**

   ```bash
   python -m http.server 8000
   ```

   **方式三：使用 Node.js 服务器**

   ```bash
   npx http-server
   ```

3. **访问应用**

   在浏览器中打开 `http://localhost:8000`

## 📱 响应式设计

课堂助手采用响应式设计，完美支持：

- 💻 桌面端（1920px+）
- 💻 笔记本（1366px - 1920px）
- 📱 平板（768px - 1366px）
- 📱 手机（320px - 768px）

## 🌟 特色亮点

- **简洁优雅的界面**: 采用现代设计语言，界面清爽不繁杂
- **流畅的动画效果**: 精心设计的过渡动画，提升使用体验
- **智能提醒系统**: 不错过任何重要的学习任务
- **数据云端同步**: 多设备无缝切换，数据永不丢失
- **个性化定制**: 多种主题和设置选项，打造专属体验

## 🤝 贡献指南

欢迎对项目进行贡献！如果你有好的想法或发现了问题：

1. Fork 本项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 项目主页: [https://github.com/yourusername/Class-Assistant-2](https://github.com/yourusername/Class-Assistant-2)
- 问题反馈: [Issues](https://github.com/yourusername/Class-Assistant-2/issues)
- 邮箱: your-email@example.com

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

⭐ 如果这个项目对你有帮助，请给我们一个 Star！

💡 **让学习变得更简单，让生活变得更有序** - 课堂助手团队
