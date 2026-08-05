/**
 * 用例 PMSID: 1805681
 * 用例标题: [077]入口-通过终端进入回收站
 * 生成时间: 2025-12-29 09:41:40
 * 用例编写人: UT000244（李庆玲）
 * 修改说明: 根据要求重新编写，实现通过终端命令打开回收站并验证侧边栏高亮定位
 */

describe('1805681-[077]入口-通过终端进入回收站', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805681-[077]入口-通过终端进入回收站', async ({ device, agent, uos, system }) => {
    // 步骤一：使用快捷键 Ctrl+Alt+T 打开终端
    await device.pressKey("Control+Alt+T");

    // 步骤二：在终端中输入命令 dde-file-manager trash:///
    await device.typeText('dde-file-manager trash:///');
    await device.pressKey("Enter");
    await agent.aiWaitFor('文件管理器窗口已打开');

    // 步骤三：验证文件管理器已进入回收站目录
    await agent.aiWaitFor('回收站页面已打开');
    await agent.aiAssert('当前路径显示为回收站');

    // 步骤四：验证侧边栏高亮定位在回收站
    await agent.aiAssert('侧边栏回收站图标高亮显示');
    await agent.aiAssert('侧边栏回收站项目处于选中状态');

  }, { timeout: 1800000, tags: ["1805681", "level2", "trash", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager');

    // 恢复文件管理器设置
    await system.cleanupFileManager();

  });
});
