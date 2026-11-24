/**
 * 用例 PMSID: 1809569
 * 用例标题: 【文件管理】【桌面自动整理】超出集合图标
 * 生成时间: 2026-08-12
 * 用例编写人: UT006487(王薇)
 */

describe('1809569-【文件管理】【桌面自动整理】超出集合图标', () => {
  let desktopOrganizationEnabled = false;
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
    await system.exec('rm -rf ~/Desktop/*.pdf 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*快捷方式 2>/dev/null || true');

    console.log('4. beforeEach: 创建80个测试文件夹');
    for (let i = 1; i <= 80; i++) {
      await system.exec(`mkdir -p ~/Desktop/${i}`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809569-【文件管理】【桌面自动整理】超出集合图标', async ({ device, agent, uos, system }) => {
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

    console.log('===== 步骤2: 鼠标悬浮集合框，点击右上角图标，点击集合尺寸，选择大尺寸，滑动滚轮 =====');
    await agent.aiHover('桌面右侧的文件集合框');
    await agent.aiWaitFor('框右上角出现一个图标');
    await agent.aiTap('文件集合框右上角的图标');
    await agent.aiTap('集合尺寸选项');
    await agent.aiTap('大尺寸选项');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('2.1 鼠标悬浮在文件集合框上');
    await agent.aiHover('桌面右侧的文件集合框');

    console.log('2.2 记录滚动前文件集合框中的首个文件名称');
    const fileNamesBefore = await agent.aiQuery('文件集合框中左上角第一个文件的名称');
    console.log(`滚动前首个文件名称: ${fileNamesBefore}`);

    console.log('2.3 滑动鼠标滚轮');
    await agent.aiScroll('右侧文件集合框', { direction: 'up' , distance: 60 });

    console.log('2.4 记录滚动后文件集合框中的首个文件名称');
    const fileNamesAfter = await agent.aiQuery('文件集合框中左上角第一个文件的名称');
    console.log(`滚动后首个文件名称: ${fileNamesAfter}`);

    console.log('2.5 判断滚动前后首个文件名称是否一致');
    if (fileNamesBefore === fileNamesAfter) {
      throw new Error(`滚动前后首个文件名称一致（${fileNamesBefore}），滚轮翻页功能异常`);
    }
    console.log(`滚动前后首个文件名称不一致（前: ${fileNamesBefore}, 后: ${fileNamesAfter}），滚轮翻页功能正常`);

    console.log('===== 预期2: 鼠标滑动滚轮可以翻页预览 =====');

    console.log('===== 步骤3: 点击文件集合框右上角图标，点击集合尺寸，选择小尺寸，滑动滚轮 =====');
    await agent.aiHover('桌面右侧的文件集合框');
    await agent.aiWaitFor('框右上角出现一个图标');
    await agent.aiTap('文件集合框右上角的图标');
    await agent.aiTap('集合尺寸选项');
    await agent.aiTap('小尺寸选项');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('3.1 鼠标悬浮在文件集合框上');
    await agent.aiHover('桌面右侧的文件集合框');

    console.log('3.2 记录滚动前文件集合框左上角第一个文件的名称');
    const fileNamesBefore3 = await agent.aiQuery('文件集合框中左上角第一个文件的名称');
    console.log(`滚动前首个文件名称: ${fileNamesBefore3}`);

    console.log('3.3 滑动鼠标滚轮');
    await agent.aiScroll('右侧文件集合框', { direction: 'down', distance: 60 });

    console.log('3.5 记录滚动后文件集合框左上角第一个文件的名称');
    const fileNamesAfter3 = await agent.aiQuery('文件集合框中左上角第一个文件的名称');
    console.log(`滚动后首个文件名称: ${fileNamesAfter3}`);

    console.log('3.6 判断滚动前后首个文件名称是否一致');
    if (fileNamesBefore3 === fileNamesAfter3) {
      throw new Error(`滚动前后首个文件名称一致（${fileNamesBefore3}），滚轮翻页功能异常`);
    }
    console.log(`滚动前后首个文件名称不一致（前: ${fileNamesBefore3}, 后: ${fileNamesAfter3}），滚轮翻页功能正常`);
    console.log('===== 预期3: 鼠标滑动滚轮可以翻页预览 =====');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809569', 'level2', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    //恢复默认集合尺寸
    console.log('6. afterAll: 鼠标悬浮文件集合框上，等待图标出现');
    await agent.aiHover('桌面右侧的文件集合框');
    await agent.aiTap('文件集合框右上角的图标');
    await agent.aiWaitFor('出现集合尺寸选项');

    console.log('7. afterAll:点击集合尺寸');
    await agent.aiTap('集合尺寸选项');
    await agent.aiWaitFor('出现中尺寸选项');

    console.log('8. afterAll:点击中尺寸');
    await agent.aiTap('中尺寸选项');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    //清理文件夹
    for (let i = 1; i <= 80; i++) {
      await system.exec(`rm -rf ~/Desktop/${i} 2>/dev/null || true`);
    }
  });
});