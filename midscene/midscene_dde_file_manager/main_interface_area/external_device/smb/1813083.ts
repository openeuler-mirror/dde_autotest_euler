/**
 * 用例 PMSID: 1813083
 * 用例标题: 连接服务器-通过【x】按键减少【我收藏的服务器】的收藏信息检查
 * 生成时间: 2026-08-13
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

describe('1813083-连接服务器-通过x按键减少我收藏的服务器的收藏信息检查', () => {
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

  test('1813083-连接服务器-通过x按键减少我收藏的服务器的收藏信息检查', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：启动器文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤2：点击右上角主菜单，点击"连接到服务器"');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap('连接到服务器');
    await agent.aiWaitFor('连接到服务器弹框已显示');

    console.log('步骤2：若收藏服务器不为空，从上到下依次点击收藏服务器IP右侧的X号，直到全部删除');
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

    console.log('步骤4：点击10.20.0.1，点击右侧的X号');
    await agent.aiHover('收藏服务器列表中的10.20.0.1');
    await system.exec('sleep 1');
    await agent.aiTap('收藏服务器10.20.0.1右侧的X号');
    await system.exec('sleep 1');

    console.log('步骤5：服务器IP输入框右侧栏变收藏符号，点击"收藏符号"');
    await agent.aiTap('服务器IP输入框右侧的收藏符号');
    await system.exec('sleep 1');

    console.log('步骤6：断言收藏栏多一个10.20.0.1');
    await agent.aiWaitFor('收藏服务器列表中存在10.20.0.1');
    await agent.aiAssert('收藏服务器列表的10.20.0.1变为选中状态');

    console.log('步骤7：点击服务器IP输入框，Ctrl+A，输入10.20.0.2，点击收藏标签');
    await agent.aiTap('服务器IP输入框');
    await device.pressKey('Ctrl', 'a');
    await device.pressKey('Delete');
    await agent.aiInput('10.20.0.2', '服务器IP输入框');
    await agent.aiTap('服务器IP输入框右侧的收藏标签');
    await system.exec('sleep 1');

    console.log('步骤8：将鼠标悬停在10.20.0.1的收藏服务器IP上，断言收藏的IP右侧均有X号');
    await agent.aiHover('收藏服务器列表中的10.20.0.1');
    await system.exec('sleep 1');
    await agent.aiAssert('收藏服务器10.20.0.1右侧有X号');
    await agent.aiAssert('收藏服务器10.20.0.2右侧有X号');

    await agent.aiTap('收藏服务器10.20.0.2右侧的X号');
    await agent.aiTap("10.20.0.1")
    await agent.aiTap('收藏服务器10.20.0.1右侧的X号');
    await agent.aiAssert('收藏服务器列表中不存在10.20.0.1');
    await agent.aiAssert('收藏服务器列表中不存在10.20.0.2');
    await device.pressKey('Escape');

    console.log('测试完成');
  }, { timeout: 1200000, tags: ['1813083', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

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

    // const { cleanSmbMounts, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    system.exec('killall dde-file-manager');
    await cleanSmbMounts(agent, system, 1);
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
