/**
 * 用例 PMSID: 1807799
 * 用例标题: 文管右键菜单显示快捷键-快捷键功能-桌面快捷键查看属性
 * 生成时间: 2025-12-15 13:22:54
 * 用例编写人: UT000649(黄甜)
 */

describe('1807799-文管右键菜单显示快捷键-快捷键功能-桌面快捷键查看属性', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent ,system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`touch /home/$USER/Desktop/新建测试文件.txt`)
    await system.exec(`mkdir /home/$USER/Desktop/新建测试文件夹`)
  });

  test('1807799-文管右键菜单显示快捷键-快捷键功能-桌面快捷键查看属性', async ({ device, agent, uos , system}) => {
    // 步骤 1: 桌面创建文件，查看属性
    await agent.aiRightClick("新建测试文件.txt",{timeoutMS:200});
    await device.pressKey(`R`)
    await agent.aiAssert("桌面存在新建测试文件.txt属性窗口");
    await agent.aiTap("属性窗口右上角关闭按钮:X");
    
    // 步骤 2: 查看文件夹，查看属性属性
    await agent.aiRightClick("新建测试文件夹",{timeoutMS:200});
    await device.pressKey(`R`)
    await agent.aiAssert("桌面存在新建测试文件夹属性窗口");
    await agent.aiTap("属性窗口右上角关闭按钮:X");

    // 步骤 3: 查看多个文件、文件夹、应用属性
    await device.pressKey(`Ctrl`,`A`)
    await agent.aiRightClick("新建文件夹图标",{timeoutMS:200});
    await device.pressKey(`R`)
    await agent.aiAssert("桌面存在计算机、服务与支持等属性窗口");

  }, { timeout: 1200000, tags: ['1807799', 'level2','smoke','huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("关闭全部", { deepThink: true });
    await system.exec(`rm -rf /home/uos/Desktop/新建测试*`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});




