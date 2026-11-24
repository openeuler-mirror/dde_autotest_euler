/**
 * 用例 PMSID: 1810015
 * 用例标题: 【1071桌面整理】集合尺寸调节，集合间不能重叠
 * 生成时间: 2026-08-13
 * 用例编写人: UT006487(王薇)
 */

describe('1810015-【1071桌面整理】集合尺寸调节，集合间不能重叠', () => {
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
      await system.exec(`mkdir -p ~/Desktop/1810015-${i}`);
      await system.exec(`touch ~/Desktop/1810015-${i}.txt`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1810015-【1071桌面整理】集合尺寸调节，集合间不能重叠', async ({ device, agent, uos, system }) => {
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
    await agent.aiTap('右键菜单中的桌面整理');

    console.log('===== 预期1: 桌面右侧的文件集合框大于等于2个 =====');
    await agent.aiAssert('桌面右侧的文件集合框数量大于等于2个');

    console.log('===== 步骤2: 鼠标悬浮txt文档集合框，拖动文档标题向上移动 =====');
    console.log('2.1 鼠标悬浮在txt文档集合框上');
    await agent.aiHover('桌面右侧的txt文档集合框');
    await agent.aiWaitFor('文档集合框左上角出现"文档"三个字');

    console.log('2.2 鼠标移动到"文档"两个字上面');
    await agent.aiHover('文档集合框左上角的"文档"文字');

    console.log('2.3 按住鼠标垂直向上拖动一段距离后松开');
   // await device.keyDown('Shift');
    await agent.aiAction('按住鼠标左键，将"文档"文字垂直向上拖动一段距离后松开鼠标，注意无法拖动为正常的，继续执行下一步即可');
   // await device.keyUp('Shift');

    console.log('===== 预期2: 桌面上的两个文件集合框之间无重合，中间存在一定缝隙 =====');
    await agent.aiAssert('桌面上的两个文件集合框之间无重合，中间存在一定缝隙');

    console.log('✅ 测试用例执行完成');
  }, { timeout: 1200000, tags: ['1810015', 'level3', 'desktop_organization', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('5. afterEach: 每个测试后的清理');
    for (let i = 1; i <= 10; i++) {
      await system.exec(`rm -rf ~/Desktop/1810015-${i} 2>/dev/null || true`);
      await system.exec(`rm -rf ~/Desktop/1810015-${i}.txt 2>/dev/null || true`);
    }
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('6. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});