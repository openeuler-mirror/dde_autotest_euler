/**

 * 用例 PMSID: 1672405
 * 用例标题：调出工作区
 * 生成时间: 2026-04-24 15:49:00
 * 用例编写人: UT006165（李日华）
 */

describe('1672405-调出工作区', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672405-调出工作区', async ({ device, agent, uos }) => {
    // 前置操作：输入快捷键打开终端，在桌面输入快捷键Super+S，预期：进入多任务视图
    await device.pressKey("Esc");
    await device.pressKey('Ctrl', 'Alt', 'T');
    await device.pressKey("Super+S");
  
    
    // 查看工作区选择区展示，预期：展示桌面缩略图，根据桌面实际比例缩放展示
    await agent.aiAssert("多任务视图中屏幕顶部20%高度区域内有工作区缩略图,下方部分可能会有窗口展示");
    // await agent.aiAssert("桌面缩略图按实际比例缩放展示");
    await agent.aiAssert('桌面顶部壁纸缩略图都在矩形容器中展示，不同比例的原始壁纸都被裁剪适配了容器大小展示')
    
    // 查看工作区窗口选择区，预期：展示窗口缩略图，根据窗口实际情况缩放展示，多窗口采用平铺方式展示
    await agent.aiAssert("屏幕下方80%区域内的工作区显示的是一个打开的终端窗口");
    await agent.aiAssert("窗口缩略图正常展示");
  }, { timeout: 300000, tags: ['1672405', 'level1', 'x11','xorg'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 返回桌面
    await device.pressKey("Esc");
    await uos.showDesktop();
    await system.exec('killall deepin-terminal dde-file-manager browser 2>/dev/null || true');

  });
});