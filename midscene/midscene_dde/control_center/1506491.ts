
/**
 * 用例 PMSID: 1506491
 * 用例标题: 【控制中心】【网络】【系统代理】系统代理界面检查
 * 生成时间: 2026-04-24 14:31:11
 * 用例编写人: UT002485(卢燕)
 */

describe('1506491-【控制中心】【网络】【系统代理】系统代理界面检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1506491-【控制中心】【网络】【系统代理】系统代理界面检查', async ({ device, agent, uos }) => {
    // 进入控制中心系统代理页面
    await uos.openApp('控制中心', { maximizeWindow: true });
    await agent.aiTap("窗口左侧显示的网络");
    await agent.aiTap("窗口右侧显示的系统代理");

    // 检查系统代理开关默认状态
    await agent.aiAssert({
      prompt: '系统代理开关显示为关闭状态',
      images: [
        {
          name: '静音图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/disable.png',
        },
      ],
      deepThink: true,
      });

    // 开启系统代理
    await agent.aiTap("系统代理开关");
    await agent.aiAssert("系统代理开关已开启，显示代理类型");

    // 检查代理类型下拉框
    await agent.aiAssert("代理类型右侧显示为手动");
    await agent.aiTap("代理类型右侧的符号⌵");
    await agent.aiAssert("代理类型下拉框存在选项：自动、手动，手动前显示符合✓");
     
    // 检查自动模式配置URL，默认显示为空
    await agent.aiTap("自动");
    await agent.aiAssert("配置URL输入框内容为空，显示灰色必填字样");
    await agent.aiTap("配置URL右侧的输入框必填字样", { deepThink: true });
    await device.typeText("https://uniontech#");
    await agent.aiAssert("配置URL输入框显示内容：https://uniontech#");
    await agent.aiTap("代理设置页面空白处使输入框失焦");
    await agent.aiAssert("取消按钮未灰化、可点击");
    await agent.aiAssert("保存按钮未灰化、可点击");
    await agent.aiTap("配置URL输入框使其选中");
    await agent.aiAssert("取消按钮未灰化、可点击");
    await agent.aiAssert("保存按钮未灰化、可点击");

    // 切换到手动模式
    await agent.aiTap("代理类型右侧的符号⌵");
    await agent.aiTap("手动");
    await agent.aiAssert("显示HTTP代理、端口、需要认证，需要认证开关关闭");
    await agent.aiAssert("显示HTTPS代理、端口、需要认证，需要认证开关关闭");
    await agent.aiAssert("显示FTP代理、端口、需要认证，需要认证开关关闭");
    await agent.aiAssert("显示SOCKS代理、端口、需要认证，需要认证开关关闭");
    await agent.aiAssert("文本框内显示localhost, 127.0.0.0/8, ::1");
    await agent.aiAssert("取消按钮高亮显示，保存按钮灰化显示");
  }, { timeout: 600000, tags: ['1506491','level1','smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');   
    await uos.closeCurrentWindow();
  });
});
