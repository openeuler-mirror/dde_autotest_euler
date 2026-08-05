
/**
 * 用例 PMSID: 1805833
 * 用例标题: 还原-原路径下存在同名文件文件夹时功能正常_
 * 生成时间: 2025-12-30 19:47:50
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1805833-还原-原路径下存在同名文件文件夹时功能正常_', () => {
  beforeAll(async ({ device, uos, agent , system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await device.pressKey('Esc');
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805833-还原-原路径下存在同名文件文件夹时功能正常_', async ({ device, agent, uos, system }) => {
    await system.exec('mkdir ~/Desktop/h_tst & touch ~/Desktop/h_tst.txt', 500);
    await agent.aiRightClick('h_tst');
    await agent.aiTap('删除选项');
    await agent.aiRightClick('h_tst.txt');
    await agent.aiTap('删除选项');
    await system.exec('mkdir ~/Desktop/h_tst & touch ~/Desktop/h_tst.txt', 500); 
    await agent.aiDoubleClick('h_tst');
    await agent.aiTap('文件夹窗口左侧边栏回收站');
    await agent.aiRightClick('文管窗口中心空白处');
    await agent.aiTap('全部还原');
    console.log("开始弹框界面检查");
    await agent.aiAssert("弹出提示框，有1个任务正在进行，包含提示文案、不再询问勾选按钮、跳过按钮、替换按钮、共存按钮、最小化按钮和X关闭按钮");
    await agent.aiTap('弹框中最小化按钮');
    await agent.aiAssert("无任务正在进行的提示弹框");
    await agent.aiTap('任务栏左侧文管图标');
    await agent.aiAssert("有1个任务正在进行的提示弹框显示");

    await agent.aiTap('有1个任务正在进行的提示弹框右上角X');
    await agent.aiAssert("任务正在进行的提示弹框关闭");
    console.log("弹框界面检查完成");
    await agent.aiRightClick('文管窗口中心空白处');
    await agent.aiTap('全部还原');
    await agent.aiTap('勾选不再询问');
    await agent.aiAssert("不再询问左边方框显示勾选");

    await agent.aiTap('弹窗上跳过按钮');
    await agent.aiTap('弹窗上跳过按钮');
    await agent.aiAssert("文管窗口回收站内存在文件h_tst.txt和文件夹h_tst");
    console.log("开始第1次还原操作");
    await agent.aiRightClick('文管窗口中心空白处');
    await agent.aiTap('全部还原');
    await agent.aiTap('弹窗上替换按钮');
    await agent.aiTap('弹窗上合并按钮');
    await agent.aiAssert("文管窗口回收站内文件夹为空");

    await agent.aiTap('文件夹窗口左侧边栏桌面');
    await agent.aiRightClick('h_tst');
    await agent.aiTap('删除选项');
    await agent.aiRightClick('h_tst.txt');
    await agent.aiTap('删除选项');
    await system.exec('mkdir ~/Desktop/h_tst & touch ~/Desktop/h_tst.txt', 500); 
    console.log("开始第2次还原操作");
    await agent.aiTap('文件夹窗口左侧边栏回收站');
    await agent.aiRightClick('文管窗口中心空白处');
    await agent.aiTap('全部还原');
    await agent.aiTap('弹窗上共存按钮');
    await agent.aiTap('弹窗上共存按钮');
    await agent.aiAssert("桌面有文件夹h_tst、h_tst（副本）和文件h_tst.txt、h_tst（副本）.txt");

  }, { timeout: 1500000, tags: ['1805833', 'level3', 'trash', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -rf ~/Desktop/h_tst*', 500);
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.exec('killall dde-file-manager', 500);
  });
});
