/**
 * 用例 PMSID: 1810033
 * 用例标题: 【1071桌面整理】集合尺寸设置，从大尺寸调节到小尺寸
 * 生成时间: 2026-08-03
 * 用例编写人: UT006487(王薇)
 */

describe('1810033-【1071桌面整理】集合尺寸设置，从大尺寸调节到小尺寸', () => {
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

    console.log('4. beforeEach: 创建测试文件');
    await system.exec('touch ~/Desktop/1810033-1.txt');
    await system.exec('touch ~/Desktop/1810033-2.txt');
    await system.exec('touch ~/Desktop/1810033-3.txt');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1810033-【1071桌面整理】集合尺寸设置，从大尺寸调节到小尺寸', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 右键桌面-桌面设置-启动桌面整理开关为打开状态，右键桌面，点击整理桌面 =====');
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

    console.log('1.2 点击整理桌面');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的桌面整理');

    console.log('===== 预期1: 右侧存在文件集合框 =====');
    await agent.aiAssert('桌面右侧存在文件集合框');

    console.log('===== 步骤2: 鼠标悬浮文件集合框上，出现图标，点击该图标，点击集合尺寸，点击中尺寸 =====');
    console.log('2.1 鼠标悬浮文件集合框上，等待图标出现');
    await agent.aiHover('桌面右侧的文件集合框');
    await agent.aiTap('文件集合框右上角的图标');
    await agent.aiWaitFor('出现集合尺寸选项');

    console.log('2.3 点击集合尺寸');
    await agent.aiTap('集合尺寸选项');
    await agent.aiWaitFor('出现中尺寸选项');

    console.log('2.4 点击中尺寸');
    await agent.aiTap('中尺寸选项');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 预期2: 调整完成，记录文件集合框四个角的位置 =====');
    const frameCornersMedium = await agent.aiQuery('文件集合框四个角的位置坐标，包括左上角、右上角、左下角、右下角');
//    console.log(`中尺寸时框四个角的位置坐标: ${frameCornersMedium}`);
    console.log('===== 坐标获取完成 =====');
    console.log('返回值类型:', typeof frameCornersMedium);
    console.log('是否为null:', frameCornersMedium === null);
    console.log('是否为undefined:', frameCornersMedium === undefined);
    console.log('完整返回值:', frameCornersMedium);

    console.log('===== 步骤3: 鼠标悬浮文件集合框上，点击图标，点击集合尺寸，点击小尺寸 =====');
    console.log('3.1 鼠标悬浮文件集合框上，等待图标出现');
    await agent.aiHover('桌面右侧的文件集合框');
    await agent.aiTap('文件集合框右上角的图标');
    await agent.aiWaitFor('出现集合尺寸选项');

    console.log('3.2 点击集合尺寸');
    await agent.aiTap('集合尺寸选项');

    console.log('3.3 点击小尺寸');
    await agent.aiTap('小尺寸选项');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 预期3: 记录文件集合框四个角的位置，且小尺寸是以中尺寸右上角为原点，向右上角缩小 =====');
    const frameCornersSmall = await agent.aiQuery('文件集合框四个角的位置坐标，包括左上角、右上角、左下角、右下角');
    console.log(`小尺寸时框四个角的位置坐标: ${frameCornersSmall}`);
    console.log('===== 坐标获取完成 =====');
    console.log('返回值类型:', typeof frameCornersSmall);
    console.log('是否为null:', frameCornersSmall === null);
    console.log('是否为undefined:', frameCornersSmall === undefined);
    console.log('完整返回值:', frameCornersSmall);

    await agent.aiAssert(` ${JSON.stringify(frameCornersMedium.右上角)} 与 ${JSON.stringify(frameCornersSmall.右上角)}差值小于5`);
    await agent.aiAssert(` ${JSON.stringify(frameCornersMedium.右下角)} 与 ${JSON.stringify(frameCornersSmall.右下角)}差值小于5`);
    await agent.aiAssert(` ${JSON.stringify(frameCornersMedium.左上角)} 与 ${JSON.stringify(frameCornersSmall.左上角)}的y坐标差值小于3`);
    await agent.aiAssert(` ${JSON.stringify(frameCornersSmall.左上角)} 的x坐标大于 ${JSON.stringify(frameCornersMedium.左上角)}的x坐标超过100`);
    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1810033', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
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
    await system.exec('rm -rf ~/Desktop/1810033-*.txt 2>/dev/null || true');
    await system.exec('killall dde-file-manager', 500);
  });
});