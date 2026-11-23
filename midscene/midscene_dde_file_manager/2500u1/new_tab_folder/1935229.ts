/**
 * 用例 PMSID:1935229
 * 用例标题:【在新标签页中打开新文件夹】在文管打开新文件夹
 * 生成时间: 2026-07-07
 * 用例编写人: UT000211(陈依)
 */

describe('1935229-【在新标签页中打开新文件夹】在文管打开新文件夹', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 引用公共方法清理应用进程和文管配置
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);

    // 使用命令在主目录创建满足如下要求的文件和文件夹
    // 主目录有3个文件夹：A、B、C，这3个文件夹里均有子文件夹（名称分别为：A1、B1、C1）及一些文件
    console.log('创建测试文件夹和文件');
    await system.exec('mkdir -p ~/A/A1 ~/B/B1 ~/C/C1');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('touch ~/A/file1.txt ~/A/file2.txt ~/B/file1.txt ~/B/file2.txt ~/C/file1.txt ~/C/file2.txt', 500);
    await system.exec('touch ~/A/A1/a1_file1.txt ~/A/A1/a1_file2.txt ~/B/B1/b1_file1.txt ~/B/B1/b1_file2.txt ~/C/C1/c1_file1.txt ~/C/C1/c1_file2.txt', 500);
    console.log('✅ 测试文件夹和文件创建完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1935229-【在新标签页中打开新文件夹】在文管打开新文件夹', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：在新标签页中打开新文件夹功能 ===');

    // 步骤1: 打开文件管理器，点击右上角三条横线,点击设置，点击在标签打开新文件夹前方的方框，完成后点击设置页面右上角×按钮
    console.log('步骤1: 打开文件管理器并设置"在标签打开新文件夹"选项');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文件管理器已打开');

    // 打开设置菜单
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    console.log('✅ 设置窗口已打开');

    // 点击"在标签打开新文件夹"前方的方框
    await agent.aiTap("在标签打开新文件夹文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("在标签打开新文件夹文字左侧有蓝色√");
    console.log('✅ "在标签打开新文件夹"选项已勾选');

    // 点击设置页面右上角×按钮关闭设置
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');

    // 步骤2: 点击文件管理器侧边栏的主目录，双击文件夹A，预期从当前标签页打开文件夹A
    console.log('步骤2: 点击侧边栏主目录，双击文件夹A');
    await agent.aiTap("文件管理器左侧的主目录");
    await agent.aiDoubleClick("主区域中的文件夹A");
    await agent.aiAssert("当前标签页显示文件夹A的内容，显示A1子文件夹和file1.txt、file2.txt文件");
    console.log('✅ 从当前标签页打开文件夹A成功');

    // 步骤3: 双击文件夹A1，从当前标签页进入文件夹A1目录
    console.log('步骤3: 双击文件夹A1进入A1目录');
    await agent.aiDoubleClick("主区域中的文件夹A1");
    await agent.aiAssert("当前标签页显示文件夹A1的内容，显示a1_file1.txt、a1_file2.txt文件");
    console.log('✅ 从当前标签页进入文件夹A1目录成功');

    console.log('✅ 1935229用例测试完成');

  }, { timeout: 600000, tags: ["1935229", "level3", "new_folder", "chenyi"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 步骤3: 滑动设置页面到最底部，点击恢复默认
    console.log('===== 滑动设置页面到最底部，点击恢复默认 =====');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiScroll('设置页面', { direction: 'down', distance: 60 });
    await agent.aiTap('设置页面底部的恢复默认按钮');
    
    // 步骤4: 关闭设置菜单
    console.log('===== 关闭设置菜单 =====');
    await agent.aiTap('设置窗口右上角的关闭按钮');
    await agent.aiAssert('设置窗口被关闭');

    // 步骤5: 按F5刷新窗口
    console.log('===== 按F5刷新窗口 =====');
    await device.pressKey("F5");
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);

    // 清理创建的测试文件夹
    console.log('清理测试文件夹');
    await system.exec('rm -rf ~/A ~/B ~/C', 500);
    console.log('✅ 测试文件夹已清理');
  });
});
