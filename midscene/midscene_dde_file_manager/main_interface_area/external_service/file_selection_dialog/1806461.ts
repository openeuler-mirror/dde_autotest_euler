
/**
 * 用例 PMSID: 1806461
 * 用例标题: 文管选择窗口-添加其他程序支持筛选.desktop文件
 * 生成时间: 2026-01-06 17:33:54
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806461-文管选择窗口-添加其他程序支持筛选.desktop文件', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806461-文管选择窗口-添加其他程序支持筛选.desktop文件', async ({ device, agent, uos , system }) => {
    await system.exec(`touch ~/Desktop/hu_test & touch ~/Desktop/hu_test1`, 500);
    
    await agent.aiRightClick('hu_test');
    await agent.aiTap("打开方式");

    await device.pressKey('Down');
    await device.pressKey('Down');
    await device.pressKey('Enter');

    // await agent.aiTap("二级菜单选择默认程序选项");
    await agent.aiTap("弹窗左下角添加其他程序");
    await agent.aiAssert('打开文管选择窗口');
    await agent.aiTap("文管窗口左侧栏桌面");
    await agent.aiAssert('文管窗口下方下拉框默认选择应用程序(*.desktop)');
    await agent.aiAssert('文管窗口内文件hu_test,hu_test1名称比窗口内计算机图标名称颜色浅 ');
    await agent.aiTap("应用程序(*.desktop)");
    await agent.aiTap("所有文件(*)");
    await agent.aiAssert('文件hu_test,hu_test1取消置灰'); 

  }, { timeout: 600000, tags: ['1806461', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Desktop/hu_test*`, 500);
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager & killall dde-file-dialog', 500);
  });
});
