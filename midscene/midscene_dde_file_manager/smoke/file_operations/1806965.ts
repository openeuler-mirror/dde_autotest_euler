/**
 * 用例 PMSID: 1806965
 * 用例标题: 【Ctrl+Z撤销】新建文件后，Ctrl+Z撤销弹出彻底删除提示
 * 生成时间: 2025-12-15 10:40:32
 * 用例编写人: UT002411
 */

describe('1806965-【Ctrl+Z撤销】新建文件后，Ctrl+Z撤销弹出彻底删除提示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
    await system.exec("rm -rf ~/Documents/*");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806965-【Ctrl+Z撤销】新建文件后，Ctrl+Z撤销弹出彻底删除提示', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    // await uos.openFileManager();
    await uos.openApp('文件管理器');
    await agent.aiWaitFor("文件管理器界面已显示");
    // 步骤 2: 进入文档目录，新建文件夹
    await agent.aiTap("侧边栏的文档目录");
    await agent.aiRightClick("文档目录的空白区域");
    await agent.aiTap("新建文档");
    await agent.aiTap("演示文档");
    await agent.aiTap("文档目录的空白区域");
    await agent.aiWaitFor("演示文档被创建");
    // 步骤 3: 撤销新建文件夹，撤销后新建文件夹被删除
    await device.pressKey("Ctrl+Z");
    await agent.aiWaitFor("弹出撤销提示窗口");
    await agent.aiTap("弹窗左侧的取消按钮");
    await agent.aiAssert("弹窗关闭，文件管理器的当前目录有演示文档");
    await device.pressKey("Ctrl+Z");
    await agent.aiWaitFor("弹出撤销提示窗口");
    await agent.aiTap("弹窗中右侧的删除按钮");
    await agent.aiAssert("弹窗关闭，文件管理器的当前目录没有演示文档");

  }, { timeout: 600000,
       tags: ['1806965', 'level2', 'smoke', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("rm -rf ~/Documents/*");
  });
});
