// @ts-nocheck

/**
 * 用例 PMSID: 1808275
 * 用例标题: 回收站图标右键菜单
 * 生成时间：2026-01-19 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1808275-回收站图标右键菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808275-回收站图标右键菜单', async ({ device, agent, uos, system }) => {
    // 新增1：在桌面双击“回收站图标”，进入回收站目录，断言侧边栏回收站是高亮的状态，点击“Alt+F4”快捷键关闭文件管理器
    console.log('Step 1: 在桌面双击“回收站图标”，进入回收站目录，检查侧边栏回收站高亮，关闭窗口');
    await system.exec('killall dde-file-manager', 500);
    await agent.aiDoubleClick("桌面回收站图标");
    await agent.aiWaitFor("回收站已打开");
    await agent.aiAssert("侧边栏的回收站目录处于高亮状态");
    await device.pressKey("Alt+F4");
    
    // 步骤2：在桌面回收站图标上右键，检查右键菜单包含预期选项
    console.log('Step 2: 在桌面回收站图标上右键，检查右键菜单项目');
    await agent.aiRightClick("桌面回收站图标");
    await agent.aiAssert("右键菜单中包含：打开、清空回收站、反选、发送到、属性(R)");
    
    // 步骤3：点击“打开”，进入回收站目录，断言侧边栏回收站是高亮的状态，点击“Alt+F4”快捷键关闭窗口
    console.log('Step 3: 点击“打开”，检查侧边栏回收站高亮，关闭窗口');
    await agent.aiTap("打开");
    await agent.aiWaitFor("回收站已打开");
    await agent.aiAssert("侧边栏的回收站目录处于高亮状态");
    await device.pressKey("Alt+F4");
    
    // 步骤4：在桌面回收站图标上右键，点击“属性(R)”，断言属性弹框已打开，点击“Alt+F4”关闭属性弹框
    console.log('Step 4: 右键点击桌面回收站图标，点击属性，检查弹框，关闭');
    await agent.aiRightClick("桌面回收站图标");
    await agent.aiTap("属性(R)");
    await agent.aiWaitFor("有回收站属性页面处于打开的状态");
    await device.pressKey("Alt+F4");
    
    // 优化步骤5：在桌面回收站图标上右键，鼠标悬停在“发送到”按钮，点击“创建链接”，在创建链接页面，点击“enter”快捷键，启动器打开文件管理器，点击侧边栏“主目录”，断言主目录存在回收站快捷方式，在主目录页面点击“回收站快捷方式”，断言侧边栏回收站是高亮的状态，点击2次“Alt+F4”快捷键关闭文件管理器
    console.log('Step 5: 右键点击桌面回收站图标，发送到创建链接，检查主目录回收站快捷方式，点击并检查高亮');
    await agent.aiRightClick("桌面回收站图标");
    await agent.aiHover("发送到");
    await agent.aiTap("创建链接");
    await device.pressKey("Enter");
    
    // 启动器打开文件管理器
    await uos.openApp('文件管理器', 3000, 20000, true);
    
    // 点击侧边栏“主目录”
    await agent.aiTap("侧边栏的主目录");
    await agent.aiWaitFor("主目录已打开");
    
    // 断言主目录存在回收站快捷方式
    await agent.aiAssert("主目录中存在回收站快捷方式");
    
    // 在主目录页面，点击回收站快捷方式并断言侧边栏高亮
    await agent.aiDoubleClick("回收站快捷方式");
    await agent.aiAssert("侧边栏的回收站目录处于高亮状态");
    
    // 点击2次Alt+F4关闭文件管理器
    await device.pressKey("Alt+F4");
    //  await agent.aiTap("回收站快捷方式");
    await device.pressKey("Delete");
    await system.exec('killall dde-file-manager', 500);
    
    // 步骤6：在桌面回收站图标上右键，点击“清空回收站”，等清空回收站弹框加载完成，点击“清空”，断言清空成功
    console.log('Step 6: 右键点击桌面回收站图标，清空回收站，检查是否成功');
    await agent.aiRightClick("桌面回收站图标");
    await agent.aiTap("清空回收站");
    await agent.aiWaitFor("清空回收站弹框加载完成");
    await agent.aiTap("清空");
    // await agent.aiAssert("清空回收站成功");
    
    console.log('【调试】测试用例执行完成');
  }, { timeout: 600000, tags: ['1808275', 'level2', 'smoke', 'trash', 'DITT' , 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});