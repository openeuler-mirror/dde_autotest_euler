
/**
 * 用例 PMSID: 1818431
 * 用例标题: 【任务栏】【快捷面板】【声音】快捷面板界面，音量图标静音功能检查
 * 生成时间: 2026-04-14 15:25:23
 * 用例编写人: UT002485(卢燕)
 */
const caseDir = process.env.TESTCASE_DIR;
describe('1818431-【任务栏】【快捷面板】【声音】快捷面板界面，音量图标静音功能检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent , uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1818431-【任务栏】【快捷面板】【声音】快捷面板界面，音量图标静音功能检查', async ({ device, agent, uos, system }) => {
    // 初始化环境，取消静音设置
    const sound = `pactl set-sink-mute @DEFAULT_SINK@ 0`;
    await system.exec(sound,5000);

    // 打开声音面板设置静音
    await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
    await agent.aiWaitFor("快捷设置面板已显示");
    await agent.aiTap("UOS系统控制中心快捷面板内，音量调节条左端的喇叭形状功能按钮", { deepThink: true });
    await agent.aiAssert({
      prompt: '音量调节条左端显示静音图标',
      images: [
        {
          name: '静音图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/volume-left.png',
        },
      ],
      deepThink: true,
      });

    //检查控制中心的声音输出音量图标
    await uos.openApp('控制中心');
    await agent.aiTap("弹出窗口上的声音");   
    await agent.aiAssert({
      prompt: '输出音量调节条左端显示静音图标',
      images: [
        {
          name: '静音图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/volume-left.png',
        },
      ],
      deepThink: true,
      });

    await agent.aiTap("弹出窗口右上角的X关闭按钮"); 
    
    // 恢复环境，取消静音设置
    const sound2 = `pactl set-sink-mute @DEFAULT_SINK@ 0`;
    await system.exec(sound2,5000);

    // 打开声音快捷面板设置静音
    await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
    await agent.aiWaitFor("快捷设置面板已显示");    
    await agent.aiTap("UOS系统控制中心快捷面板内，音量调节条右端的设备形状功能按钮", { deepThink: true });
    await agent.aiWaitFor("声音快捷设置面板已显示");
    await agent.aiTap("音量滑块左端的喇叭图标", { deepThink: true });
    await agent.aiAssert('音量滑块左端显示音量减图标');

    //检查控制中心的声音输出音量图标
    await uos.openApp('控制中心');
    await agent.aiTap("弹出窗口上的声音");   
    await agent.aiAssert({
      prompt: '输出音量调节条左端显示静音图标',
      images: [
        {
          name: '静音图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/volume-left.png',
        },
      ],
      deepThink: true,
      });
    await agent.aiTap("弹出窗口右上角的X关闭按钮");
  }, { timeout: 600000, tags: ['1818431', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});
