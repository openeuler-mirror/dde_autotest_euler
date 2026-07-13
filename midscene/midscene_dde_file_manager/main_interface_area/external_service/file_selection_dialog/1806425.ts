
/**
 * 用例 PMSID: 1806425
 * 用例标题: 文管选择窗-单个文件夹/文件右键操作
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806425-文管选择窗-单个文件夹/文件右键操作', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806425-文管选择窗-单个文件夹/文件右键操作', async ({ device, agent, uos, system }) => {
    await uos.openApp("文件管理器");
    await agent.aiTap('文管窗口右上角菜单按钮', { deepThink: true });
    await agent.aiTap('设置');

    // 根据判断结果执行下一步操作
    const result = await agent.aiBoolean('未勾选总是在新窗口打开文件夹');
    if (result) {
        console.log('未勾选总是在新窗口打开文件夹，点击勾选');
        await agent.aiTap('勾选总是在新窗口打开文件夹');
    } else {
        console.log('已勾选，跳过勾选操作');
    }
    await uos.closeCurrentWindow();

    await uos.openApp("看图");
    await agent.aiTap('打开图片');
    await agent.aiWaitFor("文管选择弹框显示");
    await agent.aiTap('文管窗口左侧图片');
    await agent.aiRightClick("文管窗口左侧图片");
    await agent.aiAssert('无右键弹框显示');
    await agent.aiRightClick("Wallpapers上方文件夹图标");
    await agent.aiAssert('右键菜单中不存在“在新窗口打开、在新标签中打开”的选项');
    await agent.aiTap('右键菜单中打开');
    await agent.aiAssert('进入Wallpapers目录');

  }, { timeout: 1200000, tags: ['1806425', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Documents/1806425* & rm -rf ~/Downloads/1806425* `, 500);
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
  });
});
