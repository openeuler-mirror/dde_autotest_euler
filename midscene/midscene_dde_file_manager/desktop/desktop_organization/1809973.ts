/**
 * 用例 PMSID: 1809973
 * 用例标题: 【1071桌面整理】自动整理，记忆布局，开启/关闭桌面整理
 * 生成时间: 2026-08-18
 * 用例编写人: UT006487(王薇)
 */

describe('1809973-【1071桌面整理】自动整理，记忆布局，开启/关闭桌面整理', () => {
  let desktopOrganizationEnabled1 = false;
  let desktopOrganizationEnabled = false;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager', 500);
  });

  beforeEach(async ({ device, agent, uos, system }) => {

    console.log('2. beforeEach: 删除桌面的所有文件和文件夹');
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pdf 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.mp4 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.avi 2>/dev/null || true');

    console.log('3. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const hasWindow = await agent.aiQuery('桌面上有应用窗口');
    if (hasWindow) {
      await agent.aiTap('应用窗口上方空白边缘');
      await device.pressKey('Alt+F4');
    }

    console.log('4. beforeEach: 创建2个文件夹和2个txt文件');
    for (let i = 1; i <= 2; i++) {
      await system.exec(`mkdir -p ~/Desktop/1809973-${i}`);
      await system.exec(`touch ~/Desktop/1809973-${i}.txt`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809973-【1071桌面整理】自动整理，记忆布局，开启/关闭桌面整理', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 桌面右键-桌面设置-启用桌面整理，且桌面右键点击整理桌面 =====');
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
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');

    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的整理桌面');

    console.log('===== 预期1: 文件被整理到桌面右侧 =====');
    await agent.aiAssert('1809973开头的文件和文件夹都在桌面右侧');

    console.log('===== 步骤2: 桌面右键-桌面设置-关闭启用桌面整理选项 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    await agent.aiTap('启用桌面整理右侧的按钮');
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');

    console.log('===== 预期2: 文件被恢复到桌面左侧 =====');
    await agent.aiAssert('1809973开头的文件和文件夹都在桌面左侧');

    console.log('===== 步骤3: 桌面右键-桌面设置-启用桌面整理，且桌面右键点击整理桌面 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    await agent.aiTap('启用桌面整理右侧的按钮');
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');

    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的整理桌面');

    console.log('===== 预期3: 文件被整理到桌面右侧 =====');
    await agent.aiAssert('1809973开头的文件和文件夹都在桌面右侧');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809973', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    //恢复桌面整理功能
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
    }
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');
    //删除创建的文件夹和txt文件
    for (let i = 1; i <= 2; i++) {
      await system.exec(`rm -rf ~/Desktop/1809973-${i} 2>/dev/null || true`);
      await system.exec(`rm -rf ~/Desktop/1809973-${i}.txt 2>/dev/null || true`);
    }
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});