/**
 * 用例 PMSID:1935241
 * 用例标题:【在新标签页中打开新文件夹】第三方应用打开
 * 生成时间: 2026-07-07
 * 用例编写人: UT000211(陈依)
 */

describe('1935241-【在新标签页中打开新文件夹】第三方应用打开', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    
    // 环境清理：安静删除配置文件，关闭文件管理器
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
    
    // 打开文件管理器，点击文管右上角三条横线，点击设置，进入设置页面
    console.log('打开文件管理器并进入设置');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("设置页面已打开");
    console.log('✅ 设置页面已打开');
    
    // 在新标签页中打开新文件夹文字左侧方框的中心，预期在新标签打开新文件夹前方方框被勾选
    await agent.aiTap("在新标签页中打开新文件夹文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("在新标签打开新文件夹前方方框被勾选");
    await agent.aiTap("设置页面×");
    await agent.aiAssert("设置页面关闭");
    console.log('✅ "在新标签页中打开新文件夹"选项已勾选');
    
    // 关掉文件管理器
    await agent.aiTap("文件管理器×");
    await agent.aiAssert("文件管理器窗口已关闭");
    console.log('✅ 文件管理器已关闭');
    
    // 使用命令，创建满足如下要求的文件：桌面有3个文件夹A、B、C，这3个文件夹里均有子文件夹（名称分别为：A1、B1、C1）及一些文件
    console.log('创建测试文件夹和文件');
    await system.exec('mkdir -p ~/Desktop/A/A1 ~/Desktop/B/B1 ~/Desktop/C/C1');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('touch ~/Desktop/A/file1.txt ~/Desktop/A/file2.txt ~/Desktop/B/file1.txt ~/Desktop/B/file2.txt ~/Desktop/C/file1.txt ~/Desktop/C/file2.txt');
    await system.exec('touch ~/Desktop/A/A1/a1_file1.txt ~/Desktop/A/A1/a1_file2.txt ~/Desktop/B/B1/b1_file1.txt ~/Desktop/B/B1/b1_file2.txt ~/Desktop/C/C1/c1_file1.txt ~/Desktop/C/C1/c1_file2.txt');
    console.log('✅ 测试文件夹和文件创建完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1935241-【在新标签页中打开新文件夹】第三方应用打开', async ({ device, agent, uos, system, env }) => {
    console.log('=== 开始测试：在新标签页中打开新文件夹功能（第三方应用打开）===');

    // 步骤1: 打开浏览器，输入网址 https://cdimage.uniontech.com/daily-iso/source/chengdu/Python-workhome.zip，点击enter键，点击出现弹窗的下载按钮，等待30s
    console.log('步骤1: 打开浏览器并下载文件');
    await uos.openApp("浏览器", 3000, 20000, true);
    await agent.aiAssert("浏览器窗口已打开");
    console.log('✅ 浏览器已打开');
    
    await agent.aiTap("浏览器地址栏");
    await device.typeText("https://cdimage.uniontech.com/daily-iso/source/chengdu/Python-workhome.zip");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ 已输入下载地址');
    
    // 点击出现弹窗的下载按钮
    await agent.aiTap("下载弹窗中的下载按钮", { deepThink: true });
    console.log('✅ 已点击下载按钮');
    
    // 等待30s
    await new Promise(resolve => setTimeout(resolve, 30000));
    console.log('✅ 等待下载完成');

    // 步骤2: 点击浏览器右上角下载图标，点击完整的下载记录，点击第一条下载记录右上方的三个点，点击在文件夹显示，预期进入到文件的下载目录
    console.log('步骤2: 在浏览器中打开下载文件所在文件夹');
    await agent.aiTap("浏览器右上角下载图标", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ 已点击下载图标');
    
    await agent.aiTap("完整的下载记录", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ 已点击完整的下载记录');
    
    await agent.aiTap("第一条下载记录右上方的三个点", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ 已点击三个点菜单');
    
    await agent.aiTap("在文件夹显示", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("进入到文件的下载目录");
    console.log('✅ 已进入到文件的下载目录');

    // 步骤3: 执行win+D，预期显示桌面
    console.log('步骤3: 执行win+D显示桌面');
    await device.pressKey("win+d");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("显示桌面");
    console.log('✅ 已显示桌面');

    // 步骤4: 双击访问桌面上的文件夹A，预期在当前文管窗口以新标签打开文件夹A，文件夹A旁边的标签是步骤2的下载目录
    console.log('步骤4: 双击桌面上的文件夹A');
    await agent.aiDoubleClick("桌面上的文件夹A");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("当前文管窗口以新标签打开文件夹A");
    await agent.aiAssert("文件夹A旁边的标签是下载目录");
    console.log('✅ 已在新标签打开文件夹A，旁边标签为下载目录');

    console.log('✅ 1935241用例测试完成');

  }, { timeout: 600000, tags: ["1935241", "level3", "new_folder", "chenyi"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
    
    // 关闭浏览器
    await system.exec(`ps aux |grep browser | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null || true`);

    // 清理创建的测试文件夹
    console.log('清理测试文件夹');
    await system.exec('rm -rf ~/Desktop/A ~/Desktop/B ~/Desktop/C');
    console.log('✅ 测试文件夹已清理');
  });
});
