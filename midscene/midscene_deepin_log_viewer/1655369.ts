/**
 * 用例 PMSID: 1655369
 * 用例标题: 刷新频率——每10秒
 * 生成时间: 2026-04-26
 * 用例编写人: UT006165（李日华）
 */

describe('1655369-刷新频率——每10秒', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655369-刷新频率——每10秒', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开日志收集工具，日志收集工具窗口被打开
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具已显示");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击窗口菜单栏右侧三条横线的菜单项，弹出菜单窗口
    await agent.aiTap("窗口菜单栏右侧三条横线的菜单项");
    await agent.aiWaitFor("弹出菜单窗口");
    await agent.aiAssert("菜单窗口已弹出");

    // 步骤 3: 点击刷新频率，展开刷新频率子菜单含选项每10秒、每1分钟、5分钟、不刷新
    await agent.aiTap("刷新频率");
    await agent.aiWaitFor("刷新频率子菜单");
    await agent.aiAssert("展开刷新频率子菜单含选项每10秒、每1分钟、5分钟、不刷新");

    // 步骤 4: 点击每10秒，每10秒被选中，菜单窗口和刷新频率子菜单均关闭
    await agent.aiTap("每10秒");
    await agent.aiWaitFor("菜单窗口和刷新频率子菜单均关闭");
    await agent.aiAssert("菜单窗口和刷新频率子菜单均关闭");

    // 步骤 5: 等待15秒，查看日志收集工具窗口，会刷新界面
    // 循环检测刷新图标，最多等待 15 秒
    let isRefreshed = false;
    const startTime = Date.now();
    while (Date.now() - startTime < 15000) {
      const isRefreshing = await agent.aiBoolean("日志收集工具窗口主界面中部内容刷新显示出来");
      if (isRefreshing) {
        isRefreshed = true;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100)); // 每100毫秒检测一次
    }
    
    if (!isRefreshed) {
      throw new Error("在1分钟内未检测到界面刷新");
    }

    // 步骤 6: 关闭并重新打开日志收集工具
    await system.exec("pkill -f deepin-log-viewer");
    await agent.aiWaitFor("日志收集工具窗口已关闭");
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具已显示");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 7: 再次打开菜单，检查“每10秒”是否被选中
    await agent.aiTap("窗口菜单栏右侧三条横线的菜单项");
    await agent.aiWaitFor("弹出菜单窗口");
    await agent.aiTap("刷新频率");
    await agent.aiWaitFor("刷新频率子菜单");
    await agent.aiAssert("每10秒选项处于被选中状态");

    // 步骤 8: 等待15秒，查看日志收集工具窗口，会刷新界面
    // 循环检测刷新图标，最多等待 15 秒
    const startTime1 = Date.now();
    while (Date.now() - startTime1 < 15000) {
      const isRefreshing = await agent.aiBoolean("日志收集工具窗口主界面中部内容刷新显示出来");
      if (isRefreshing) {
        isRefreshed = true;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100)); // 每100毫秒检测一次
    }
    
    if (!isRefreshed) {
      throw new Error("在1分钟内未检测到界面刷新");
    }

  }, { timeout: 800000, tags: ['1655369', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
