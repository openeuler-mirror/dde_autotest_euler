// @ts-nocheck

/**
 * 用例PMSID：1809955
 * 用例标题：【1071桌面整理】视图选项配置，关闭一键隐藏集合，快捷键设置
 * 生成时间：2026-02-28 18:58:00
 * 用例编写人：UT000686(李双双)
 */

describe('1809955-视图选项配置-关闭一键隐藏集合', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809955-视图选项配置-关闭一键隐藏集合', async ({ device, agent, uos, system }) => {
    //前置条件，重置桌面整理
     await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);
    // 前置条件：创建测试文件
    await system.exec('mkdir ~/Desktop/1809955', 500);
    await agent.aiWaitFor("1809955文件夹已创建");

    // 前置条件：开启桌面整理功能
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);

    // 前置条件：桌面中间空白处，右键，点击"整理桌面"
    await agent.aiRightClick("桌面中间位置");
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiTap("整理桌面");
    await agent.aiWaitFor("桌面整理功能已开启");

    // 步骤1：桌面中间空白处，右键，点击"桌面设置"
    await agent.aiRightClick("桌面中间位置");
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiTap("桌面设置");
    await agent.aiWaitFor("桌面设置页面已打开");

    // 步骤2：点击"一键隐藏所有集成"右侧的高亮按钮
    await agent.aiTap("一键隐藏所有集合右侧的高亮按钮");
    await agent.aiAssert("桌面设置无隐藏/显示集合快捷键的文案");
    // 恢复环境
    await agent.aiTap("一键隐藏所有集合右侧黑色按钮");
    await device.pressKey("alt+F4")

    // 断言桌面设置页面无"隐藏/显示集成快捷键"的文案
    await agent.aiAssert("桌面设置页面不显示隐藏/显示集成快捷键");
  }, { timeout: 900000, tags: ['1809955', 'level3', 'desktop_organization', 'interaction-scenario', 'DITT', 'lishuangshuang'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ system, device, uos, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理桌面上的测试文件
    await system.exec('rm -rf ~/Desktop/1809955', 500);
    await device.pressKey("alt+F4")
    // 恢复桌面整理功能到默认状态
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);
  });
});