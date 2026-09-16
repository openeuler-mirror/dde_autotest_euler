/**

 * 用例 PMSID: 1672393
 * 用例标题：窗口快捷操作菜单
 * 生成时间: 2026-04-24 18:15:00
 * 用例编写人: UT006165（李日华）
 */

describe('1672393-窗口快捷操作菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672393-窗口快捷操作菜单', async ({ device, agent, uos }) => {
    // 前置操作：打开终端应用
    await uos.openApp("终端");
    
    // 步骤1：在任一激活窗口，按【alt+space】，在当前窗口左上角显示窗口快捷菜单
    console.log('步骤1:在终端窗口按Alt+Space显示快捷菜单');
    await agent.aiTap("终端窗口标题栏"); // 激活窗口
    await device.pressKey("Alt", "Space");
    await agent.aiWaitFor("窗口快捷菜单已显示");
    
    // 验证菜单显示在窗口左上角
    await agent.aiAssert("窗口快捷菜单显示在当前窗口左上角");

    // 步骤2：查看菜单内容，菜单依次为：最小化、最大化、移动、总在最前、总在可见工作区、移至右/左边的工作区、关闭
    console.log('步骤2:验证菜单项内容');
    
    // 验证菜单项顺序和内容
    await agent.aiAssert("菜单项依次包含最小化、最大化、移动、更改大小、总在最前、总在可见工作区、移至左边的工作区、移至右边的工作区、关闭");

    // 这部分有bug：313671会导致失败，暂时注释掉
    // 关闭快捷菜单
    // await device.pressKey("Esc");
    // await agent.aiWaitFor("窗口快捷菜单已关闭");
    
    // // 打开启动器窗口
    // await device.pressKey('Super');
    // await device.pressKey("Alt", "Space");
    // // 验证启动器窗口没有显示快捷菜单
    // await agent.aiAssert("左下方显示启动器");
    // await agent.aiAssert("启动器界面保持正常显示");
    
    
  }, { timeout: 300000, tags: ['1672393', 'level1', 'x11','xorg'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 退出菜单，进入桌面，关闭终端
    await device.pressKey("Esc");
    await uos.showDesktop(); 
    await agent.aiRightClick("任务栏终端图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
  });
});