/**
 * 用例 PMSID: 1806345
 * 用例标题: 侧边栏最近使用，点击进入
 * 生成时间: 2026-02-04
 * 用例编写人: UT000211(陈依)
 */

describe('1806345-侧边栏最近使用，点击进入', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806345-侧边栏最近使用，点击进入', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，预期文件管理器打开
    console.log("=== 步骤1：打开文件管理器 ===");
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiAssert("文件管理器窗口已打开");
    console.log("✅ 文件管理器已成功打开");

    // 步骤 2: 点击侧边栏最近使用，预期文管页面跳转到最近使用目录
    console.log("=== 步骤2：点击侧边栏最近使用 ===");
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("已切换到最近使用栏目");
    console.log("✅ 已成功跳转到最近使用目录");

    console.log("===1806345-侧边栏最近使用，点击进入，执行成功===");

  }, { timeout: 600000, tags: ["1806345", "level1", "smoke", "DITT", "chenyi"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    // 显示桌面
    await uos.showDesktop();
  });
});
