// @ts-nocheck

/**
 * AI 生成的测试脚本
 * 用例 PMSID: 1809613
 * 用例标题: 【桌面自动整理】集合交互-选项设置
 * 生成时间：2026-02-10 11:38:15
 * 用例编写人：UT000686(李双双)
 */

describe('1809613-集合交互-选项设置', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809613-集合交互-选项设置', async ({ device, agent, uos, system }) => {
    // 前置条件：创建测试文件
    // 确保桌面整理功能已正确关闭
    // 前置条件：确保桌面整理功能已开启
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);
    await system.exec('touch ~/Desktop/9613.txt', 500);
    await agent.aiWaitFor("9613.txt已创建");

    // 步骤1：桌面中间空白处右键，点击"整理桌面"
    await agent.aiRightClick("桌面中间位置");
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiTap("整理桌面", { deepThink: true });
    await agent.aiWaitFor("桌面整理功能已开启");

    // 步骤2：鼠标hover到9613.txt文件上，点击右上角的三点按钮，断言存在"集合尺寸"的按钮
    await agent.aiHover("桌面上的9613.txt文件");
    // await agent.aiWaitFor("文件操作菜单已显示");
    await agent.aiTap("文件右上角的...按钮", { deepThink: true });
    // await agent.aiWaitFor("选项菜单已展开");
    await agent.aiAssert("存在'集合尺寸'按钮");
  }, { timeout: 900000, tags: ['1809613', 'level4', 'desktop_organization', 'interaction-scenario', 'DITT', 'lishuangshuang'] });

  afterEach(async ({system}) => {
    console.log('4. afterEach: 每个测试后的清理');
    console.log('删除桌面整理的配置文件');
    // 确保桌面整理功能已正确关闭
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);  
    console.log("配置文件清除成功")
  });
  afterAll(async ({ system, device, uos, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理桌面上的测试文件
    await system.exec('rm -rf ~/Desktop/9613.txt', 500);
    // 确保桌面整理功能已正确关闭
    console.log('开始清理配置文件，不显示桌面整理')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
    console.log('显示桌面整理入口')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);  
  });
});