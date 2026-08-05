/**
 * 用例 PMSID: 1805783
 * 用例标题: [077]回收站-拖拽文件到文件夹中
 * 生成时间: 2025-12-29 14:11:00
 * 用例编写人：UT000374 (胡宏杰)
 */

// @ts-nocheck
require("dotenv/config");


describe('1805783-[077]回收站-拖拽文件到文件夹中', () => {
  beforeAll(async ({ device, uos, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805783-[077]回收站-拖拽文件到文件夹中', async ({ device, agent, uos, system }) => {
    console.log('开始测试：回收站拖拽文件到文件夹中');

    // 步骤一：通过系统命令在桌面创建文件夹和文本文件
    console.log('步骤一：通过系统命令在桌面创建文件夹和文本文件');
    await system.exec('mkdir ~/Desktop/h_tst & touch ~/Desktop/h_tst.txt', 500);
    await agent.aiRightClick('h_tst');
    await agent.aiTap('删除选项');

    await agent.aiRightClick('h_tst.txt');
    await agent.aiTap('删除选项');
    await agent.aiDoubleClick('主目录');
    await agent.aiTap('文件夹窗口左侧边栏回收站');
    // 步骤二：开始拖拽文件夹和文本文件
    await agent.aiDrag("h_tst.txt", "h_tst", { deepThink: true });
    await agent.aiAssert('回收站目录中存在h_tst文件夹和h_tst.txt文件');
    await agent.aiDrag("h_tst", "h_tst.txt", { deepThink: true });
    await agent.aiAssert('回收站目录中存在h_tst文件夹和h_tst.txt文件');

  }, { timeout: 600000, tags: ["1805783", "level3", "trash", "huhongjie"] });

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
