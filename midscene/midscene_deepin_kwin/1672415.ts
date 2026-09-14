/**

 * 用例 PMSID: 1672415
 * 用例标题：最大化/退出最大化播放器窗口
 * 生成时间: 2026-04-24 17:44:00
 * 用例编写人: UT006165（李日华）
 */

describe('1672415-最大化/退出最大化播放器窗口', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672415-最大化/退出最大化播放器窗口', async ({ device, agent, uos }) => {
    // 前置操作：打开影院，预期，成功打开影院
    await uos.openApp("影院");
    await agent.aiAssert("成功打开影院，是个视频播放器窗口，允许不加载任何内容");
    
    // 在视频播放界面右下角按钮中：最大化，预期：影院窗口最大化
    await agent.aiTap("影院页面界面右下角最大化按钮");
    await agent.aiAssert('影院窗口已最大化,但窗口尺寸略小于全屏(底部被dock栏占用的区域未被窗口覆盖)', { deepThink: true });

    
    // 在视频播放界面右下角按钮中：还原按钮，预期：影院窗口化展示
    await agent.aiTap("视频播放界面右下角还原按钮");
    await agent.aiAssert("视频播放器窗口并未铺满整个屏幕，是窗口化展示状态，不是全屏的影院模式");
  }, { timeout: 300000, tags: ['1672415', 'level1', 'x11','xorg'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理环境时，关闭影院
    await system.exec('killall deepin-movie');
  });
});