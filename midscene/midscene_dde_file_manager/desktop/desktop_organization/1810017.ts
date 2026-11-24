/**
 * 用例 PMSID: 1810017
 * 用例标题: 【1071桌面整理】集合尺寸调节，集合间最小边距
 * 生成时间: 2026-08-18
 * 用例编写人: UT006487(王薇)
 */

describe('1810017-【1071桌面整理】集合尺寸调节，集合间最小边距', () => {
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

    console.log('4. beforeEach: 创建10个文件夹和10个txt文件');
    for (let i = 1; i <= 10; i++) {
      await system.exec(`mkdir -p ~/Desktop/1810017-${i}`);
      await system.exec(`touch ~/Desktop/1810017-${i}.txt`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1810017-【1071桌面整理】集合尺寸调节，集合间最小边距', async ({ device, agent, uos, system }) => {
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
    await agent.aiTap('应用窗口上方空白边缘');
    await device.pressKey('Alt+F4');

    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('右键菜单中的整理桌面');

    console.log('===== 预期1: 桌面右侧的文件集合框大于等于2个 =====');
    await agent.aiAssert('桌面右侧的文件集合框数量大于等于2个');

    console.log('===== 预期2: 计算两个集合框相邻边的间距 =====');
    console.log('2.1 获取txt文件集合框透明框下方的y坐标');
    const txtFrameBottomY = await agent.aiQuery('桌面右侧txt文件集合框透明框底部的y像素坐标值，只返回数字');
    const y1 = parseInt(txtFrameBottomY.toString().replace(/[^0-9]/g, ''));
    console.log(`txt集合框底部y坐标(y1): ${y1}px`);

    console.log('2.2 获取文件夹集合框透明框上方的y坐标');
    const folderFrameTopY = await agent.aiQuery('桌面右侧包含文件夹的透明框顶部的y像素坐标值，只返回数字');
    const y2 = parseInt(folderFrameTopY.toString().replace(/[^0-9]/g, ''));
    console.log(`文件夹集合框顶部y坐标(y2): ${y2}px`);

    console.log('2.3 计算两个y坐标差值的绝对值');
    const distance = Math.abs(y2 - y1);
    console.log(`两个集合框相邻边的间距: ${distance}px`);

    console.log('2.4 判断间距是否小于15px');
    if (distance < 15) {
      console.log(`间距${distance}px < 15px，验证通过`);
    } else {
      throw new Error(`间距${distance}px >= 15px，验证失败`);
    }

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1810017', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    for (let i = 1; i <= 10; i++) {
      await system.exec(`rm -rf ~/Desktop/1810017-${i} 2>/dev/null || true`);
      await system.exec(`rm -rf ~/Desktop/1810017-${i}.txt 2>/dev/null || true`);
    }
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});