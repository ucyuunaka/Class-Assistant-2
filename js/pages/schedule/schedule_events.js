// 课表事件控制器
// 负责处理课表相关的各种事件

import { scheduleData, deleteCourse, updateCourse, addCourse, clearCourses } from "./schedule_data.js";
import { renderTimetable, renderListView } from "./schedule_render.js";
import { setupDragAndDrop } from "./schedule_drag.js";
import { updateCoursesCache } from "./schedule_cache.js";

// 当前编辑模式状态
let isEditMode = false;
// 当前要删除的课程ID
let currentCourseToDelete = null;

/**
 * 初始化课表事件
 * 设置所有事件监听器
 */
export function initScheduleEvents() {
  // 获取DOM元素
  const editScheduleBtn = document.getElementById("edit-schedule-btn");
  const weekViewBtn = document.getElementById("week-view");
  const listViewBtn = document.getElementById("list-view");
  const weekViewContainer = document.getElementById("week-view-container");
  const listViewContainer = document.getElementById("list-view-container");
  const addCourseModal = document.getElementById("add-course-modal");
  const closeCourseModal = document.getElementById("close-course-modal");
  const cancelCourse = document.getElementById("cancel-course");
  const addCourseForm = document.getElementById("add-course-form");
  const deleteConfirmModal = document.getElementById("delete-confirm-modal");
  const closeDeleteModal = document.getElementById("close-delete-modal");
  const cancelDelete = document.getElementById("cancel-delete");
  const confirmDelete = document.getElementById("confirm-delete");
  const clearScheduleModal = document.getElementById("clear-schedule-modal");
  const closeClearModal = document.getElementById("close-clear-modal");
  const cancelClear = document.getElementById("cancel-clear");
  const confirmClear = document.getElementById("confirm-clear");
  const colorOptions = document.querySelectorAll(".color-option");
  const courseColorInput = document.getElementById("course-color");

  // 编辑模式切换
  editScheduleBtn.addEventListener("click", function () {
    // 检查当前是否是列表视图
    if (listViewContainer.style.display === "block") {
      window.showNotification("请在周视图下编辑课表", "info");
      return;
    }

    // 切换编辑模式状态
    isEditMode = !isEditMode;

    // 更新按钮文本和图标
    if (isEditMode) {
      editScheduleBtn.innerHTML = '<i class="fas fa-check"></i> 完成编辑';
      editScheduleBtn.classList.add("btn-success");
      // 添加编辑模式类到容器
      weekViewContainer.classList.add("edit-mode");
    } else {
      editScheduleBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑课表';
      editScheduleBtn.classList.remove("btn-success");
      // 移除编辑模式类
      weekViewContainer.classList.remove("edit-mode");
    }

    setupDragAndDrop(isEditMode);
  });

  // 视图切换事件
  weekViewBtn.addEventListener("click", function () {
    // 退出编辑模式
    isEditMode = false;
    editScheduleBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑课表';
    editScheduleBtn.classList.remove("btn-success");
    weekViewContainer.classList.remove("edit-mode");

    weekViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
    weekViewContainer.style.display = "block";
    listViewContainer.style.display = "none";
  });

  listViewBtn.addEventListener("click", function () {
    // 退出编辑模式
    isEditMode = false;
    editScheduleBtn.innerHTML = '<i class="fas fa-edit"></i> 编辑课表';
    editScheduleBtn.classList.remove("btn-success");
    weekViewContainer.classList.remove("edit-mode");    
    
    listViewBtn.classList.add("active");
    weekViewBtn.classList.remove("active");
    listViewContainer.style.display = "block";
    weekViewContainer.style.display = "none";
    renderListView();
  });

  // 导出和清空事件
  document.getElementById("export-ical").addEventListener("click", function (e) {
    e.preventDefault();
    window.showNotification("导出为iCal功能正在开发中...", "info");
  });
  
  document.getElementById("export-csv").addEventListener("click", function (e) {
    e.preventDefault();
    window.showNotification("导出为CSV功能正在开发中...", "info");
  });
  
  document.getElementById("import-courses").addEventListener("click", function (e) {
    e.preventDefault();
    window.showNotification("导入课程功能正在开发中...", "info");
  });

  document.getElementById("print-schedule").addEventListener("click", function (e) {
    e.preventDefault();
    window.print();
  });

  // 清空课表相关事件
  document.getElementById("clear-schedule").addEventListener("click", function (e) {
    e.preventDefault();
    showClearConfirm();
  });

  closeClearModal.addEventListener("click", hideClearConfirm);
  cancelClear.addEventListener("click", hideClearConfirm);
  confirmClear.addEventListener("click", function() {
    clearCourses();

    // 更新视图
    renderTimetable();
    renderListView();
    updateCoursesCache();

    // 隐藏确认对话框
    hideClearConfirm();

    // 显示成功通知
    window.showNotification("课表已清空", "success");
  });

  // 删除确认对话框事件
  closeDeleteModal.addEventListener("click", hideDeleteConfirm);
  cancelDelete.addEventListener("click", hideDeleteConfirm);
  confirmDelete.addEventListener("click", function () {
    if (currentCourseToDelete) {
      handleDeleteCourse(currentCourseToDelete);
      hideDeleteConfirm();
    }
  });

  // 课程卡片事件
  setupCourseCardEvents();
  
  // 单元格点击事件
  setupCellClickEvents();

  // 添加/编辑课程表单提交
  addCourseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // 获取表单数据
    const courseName = document.getElementById("course-name").value;
    const courseTeacher = document.getElementById("course-teacher").value;
    const courseLocation = document.getElementById("course-location").value;
    const courseDay = parseInt(document.getElementById("course-day").value);
    const courseStartTime = parseInt(document.getElementById("course-start-time").value);
    const courseEndTime = parseInt(document.getElementById("course-end-time").value);
    const courseColor = document.getElementById("course-color").value;
    const courseNotes = document.getElementById("course-notes").value;

    // 验证数据
    if (!courseName || !courseDay || !courseStartTime || !courseEndTime) {
      window.showNotification("请填写所有必填项", "error");
      return;
    }

    // 验证时间范围
    if (courseEndTime < courseStartTime) {
      window.showNotification("结束时间不能早于开始时间", "error");
      return;
    }

    // 生成时间槽数组
    const timeSlots = [];
    for (let i = courseStartTime; i <= courseEndTime; i++) {
      timeSlots.push(i);
    }

    const editingCourseId = this.dataset.editingCourseId;

    const courseData = {
      title: courseName,
      teacher: courseTeacher,
      location: courseLocation,
      day: courseDay,
      time: courseStartTime, // 使用开始时间作为主时间
      endTime: courseEndTime, // 保存结束时间
      timeSlots: timeSlots, // 保存所有时间槽
      color: courseColor,
      notes: courseNotes,
    };

    try {
      if (editingCourseId) {
        // 更新现有课程
        const success = updateCourse(parseInt(editingCourseId), courseData);
        if (success) {
          window.showNotification("课程已更新", "success");
          afterCourseDataChanged();
          closeAddCourseModal();
        } else {
          window.showNotification("更新课程失败", "error");
        }
      } else {
        // 添加新课程
        const newCourse = addCourse(courseData);
        if (newCourse) {
          window.showNotification("课程已添加", "success");
          afterCourseDataChanged();
          closeAddCourseModal();
        } else {
          window.showNotification("添加课程失败", "error");
        }
      }
    } catch (error) {
      console.error("保存课程时出错:", error);
      window.showNotification("保存课程失败: " + error.message, "error");
    } finally {
      // 清除编辑状态
      delete this.dataset.editingCourseId;
    }
  });

  // 关闭模态框事件
  closeCourseModal.addEventListener("click", closeAddCourseModal);
  cancelCourse.addEventListener("click", closeAddCourseModal);

  // 点击模态框外部关闭
  window.addEventListener("click", (event) => {
    if (event.target === addCourseModal) {
      closeAddCourseModal();
    }
    if (event.target === deleteConfirmModal) {
      hideDeleteConfirm();
    }
  });

  // 颜色选择逻辑
  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // 移除其他选项的选中状态
      colorOptions.forEach((opt) => opt.classList.remove("selected"));
      // 添加当前选项的选中状态
      this.classList.add("selected");
      // 更新隐藏输入框的值
      courseColorInput.value = this.getAttribute("data-class");
    });
  });

  /**
   * 关闭添加/编辑课程模态框
   */
  function closeAddCourseModal() {
    // 使用 Modal.hideExisting 隐藏模态窗口
    window.Modal.hideExisting(addCourseModal);
    
    // 重置表单状态
    addCourseForm.reset();
    
    // 重置颜色选择
    document.querySelector(".color-option.selected")?.classList.remove("selected");
    document.querySelector('.color-option[data-class="course-math"]').classList.add("selected");
    courseColorInput.value = "course-math";
    
    // 重置模态框标题
    document.querySelector("#add-course-modal h2").textContent = "添加新课程";
    
    // 清除编辑状态
    delete addCourseForm.dataset.editingCourseId;
  }

  /**
   * 显示清空课表确认对话框
   */
  function showClearConfirm() {
    // 使用 Modal.showExisting 显示已存在的模态窗口
    window.Modal.showExisting(clearScheduleModal);
  }

  /**
   * 隐藏清空课表确认对话框
   */
  function hideClearConfirm() {
    // 使用 Modal.hideExisting 隐藏已存在的模态窗口
    window.Modal.hideExisting(clearScheduleModal);
  }
}

