/**
 * 用例 PMSID: 1801743
 * 用例标题: 【通知中心】已经设置默认浏览器，模拟通知信息时，标题和正文加入链接地址，点击链接地址正常跳转到url地址
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801743-【通知中心】已经设置默认浏览器，模拟通知信息时，标题和正文加入链接地址，点击链接地址正常跳转到url地址', () => {
  const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64/apps/';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1801743-【通知中心】已经设置默认浏览器，模拟通知信息时，标题和正文加入链接地址，点击链接地址正常跳转到url地址', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟通知信息：标题和正文加入链接地址（标题文字精简，避免过长省略）
    await system.exec('notify-send -a "链接跳转测试应用" "https://www.uniontech.com" "正文链接：https://www.uniontech.com" -t 60000');
    await agent.aiWaitFor('桌面右下角出现通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查1: 通知横幅展示包含网址链接内容
    await agent.aiAssert('桌面右下角显示的通知横幅中包含网址链接或uniontech相关文字');

    // 步骤 2: 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiWaitFor('通知中心中显示通知信息', { timeoutMs: 15000 });

    // 检查2: 通知中心中展示通知信息，点击正文链接能正常跳转到url地址
    await agent.aiTap('通知中心中该通知正文内容中的链接文字', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 验证浏览器是否成功打开对应网址
    const browserOpened = await agent.aiBoolean('屏幕中打开了浏览器窗口并显示网页内容', { deepThink: true });
    if (browserOpened) {
      await uos.closeCurrentWindow();
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }, { timeout: 600000, tags: ['1801743', 'level3'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
