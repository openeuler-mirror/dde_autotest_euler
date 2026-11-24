/**
 * 用例 PMSID: 1809933
 * 用例标题: 【1071桌面整理】调节集合尺寸，集合内图标布局
 * 生成时间: 2026-08-18
 * 用例编写人: UT006487(王薇)
 */

describe('1809933-【1071桌面整理】调节集合尺寸，集合内图标布局', () => {
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

    console.log('4. beforeEach: 在桌面创建三个文件夹');
    for (let i = 1; i <= 3; i++) {
      await system.exec(`mkdir -p ~/Desktop/1809933-${i}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809933-【1071桌面整理】调节集合尺寸，集合内图标布局', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 启用桌面整理，整理桌面 =====');
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

    console.log('===== 预期1: 1809933开头的文件夹在右侧的文件夹集合框内 =====');
    await agent.aiAssert('1809933开头的文件夹在右侧的文件夹集合框内');

    console.log('===== 步骤2: 切换文件夹集合框为小尺寸 =====');
    console.log('2.1 鼠标悬浮在文件夹集合框上');
    await agent.aiHover('桌面右侧的文件夹集合框');
    await agent.aiWaitFor('文件夹集合框右上角出现图标');

    console.log('2.2 点击右上角图标');
    await agent.aiTap('文件夹集合框右上角的三点图标');

    console.log('2.3 点击集合尺寸');
    await agent.aiTap('集合尺寸选项');

    console.log('2.4 点击小尺寸');
    await agent.aiTap('小尺寸选项');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 预期2: 文件夹集合框的第一行只能显示两个文件夹，第三个文件夹显示在第二行 =====');
    await agent.aiAssert('文件夹集合框的第一行只能显示两个文件夹，第三个文件夹显示在集合框的第二行');

    console.log('===== 步骤3: 切换文件夹集合框为中尺寸 =====');
    console.log('3.1 鼠标悬浮在文件夹集合框上');
    await agent.aiHover('桌面右侧的文件夹集合框');
    await agent.aiWaitFor('文件夹集合框右上角出现图标');

    console.log('3.2 点击右上角图标');
    await agent.aiTap('文件夹集合框右上角的三点图标');

    console.log('3.3 点击集合尺寸');
    await agent.aiTap('集合尺寸选项');

    console.log('3.4 点击中尺寸');
    await agent.aiTap('中尺寸选项');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 预期3: 文件夹集合框的第一行显示三个文件夹，不存在换行现象 =====');
    await agent.aiAssert('文件夹集合框的第一行显示三个文件夹，不存在换行的现象');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809933', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    for (let i = 1; i <= 3; i++) {
      await system.exec(`rm -rf ~/Desktop/1809933-${i} 2>/dev/null || true`);
    }
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});