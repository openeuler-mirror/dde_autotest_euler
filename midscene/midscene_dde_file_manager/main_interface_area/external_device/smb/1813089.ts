/**
 * 用例 PMSID: 1813089
 * 用例标题: 连接服务器-【我收藏的服务器】显示检查
 * 生成时间: 2026-08-13
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

describe('1813089-连接服务器-我收藏的服务器显示检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);

    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813089-连接服务器-我收藏的服务器显示检查', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：启动器文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤2：点击右上角主菜单，点击"连接到服务器"');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap('连接到服务器');
    await agent.aiWaitFor('连接到服务器弹框已显示');

    console.log('步骤2：若我的收藏服务器不为空，从上到下依次点击收藏服务器IP右侧的X号，直到全部删除');
    while (true) {
      const hasFavorite = await agent.aiBoolean('收藏服务器列表中存在服务器条目');
      if (!hasFavorite) {
        console.log('收藏服务器已全部删除');
        break;
      }
      console.log('点击第一个收藏服务器IP右侧的X号');
      await agent.aiTap('从上到下第一个收藏服务器IP右侧的X号');
      await system.exec('sleep 1');
    }

    console.log('步骤2：断言页面显示"暂无收藏"');
    await agent.aiAssert('页面显示"暂无收藏"');

    console.log('步骤3：点击服务器IP输入框，Ctrl+A，输入10.20.0.1，点击收藏标签');
    await agent.aiTap('服务器IP输入框');
    await device.pressKey('Ctrl', 'a');
    await device.pressKey('Delete');
    await agent.aiInput('10.20.0.1', '服务器IP输入框');
    await agent.aiTap('服务器IP输入框右侧的收藏标签');
    await system.exec('sleep 1');

    console.log('步骤4：点击服务器IP输入框，Ctrl+A，输入10.20.0.2，点击收藏标签');
    await agent.aiTap('服务器IP输入框');
    await device.pressKey('Ctrl', 'a');
    await device.pressKey('Delete');
    await agent.aiInput('10.20.0.2', '服务器IP输入框');
    await agent.aiTap('服务器IP输入框右侧的收藏标签');
    await system.exec('sleep 1');

    console.log('步骤4：断言收藏服务器下面存在10.20.0.1和10.20.0.2');
    await agent.aiAssert('收藏服务器列表中存在10.20.0.1');
    await agent.aiAssert('收藏服务器列表中存在10.20.0.2');

    console.log('步骤4：断言一个处于选中状态，一个处于非选中状态');
    const is10Selected = await agent.aiBoolean('收藏服务器列表中10.20.0.1处于选中状态');
    const is20Selected = await agent.aiBoolean('收藏服务器列表中10.20.0.2处于选中状态');
    if (is10Selected !== is20Selected) {
      console.log('断言通过：一个选中，一个非选中');
    } else {
      throw new Error('断言失败：两个收藏服务器选中状态相同，应为一个选中一个非选中');
    }

    console.log('测试完成');
  }, { timeout: 600000, tags: ['1813089', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理收藏的服务器
    try {
      await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
      await agent.aiTap('连接到服务器');
      await agent.aiWaitFor('连接到服务器弹框已显示');
      while (true) {
        const hasFavorite = await agent.aiBoolean('收藏服务器列表中存在服务器条目');
        if (!hasFavorite) break;
        await agent.aiTap('从上到下第一个收藏服务器IP右侧的X号');
        await system.exec('sleep 1');
      }
      await device.pressKey('Escape');
    } catch (error) {
      console.log('清理收藏服务器失败，跳过');
    }

    system.exec('killall dde_file_manager');
    await cleanSmbMounts(agent, system, 1);
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
