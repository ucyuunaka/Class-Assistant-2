// 课表主控制器
// 协调其他课表模块，提供主要接口

import { scheduleData, loadScheduleFromStorage, saveScheduleToStorage, afterCourseDataChanged } from "./schedule_data.js";
import { renderTimetable, renderListView } from "./schedule_render.js";
import { updateCoursesCache } from "./schedule_cache.js";
import { setupDragAndDrop } from "./schedule_drag.js";
import { initScheduleEvents } from "./schedule_events.js";
import { showNotification } from "../../../components/notifications/notifications.js";

/**
 * 初始化课表数据和功能
 */
export function initSchedule() {
  try {
    // 从本地存储加载数据
    const loadedFromStorage = loadScheduleFromStorage();

    // 初始化缓存
    updateCoursesCache();
    
    // 渲染界面
    renderTimetable();
    renderListView();
    
    // 设置初始视图状态：显示周视图，隐藏列表视图
    const weekViewContainer = document.getElementById("week-view-container");
    const listViewContainer = document.getElementById("list-view-container");
    const weekViewBtn = document.getElementById("week-view");
    const listViewBtn = document.getElementById("list-view");
    
    if (weekViewContainer && listViewContainer) {
      weekViewContainer.style.display = "block";
      listViewContainer.style.display = "none";
      
      if (weekViewBtn && listViewBtn) {
        weekViewBtn.classList.add("active");
        listViewBtn.classList.remove("active");
      }
    }
    
    // 初始化事件处理
    initScheduleEvents();
    
    // 初始化拖放功能（初始为非编辑模式）
    setupDragAndDrop(false);
    

    return true;
  } catch (error) {
    console.error("初始化课表数据失败:", error);
    document.getElementById("week-view-container").innerHTML = `
      <div class="alert alert-danger">
        <h4>初始化数据失败</h4>
        <p>${error.message}</p>
        <p>请检查控制台获取详细信息</p>
      </div>
    `;
    showNotification("初始化课表数据失败，请刷新页面重试", "error");
    return false;
  }
}

// 导出一些公共方法供其他调用
export { afterCourseDataChanged };