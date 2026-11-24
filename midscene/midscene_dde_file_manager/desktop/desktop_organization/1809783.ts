/**
 * 用例 PMSID: 1809783
 * 用例标题: 【桌面自动整理】图标焦点优化-跨集合选中多个文件，快捷键粘贴
 * 生成时间：2026-07-25
 * 用例编写人：UT006487（王薇）
 */

describe('1809783-【桌面自动整理】图标焦点优化-跨集合选中多个文件，快捷键粘贴', () => {
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

    console.log('3. beforeEach: 删除桌面的所有文件夹和txt文件');
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    

    console.log('4. beforeEach: 创建测试文件夹和文件');
    await system.exec('mkdir -p ~/Desktop/1809783-1');
    await system.exec('mkdir -p ~/Desktop/1809783-2');
    await system.exec('touch ~/Desktop/1809783-3.txt');
    await system.exec('touch ~/Desktop/1809783-4.txt');

    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809783-【桌面自动整理】图标焦点优化-跨集合选中多个文件，快捷键粘贴', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 跨集合选中多个文件后，快捷键Ctrl+v =====');
    //打开启动桌面整理
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    const desktopOrganizationEnabled = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    if (!desktopOrganizationEnabled) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    }
    await device.pressKey('Alt+F4');
    //点击桌面整理
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面整理');
    await agent.aiWaitFor('桌面右侧存在几个框框框住了图标');
    await agent.aiTap('桌面空白处');
    //进行复制操作
    await agent.aiTap('桌面1809783-1文件夹的图标');
    await device.pressKey('Ctrl+C');
    //选中两个文件
    await device.keyDown('Ctrl');
    await agent.aiTap('桌面1809783-1文件夹的图标');
    await agent.aiTap('桌面1809783-3.txt文件的图标');
    await agent.aiWaitFor('桌面1809783-1文件夹是选中状态');
    await device.keyUp('Ctrl');
    const desktopFilesBefore = await system.exec('ls ~/Desktop | wc -l');
    await device.pressKey('Ctrl+V');

    console.log('===== 预期1: 粘贴成功，取消之前选中的文件 =====');
    //文件取消选中
    await agent.aiAssert('1809783-1文件夹未被选中');
    await agent.aiAssert('1809783-3.txt文件未被选中');
    //文件粘贴成功
    const desktopFilesAfter = await system.exec('ls ~/Desktop | wc -l');
    const fileCountBefore = parseInt(desktopFilesBefore.stdout.trim());
    const fileCountAfter = parseInt(desktopFilesAfter.stdout.trim());
    await agent.aiAssert(` ${fileCountBefore}+1 = ${fileCountAfter}`);

    console.log('✅ 测试用例执行完成');

  }, { timeout: 1200000, tags: ['1809783', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    //删除多余文件/文件夹
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    await system.exec('killall dde-file-manager', 500);
  });
});