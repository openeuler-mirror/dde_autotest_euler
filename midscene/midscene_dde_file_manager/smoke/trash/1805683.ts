// @ts-nocheck

/**
 * 用例 PMSID: 1805683
 * 用例标题: 【回收站】入口-通过文管窗口进入回收站
 * 生成时间：2026-01-21 15:05:00
 * 用例编写人：UT000686(李双双)
 */

describe('1805683-【回收站】入口-通过文管窗口进入回收站', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805683-通过文管窗口进入回收站的各种方式', async ({ device, agent, uos , system}) => {
    // 步骤1：在桌面下面任务栏上，双击“文件管理器”图标，点击侧边栏的回收站，断言进入回收站目录，侧边栏回收站高亮，点击“Alt+F4”快捷键关闭文件管理器
    await system.exec('killall dde-file-manager', 500);
    console.log('Step 1: 任务栏双击文件管理器，点击侧边栏回收站，检查高亮，关闭');
    await agent.aiTap("桌面下方任务栏上的文件管理器图标")
    // await agent.aiDoubleClick("桌面下方任务栏上的文件管理器图标");
    await agent.aiWaitFor("文件管理器已打开");
    await agent.aiTap("侧边栏的回收站");
    await agent.aiAssert("已进入回收站目录");
    await agent.aiAssert("侧边栏的回收站处于高亮状态");
    await device.pressKey("Alt+F4");

    // 步骤2：启动器打开文管窗口，点击侧边栏的回收站，断言进入回收站目录，侧边栏回收站高亮
    console.log('Step 2: 启动器打开文件管理器，点击侧边栏回收站，检查高亮，关闭');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor("文件管理器已打开");
    await agent.aiTap("侧边栏的回收站");
    await agent.aiAssert("已进入回收站目录");
    await agent.aiAssert("侧边栏的回收站处于高亮状态");
   

    // 步骤3：启动器打开文管窗口，点击侧边栏的桌面，双击回收站图标，断言进入回收站目录，侧边栏回收站高亮，点击“Alt+F4”快捷键关闭文件管理器
    console.log('Step 3: 启动器打开文件管理器，点击侧边栏桌面，双击回收站图标，检查高亮，关闭');
    await agent.aiTap("侧边栏的桌面");
    await agent.aiWaitFor("桌面目录已打开");
    await agent.aiDoubleClick("回收站图标");
    await agent.aiAssert("已进入回收站目录");
    await agent.aiAssert("侧边栏的回收站处于高亮状态");
    await device.pressKey("Alt+F4");

    // 步骤4：启动器打开文管窗口，双击数据盘，双击桌面，双击回收站图标，断言进入回收站目录，侧边栏回收站高亮，点击“Alt+F4”快捷键关闭文件管理器
    console.log('Step 4: 双击回收站，检查高亮，关闭');
    await agent.aiTap("侧边栏的数据盘");
    await agent.aiWaitFor("数据盘目录已打开");
    await agent.aiDoubleClick("桌面");
    await agent.aiWaitFor("桌面目录已打开");
    await agent.aiDoubleClick("回收站图标");
    await agent.aiAssert("已进入回收站目录");
    await agent.aiAssert("侧边栏的回收站处于高亮状态");
    await device.pressKey("Alt+F4");

    // 步骤5：回收站图标，右键点击打开，断言进入回收站目录，侧边栏回收站高亮，点击“Alt+F4”快捷键关闭文件管理器
    console.log('Step 5: 桌面目录右键回收站，点击打开，检查高亮，关闭');
    await agent.aiRightClick("回收站图标");
    await agent.aiTap("打开");
    await agent.aiAssert("已进入回收站目录");
    await agent.aiAssert("侧边栏的回收站处于高亮状态");
    await device.pressKey("Alt+F4");
    await agent.aiTap("侧边栏的计算机");
   

    // 步骤6：启动器打开文管窗口，点击在文件管理器页面左上角的显示器图标，点击快捷键ctrl+a，点击Delete快捷键，输入trash://,点击“enter”，断言进入回收站目录，侧边栏回收站高亮，点击“Alt+F4”快捷键关闭文件管理器
    console.log('Step 6: 启动器打开文件管理器，点击左上角显示器图标，Ctrl+A，Delete，输入trash://，检查高亮，关闭');
    await device.pressKey("ctrl+l")
    // await agent.aiTap("文件管理器上方的地址栏");
    await agent.aiWaitFor("地址栏框处于高亮的状态")
    await device.pressKey("Ctrl+A");
    await agent.aiWaitFor("地址栏内容处于全选的状态")
    await device.pressKey("Delete");
    await agent.aiWaitFor("地址栏内容为空的状态")
    await device.typeText("trash://",true);
    await agent.aiAssert("已进入回收站目录");
    // await agent.aiAssert("侧边栏的回收站处于高亮状态");

    console.log('【调试】测试用例执行完成');
  }, { timeout: 600000, tags: ['1805683', 'level2', 'smoke', 'trash', 'DITT' , 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});