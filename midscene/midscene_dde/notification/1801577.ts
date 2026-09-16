
/**
 * 用例 PMSID: 1801577
 * 用例标题: 【通知中心】通知横幅区域最多展示三条，超过3条折叠展示
 * 生成时间: 2025-12-19 08:16:36
 * 用例编写人: UT001924(李鹤)
 */

describe('1801577-【通知中心】通知横幅区域最多展示三条，超过3条折叠展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801577-【通知中心】通知横幅区域最多展示三条，超过3条折叠展示', async ({ device, agent, uos, system }) => {
    // 通过循环实现发送5条通知并标记通知顺序
    for (let i = 1; i < 6; i++) {
      system.exec(`notify-send "通知信息测试" "第${i}条通知" -t 20000`);
      // 每条通知间隔100ms发送
      await new Promise(resolve => setTimeout(resolve, 200));
    };
    // 检查超过3条通知时,显示'第3条通知'、'第4条通知'、'第5条通知'文字,其他通知折叠起来
    await agent.aiAssert("可见3条通知，内容分别标注为“第3条通知”“第4条通知”“第5条通知”，且数字越大的通知（第5条）显示在最下方");
  }, { timeout: 1200000, tags: ['1801577', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
