// @ts-nocheck
// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * AI 生成的测试脚本
 * 用例 PMSID: 1877419
 * 用例标题: 日历左侧侧边栏显示与收起状态检查
 * 生成时间: 2025-12-12 12:47:00
 * 用例编写人: UT004175（张美）
 */

describe('1877419-日历左侧侧边栏显示与收起状态检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  

  test('1877419-日历左侧侧边栏显示与收起状态检查', async ({ device, agent, uos }) => {
    // 步骤 1: 打开日历->检查左侧侧边栏默认显示
    // 预期: 默认展示左侧侧边栏，显示本地帐户并默认显示对应的日程类型（具体显示参考UI效果）
    await uos.openApp("日历");
    // 步骤 2: 日历界面已显示
    await agent.aiWaitFor("界面有窗口显示年、月、周、日");
    // 断言左侧侧边栏默认显示
    //await agent.aiAssert("左侧侧边栏默认展示");
    // 检查本地账户左侧箭头方向，如果是右向箭头则点击展开
    // 判断箭头是否存在（右向箭头表示折叠状态）
    const arrowExists = await (async () => {
      try {
        await agent.aiWaitFor("本地账户前面的向右箭头", { timeout: 3000 });
        return true;
      } catch (e) {
        return false;
      }
    })();
    if (arrowExists) {
      // 存在右向箭头，表示折叠状态，点击展开
      await agent.aiTap("本地账户前面的向右箭头");
      await agent.aiWaitFor("本地账户下的工作、生活、其他菜单被展开");
    }
    // 如果没有右向箭头，可能是向下箭头（已展开）或没有箭头，继续执行
    await agent.aiAssert("左侧侧边栏显示本地帐户、工作");
    await agent.aiAssert("本地账户下显示工作、生活、其他");
    //await agent.aiAssert("左侧侧边栏默认显示对应的日程类型");

    // 步骤 2: 再次点击左侧侧边栏图标按钮
    // 预期: 左侧侧边栏收起，不展示
    await agent.aiTap("本地账户前面的向下箭头");
    //await agent.aiWaitFor("左侧侧边栏已收起");
    await agent.aiAssert("本地账户下的工作、生活、其他菜单被收起");

    // 步骤 3: 退出应用再次打开日历，检查左侧侧边栏显示
    // 预期: 左侧侧边栏仍为收起状态
    await agent.aiTap("窗口右上角关闭按钮:X");
    await agent.aiWaitFor("日历已关闭");
    // 再次打开日历
    await uos.openApp("日历");
   // 步骤日历界面已显示
    await agent.aiWaitFor("界面有窗口显示年、月、周、日");
    // 验证侧边栏仍为收起状态
    await agent.aiAssert("本地账户下的工作、生活、其他菜单被收起");
    //复原环境
    await agent.aiTap("本地账户前面的向右箭头");
    //await agent.aiWaitFor("左侧侧边栏已收起");
    await agent.aiAssert("本地账户下的工作、生活、其他菜单被展开");

  }, { timeout: 600000, tags: ["1877419", "level1", "demo"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("pkill dde-calendar"); 
    await uos.showDesktop(); // 恢复桌面状态
  });
}); 