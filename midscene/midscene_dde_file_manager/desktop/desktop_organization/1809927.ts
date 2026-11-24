/**
 * 用例 PMSID: 1809927
 * 用例标题: 【1071桌面整理】单次整理，粘贴到桌面文件
 * 生成时间: 2026-08-18
 * 用例编写人: UT006487(王薇)
 */

describe('1809927-【1071桌面整理】单次整理，粘贴到桌面文件', () => {
  let desktopOrganizationEnabled = false;

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

    console.log('4. beforeEach: 在~/Picture路径下创建三个文件夹');
    for (let i = 1; i <= 3; i++) {
      await system.exec(`mkdir -p ~/Pictures/1809927-${i}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809927-【1071桌面整理】单次整理，粘贴到桌面文件', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 复制1809927-1文件夹到桌面 =====');
    console.log('1.1 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器窗口已打开');

    console.log('1.2 左侧边栏点击图片');
    await agent.aiTap('侧边栏图片选项');
    await agent.aiWaitFor('图片目录已显示');

    console.log('1.3 右键1809927-1文件夹，点击复制');
    await agent.aiRightClick('1809927-1文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的复制');

    console.log('1.4 关闭文件管理器');
    await device.pressKey('Alt+F4');

    console.log('1.5 右键桌面空白处，点击粘贴');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的粘贴');
    await agent.aiTap('桌面空白处');

    console.log('===== 预期1: 1809927-1文件夹没有被文件集合框框住 =====');
    await agent.aiAssert('1809927-1文件夹不在文件夹集合框内');

    console.log('===== 步骤2: 启用桌面整理，整理桌面 =====');
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
    await agent.aiTap('桌面空白处');

    console.log('===== 预期2: 1809927-1文件夹在桌面右侧的文件夹集合框内 =====');
    await agent.aiAssert('1809927-1文件夹在桌面右侧的文件夹集合框内');

    console.log('===== 步骤3: 剪切1809927-2文件夹到桌面 =====');
    console.log('3.1 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器窗口已打开');

    console.log('3.2 左侧边栏点击图片');
    await agent.aiTap('侧边栏图片选项');
    await agent.aiWaitFor('图片目录已显示');

    console.log('3.3 右键1809927-2文件夹，点击剪切');
    await agent.aiRightClick('1809927-2文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的剪切');

    console.log('3.4 关闭文件管理器');
    await device.pressKey('Alt+F4');

    console.log('3.5 右键桌面空白处，点击粘贴');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的粘贴');
    await agent.aiTap('桌面空白处');

    console.log('===== 预期3: 1809927-2文件夹没有被文件集合框框住 =====');
    await agent.aiAssert('1809927-2文件夹不在文件夹集合框内');

    console.log('===== 步骤4: 桌面右键点击整理桌面 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的整理桌面');
    await agent.aiTap('桌面空白处');

    console.log('===== 预期4: 1809927-2文件夹在桌面右侧的文件夹集合框内 =====');
    await agent.aiAssert('1809927-2文件夹在桌面右侧的文件夹集合框内');

    console.log('===== 步骤5: 拖拽1809927-3文件夹到桌面 =====');
    console.log('5.1 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器窗口已打开');
    await agent.aiTap('文件管理器右上角最大化按钮');
    await agent.aiWaitFor('文件管理器窗口不为最大化状态');

    console.log('5.2 左侧边栏点击图片');
    await agent.aiTap('侧边栏图片选项');
    await agent.aiWaitFor('图片目录已显示');

    console.log('5.3 拖拽1809927-3文件夹到桌面空白处');
    await agent.aiAction('将1809927-3文件夹从文件管理器拖拽到桌面空白处');

    console.log('5.4 关闭文件管理器');
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');
    await agent.aiTap('桌面空白处');

    console.log('===== 预期5: 1809927-3文件夹没有被文件集合框框住 =====');
    await agent.aiAssert('1809927-3文件夹不在文件夹集合框内');

    console.log('===== 步骤6: 桌面右键点击整理桌面 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的整理桌面');
    await agent.aiTap('桌面空白处');
    
    console.log('===== 预期6: 1809927-3文件夹在桌面右侧的文件夹集合框内 =====');
    await agent.aiAssert('1809927-3文件夹在桌面右侧的文件夹集合框内');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809927', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    for (let i = 1; i <= 3; i++) {
      await system.exec(`rm -rf ~/Desktop/1809927-${i} 2>/dev/null || true`);
      await system.exec(`rm -rf ~/Pictures/1809927-${i} 2>/dev/null || true`);
    }
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});