/**
 * 用例 PMSID:1935237
 * 用例标题:【在新标签页中打开新文件夹】以管理员身份打开新文件夹
 * 生成时间: 2026-07-07
 * 用例编写人: UT000211(陈依)
 */

describe('1935237-【在新标签页中打开新文件夹】以管理员身份打开新文件夹', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器
    await uos.showDesktop();
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);

    // 打开文件管理器，点击文管右上角三条横线，点击设置，预计进入设置页面，在新标签页中打开新文件夹文字左侧方框的中心，预期在新标签打开新文件夹前方方框被勾选，关掉文件管理器
    console.log('预设置：勾选"在新标签打开新文件夹"');
    await uos.openApp("文件管理器");
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("设置页面已打开");
    await agent.aiTap("在新标签打开新文件夹文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("在新标签打开新文件夹文字左侧有蓝色√");
    console.log('✅ "在新标签打开新文件夹"选项已勾选');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');
    await closeFileManager(system);
    console.log('✅ 文件管理器已关闭');

    // 使用命令，创建测试文件桌面有3个文件夹：A、B、C，这3个文件夹里均有子文件夹（名称分别为：A1、B1、C1）及一些文件
    console.log('创建测试文件夹和文件');
    await system.exec('mkdir -p ~/Desktop/A/A1 ~/Desktop/B/B1 ~/Desktop/C/C1');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('touch ~/Desktop/A/file1.txt ~/Desktop/A/file2.txt ~/Desktop/B/file1.txt ~/Desktop/B/file2.txt ~/Desktop/C/file1.txt ~/Desktop/C/file2.txt', 500);
    await system.exec('touch ~/Desktop/A/A1/a1_file1.txt ~/Desktop/A/A1/a1_file2.txt ~/Desktop/B/B1/b1_file1.txt ~/Desktop/B/B1/b1_file2.txt ~/Desktop/C/C1/c1_file1.txt ~/Desktop/C/C1/c1_file2.txt', 500);
    console.log('✅ 测试文件夹和文件创建完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1935237-【在新标签页中打开新文件夹】以管理员身份打开新文件夹', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：以管理员身份打开新文件夹 ===');
    const TEST_PASSWORD = process.env.TEST_PASSWORD;
    // 步骤1: 双击桌面文件夹A，进入文件夹A
    console.log('步骤1: 双击桌面文件夹A，进入文件夹A');
    await agent.aiDoubleClick("桌面上的文件夹A");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文件管理器窗口已打开，显示文件夹A的内容");
    console.log('✅ 已进入文件夹A');

    // 步骤2: 点击侧边栏的图片，右键桌面文件夹A，点击以管理员身份打开，预期新文管窗口打开文件夹A
    console.log('步骤2: 点击侧边栏的图片，右键桌面文件夹A，以管理员身份打开');
    await agent.aiRightClick("桌面上的文件夹A");
    await agent.aiTap("右键菜单中的以管理员身份打开", { deepThink: true });
    await agent.aiAssert("弹出认证框");
    await agent.aiTap("请输入密码方框")
    await device.typeText(`${TEST_PASSWORD}`);
    await agent.aiTap('确定按钮')
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("新文管窗口打开文件夹A");
    console.log('✅ 以管理员身份打开文件夹A成功');

    console.log('✅ 1935237用例测试完成');

  }, { timeout: 1800000, tags: ["1935237", "level1", "new_folder", "chenyi"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 滑动设置页面到最底部，点击恢复默认
    console.log('===== 滑动设置页面到最底部，点击恢复默认 =====');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiScroll('设置页面', { direction: 'down', distance: 60 });
    await agent.aiTap('设置页面底部的恢复默认按钮');
    
    // 关闭设置菜单
    console.log('===== 关闭设置菜单 =====');
    await agent.aiTap('设置窗口右上角的关闭按钮');
    await agent.aiAssert('设置窗口被关闭');

    // 按F5刷新窗口
    console.log('===== 按F5刷新窗口 =====');
    await device.pressKey("F5");
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await agent.aiTap('文件管理器右上角关闭按钮');
    await agent.aiTap('文件管理器右上角关闭按钮');
    await agent.aiAssert('文件管理器被关闭');
    
    // 清理创建的测试文件夹
    console.log('清理测试文件夹');
    await system.exec('rm -rf ~/Desktop/A ~/Desktop/B ~/Desktop/C', 500);
    console.log('✅ 测试文件夹已清理');
  });
});
