/**
 * 用例 PMSID: 1809975
 * 用例标题: 【桌面整理】单次整理，不记忆布局，开启/关闭桌面整理
 * 生成时间: 2026-08-12
 * 用例编写人: UT006487(王薇)
 */

describe('1809975-【桌面整理】单次整理，不记忆布局，开启/关闭桌面整理', () => {
  let desktopOrganizationEnabled = false;
  let isEnabled = false;
  let isEnabled2 = false;
  let isEnabled3 = false;
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
    await system.exec('rm -rf ~/Desktop/*.pdf 2>/dev/null || true')

    console.log('4. beforeEach: 创建2个测试文件夹');
    await system.exec('mkdir -p ~/Desktop/1809975-1');
    await system.exec('mkdir -p ~/Desktop/1809975-2');

    console.log('5. beforeEach: 将文件夹拖拽到桌面右侧任意空白处');
    await agent.aiAction('将1809975-1文件夹拖拽到桌面右侧任意空白处');
    await agent.aiAction('将1809975-2文件夹拖拽到桌面右侧任意空白处');

    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809975-【桌面整理】单次整理，不记忆布局，开启/关闭桌面整理', async ({ device, agent, uos, system }) => {
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
    await device.pressKey('Alt+F4');

    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的整理桌面');

    console.log('===== 预期1: 桌面右侧存在文件集合框 =====');
    await agent.aiAssert('桌面右侧存在文件集合框');

    console.log('===== 步骤2: 桌面右键-桌面设置-启用桌面整理右侧开关点击关闭 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    try {
      isEnabled = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('桌面整理功能未启用（按钮为黑色），准备执行启用操作');
      isEnabled = false;
    }
    if (isEnabled) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    }
    await device.pressKey('Alt+F4');

    console.log('===== 预期2: 新建的文件夹1809975-1和1809975-2在左侧排列，且左侧文件图标之间无空图标 =====');
    await agent.aiAssert('文件夹1809975-1和1809975-2在桌面左半侧，且左半侧文件图标之间无空图标');

    console.log('===== 步骤3: 桌面右键-桌面设置-启用桌面整理，且桌面右键点击整理桌面 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    try {
      isEnabled2 = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('桌面整理功能未启用（按钮为黑色），准备执行启用操作');
      isEnabled2 = false;
    }
    if (!isEnabled2) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    }
    await device.pressKey('Alt+F4');

    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面整理');

    console.log('===== 预期3: 文件夹1809975-1和1809975-2存在在右侧文件集合框中 =====');
    await agent.aiAssert('文件夹1809975-1和1809975-2存在在右侧文件集合框中');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809975', 'level2', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('6. afterEach: 每个测试后的清理');
    await system.exec('killall dde-file-manager', 500);
    await system.exec('rm -rf ~/Desktop/1809975-1 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/1809975-2 2>/dev/null || true');
    console.log('7. afterEach: 恢复桌面整理功能');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    try {
      isEnabled3 = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('桌面整理功能未启用（按钮为黑色），准备执行启用操作');
      isEnabled3 = false;
    }
    if (!isEnabled3) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    }
    await device.pressKey('Alt+F4');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('8. afterAll: 清理测试套件');
  });
});