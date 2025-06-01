/**
 * 课堂助手 - 滚动动画组件
 * 提供页面元素在滚动时的淡入浮现效果
 *
 * 主要功能：
 * 1. 自动加载所需的 CSS 样式。
 * 2. 检测元素进入视口的时机。
 * 3. 应用淡入动画效果。
 * 4. 支持多种动画方向和延迟。
 */

// --- 全局作用域变量 ---
let scrollAnimationInitialized = false; // 标记动画组件是否已初始化
let scrollAnimationController = null; // 存储控制器对象的引用

// --- 函数定义 ---

/**
 * 初始化滚动动画功能
 * 创建 IntersectionObserver 实例监测元素可见性并应用动画效果。
 *
 * @param {string} selector - 选择要应用动画的元素的CSS选择器
 * @param {Object} options - 配置选项
 * @param {number} options.threshold - 元素可见比例的阈值，默认为0.1（10%）
 * @param {string} options.activeClass - 激活状态的CSS类名，默认为'active'
 * @param {boolean} options.once - 是否只触发一次，默认为true
 * @returns {Object} - 返回控制对象，包含refresh和disconnect方法
 */
export function initScrollAnimation(selector = '.animate-on-scroll', options = {}) {
  // 如果已经初始化过，则不再重复初始化
  if (scrollAnimationInitialized) {
    // console.log('[动画系统] 动画系统已初始化，返回现有控制器');
    return scrollAnimationController;
  }
  
  // console.log('[动画系统] 开始初始化滚动动画系统');
  
  const defaultOptions = {
    threshold: 0.1, // 默认当元素10%可见时触发
    activeClass: 'active',
    once: true, // 默认只触发一次
  };
    // 合并选项
  const settings = { ...defaultOptions, ...options };
  // console.log('[动画系统] 动画配置:', settings);
  
  // 获取所有要动画的元素
  const elements = document.querySelectorAll(selector);
  
  // 如果没有找到元素，直接返回
  if (elements.length === 0) {
    // console.warn(`[动画系统] 没有找到与选择器 "${selector}" 匹配的元素`);
    return;
  }
  
  // console.log(`[动画系统] 找到 ${elements.length} 个动画元素`);
  
  // 分析元素的动画类型
  elements.forEach((element, index) => {
    const animationClasses = [];
    if (element.classList.contains('fade-up')) animationClasses.push('fade-up');
    if (element.classList.contains('fade-down')) animationClasses.push('fade-down');
    if (element.classList.contains('fade-right')) animationClasses.push('fade-right');
    if (element.classList.contains('fade-left')) animationClasses.push('fade-left');
    if (element.classList.contains('zoom-in')) animationClasses.push('zoom-in');
    if (element.classList.contains('bounce-in')) animationClasses.push('bounce-in');
    
    const delayClasses = [];
    if (element.classList.contains('delay-100')) delayClasses.push('delay-100');
    if (element.classList.contains('delay-200')) delayClasses.push('delay-200');
    if (element.classList.contains('delay-300')) delayClasses.push('delay-300');
    if (element.classList.contains('delay-400')) delayClasses.push('delay-400');
    if (element.classList.contains('delay-500')) delayClasses.push('delay-500');    
    // console.log(`[动画系统] 元素 ${index + 1}: 动画类型=${animationClasses.join(',') || '默认'}, 延迟=${delayClasses.join(',') || '无'}, 标签=${element.tagName}`);
  });
  
  
  // 创建IntersectionObserver
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const elementInfo = `${element.tagName}${element.className ? '.' + element.className.split(' ').join('.') : ''}`;
        
        if (entry.isIntersecting) {
          // 检测延迟设置
          const delayMatch = element.className.match(/delay-(\d+)/);          const delayTime = delayMatch ? parseInt(delayMatch[1]) : 0;
          const entryTime = performance.now();
          
          // console.log(`[动画触发] 元素进入视口: ${elementInfo}`);
          // console.log(`[延迟检测] 检测到延迟设置: ${delayTime}ms`);
          // console.log(`[延迟计时] 元素进入视口时间戳: ${entryTime.toFixed(2)}ms`);
          
          // 添加激活类并记录实际激活时间
          const activateElement = () => {
            const activationTime = performance.now();            const actualDelay = activationTime - entryTime;
            
            element.classList.add(settings.activeClass);
            // console.log(`[动画激活] 已添加 "${settings.activeClass}" 类`);
            // console.log(`[延迟验证] 实际延迟时间: ${actualDelay.toFixed(2)}ms`);
            // console.log(`[延迟验证] 预期延迟时间: ${delayTime}ms`);
            
            if (delayTime > 0) {
              const delayDifference = Math.abs(actualDelay - delayTime);
              const tolerance = 50; // 50ms容差
              if (delayDifference <= tolerance) {
                // console.log(`[延迟验证] 延迟时间准确 (误差: ${delayDifference.toFixed(2)}ms)`);
              } else {
                // console.log(`[延迟验证] 延迟时间偏差较大 (误差: ${delayDifference.toFixed(2)}ms)`);
              }
            } else {
              // console.log(`[延迟验证] 无延迟设置，立即激活`);
            }
          };
            // 根据延迟时间决定是否立即激活或延迟激活
          if (delayTime > 0) {
            // console.log(`[延迟执行] 将在 ${delayTime}ms 后激活动画`);
            setTimeout(activateElement, delayTime);
          } else {
            activateElement();
          }
          
          // 如果设置了只触发一次，则停止观察该元素
          if (settings.once) {
            observer.unobserve(element);
            // console.log(`[动画系统] 停止观察元素: ${elementInfo}`);
          }
        } else if (!settings.once) {
          // 如果设置了可重复触发，则在元素离开视口时移除活动类
          // console.log(`[动画重置] 元素离开视口: ${elementInfo}`);
          element.classList.remove(settings.activeClass);
          // console.log(`[动画重置] 已移除 "${settings.activeClass}" 类`);
        }
      });
    },
    {
      threshold: settings.threshold,    }
  );
  
  // console.log(`[动画系统] IntersectionObserver 已创建，阈值: ${settings.threshold}`);
  
  // 开始观察所有元素
  elements.forEach((element, index) => {
    observer.observe(element);
    // console.log(`[动画系统] 开始观察元素 ${index + 1}: ${element.tagName}`);
  });
  
  // 设置标志为已初始化
  scrollAnimationInitialized = true;
  // console.log('[动画系统] 滚动动画系统初始化完成');
  
  // 创建并保存控制器对象
  scrollAnimationController = {
    // 提供方法手动刷新（例如在动态添加元素后）
    refresh: function() {
      // console.log('[动画系统] 执行刷新操作');
      const newElements = document.querySelectorAll(selector);
      let refreshCount = 0;
      newElements.forEach((element) => {
        // 只观察尚未激活的元素
        if (!element.classList.contains(settings.activeClass)) {
          observer.observe(element);
          refreshCount++;
        }
      });
      // console.log(`[动画系统] 刷新完成，新增观察 ${refreshCount} 个元素`);
    },
    // 提供方法停止观察所有元素
    disconnect: function() {
      // console.log('[动画系统] 断开所有观察者连接');
      observer.disconnect();
    }
  };
  
  // console.log('[动画系统] 控制器对象已创建，包含 refresh 和 disconnect 方法');
  return scrollAnimationController;
}

// --- 事件监听器设置 ---

// 在文档加载完成后自动初始化滚动动画
document.addEventListener('DOMContentLoaded', function() {
  // console.log('[动画系统] DOM 内容加载完成，开始自动初始化');
  initScrollAnimation();
});
