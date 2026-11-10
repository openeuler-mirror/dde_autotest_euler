/**
 * 生成时间: 2025-12-17 17:16:52
 * 用例编写人：ut003531
 * WPS模块 - 模块入口文件
 * 
 * 这个模块演示了如何使用模块化测试来组织相关的测试用例。
 * 模块模式允许：
 * 1. 将测试分散到多个文件中
 * 2. 使用模块级钩子进行初始化和清理
 * 3. 按顺序执行测试文件
 * 4. 自动合并多个测试文件的报告
 * 
 * 钩子执行顺序：
 * - beforeEach: 模块级 → 套件级 → 测试用例
 * - afterEach: 测试用例 → 套件级 → 模块级
 * 
 * 重要说明：
 * - 模块级钩子总是执行（如果定义了），不会被套件级钩子覆盖
 * - 模块级和套件级钩子是叠加关系，不是替代关系
 */


// 定义模块配置
module('WPS模块', {
  // 模块级 beforeAll：所有测试文件执行前执行一次
  beforeAll: async ({ device, uos, agent, system, env }) => {
    console.log('=== 模块级别初始化 ===');
    // 显示桌面，确保环境干净
    await uos.showDesktop();
    // 初始化安装WPS软件
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y cn.wps.wps-office-pro`;
    await system.exec(uninstallCmd);
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y cn.wps.wps-office-pro`;
    await system.exec(installCmd);
    await agent.aiWaitFor('桌面出现"WPS文字"图标', {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    try {
      await agent.aiWaitFor('出现WPS自启动对话框', {
        timeoutMs: 300000, // 等待 300 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      await agent.aiTap('弹窗的禁止按钮');
      console.log('成功处理自启动弹窗');
    } catch (e) {
      console.log('未检测到自启动弹窗');
    }
    await agent.aiDoubleClick('WPS文字图标');
    await agent.aiWaitFor('出现WPS用户许可协议对话框', {
      timeoutMs: 300000, // 等待 30 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    console.log('出现许可协议对话');
    await agent.aiTap('已阅读并同意前面的白色方框', { deepThink:true });
    await agent.aiAssert('已勾选已阅读前面的方框');
    await agent.aiTap('已阅读并同意后面的确定按钮', { deepThink:true });
    console.log('许可协议对话框处理完成');
    await agent.aiWaitFor("界面存在新建按钮", {
      timeoutMs: 30000, // 等待 30 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await uos.closeCurrentWindow();
    await agent.aiWaitFor("界面存在'计算机'", {
      timeoutMs: 30000, // 等待 30 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("桌面空白处");
    console.log('前置执行完成');
  },

  // 模块级 beforeEach：每个测试用例执行前执行（在套件级 beforeEach 之前）
  beforeEach: async ({ device, agent }) => {
    console.log('--- 模块级别测试用例前置准备 ---');
    // 例如：确保桌面处于干净状态
    // 可以在这里进行一些通用的准备工作
    // 注意：这个钩子会在所有套件级 beforeEach 之前执行
  },

  // 模块级 afterEach：每个测试用例执行后执行（在套件级 afterEach 之后）
  afterEach: async ({ device }) => {
    console.log('--- 模块级别测试用例后置清理 ---');
    // 例如：截图、验证状态等
    // 注意：这个钩子会在所有套件级 afterEach 之后执行
  },

  // 模块级 afterAll：所有测试文件执行后执行一次
  afterAll: async ({ uos, agent, device, system ,env }) => {
    console.log('=== 模块级别清理 ===');
    // 清理操作，例如：关闭应用、清理测试数据等
    await uos.closeCurrentWindow();
    // 卸载WPS软件
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y cn.wps.wps-office-pro`;
    await system.exec(uninstallCmd);
    await uos.showDesktop();
  },

  // 测试文件列表（按顺序执行）
  // 路径是相对于模块入口文件的路径
//   directories:[
//     {
//      path:'./testcase',
//     }
//   ],
  files:[
    './1963247.ts',
    './1964003.ts',
  ]
});
