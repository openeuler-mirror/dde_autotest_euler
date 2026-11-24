/**
 * 用例 PMSID: 1809553
 * 用例标题: 【桌面自动整理】桌面整理模式，切换到非桌面整理模式-图标大小为极小
 * 生成时间: 2026-07-27
 * 用例编写人: UT006487（王薇）
 */

describe('1809553-【桌面自动整理】桌面整理模式，切换到非桌面整理模式-图标大小为极小', () => {
  let desktopOrganizationEnabled = false;
  let desktopOrganizationEnabled1 = false;
  let desktopOrganizationEnabled2 = false;
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
    //恢复图标大小为默认状态
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    await agent.aiTap('从左边数滑动条的1/4处');
    await agent.aiAssert('从左数滑动条的蓝色图标位于整个进度条的1/8外');
    await device.pressKey('Alt+F4');
    //删除桌面文件和文件夹
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    //创建测试文件
    await system.exec('touch ~/Desktop/1809553-1.txt');
  });

  test('1809553-【桌面自动整理】桌面整理模式，切换到非桌面整理模式-图标大小为极小', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 关闭桌面整理后，查看关闭前后图标大小是否一致 =====');
    //设置桌面图标大小为极小
    console.log('设置桌面图标大小为极小');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    await agent.aiTap('从左边数滑动条的1/16处');
    await agent.aiAssert('从左数滑动条的蓝色图标位于整个进度条的1/8内');
    await device.pressKey('Alt+F4');
    //开启桌面整理
    console.log('开启桌面整理');
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
    await agent.aiTap('右键菜单中的整理桌面');
    await agent.aiWaitFor('桌面右侧存在框框框住了图标');
    await agent.aiTap('桌面空白处');
    //关闭桌面整理
    console.log('关闭桌面整理');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    try {
      desktopOrganizationEnabled1 = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('桌面整理功能未启用（按钮为黑色），准备执行启用操作');
      desktopOrganizationEnabled1 = false;
    }
    if (desktopOrganizationEnabled1) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    }
    await device.pressKey('Alt+F4');    
    await agent.aiWaitFor('桌面图标都不在框内');

    console.log('===== 预期1: 关闭前后图标大小保持一致 =====');
    //查看预期，桌面图标仍然保持极小状态
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    await agent.aiAssert('从左数滑动条的蓝色图标位于整个进度条的1/8内');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809553', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    await system.exec('rm -rf ~/Desktop/1809553-1.txt 2>/dev/null || true');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    //恢复桌面整理为默认状态
    //await uos.showDesktop();
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    try {
      desktopOrganizationEnabled2 = await agent.aiQuery('启用桌面整理右侧按钮为蓝色点亮状态');
    } catch (error) {
      console.log('桌面整理功能未启用（按钮为黑色），准备执行启用操作');
      desktopOrganizationEnabled2 = false;
    }
    if (!desktopOrganizationEnabled2) {
      await agent.aiTap('启用桌面整理右侧的按钮');
    }
    await device.pressKey('Alt+F4');
    //恢复图标大小为默认状态
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    await agent.aiTap('从左边数滑动条的1/4处');
    await device.pressKey('Alt+F4');
    await system.exec('killall dde-file-manager', 500);
  });
});