// @ts-nocheck

/**
 * 用例PMSID：1810223
 * 用例标题：【1071桌面整理】视图选项，关闭桌面整理
 * 生成时间：2026-02-28 18:30:00
 * 用例编写人：UT000686(李双双)
 */

describe('1810223-视图选项-关闭桌面整理', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810223-视图选项-关闭桌面整理', async ({ device, agent, uos, system }) => {
    //前置条件，重置桌面整理
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);

    // 前置条件：创建测试文件
    await system.exec('mkdir ~/Desktop/1810223', 500);
    await agent.aiWaitFor("1810223文件夹已创建");

    // 前置条件：开启桌面整理功能
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);

    // 前置条件：桌面中间空白处，右键，点击"整理桌面"
    await agent.aiRightClick("桌面中间位置");
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiTap("整理桌面");
    await agent.aiWaitFor("桌面整理功能已开启");

    // 步骤1：桌面中间空白处，右键，点击"桌面设置"，点击"启动桌面整理"右边的开关按钮
    await agent.aiRightClick("桌面中间位置");
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiTap("桌面设置");
    await agent.aiWaitFor("桌面设置页面已打开");
    await agent.aiTap("启用桌面整理右侧的高亮按钮")
    
    // 断言桌面设置页面只有"自动排列图标"、"图标大小"、"启动桌面整理"的文案
    await agent.aiAssert("桌面设置页面显示自动排列图标");
    await agent.aiAssert("桌面设置页面显示图标大小");
    await agent.aiAssert("桌面设置页面显示启动桌面整理");
    
    // 断言1810223文件夹散落在桌面左侧
    await agent.aiAssert("1810223文件夹位于桌面左侧");

    // 点击"启动桌面整理"右边的开关按钮
    await agent.aiTap("启动桌面整理的右侧开关按钮");
    // await agent.aiWaitFor("桌面整理功能已关闭");

    // 步骤2：点击"esc"快捷键
    await device.pressKey("Escape");
    await agent.aiWaitFor("桌面设置页面已关闭");

    // 步骤3：桌面中间空白处，右键，断言右键弹框中有"整理桌面"的文案
    await agent.aiRightClick("桌面中间位置");
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiAssert("右键菜单包含整理桌面选项");
    
    // 断言1810223文件夹散落在桌面左侧
    await agent.aiAssert("1810223文件夹位于桌面左侧");

    // 步骤4：点击"整理桌面"，断言1810223文件被整理到桌面的右侧
    await agent.aiTap("整理桌面");
    await agent.aiWaitFor("桌面整理功能已开启");
    await agent.aiAssert("1810223文件夹位于桌面右侧");
  }, { timeout: 900000, tags: ['1810223', 'level4', 'desktop_organization', 'interaction-scenario', 'DITT', 'lishuangshuang'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ system, device, uos, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('esc')
    // 清理桌面上的测试文件
    await system.exec('rm -rf ~/Desktop/1810223', 500);
    // 恢复桌面整理功能到默认状态
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);
  });
});