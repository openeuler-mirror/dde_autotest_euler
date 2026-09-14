/**
 * 用例 PMSID: 1807813
 * 用例标题: 文管右键菜单显示快捷键-快捷键功能-文管内快捷键查看属性
 * 生成时间: 2025-12-15 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1807813-文管右键菜单显示快捷键-快捷键功能-文管内快捷键查看属性', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`touch /home/$USER/Desktop/1807813.txt`);
    await system.exec(`mkdir /home/$USER/Desktop/1807813`)
  });

  test('1807813-文管右键菜单显示快捷键-快捷键功能-文管内快捷键查看属性', async ({ device, agent, uos , system}) => {
    // 步骤 1: 打开文管，进入桌面目录
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的桌面目录",{timeoutMS:200});
    
    // 步骤 2: 桌面创建文件，查看属性
    await agent.aiRightClick("文件管理器窗口的1807813.txt文件的图标",{timeoutMS:300});
    await device.pressKey(`R`)
    await agent.aiAssert("桌面存在1807813.txt属性窗口");
    await agent.aiTap("属性窗口右上角关闭按钮:X");
    
    // 步骤 3: 查看文件夹，查看属性属性
    await agent.aiRightClick("文件管理器窗口的1807813文件夹的图标",{timeoutMS:200});
    await device.pressKey(`R`)
    await agent.aiAssert("桌面存在1807813属性窗口");
    await agent.aiTap("属性窗口右上角关闭按钮:X");

    // 步骤 4: 查看多个文件、文件夹、应用属性
    await device.pressKey(`Ctrl`,`A`)
    await agent.aiRightClick("文件管理器窗口的1807813文件夹的图标",{timeoutMS:200});
    await device.pressKey(`R`)
    await agent.aiAssert("桌面面存在计算机、服务与支持等属性窗口",{deepThink:true});

  }, { timeout: 600000, tags: ['1807813', 'level2','smoke','huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("关闭全部");
    await system.exec(`rm -rf /home/uos/Desktop/1807813*`)
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});