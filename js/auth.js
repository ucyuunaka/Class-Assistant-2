// js/auth.js
import { Storage } from './main.js';

/**
 * 检查用户是否已完成首次登录流程。
 * 如果未完成且当前不在登录页，则重定向到登录页。
 */
export function checkFirstLoginExperience() {
  // 【调试模式】临时禁用首次登录检测 - 取消注释下面这行来禁用登录检测
  return; // 直接返回，跳过登录检查
  
  const hasCompleted = Storage.get('hasCompletedLoginFlow');
  const isLoginPage = window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('/login');

  if (hasCompleted !== true && !isLoginPage) {
    window.location.href = '/pages/login.html';
  }
}

/**
 * 标记用户已完成首次登录流程。
 * 仅在标记尚未设置时执行一次。
 */
export function markLoginFlowCompleted() {
  if (Storage.get('hasCompletedLoginFlow') !== true) {
    Storage.save('hasCompletedLoginFlow', true);
  }
}