// @ts-nocheck

/**
 * 用例 PMSID: 1810621
 * 用例标题: 【Bug转用例场景】在文管重命名目录后马上删除目录
 * 生成时间：2026-07-09 10:00:00
 * 用例编写人：UT000649（黄甜）
 */

describe('1810621-在文管重命名目录后马上删除目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('mkdir -p ~/Desktop/1810621_test');
  });

  test('1810621-在文管重命名目录后马上删除目录', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1810621 ===');

    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap('文件管理器侧边栏的桌面图标');

    console.log('步骤1：打开文管，选中一个目录进入重命名状态，退出编辑状态后再马上删除该目录');
    await agent.aiRightClick('1810621_test');
    await agent.aiTap('重命名');
    await device.typeText('1810621_test_renamed');
    await device.pressKey('Enter');

    await agent.aiRightClick('1810621_test_renamed');
    await agent.aiTap('删除');
    await agent.aiAssert('桌面无1810621_test_renamed目录');

    console.log('检查dde-file-manager是否崩溃');
    const now = new Date();
    const currentTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    console.log(`当前时间：${currentTime}`);
    const coredumpResult = await system.exec(`coredumpctl list | grep dde-file-manager | grep ${currentTime}`);
    console.log(`coredumpctl结果：${coredumpResult.stdout}`);
    await agent.aiAssert(`无${currentTime}时间的崩溃记录`);

    console.log('目录删除成功，文管无崩溃');

    await uos.closeCurrentWindow();

    console.log('✅ 1810621用例测试完成');
  }, { timeout: 600000, tags: ['1810621', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -rf ~/Desktop/1810621*');
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });
});