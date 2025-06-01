/**
 * 页脚组件 - 提供全站统一的页脚内容和功能
 * 
 * 主要功能：
 * - 自动加载页脚样式和内容
 * - 更新版权年份
 * - 高亮当前页面对应的链接
 * - 提供智能导航功能
 */

// --- 页脚类定义 ---
class Footer {
  constructor() {
    this.init();
  }

  /**
   * 初始化页脚组件
   * 在DOM加载完成后执行初始化操作
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      // 添加页脚样式
      this.loadStyles();
      // 加载页脚内容
      this.loadFooter();
    });
  }
  
  /**
   * 加载页脚样式
   * 检查并添加页脚CSS样式表到文档头部
   */
  loadStyles() {
    // 检查是否已经加载了样式
    if (!document.querySelector('link[href*="footer.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      
      // 使用正确的路径（相对于项目根目录）
      // 假设页面从根目录或pages目录加载
      let cssPath = window.location.pathname.includes('/pages/') 
        ? '../components/footer/footer.css' 
        : 'components/footer/footer.css';
      
      link.href = '/components/footer/footer.css';
      document.head.appendChild(link);
    }
  }

  /**
   * 加载页脚内容
   * 通过fetch加载页脚HTML模板并处理各种状态
   */  
  loadFooter() {
    // 查找页脚元素
    const footer = document.querySelector('.footer');
    
    if (footer) {
      // 使用正确的路径（相对于项目根目录）
      // 假设页面从根目录或pages目录加载
      let footerPath = window.location.pathname.includes('/pages/') 
        ? '../components/footer/footer.html' 
        : 'components/footer/footer.html';
      
      // 加载页脚内容
      fetch('/components/footer/footer.html')
        .then(response => {
          if (!response.ok) {
            throw new Error('无法加载页脚模板');
          }
          return response.text();
        })
        .then(html => {
          // 插入页脚内容
          footer.innerHTML = `<div class="container">${html}</div>`;
          
          // 更新年份
          this.updateCurrentYear();
          
          // 高亮当前页面链接
          this.highlightCurrentPage();
          
          // 添加链接点击事件处理
          this.setupLinkNavigation();
        })
        .catch(error => {
          console.error('页脚加载失败:', error);
          // 优雅降级：显示错误信息但仍保持页脚区域可见
          footer.innerHTML = '<div class="container"><p style="color: red;">错误：无法加载页脚内容。</p></div>';
        });
    }
  }

  /**
   * 更新版权信息中的年份
   * 自动将页脚中的年份设置为当前年份
   */
  updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
  /**
   * 高亮当前页面在页脚中的链接
   * 根据当前URL路径自动标记对应的页脚导航按钮
   * 注：与buttons.css中的btn-nav类样式配合使用
   */
  highlightCurrentPage() {
    const currentPathname = window.location.pathname;
    // 更新选择器以匹配新的按钮类名
    const footerLinks = document.querySelectorAll('.footer-links .btn-nav');

    footerLinks.forEach(link => {
      const href = link.getAttribute('href');

      // Reset styles first to handle navigation within the site
      link.style.fontWeight = '';
      link.style.color = '';

      if (href && !href.startsWith('http')) { // Only process internal links
        try {
          // Resolve the link's href relative to the document's base URL (origin)
          // This correctly handles paths like 'index.html' and 'pages/schedule.html'
          const linkUrl = new URL(href, window.location.origin);
          const linkPathname = linkUrl.pathname;

          // Compare the resolved pathname with the current pathname
          if (linkPathname === currentPathname) {
            link.style.fontWeight = '600'; // 使用 '600' 或 'bold'
            link.style.color = 'var(--primary-color)';
          }
        } catch (e) {
          console.error(`Error processing footer link href: ${href}`, e);
          // Optionally handle the error, e.g., skip this link
        }
      }
    });
  }
    /**
   * 设置页脚链接的智能导航功能
   * 处理页脚导航按钮点击事件，确保正确的导航行为
   * 注：使用了components/buttons.css中的btn-nav和btn-nav-slide类样式
   */
  setupLinkNavigation() {
    // 选择器已更新为匹配btn-nav类名
    const footerLinks = document.querySelectorAll('.footer-links .btn-nav');
    
    footerLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        
        // 获取原始链接
        const href = link.getAttribute('href');
        
        // 页面跳转
        // 由于 footer.js 在 components/footer/ 目录下加载，
        // 所有来自 footer.html 的链接（如 'index.html' 或 'pages/somepage.html'）
        // 需要向上两级才能正确解析到项目根目录或 pages 目录。
        if (href && !href.startsWith('http')) {
          let targetUrl = href;
          // 如果 HTML 文件在 pages/ 目录下，则其引用的 footer.html 内的链接已经是相对 pages/ 的
          // 例如，从 pages/countdown.html 加载的 footer, 其链接 'index.html' 应跳转到 '../index.html'
          // 而链接 'pages/schedule.html' 应跳转到 './schedule.html' (如果当前在 pages/ 内)
          // 或者 '../pages/schedule.html' (如果当前在更深层级)

          // 当前 footer.js 所在路径是 components/footer/
          // footer.html 引入的路径是相对于项目根目录的
          // 例如：index.html, pages/schedule.html
          // 当从 pages/anypage.html 页面加载此 footer 时，
          // href="index.html" 应该转为 ../index.html
          // href="pages/schedule.html" 应该转为 schedule.html (如果 anypage 和 schedule 在同级)
          // 或 ../pages/schedule.html (如果 anypage 在 pages 的子目录)
          
          // 简单的处理方式：假设 footer.html 中的链接都是相对于项目根目录的
          // 那么从 components/footer/ 跳转就需要 ../../
          if (targetUrl.startsWith('pages/')) {
            // 对于 pages/xxx.html，调整为 ../../pages/xxx.html
            window.location.href = `../../${targetUrl}`;
          } else if (targetUrl === 'index.html') {
            // 对于 index.html，调整为 ../../index.html
            window.location.href = `../../${targetUrl}`;
          } else {
            // 对于其他情况，或者已经是 ../../ 开头的，直接使用
            // 或者可以考虑更复杂的路径解析
            window.location.href = targetUrl; 
          }
        } else if (href) {
          // 外部链接直接跳转
          window.location.href = href;
        }
      });
    });
  }
}

// --- 模块导出 ---
/**
 * 创建并导出Footer单例
 * 确保整个应用只有一个页脚实例
 */
const footer = new Footer();
export default footer;
