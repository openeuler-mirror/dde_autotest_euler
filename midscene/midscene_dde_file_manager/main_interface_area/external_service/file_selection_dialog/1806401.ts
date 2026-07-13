
/**
 * 用例 PMSID: 1806401
 * 用例标题: 文管选择窗-单个文件夹/文件右键操作
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806401-文管选择窗-单个文件夹/文件右键操作', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806401-文管选择窗-单个文件夹/文件右键操作', async ({ device, agent, uos, system }) => {
    await uos.openApp("文件管理器");
    await uos.openApp("系统监视器");
    await agent.aiTap('系统监视器窗口顶部搜索')
    await device.typeText('dde-file-manager');
    await agent.aiWaitFor('文件管理器进程显示');
    await agent.aiRightClick('系统监视器窗口内“文件管理器”进程');
    await agent.aiTap('查看命令所在位置')
    await agent.aiAssert('打开一个libexec的文件夹，文件夹内选中名称为“dde-file-manager”文件');
    

  }, { timeout: 1200000, tags: ['1806401', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall deepin-system-monitor & killall dde-file-manager', 500);
  });
});
