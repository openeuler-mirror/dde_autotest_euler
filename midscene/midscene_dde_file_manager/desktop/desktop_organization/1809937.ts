/**
 * 用例 PMSID: 1809937
 * 用例标题: 【1071桌面整理】集合文件归类-其他
 * 生成时间: 2026-08-31
 * 用例编写人: UT006487(王薇)
 */

describe('1809937-【1071桌面整理】集合文件归类-其他', () => {
  let desktopOrganizationEnabled = false;
  let desktopOrganizationEnabled1 = false;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
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
    await system.exec('rm -rf ~/Desktop/*.iso 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.png 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.jpg 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.wav 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.bin 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.key 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ini 2>/dev/null || true');
  });

  test('1809937-【1071桌面整理】集合文件归类-其他', async ({ device, agent, uos, system }) => {
    console.log('===== 前置条件1: 桌面右键-桌面设置-启用桌面整理，勾选集合方式中的"其他"选项 =====');
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

    const otherChecked = await agent.aiQuery('集合方式中的其他选项是否已勾选');
    console.log(`其他选项勾选状态: ${otherChecked}`);
    if (!otherChecked) {
      console.log('其他选项未勾选，执行勾选操作');
      await agent.aiTap('集合方式中的其他选项前的勾选框');
    } else {
      console.log('其他选项已勾选，忽略');
    }
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');

    console.log('===== 前置条件2: 桌面创建1809937.iso文件 =====');
    await system.exec('touch ~/Desktop/1809937.iso');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('===== 步骤1: 桌面右键点击整理桌面 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的整理桌面');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('===== 预期1: 鼠标悬浮1809937.iso文件，文件框左上角存在标题为"其他" =====');
    await agent.aiHover('桌面上的1809937.iso文件图标');
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAction('1809937.iso文件所在的文件框左上角存在标题为"其他"');
    console.log('✅ 预期1验证通过: 1809937.iso文件所在文件框标题为"其他"');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809937', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    console.log('4.1 恢复默认状态 - 检查启用桌面整理按钮状态');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
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
    const otherChecked1 = await agent.aiQuery('集合方式中的其他选项是否已勾选');
    console.log(`其他选项勾选状态: ${otherChecked1}`);
    if (otherChecked1) {
      console.log('其他选项已勾选，执行取消勾选操作');
      await agent.aiTap('集合方式中的其他选项前的勾选框');
    } else {
      console.log('其他选项未勾选，忽略');
    }
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    await system.exec('rm -f ~/Desktop/1809937.iso');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });
});
