/**
 * 用例 PMSID: 1804801
 * 用例标题: 勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1804801-勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-不弹窗提示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1804801-勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-不弹窗提示', async ({ device, agent, uos , system}) => {

    // 步骤 1:设置取消勾选“显示隐藏文件”
    await agent.aiTap("桌面空白处");
    await device.pressKey(`Ctrl+H`);

    // 步骤 2: 打开文件对话框，创建.开头文件
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器主菜单按钮");
    await agent.aiTap("打开文件");
    await agent.aiTap("文件管理器窗口侧边栏的文档目录");

    await agent.aiRightClick("文档目录空白处");
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText(".测试文件");
    await device.pressKey(`Enter`)
    await agent.aiAssert(".测试文件.txt创建成功");

    // 步骤 2: 创建.开头文件夹
    await agent.aiRightClick("文件管理器窗口文档目录空白处");
    await agent.aiTap("新建文件夹");
    await device.typeText(".测试文件夹");
    await device.pressKey(`Enter`)
    await agent.aiAssert("文件管理器窗口文档目录存在.测试文件夹",{deepThink:true});

    // 步骤 3: 重命名.开头文件
    await agent.aiRightClick(".测试文件.txt");
    await agent.aiTap("重命名");
    await device.typeText(".测试2");
    await device.pressKey(`Enter`)
    await agent.aiAssert(".测试2.txt创建成功",{deepThink:true});

    // 步骤 4: 重命名.开头文件夹
    await agent.aiRightClick(".测试文件夹");
    await agent.aiTap("重命名");
    await device.typeText(".测试3");
    await device.pressKey(`Enter`)
    await agent.aiAssert(".测试3文件夹创建成功",{deepThink:true});

  }, { timeout: 600000, tags: ['1804801', 'level2', 'menu', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("文件管理器窗口文档目录空白处");
    await device.pressKey(`Ctrl+H`);
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
    await agent.aiTap("文本编辑器窗口右上角关闭按钮:X");
    await system.exec(`rm -rf /home/$USER/Documents/.测试*`)
  });
});
