/**
 * 用例 PMSID: 1810035
 * 用例标题: 【1071桌面整理】集合尺寸设置，从小尺寸调节到大尺寸
 * 生成时间: 2026-08-11
 * 用例编写人: UT006487(王薇)
 */

describe('1810035-【1071桌面整理】集合尺寸设置，从小尺寸调节到大尺寸', () => {
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
    //删除桌面文件和文件夹
    console.log('3. beforeEach: 删除桌面的所有文件和文件夹');
    await system.exec('find ~/Desktop -maxdepth 1 -type d ! -name "Desktop" ! -name "." ! -name ".." -exec rm -rf \\{\\} \\; 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.txt 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.docx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.xlsx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pptx 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.ts 2>/dev/null || true');
    await system.exec('rm -rf ~/Desktop/*.pdf 2>/dev/null || true')

    console.log('4. beforeEach: 创建30个测试txt文件');
    for (let i = 1; i <= 30; i++) {
      await system.exec(`touch ~/Desktop/1810035-${i}.txt`);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1810035-【1071桌面整理】集合尺寸设置，从小尺寸调节到大尺寸', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 桌面右键-桌面设置-启用桌面整理，且桌面右键点击整理桌面 =====');
    console.log('1.1 打开桌面整理开关');
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

    console.log('1.2 点击桌面整理');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的整理桌面');

    console.log('===== 预期1: 桌面右侧存在文件集合框 =====');
    await agent.aiAssert('桌面右侧存在文件集合框');

    console.log('===== 步骤2: 点击图标，点击集合尺寸，点击小尺寸 =====');
    await agent.aiHover('桌面右侧的文件集合框');
    await agent.aiTap('文件集合框右上角的图标');
    await agent.aiHover('集合尺寸选项');
    await agent.aiTap('小尺寸选项');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 预期2: 文件集合框已变为小尺寸，获取四个角的位置坐标 =====');
    const frameSmall = await agent.aiQuery('文件集合框四个角的位置坐标，包括左上角、右上角、左下角、右下角');
    console.log(`小尺寸框坐标: ${frameSmall}`);

    console.log('===== 步骤3: 点击图标，点击集合尺寸，点击中尺寸 =====');
    await agent.aiHover('桌面右侧的文件集合框');
    await agent.aiTap('文件集合框右上角的图标');
    await agent.aiHover('集合尺寸选项');
    await agent.aiTap('中尺寸选项');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('===== 预期3: 文件集合框已变为中尺寸，获取四个角的位置坐标 =====');
    const frameMedium = await agent.aiQuery('文件集合框四个角的位置坐标，包括左上角、右上角、左下角、右下角');
    console.log(`中尺寸框坐标: ${frameMedium}`);

    console.log('===== 预期3: 对比中尺寸和小尺寸的坐标 =====');
    await agent.aiAssert(` ${JSON.stringify(frameMedium.右上角)} 与 ${JSON.stringify(frameSmall.右上角)}的曼哈顿距离小于5`);
    await agent.aiAssert(` ${JSON.stringify(frameMedium.右下角)} 与 ${JSON.stringify(frameSmall.右下角)}的曼哈顿距离小于5`);
    await agent.aiAssert(` ${JSON.stringify(frameMedium.左上角)} 与 ${JSON.stringify(frameSmall.左上角)}的y坐标差值小于5`);
    await agent.aiAssert(` ${JSON.stringify(frameMedium.左上角)} 的x坐标小于 ${JSON.stringify(frameSmall.左上角)}的x坐标超过100`);

    console.log('===== 步骤4: 点击图标，点击集合尺寸，点击大尺寸 =====');
    await agent.aiHover('桌面右侧的文件集合框');
    await agent.aiTap('文件集合框右上角的图标');
    await agent.aiHover('集合尺寸选项');
    await agent.aiTap('大尺寸选项');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('===== 预期4: 文件集合框已变为大尺寸，获取四个角的位置坐标 =====');
    const frameLarge = await agent.aiQuery('文件集合框四个角的位置坐标，包括左上角、右上角、左下角、右下角');
    console.log(`大尺寸框坐标: ${frameLarge}`);

    console.log('===== 预期4: 对比大尺寸和中尺寸的坐标 =====');
    await agent.aiAssert(` ${JSON.stringify(frameLarge.右上角)} 与 ${JSON.stringify(frameMedium.右上角)}的曼哈顿距离小于5`);
    await agent.aiAssert(` ${JSON.stringify(frameLarge.左上角)} 与 ${JSON.stringify(frameMedium.左上角)}的曼哈顿距离小于5`);
    await agent.aiAssert(` ${JSON.stringify(frameLarge.左下角)} 与 ${JSON.stringify(frameMedium.左下角)}的x坐标差值小于5`);
    await agent.aiAssert(` ${JSON.stringify(frameLarge.左下角)} 的y坐标大于 ${JSON.stringify(frameMedium.左下角)}的y坐标超过100`);

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1810035', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
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
    await system.exec('rm -rf ~/Desktop/1810035-*.txt 2>/dev/null || true');
    await system.exec('killall dde-file-manager', 500);
  });
});