// @ts-nocheck

/**
 * 用例 PMSID: 1810611
 * 用例标题: 桌面快速右键不同文件，不会触发打开操作
 * 生成时间：2026-07-09 10:00:00
 * 用例编写人：UT000649（黄甜）
 */

describe('1810611-桌面快速右键不同文件不会触发打开操作', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('touch ~/Desktop/1810611_file1.txt');
    await system.exec('touch ~/Desktop/1810611_file2.txt');
    await system.exec('touch ~/Desktop/1810611_file3.txt');
  });

  test('1810611-桌面快速右键不同文件不会触发打开操作', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1810611 ===');

    console.log('步骤1：在桌面上快速右键不同文件');
    for (let i = 1; i <= 3; i++) {
      await agent.aiRightClick(`1810611_file${i}.txt`, 100);
      await agent.aiAssert(`文件右键菜单显示正常`);
      await device.pressKey('Esc');
      await system.exec('sleep 0.1');
    }

    await agent.aiAssert('文件右键菜单显示正常，桌面无文件打开窗口');
    console.log('文件右键菜单显示正常，桌面无文件打开窗口');

    console.log('✅ 1810611用例测试完成');
  }, { timeout: 600000, tags: ['1810611', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -f ~/Desktop/1810611*');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await uos.showDesktop();
  });
});