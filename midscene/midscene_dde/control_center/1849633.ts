
/**
 * 用例 PMSID: 1849633
 * 用例标题: 【通知中心】通知支持设定自动消失时间
 * 生成时间: 2026-02-10 09:17:33
 * 用例编写人: UT001924（李鹤）
 */

describe('1849633-【通知中心】通知支持设定自动消失时间', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1849633-【通知中心】通知支持设定自动消失时间', async ({ device, agent, uos, system }) => {
    // 定义发送命令(因为ai识别需要一些时间，所以这里设定12秒消失)
    const sendNtifyCmd = "notify-send 测试 测试通知支持设定时间消失 -t 12000";
    // 发送通知
    await system.exec(sendNtifyCmd);
    // 等待7秒后查看通知还在
    await new Promise(resolve => setTimeout(resolve, 7000));
    await agent.aiAssert("'测试通知支持设定时间消失'文字可见");
    // 断言通知发出到12秒，桌面通知消失，这里多等1秒避免误报
    await new Promise(resolve => setTimeout(resolve, 6000));
    await agent.aiAssert("'测试通知支持设定时间消失'文字不可见");
    // 打开通知中心，断言通知进入了通知中心
    await device.pressKey("super", "m");
    await agent.aiAssert("'测试通知支持设定时间消失'文字可见");
  }, { timeout: 600000, tags: ['1849633', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭通知中心
    await device.pressKey("super", "m");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
