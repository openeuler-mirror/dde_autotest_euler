/**
 * 用例 PMSID: 1832189
 * 用例标题: 【启动器】【全屏模式】【搜索规则】搜索框文案及翻译检查
 * 用例编写人: UT005571（王艺桥）
 * 生成时间: 2026-08-31 11:00:00
 * 说明：通过设置英文环境变量并重启 dde-shell 服务使 UI 切换为英文（无需注销登录），用例结束后恢复中文环境。
 */

describe('1832189-【启动器】【全屏模式】【搜索规则】搜索框文案及翻译检查', () => {
  // DBus 公共参数
  const LANG_BUS = 'gdbus call --session --dest org.deepin.dde.LangSelector1 --object-path /org/deepin/dde/LangSelector1 --method';
  const SETTINGS_FILE = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  beforeAll(async ({ uos, system }) => {
    // 确保系统语言为简体中文基线
    const localeRes = await system.exec(`${LANG_BUS} org.freedesktop.DBus.Properties.Get org.deepin.dde.LangSelector1 CurrentLocale`);
    if (!(localeRes.success && localeRes.stdout.includes('zh_CN'))) {
      await system.exec(`${LANG_BUS} org.deepin.dde.LangSelector1.SetLocale s "zh_CN.UTF-8"`);
      await system.exec(`${LANG_BUS} org.deepin.dde.LangSelector1.DeleteLocale s "en_US.UTF-8"`);
    }
    // 确保启动器为窗口模式
    const frameRes = await system.exec(`cat ${SETTINGS_FILE}`);
    if (!(frameRes.success && frameRes.stdout.includes('current_frame=WindowedFrame'))) {
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${SETTINGS_FILE}`);
    }
    await uos.showDesktop();
  });

  test('1832189-【启动器】【全屏模式】【搜索规则】搜索框文案及翻译检查', async ({ device, agent, uos, system }) => {
    // 步骤 1: 切换系统 UI 为英文环境（通过环境变量重启 dde-shell，无需注销）
    await system.exec(`${LANG_BUS} org.deepin.dde.LangSelector1.AddLocale s "en_US.UTF-8"`);
    await system.exec(`${LANG_BUS} org.deepin.dde.LangSelector1.SetLocale s "en_US.UTF-8"`);
    await system.exec('systemctl --user set-environment LANGUAGE=en_US.UTF-8 LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8');
    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await sleep(8000);
    await uos.showDesktop();
    await sleep(2000);

    // 步骤 2: 打开启动器全屏模式
    await uos.openLauncher();
    await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
      images: [{ name: '全屏模式小图标', url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png' }],
      deepThink: true,
    });
    await agent.aiWaitFor('启动器全屏模式已显示');
    await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');

    // 步骤 3: 检查搜索框默认占位文案为英文 "Search"
    await agent.aiAssert('启动器全屏模式底部搜索框显示英文占位文案 Search');

    // 步骤 4: 输入无匹配内容，检查"无搜索结果"文案为英文 "No search results"
    await agent.aiTap('启动器全屏模式底部的搜索输入框');
    await device.typeText('zzzzzzzzzz');
    await agent.aiWaitFor('底部中央的搜索输入框，呈矩形，内有放大镜图标和字符：zzzzzzzzzz', { timeoutMs: 15000 });
    await agent.aiAssert('界面中央显示英文文案 No search results');

    // 收尾：按 ESC 关闭启动器
    await device.pressKey('ESC');
  }, { timeout: 600000, tags: ['1832189', 'level3', 'remote'] });

  afterEach(async ({ device }) => {
    await device.releaseAllKeys();
  });

  afterAll(async ({ uos, system }) => {
    // 恢复系统语言为简体中文
    await system.exec(`${LANG_BUS} org.deepin.dde.LangSelector1.SetLocale s "zh_CN.UTF-8"`);
    await system.exec(`${LANG_BUS} org.deepin.dde.LangSelector1.DeleteLocale s "en_US.UTF-8"`);
    // 恢复 dde-shell 服务环境变量为中文并重启
    await system.exec('systemctl --user unset-environment LANGUAGE LANG LC_ALL');
    await system.exec('systemctl --user set-environment LANGUAGE=zh_CN.UTF-8 LANG=zh_CN.UTF-8');
    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await sleep(8000);
    // 恢复启动器为窗口模式
    const frameRes = await system.exec(`cat ${SETTINGS_FILE}`);
    if (frameRes.success && frameRes.stdout.includes('current_frame=FullscreenFrame')) {
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${SETTINGS_FILE}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await sleep(8000);
    }
    await uos.showDesktop();
  });
});