/**
 * 显示删除确认对话框
 * @param {string} courseId - 课程ID
 */
function showDeleteConfirm(courseId) {
  currentCourseToDelete = courseId;
  // 使用 Modal.showExisting 显示已存在的模态窗口
  window.Modal.showExisting(document.getElementById("delete-confirm-modal"));
}

/**
 * 隐藏删除确认对话框
 */
function hideDeleteConfirm() {
  // 使用 Modal.hideExisting 隐藏已存在的模态窗口
  window.Modal.hideExisting(document.getElementById("delete-confirm-modal"));
  currentCourseToDelete = null;
}

/**
 * 在课程数据变更后更新界面
 */
export function afterCourseDataChanged() {
  renderTimetable();
  renderListView();
  setupDragAndDrop(isEditMode);
  updateCoursesCache();
}

/**
 * 设置课程卡片事件
 */
function setupCourseCardEvents() {
  // 动态绑定所有课程卡片点击事件
  document.addEventListener("click", function (e) {
    // 检查是否点击了删除图标
    if (
      e.target.closest(".course-delete-icon") ||
      e.target.classList.contains("fa-times")
    ) {
      if (isEditMode) {
        e.preventDefault();
        e.stopImmediatePropagation();

        const deleteIcon = e.target.closest(".course-delete-icon");
        const courseCard = deleteIcon.closest(".course-card");
        const courseId = courseCard.getAttribute("data-course-id");

        showDeleteConfirm(courseId);
      }
      return;
    }

    // 原有的课程卡片点击事件
    const courseCard = e.target.closest(".course-card");
    if (courseCard && !isEditMode) {
      const courseId = courseCard.getAttribute("data-course-id");
      if (courseId) {
        const course = scheduleData.courses.find(
          (c) => c.id == courseId
        );
        if (course) {
          showCourseDetails(course);
        }
      }
    }
  });
}

