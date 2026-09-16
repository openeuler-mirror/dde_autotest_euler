
/**
 * 用例 PMSID: 1801671
 * 用例标题: 【通知中心】点击通知中心长驻区域任一应用折叠通知信息，展开后展示元素与需求一致
 * 生成时间: 2026-03-21 17:32:29
 * 用例编写人: UT001924（李鹤）
 */

describe('1801671-【通知中心】点击通知中心长驻区域任一应用折叠通知信息，展开后展示元素与需求一致', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801671-【通知中心】点击通知中心长驻区域任一应用折叠通知信息，展开后展示元素与需求一致', async ({ device, agent, uos, system }) => {
    for (let i = 1; i < 6; i++) {
      system.exec(`notify-send -a "自动化测试" "通知信息测试" "第${i}条通知"`);
      // 每条通知间隔100ms发送
      await new Promise(resolve => setTimeout(resolve, 200));
    };
    await agent.aiWaitFor("桌面右下角有内容标注为'第5条通知'通知信息");
    // 默认没指定通知消失时间，等待6秒后桌面通知消失进入通知中心，此处等待6秒是业务逻辑不可降低
    await new Promise(resolve => setTimeout(resolve, 6000));
    await device.pressKey("super","m");
    await agent.aiTap("'第5条通知'通知信息");
    await agent.aiAssert({
      prompt: "消息框左上方显示应用程序名称(自动化测试),消息框右上方从左到右显示收起、设置、清除通知图标按钮,展示与参考图一致",
        images: [
        { name: '参考图', url: 'https://youqu.uniontech.com/_picture/professional-desktop/lihe/control-center/expandNotification.png' }
        ],
        convertHttpImage2Base64: true,
    });
  }, { timeout: 600000, tags: ['1801671', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
