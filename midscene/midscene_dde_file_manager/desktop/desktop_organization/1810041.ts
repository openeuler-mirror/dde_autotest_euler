/**
 * 用例 PMSID: 1810041
 * 用例标题: 【1071桌面整理】集合悬浮在上一层
 * 生成时间: 2026-07-26
 * 用例编写人: UT006487（王薇）
 */

describe('1810041-【1071桌面整理】集合悬浮在上一层', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager', 500);
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //关闭await uos.showDesktop无法关掉的窗口
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

    console.log('4. beforeEach: 在桌面创建多个.sh文件');
    for (let i = 1; i <= 90; i++) {
      await system.exec(`touch ~/Desktop/1810041-${i}.sh`);
    }

    console.log('5. beforeEach: 在桌面创建文件夹1810041-1');
    await system.exec('mkdir -p ~/Desktop/1810041-1');

  });

  test('1810041-【1071桌面整理】集合悬浮在上一层', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 查看文件夹所属的框的图层 =====');
    console.log('打开启动桌面整理');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    const desktopOrganizationEnabled = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    if (!desktopOrganizationEnabled) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    }
    await device.pressKey('Alt+F4');

    console.log('点击桌面整理');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面整理');
    await agent.aiWaitFor('桌面右侧存在框框框住了图标');
    await agent.aiTap('桌面空白处');

    console.log('===== 预期1: 文件夹所属的框在.sh图标的上层 =====');
    await agent.aiAssert('文件夹1810041-1所属的框的图层在.sh文件图标的上层');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1810041', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('8. afterEach: 每个测试后的清理');
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.sh 2>/dev/null || true');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('9. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});