/**
 * 设置单元格点击事件
 */
function setupCellClickEvents() {
  document.addEventListener("click", function (e) {
    // 检查是否处于编辑模式
    if (!isEditMode) return;

    const cell = e.target.closest(".timetable-cell");
    if (!cell) return;

    // [调试输出] 单元格点击信息 - TC_SCH_GRID_003 已完成，暂时注释
    // console.log(`[TC_SCH_GRID_003 调试] 单元格被点击:`, cell);
    // console.log(`[TC_SCH_GRID_003 调试] 单元格类名:`, cell.className);
    // console.log(`[TC_SCH_GRID_003 调试] 单元格属性:`, {
    //   day: cell.getAttribute("data-day"),
    //   time: cell.getAttribute("data-time")
    // });

    try {
      const day = parseInt(cell.getAttribute("data-day"));
      const time = parseInt(cell.getAttribute("data-time"));

      // 验证获取的day和time是否有效
      if (isNaN(day)) throw new Error("无效的星期数据");
      if (isNaN(time)) throw new Error("无效的时间数据");

      // 检查单元格内是否有课程
      const hasCourse = cell.querySelector(".course-card") !== null;
      
      // [调试输出] 单元格状态信息 - TC_SCH_GRID_003 已完成，暂时注释
      // console.log(`[TC_SCH_GRID_003 调试] 单元格状态: 星期${day}, 时间段${time}, 有课程: ${hasCourse}`);

      if (hasCourse) {
        // 编辑现有课程
        const courseCard = cell.querySelector(".course-card");
        const courseId = courseCard.getAttribute("data-course-id");
        if (!courseId) throw new Error("课程ID无效");

        const course = scheduleData.courses.find(
          (c) => c.id == courseId
        );
        if (!course) throw new Error("找不到对应课程");

        editCourse(course);
      } else {
        // 创建新课程
        createNewCourse(day, time);
      }
    } catch (error) {
      console.error("处理单元格点击时出错:", error);
      window.showNotification("操作失败: " + error.message, "error");
    }
  });
}

