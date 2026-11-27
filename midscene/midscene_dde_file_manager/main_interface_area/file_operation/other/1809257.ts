/**
 * 用例 PMSID: 1809257
 * 用例标题: 文件名称分词优化-桌面图标大小为小，文件名称为英文，检查文件显示
 * 生成时间: 2026-07-25
 * 用例编写人: UT006487（王薇）
 */

describe('1809257-文件名称分词优化-桌面图标大小为小，文件名称为英文，检查文件显示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec('killall dde-file-manager', 500);
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const hasWindow = await agent.aiQuery('桌面上有应用窗口');
    if (hasWindow) {
      await agent.aiTap('应用窗口上方空白边缘');
      await device.pressKey('Alt+F4');
    }

    console.log('3. beforeEach: 设置桌面图标大小为最小');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    await agent.aiAction('滑动图标大小的滑动条到左数第一个位置（每个|算一个位置）');
    await device.pressKey('Alt+F4');

    console.log('4. beforeEach: 创建测试文件夹');
    await system.exec('rm -rf ~/Desktop/hhhhhhhhhhhhhh', 500);
    await system.exec('rm -rf ~/Desktop/1809257-1', 500);
    await system.exec('mkdir -p ~/Desktop/1809257-1');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809257-文件名称分词优化-桌面图标大小为小，文件名称为英文，检查文件显示', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 命名为纯英文名称 =====');
    await agent.aiTap('桌面1809257-1文件夹');
    await agent.aiRightClick('桌面1809257-1文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('重命名');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Backspace');
    await device.typeText('hhhhhhhhhhhhhh');
    await device.pressKey('Enter');
    await agent.aiTap('桌面空白处');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 预期1: 文件夹名称显示符合分词优化规则 =====');
    await agent.aiAssert('hh开头的文件夹名第一行显示hhhhh，第二行以...开头，以hhh结尾');

    console.log('===== 步骤2: 点击文件 =====');
    await agent.aiTap('hh开头的文件夹');

    console.log('===== 步骤3: 显示全部文件名称 =====');
    await agent.aiAssert('文件夹名称第一行显示5个h，第二行显示5个h，第三行显示4个h');
    await agent.aiTap('桌面空白处');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1809257', 'level2', 'file_operation', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    await system.exec('rm -rf ~/Desktop/hhhhhhhhhhhhhh', 500);
    await system.exec('rm -rf ~/Desktop/1809257-1', 500);
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    console.log('7. beforeEach: 恢复图标大小为默认');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('桌面设置');
    await agent.aiWaitFor('桌面设置窗口已打开');
    await agent.aiAction('滑动图标大小的滑动条到左数第二个位置（每个|算一个位置）');
    await device.pressKey('Alt+F4');
    await system.exec('killall dde-file-manager', 500);
  });
});