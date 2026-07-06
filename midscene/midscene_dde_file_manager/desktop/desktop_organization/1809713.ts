// @ts-nocheck

/**
 * 用例 PMSID: 1809713
 * 用例标题: 【桌面自动整理】桌面选项-非模态窗口
 * 生成时间：2026-02-10 12:29:32
 * 用例编写人：UT000686(李双双)
 */

describe('1809713-桌面自动整理-桌面选项-非模态窗口', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809713-桌面自动整理-桌面选项-非模态窗口', async ({ device, agent, uos, system }) => {
    // 前置条件：创建测试文件
    await system.exec('touch ~/Desktop/9613.txt', 500);
    await agent.aiWaitFor("9613.txt已创建");
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);

    // 步骤1：桌面中间空白处右键，点击"整理桌面"
    await agent.aiRightClick("桌面中间位置");
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiTap("整理桌面");
    await agent.aiAssert("桌面整理功能已开启");

    // 步骤2：启动器-文件管理器，点击侧边栏的音乐
    await uos.openApp("文件管理器", 3000, 20000, true);
  }, { timeout: 900000, tags: ['1809713', 'level4', 'desktop_organization', 'interaction-scenario', 'DITT', 'lishuangshuang111'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ system, device, uos, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理桌面上的测试文件
    await system.exec('rm -f ~/Desktop/9613.txt', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);
    // 确保文件管理器已关闭
    await system.exec('killall dde-file-manager', 500);
  });
});