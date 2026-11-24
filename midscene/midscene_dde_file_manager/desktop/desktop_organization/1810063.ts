/**
 * 用例 PMSID: 1810063
 * 用例标题: 【桌面整理】视图选项-自动排列图标（已开启桌面整理）
 * 生成时间: 2026-07-29
 * 用例编写人: UT006487（王薇）
 */

describe('1810063-【桌面整理】视图选项-自动排列图标（已开启桌面整理）', () => {
  let desktopOrganizationEnabled = false;
  let autoArrangeEnabled = false;
  let autoArrangeEnabled3 = false;
  let autoArrangeEnabled4 = false;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager', 500);
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    //关闭await uos.showDesktop无法关闭的应用窗口
    await new Promise(resolve => setTimeout(resolve, 1000));
    const hasWindow = await agent.aiQuery('桌面上有应用窗口');
    if (hasWindow) {
      await agent.aiTap('应用窗口上方空白边缘');
      await device.pressKey('Alt+F4');
    }
    //删除桌面文件和文件夹
    console.log('3. beforeEach: 删除桌面的所有文件和文件夹');
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true')
    //创建测试文件夹1810063-1
    console.log('4. beforeEach: 创建测试文件夹1810063-1');
    await system.exec('mkdir -p ~/Desktop/1810063-1');
    await system.exec('touch ~/Desktop/1810063-2.sh');
  });

  test('1810063-【桌面整理】视图选项-自动排列图标（已开启桌面整理）', async ({ device, agent, uos, system }) => {
    //开启桌面整理
    console.log('打开启动桌面整理');
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
    //点击桌面整理  
    console.log('点击桌面整理');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面整理');
    await agent.aiWaitFor('桌面右侧存在框框框住了图标');
    await agent.aiTap('桌面空白处');
    //自动排列图标设置为默认关闭状态
    console.log('自动排列图标设置为默认关闭状态');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    try {
      autoArrangeEnabled = await agent.aiQuery('自动排列图标右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('自动排列图标未启用（按钮为黑色），准备执行启用操作');
      autoArrangeEnabled = false;
    }
    if (!autoArrangeEnabled) {
      await agent.aiTap('自动排列图标右侧的按钮');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap('自动排列图标右侧的按钮');
    } else {
      await agent.aiTap('自动排列图标右侧的按钮');
    }
    await device.pressKey('Alt+F4');

    console.log('===== 步骤1: 桌面空白处右键 =====');
    await agent.aiRightClick('桌面空白处');

    console.log('===== 预期1: 不显示自动排列图标 =====');
    await agent.aiAssert('右键菜单中不显示自动排列图标选项');

    console.log('===== 步骤2: 将桌面计算机图标拉动到桌面右侧任意空白处，桌面空白处右键-点击桌面设置-打开自动排列图标 =====');
    await agent.aiTap('桌面空白处');
    await agent.aiAction('将计算机图标拖拽到桌面右侧空白非框内');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    await agent.aiTap('自动排列图标右侧的按钮');
    await agent.aiWaitFor('自动排列图标右侧开关为蓝色点亮状态');
    await device.pressKey('Alt+F4');

    console.log('===== 预期2: 桌面左侧图标按顺序排列 =====');
    await agent.aiAssert('桌面左侧两个图标之间无空图标的现象');

    console.log('===== 步骤3: 桌面空白处右键-点击桌面设置-关闭自动排列图标，将桌面计算机图标拉动到桌面右侧任意空白处 =====');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    try {
      autoArrangeEnabled3 = await agent.aiQuery('自动排列图标右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('自动排列图标未启用（按钮为黑色），准备执行启用操作');
      autoArrangeEnabled3 = false;
    }
    if (autoArrangeEnabled3) {
      await agent.aiTap('自动排列图标右侧的按钮');
    }
    await device.pressKey('Alt+F4');

    await agent.aiAction('将计算机图标拖拽到桌面右侧空白非框内');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('===== 预期3: 可以拉动成功 =====');
    await agent.aiAssert('计算机图标已成功拉动到桌面右侧空白处');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1810063', 'level2', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('7. afterEach: 每个测试后的清理');
    await system.exec('rm -rf ~/Desktop/1810063-1 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/1810063-2.sh 2>/dev/null || true');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('8. afterAll: 清理测试套件');
    //自动排列图标设置为默认关闭状态
    console.log('自动排列图标设置为默认关闭状态');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    try {
      autoArrangeEnabled4 = await agent.aiQuery('自动排列图标右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('自动排列图标未启用（按钮为黑色），准备执行启用操作');
      autoArrangeEnabled4 = false;
    }
    if (!autoArrangeEnabled4) {
      await agent.aiTap('自动排列图标右侧的按钮');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap('自动排列图标右侧的按钮');
    } else {
      await agent.aiTap('自动排列图标右侧的按钮');
    }
    await device.pressKey('Alt+F4');
    await system.exec('killall dde-file-manager', 500);
  });
});