/**
 * 修改课程
 * @param {Object} course - 课程数据
 */
function editCourse(course) {
  try {
    if (!course) throw new Error("课程数据无效");

    // 填充模态框中的课程数据
    document.getElementById("course-name").value = course.title || "";
    document.getElementById("course-teacher").value = course.teacher || "";
    document.getElementById("course-location").value = course.location || "";
    document.getElementById("course-day").value = course.day || "";
    
    // 设置开始时间和结束时间
    document.getElementById("course-start-time").value = course.time || "";
    document.getElementById("course-end-time").value = course.endTime || course.time || "";

    // 设置课程颜色
    document.querySelector(".color-option.selected")?.classList.remove("selected");
    const colorOption = document.querySelector(
      `.color-option[data-class="${course.color}"]`
    );
    if (colorOption) {
      colorOption.classList.add("selected");
      document.getElementById("course-color").value = course.color;
    } else {
      // 默认颜色
      document
        .querySelector('.color-option[data-class="course-computer"]')
        .classList.add("selected");
      document.getElementById("course-color").value = "course-computer";
    }

    // 把弹窗标题改为"编辑课程"
    document.querySelector("#add-course-modal h2").textContent = "编辑课程";
    // 显示 添加/编辑 课程弹窗
    window.Modal.showExisting(document.getElementById("add-course-modal"));

    // 保存当前编辑的课程ID
    document.getElementById("add-course-form").dataset.editingCourseId = course.id;
  } catch (error) {
    console.error("编辑课程时出错:", error);
    window.showNotification("编辑课程失败: " + error.message, "error");
  }
}

/**
 * 处理课程删除请求
 * @param {string} courseId - 课程ID
 * @returns {boolean} 是否成功删除课程
 */
function handleDeleteCourse(courseId) {
  
  // 查找课程
  const course = scheduleData.courses.find(c => c.id === parseInt(courseId));
  if (!course) {
    console.error(`找不到ID为${courseId}的课程`);
    window.showNotification("无法删除课程:找不到指定课程", "error");
    return false;
  }
  
  try {
    // 删除课程
    if (deleteCourse(parseInt(courseId))) {
      // 删除后更新缓存
      updateCoursesCache();
      
      // 课程占用的所有单元格
      const startTime = course.time;
      const endTime = course.endTime || course.time;
      const occupiedCells = [];
      
      for (let time = startTime; time <= endTime; time++) {
        occupiedCells.push(`${course.day}-${time}`);
      }

      
      // 重新渲染视图
      renderTimetable();
      renderListView();
      
      // 更新拖放功能
      setupDragAndDrop(isEditMode);
      
      // 显示成功通知
      window.showNotification(`已删除课程：${course.title}`, "success");
      return true;
    } else {
      // 删除失败，显示错误
      window.showNotification("删除课程失败", "error");
      return false;
    }
  } catch (error) {
    console.error("删除课程时出错:", error);
    window.showNotification("删除课程时出错: " + error.message, "error");
    return false;
  }
}

