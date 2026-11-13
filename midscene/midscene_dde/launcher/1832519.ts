/**
 * 用例 PMSID: 1832519
 * 用例标题: 【启动器】【右键菜单】启动器强依赖应用，"卸载"菜单置灰
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832519-【启动器】【右键菜单】启动器强依赖应用，"卸载"菜单置灰', () => {
  let isFullscreen = false;

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const result = await system.exec('cat /home/uos/.config/deepin/org.deepin.dde-shell/settings.ini');
    if (!result.success) {
      throw new Error('读取配置文件失败');
    }
    const content = result.stdout.toString();
    isFullscreen = content.includes('current_frame=FullscreenFrame');
    if (isFullscreen) {
      await device.pressKey('ESC');
      await uos.openLauncher();
      await agent.aiTap({
        prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
        images: [{ name: '窗口模式小图标', url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png' }],
        deepThink: true,
      });
    }
    await device.pressKey('ESC');
  });

  test('1832519-【启动器】【右键菜单】启动器强依赖应用，"卸载"菜单置灰', async ({ device, agent, uos }) => {
    // 步骤1：打开启动器窗口模式
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示');

    // 步骤2：在启动器搜索框输入"计算机"，聚焦强依赖应用
    await agent.aiTap('启动器窗口底部的搜索框', { deepThink: true });
    await device.typeText('计算机');
    await agent.aiWaitFor('启动器搜索结果显示"计算机"应用');

    // 步骤3：右键点击搜索结果中的"计算机"应用图标
    await agent.aiRightClick('启动器搜索结果的"计算机"应用图标', { deepThink: true });
    await agent.aiWaitFor('右键菜单已显示');

    // 步骤4：强依赖应用右键菜单中"卸载"选项置灰
    await agent.aiAssert('右键菜单中卸载选项置灰不可点击');
  }, { timeout: 600000, tags: ['1832519', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    if (isFullscreen) {
      await uos.openLauncher();
      await agent.aiTap({
        prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
        images: [{ name: '全屏模式小图标', url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png' }],
        deepThink: true,
      });
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
