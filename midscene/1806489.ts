/**
 * AI 生成的测试脚本
 * 用例 PMSID: 1806489
 * 用例标题: Bug193649转：在文管重命名目录后马上删除目录
 * 生成时间: 2025-12-15 10:40:32
 * 用例编写人: UT002411(胡戬)
 */

describe('1806489-Bug193649转：在文管重命名目录后马上删除目录', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
    await system.exec(`rm -rf ~/Document/1806489te*`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806489-Bug193649转：在文管重命名目录后马上删除目录', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器 // 通过系统快捷方式或启动器打开文件管理器
    await uos.openApp('文件管理器');
    await agent.aiWaitFor("文件管理器界面已显示");
    // 步骤 2: 进入文档目录，新建文件夹
    await agent.aiTap("侧边栏的文档目录");
    await agent.aiRightClick("文档目录的空白区域");
    await agent.aiTap("新建文件夹");
    await device.typeText("1806489te")
    await agent.aiTap("文档目录的空白区域");
    await agent.aiWaitFor("1806489te文件夹被创建");
    // 步骤 3: 重命名新建文件夹，退出重命名状态后快速删除新建文件夹
    await agent.aiRightClick("1806489te文件夹");
    await agent.aiTap("重命名");
    await device.pressKey("Esc");
    await device.pressKey("Delete");
    // 步骤 4: 目录删除成功，文管无崩溃
    await agent.aiAssert("文档目录没有1806489te文件夹，文件管理器没有崩溃");

  }, { timeout: 600000,
       tags: ['1806489', 'level2', 'smoke', 'midscene_dde_file_manager/smoke/file_operations', 'DITT', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec(`rm -rf ~/Document/1806489te*`);
  });
});
