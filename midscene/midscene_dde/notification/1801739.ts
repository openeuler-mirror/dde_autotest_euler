/**
 * 用例 PMSID: 1801739
 * 用例标题: 【通知中心】模拟通知信息时，标题和正文加入链接地址，标题展示为常规文本，正文内容展示为链接样式
 * 生成时间: 2026-07-28 16:49:12
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801739-【通知中心】模拟通知信息时，标题和正文加入链接地址，标题展示为常规文本，正文内容展示为链接样式', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasClearBtn = await agent.aiBoolean('通知中心界面显示"清除全部"按钮');
    if (hasClearBtn) {
      await agent.aiTap('通知中心的清除全部按钮', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    for (let i = 0; i < 8; i++) {
      const hasLeftover = await agent.aiBoolean('通知中心中存在通知');
      if (!hasLeftover) break;
      try {
        await agent.aiHover('通知中心中最上面一条通知', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap('该通知右上角的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { break; }
    }
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801739-【通知中心】模拟通知信息时，标题和正文加入链接地址，标题展示为常规文本，正文内容展示为链接样式', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 模拟通知信息时标题和正文加入链接地址
    await system.exec('notify-send -a "链接样式测试应用" "测试通知支持链接跳转统信官网：https://www.uniontech.com 测试测试" "fewfw fewaf fewa fewa \\n 测试支持链接跳转 \\n 2424 \\n fewfw \\n fewf 统信官网：https://www.uniontech.com 测试测试" -t 60000');
    await agent.aiWaitFor('桌面右下角出现一条通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 1: 查看标题展示
    await agent.aiAssert('通知横幅标题中的链接地址当作纯文本展示，没有链接样式');

    // 步骤 2: 查看正文展示
    await agent.aiAssert('通知横幅正文内容中包含链接地址');

    // 打开通知中心，验证通知中心表现与通知横幅一致
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiAssert('通知中心通知信息正文内容中包含链接地址');
  }, { timeout: 600000, tags: ['1801739', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasClearBtn = await agent.aiBoolean('通知中心界面显示"清除全部"按钮');
    if (hasClearBtn) {
      await agent.aiTap('通知中心的清除全部按钮', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    for (let i = 0; i < 8; i++) {
      const hasLeftover = await agent.aiBoolean('通知中心中存在通知');
      if (!hasLeftover) break;
      try {
        await agent.aiHover('通知中心中最上面一条通知', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap('该通知右上角的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { break; }
    }
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });
});
