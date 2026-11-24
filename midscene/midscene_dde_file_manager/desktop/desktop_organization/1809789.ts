/**
 * 用例 PMSID: 1809789
 * 用例标题: 【桌面自动整理】图标焦点优化-跨集合选中多个文件，拖拽
 * 生成时间：2026-07-25
 * 用例编写人：UT006487（王薇）
 */

describe('1809789-【桌面自动整理】图标焦点优化-跨集合选中多个文件，拖拽', () => {
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

    console.log('3. beforeEach: 删除桌面的所有文件夹和txt文件');
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    await system.exec('rm -rf ~/Music/* 2>/dev/null || true');
    await system.exec(`unlink "/home/${test_username}/Desktop/音乐 快捷方式"`);
    

    console.log('4. beforeEach: 创建测试文件夹和文件');
    await system.exec('mkdir -p ~/Desktop/1809789-1');
    await system.exec('mkdir -p ~/Desktop/1809789-2');
    await system.exec('mkdir -p ~/Desktop/1809789-3');
    await system.exec('touch ~/Desktop/1809789-4.txt');
    await system.exec('touch ~/Desktop/1809789-5.txt');
    await system.exec('touch ~/Desktop/1809789-6.txt');

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('5. beforeEach: 记录桌面所有软链接');

  });

  test('1809789-【桌面自动整理】图标焦点优化-跨集合选中多个文件，拖拽', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 跨集合选中多个文件后，拖拽到集合内部 =====');
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
    //选中两个文件拖拽到集合内部
    await device.keyDown('Ctrl');
    await agent.aiTap('桌面1809789-1文件夹的图标');
    await agent.aiTap('桌面1809789-4.txt文件的图标');
    await agent.aiWaitFor('桌面1809789-1文件夹是选中状态');
    await device.keyUp('Ctrl');
    const folder1PositionBefore = await agent.aiAction('1809789-1文件夹的大概位置');
    const file4PositionBefore = await agent.aiAction('1809789-4.txt文件的大概位置');
    //进行拖拽操作
    await device.keyDown('Ctrl');
    await agent.aiDrag('1809789-4', '最右上方的框框空白处');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.keyUp('Ctrl');
    await agent.aiTap('桌面左侧空白处');

    console.log('===== 预期1: 无法拖拽 =====');
    const folder1PositionAfter = await agent.aiAction('1809789-1文件夹的大概位置');
    const file4PositionAfter = await agent.aiAction('1809789-4.txt文件的大概位置');
    await agent.aiAssert(` ${folder1PositionBefore}约等于 ${folder1PositionAfter}`);
    await agent.aiAssert(` ${file4PositionBefore}约等于 ${file4PositionAfter}`);

    console.log('===== 步骤2: 跨集合选中多个文件后，拖拽到桌面空白处 =====');
    //选中两个文件拖拽到桌面空白处
    await device.keyDown('Ctrl');
    await agent.aiTap('桌面1809789-2文件夹的图标');
    await agent.aiTap('桌面1809789-5.txt文件的图标');
    await agent.aiWaitFor('桌面1809789-2文件夹是选中状态');
    await device.keyUp('Ctrl');
    //进行拖拽操作
    await device.keyDown('Ctrl');
    await agent.aiAction('将1809789-2文件夹拖拽到桌面左侧空白处');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.keyUp('Ctrl');
    await agent.aiTap('桌面左侧空白处');


    console.log('===== 预期2: 文件拖拽到桌面空白处 =====');
    await agent.aiAssert('1809789-2文件夹和1809789-5.txt文件已拖拽到左侧');

    console.log('===== 步骤3: 跨集合选中多个文件后，拖拽到文管本地目录 =====');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器窗口已打开');
    await agent.aiTap('侧边栏主目录选项');
    await agent.aiWaitFor('主目录页面已显示');
    await agent.aiRightClick('音乐目录');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiHover('发送到选项');
    await agent.aiWaitFor('发送到子菜单已显示');
    await agent.aiTap('发送到桌面选项');
    await device.pressKey('Alt+F4');
    //选中两个文件
    await device.keyDown('Ctrl');
    await agent.aiTap('桌面1809789-3文件夹的图标');
    await agent.aiTap('桌面1809789-6.txt文件的图标');
    await agent.aiWaitFor('桌面1809789-3文件夹是选中状态');
    await device.keyUp('Ctrl');
    //进行拖拽操作
    await device.keyDown('Ctrl');
    await agent.aiAction('将1809789-3文件夹拖拽到桌面音乐文件夹下');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.keyUp('Ctrl');
    await agent.aiTap('桌面空白处');

    console.log('===== 预期3: 拖拽到音乐目录成功 =====');
    await agent.aiDoubleClick('桌面音乐快捷方式');
    await agent.aiWaitFor('音乐文件夹已打开');
    await agent.aiAssert('1809789-3文件夹存在于音乐目录中');
    await agent.aiAssert('1809789-6.txt文件存在于音乐目录中');
    await device.pressKey('Alt+F4');

    console.log('✅ 测试用例执行完成');

  }, { timeout: 1200000, tags: ['1809789', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('6. afterEach: 每个测试后的清理');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('7. afterAll: 清理测试套件');
    //删除多余文件/文件夹
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    await system.exec('rm -rf ~/Music/* 2>/dev/null || true');

    console.log('8. afterAll: 删除测试期间新增的软链接');
    await system.exec(`unlink "/home/${test_username}/Desktop/音乐 快捷方式"`);
    await system.exec('killall dde-file-manager', 500);
  });
});