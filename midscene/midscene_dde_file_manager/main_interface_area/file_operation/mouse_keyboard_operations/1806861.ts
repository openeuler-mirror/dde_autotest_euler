
/**
 * 用例 PMSID: 1806861
 * 用例标题: 1806861文件操作-在桌面/文管切换隐藏文件显示模式
 * 生成时间: 2025-12-12 13:37:27
 * 用例编写人: UT000193（郑豪）
 */

describe('1806861-文件操作-在桌面/文管切换隐藏文件显示模式_', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec("rm -rf ~/Desktop/.test_1806861"); 
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //创建隐藏测试文件夹
    await system.exec("mkdir -p ~/Desktop/.test_1806861"); 
  });

  test('1806861-文件操作-在桌面/文管切换隐藏文件显示模式_', async ({ device, agent, uos }) => {
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器窗口已打开');
    await agent.aiTap("侧边栏中的桌面目录", { deepThink: true });
    // 步骤1：快捷键显示隐藏文件夹，断言显示隐藏文件夹
    await device.pressKey('Ctrl', 'H');
    await agent.aiAssert("文件管理器显示隐藏文件夹：.test_1806861", { fuzzyMatch: true });

    // 步骤2：快捷键隐藏隐藏文件夹，断言不显示隐藏文件夹
    await device.pressKey('Ctrl', 'H');
    await agent.aiAssert("文件管理器不显示隐藏文件夹：.test_1806861", { fuzzyMatch: true });
  }, { timeout: 300000, tags: ['1806861', 'level3', 'mouse_keyboard_operations', 'zhenghao'] });

  afterEach(async ({ device,system,agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除测试文件，关闭文件管理器
    await system.exec("rm -rf ~/Desktop/.test_1806861/"); 
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec("rm -rf ~/Desktop/.test_1806861"); 
  });
});
