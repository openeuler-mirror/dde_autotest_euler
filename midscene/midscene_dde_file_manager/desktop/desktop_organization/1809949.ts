/**
 * 用例 PMSID: 1809949
 * 用例标题: 【1071桌面整理】集合文件归类-应用程序
 * 生成时间: 2026-08-18
 * 用例编写人: UT006487(王薇)
 */

describe('1809949-【1071桌面整理】集合文件归类-应用程序', () => {
  let desktopOrganizationEnabled = false;
  let desktopOrganizationEnabled1 = false;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager', 500);
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const hasWindow = await agent.aiQuery('桌面上有应用窗口');
    if (hasWindow) {
      await agent.aiTap('应用窗口上方空白边缘');
      await device.pressKey('Alt+F4');
    }

    console.log('3. beforeEach: 删除桌面的所有文件和文件夹');
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pdf 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.jpg 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.jpeg 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.png 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.gif 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.mp4 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.mov 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.mp3 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.wav 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.avi 2>/dev/null || true');
  });

  test('1809949-【1071桌面整理】集合文件归类-应用程序', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 桌面右键-桌面设置-启用桌面整理，勾选应用程序，点击整理桌面 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');

    try {
      desktopOrganizationEnabled = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('桌面整理功能未启用（按钮为黑色），准备执行启用操作');
      desktopOrganizationEnabled = false;
    }
    if (!desktopOrganizationEnabled) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    }

    const appChecked = await agent.aiQuery('应用程序选项是否已勾选');
    console.log(`应用程序勾选状态: ${appChecked}`);
    if (!appChecked) {
      console.log('应用程序未勾选，执行勾选操作');
      await agent.aiTap('应用程序选项前的勾选框');
    } else {
      console.log('应用程序已勾选，忽略');
    }
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');

    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的整理桌面');

    console.log('===== 预期1: 桌面上的回收站在桌面右侧的集合框内 =====');
    await agent.aiAssert('桌面上的回收站在桌面右侧的集合框内');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809949', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    console.log('5.1 恢复默认状态 - 检查启用桌面整理按钮状态');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    //恢复默认状态 - 检查启用桌面整理按钮状态
    try {
      desktopOrganizationEnabled1 = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('桌面整理功能未启用（按钮为黑色），准备执行启用操作');
      desktopOrganizationEnabled1 = false;
    }
    if (!desktopOrganizationEnabled1) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    } else {
      await agent.aiTap('启用桌面整理右侧的按钮');
      await new Promise(resolve => setTimeout(resolve, 300));
      await agent.aiTap('启用桌面整理右侧的按钮');
    }
    //恢复默认状态 - 检查应用程序勾选状态
    const appChecked1 = await agent.aiQuery('应用程序选项是否已勾选');
    console.log(`应用程序勾选状态: ${appChecked1}`);
    if (appChecked1) {
      console.log('应用程序已勾选，执行取消勾选操作');
      await agent.aiTap('应用程序选项前的勾选框');
    } else {
      console.log('应用程序未勾选，忽略');
    }
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});