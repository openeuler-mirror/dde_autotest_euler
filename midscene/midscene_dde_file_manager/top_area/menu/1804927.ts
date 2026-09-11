/**
 * 用例 PMSID: 1804927
 * 用例标题: 不勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-弹窗提示-点击【取消】
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1804927-不勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-弹窗提示-点击【取消】', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1804927-不勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-弹窗提示-点击【取消】', async ({ device, agent, uos , system}) => {

    // 步骤 1: 新建“.”开头文件，取消隐藏
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText(".测试文件");
    await device.pressKey(`Enter`)
    await agent.aiWaitFor("对话框加载完成");
    await agent.aiTap("取消");
    await agent.aiAssert("文件名称为新建文本.txt");

    // 步骤 2: 新建“.”开头文件夹，取消隐藏
    await agent.aiRightClick("新建文本.txt右侧桌面空白处",{timeoutMS:200});
    await agent.aiTap("新建文件夹");
    await device.typeText(".测试文件夹");
    await device.pressKey(`Enter`)
    await agent.aiWaitFor("对话框加载完成");
    await agent.aiTap("取消");
    await agent.aiAssert("文件夹名称为新建文件夹");

    // 步骤 3:重命名“.”开头文件，取消隐藏
    await agent.aiRightClick("新建文本.txt");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("重命名");
    await device.typeText(".测试文件");
    await device.pressKey(`Enter`)
    await agent.aiWaitFor("对话框加载完成");
    await agent.aiTap("取消");
    await agent.aiAssert("文件名称为新建文本.txt");

    // 步骤 4: 重命名“.”开头文件夹，取消隐藏
    await agent.aiRightClick("新建文件夹");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("重命名");
    await device.typeText(".测试文件夹");
    await device.pressKey(`Enter`)
    await agent.aiWaitFor("对话框加载完成");
    await agent.aiTap("取消");
    await agent.aiAssert("文件夹名称为新建文件夹");

  }, { timeout: 800000, tags: ['1804927', 'level2', 'menu', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/$USER/Desktop/新建*`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});