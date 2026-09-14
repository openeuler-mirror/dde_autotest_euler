/**
 * 用例 PMSID: 1807815
 * 用例标题: 文管右键菜单显示快捷键-快捷键功能-文管内空白处快捷键查看属性
 * 生成时间: 2025-12-15 13:22:54
 * 用例编写人: UT000649 (黄甜)
 */

describe('1807815-文管右键菜单显示快捷键-快捷键功能-文管内空白处快捷键查看属性', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807815-文管右键菜单显示快捷键-快捷键功能-文管内空白处快捷键查看属性', async ({ device, agent, uos , system}) => {
    // 步骤 1: 打开文件夹管理器 // 创建文件/文件夹
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的文档目录");

    // 步骤 2: 查看路径属性
    await agent.aiRightClick("文件管理器窗口空白处");
    await device.pressKey(`R`)
    await agent.aiAssert("属性窗口显示");
    await agent.aiTap("属性窗口右上角关闭按钮:X");

  }, { timeout: 1200000, tags: ['1807815','level2','smoke','huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});