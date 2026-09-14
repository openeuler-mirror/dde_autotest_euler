/**

 * 用例 PMSID: 1672417
 * 用例标题：最小化/还原播放器窗口
 * 生成时间: 2026-04-24 17:13:00
 * 用例编写人: UT006165（李日华）
 */

describe('1672417-最小化/还原播放器窗口', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672417-最小化/还原播放器窗口', async ({ device, agent, uos,system }) => {
    //前置操作：保证只有一个工作区
    await device.pressKey('Super', 'S');

    // 连续输入5次快捷键alt+-，使工作区的数量为1
    console.log('连续输入5次 Alt+- 减少工作区数量到1');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
    }
    await device.pressKey("Esc");
    await device.pressKey('Ctrl','Alt','1');


    // 打开影院，预期，成功打开影院
    await uos.openApp("影院");
    await agent.aiAssert("成功打开影院，是个视频播放器窗口，允许不加载任何内容");
    
    // 在视频播放界面右上角功能按钮中：最小化，预期视频窗口正确展示最小化效果
    await agent.aiTap("影院界面右上角最小化按钮");
    await agent.aiAssert("影院最小化,展示桌面");
    
    // 点击dock栏影院图标，影院恢复窗口显示
    // 防止又点成相册图标，先给它杀了
    await system.exec('ll-cli kill org.deepin.album')
    await agent.aiTap("dock栏影院图标");
    await agent.aiAssert("影院恢复窗口显示");

  }, { timeout: 300000, tags: ['1672417', 'level1', 'x11','xorg'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理环境时，关闭影院
    await system.exec('ll-cli kill org.deepin.movie')

  });
});