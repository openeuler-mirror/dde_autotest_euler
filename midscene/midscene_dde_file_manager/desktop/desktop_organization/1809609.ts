/**
 * 用例 PMSID: 1809609
 * 用例标题: 【桌面自动整理】集合文件归类-软链接
 * 生成时间: 2026-07-26
 * 用例编写人: UT006487（王薇）
 */

describe('1809609-【桌面自动整理】集合文件归类-软链接', () => {
  const test_username = process.env.TEST_USERNAME;
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

    console.log('3. beforeEach: 删除桌面现有文件和文件夹');
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    await system.exec(`rm ~/Desktop/1809609-link*`);

    console.log('4. beforeEach: 在主目录创建文件夹1809609-1');
    await system.exec('mkdir -p ~/Desktop/1809609-1');

    console.log('5. beforeEach: 生成1级软链接');
    await system.exec('ln -s ~/Desktop/1809609-1 ~/Desktop/1809609-link1');

    console.log('6. beforeEach: 生成2级软链接');
    await system.exec('ln -s ~/Desktop/1809609-link1 ~/Desktop/1809609-link2');

    console.log('7. beforeEach: 生成3级软链接');
    await system.exec('ln -s ~/Desktop/1809609-link2 ~/Desktop/1809609-link3');

    console.log('8. beforeEach: 生成4级软链接');
    await system.exec('ln -s ~/Desktop/1809609-link3 ~/Desktop/1809609-link4');

    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809609-【桌面自动整理】集合文件归类-软链接', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 右键桌面-桌面设置-开启启动桌面整理，右键桌面点击桌面整理 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    const desktopOrganizationEnabled = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    if (!desktopOrganizationEnabled) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    }
    await device.pressKey('Alt+F4');

    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面整理');
    await agent.aiWaitFor('桌面右侧存在框框框住了图标');

    console.log('===== 预期1: 桌面1809609开头的文件夹都被一个框框框住 =====');
    await agent.aiAssert('桌面1809609开头的所有文件夹都被同一个框框住');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809609', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('9. afterEach: 每个测试后的清理');
    //删除桌面的所有文件和文件夹
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    await system.exec('killall dde-file-manager', 500);
    //删除新增的软链接
    await system.exec(`rm ~/Desktop/1809609-link*`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('10. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});