/**
 * 创建新课程
 * @param {number} day - 星期几
 * @param {number} time - 课程节数
 */
function createNewCourse(day, time) {
  // 检查是否为被占用的单元格，如果是则告知用户
  const cell = document.querySelector(`.timetable-cell[data-day="${day}"][data-time="${time}"]`);
  if (cell && cell.classList.contains('occupied-cell')) {
    window.showNotification("此时间段已被其他课程占用，请选择其他时间段", "warning");
    return;
  }

  // 重置表单并设置默认值
  document.getElementById("add-course-form").reset();
  document.getElementById("course-day").value = day;
  document.getElementById("course-start-time").value = time;
  document.getElementById("course-end-time").value = time;
  
  // 重置颜色选择
  document.querySelector(".color-option.selected")?.classList.remove("selected");
  document.querySelector('.color-option[data-class="course-math"]').classList.add("selected");
  document.getElementById("course-color").value = "course-math";
  
  // 重置模态框标题
  document.querySelector("#add-course-modal h2").textContent = "添加新课程";
  
  // 清除编辑状态
  delete document.getElementById("add-course-form").dataset.editingCourseId;

  // 使用 Modal.showExisting 显示模态窗口
  window.Modal.showExisting(document.getElementById("add-course-modal"));
}

/**
 * 显示课程详情
 * @param {Object} course - 课程数据
 */
function showCourseDetails(course) {
  // 【备用】可以在这里实现课程详情查看功能
}

// 导出当前的编辑模式状态
export { isEditMode };

// [TC_SCH_GRID_004 调试] 视口尺寸和滚动监测
function initResponsiveDebugging() {
  console.log(`[TC_SCH_GRID_004 调试] 初始化响应式调试功能`);
  
  // 监测视口尺寸变化
  function logViewportInfo() {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    };
    console.log(`[TC_SCH_GRID_004 调试] 视口信息:`, viewport);
    
    // 判断是否为小屏幕
    const isSmallScreen = window.innerWidth <= 768;
    console.log(`[TC_SCH_GRID_004 调试] 是否为小屏幕设备: ${isSmallScreen}`);
  }
  
  // 页面加载时记录初始状态
  logViewportInfo();
  
  // 监听窗口大小变化
  window.addEventListener('resize', function() {
    console.log(`[TC_SCH_GRID_004 调试] 窗口大小变化事件触发`);
    logViewportInfo();
  });
  
  // 监听时间表容器的滚动事件
  const timetableContainer = document.querySelector('.timetable');
  if (timetableContainer) {
    timetableContainer.addEventListener('scroll', function(e) {
      const scrollInfo = {
        scrollLeft: e.target.scrollLeft,
        scrollTop: e.target.scrollTop,
        scrollWidth: e.target.scrollWidth,
        clientWidth: e.target.clientWidth,
        maxScrollLeft: e.target.scrollWidth - e.target.clientWidth
      };
      console.log(`[TC_SCH_GRID_004 调试] 滚动事件:`, scrollInfo);
      
      // 计算滚动百分比
      const scrollPercentage = (scrollInfo.scrollLeft / scrollInfo.maxScrollLeft * 100).toFixed(1);
      console.log(`[TC_SCH_GRID_004 调试] 水平滚动百分比: ${scrollPercentage}%`);
    });
    
    console.log(`[TC_SCH_GRID_004 调试] 时间表滚动监听器已设置`);
  } else {
    console.log(`[TC_SCH_GRID_004 调试] 未找到时间表容器`);
  }
}

// 在页面加载完成后初始化调试功能
document.addEventListener('DOMContentLoaded', function() {
  initResponsiveDebugging();
});