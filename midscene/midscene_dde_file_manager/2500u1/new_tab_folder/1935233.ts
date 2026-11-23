/**
 * 用例 PMSID:1935233
 * 用例标题:【在新标签页中打开新文件夹】勾选"重复打开文件夹时激活已有窗口"
 * 生成时间: 2026-07-07
 * 用例编写人: UT000211(陈依)
 */

describe('1935233-【在新标签页中打开新文件夹】勾选"重复打开文件夹时激活已有窗口"', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器
    await uos.showDesktop();
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);

    // 使用命令在桌面创建满足如下要求的文件和文件夹，桌面有3个文件夹：A、B、C，这3个文件夹里均有子文件夹（名称分别为：A1、B1、C1）及一些文件
    console.log('创建测试文件夹和文件');
    await system.exec('mkdir -p ~/Desktop/A/A1 ~/Desktop/B/B1 ~/Desktop/C/C1');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('touch ~/Desktop/A/file1.txt ~/Desktop/A/file2.txt ~/Desktop/B/file1.txt ~/Desktop/B/file2.txt ~/Desktop/C/file1.txt ~/Desktop/C/file2.txt', 500);
    await system.exec('touch ~/Desktop/A/A1/a1_file1.txt ~/Desktop/A/A1/a1_file2.txt ~/Desktop/B/B1/b1_file1.txt ~/Desktop/B/B1/b1_file2.txt ~/Desktop/C/C1/c1_file1.txt ~/Desktop/C/C1/c1_file2.txt', 500);
    console.log('✅ 测试文件夹和文件创建完成');

    // 打开文件管理器，点击文管右上角三条横线，点击设置，预计进入设置页面，在新标签页中打开新文件夹"和"重复打开文件夹时激活已有窗口"文字左侧方框的中心，预期在新标签打开新文件夹和重复打开文件夹时激活已有窗口前方方框被勾选，关掉文件管理器
    console.log('预设置：勾选"在新标签打开新文件夹"和"重复打开文件夹时激活已有窗口"');
    await uos.openApp("文件管理器");
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("设置页面已打开");
    await agent.aiTap("在新标签打开新文件夹文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("在新标签打开新文件夹文字左侧有蓝色√");
    await agent.aiTap("重复打开文件夹时激活已有窗口文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("重复打开文件夹时激活已有窗口文字左侧有蓝色√");
    console.log('✅ 设置选项已勾选');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
    console.log('✅ 文件管理器已关闭');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1935233-【在新标签页中打开新文件夹】勾选"重复打开文件夹时激活已有窗口"', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：勾选"重复打开文件夹时激活已有窗口"功能 ===');

    // 步骤1: 双击桌面文件夹A，进入文件夹A
    console.log('步骤1: 双击桌面文件夹A，进入文件夹A');
    await agent.aiDoubleClick("桌面上的文件夹A");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文件管理器窗口已打开，显示文件夹A的内容");
    console.log('✅ 已进入文件夹A');

    // 步骤2: 再次双击桌面文件夹A，激活步骤1文管窗口，没有打开其他窗口和标签，此为窗口1
    console.log('步骤2: 再次双击桌面文件夹A，预期激活已有窗口');
    await agent.aiDoubleClick("桌面上的文件夹A");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("激活步骤1的文管窗口，没有打开其他窗口和标签");
    console.log('✅ 已激活已有窗口');

    // 步骤3: 双击桌面文件夹B，预计步骤1文管窗口以新标签打开文件夹B，存在文件夹B标签
    console.log('步骤3: 双击桌面文件夹B，预期以新标签打开');
    await agent.aiDoubleClick("桌面上的文件夹B");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("步骤1文管窗口以新标签打开文件夹B");
    await agent.aiAssert("存在文件夹B标签");
    console.log('✅ 文件夹B以新标签打开成功');

    // 步骤4: 点击文管右上角三条横线，点击设置，预计进入设置页面，在新标签页中打开新文件夹"和"重复打开文件夹时激活已有窗口"文字左侧方框的中心，预期在新标签打开新文件夹和重复打开文件夹时激活已有窗口前方方框没有勾选，关闭设置页面
    console.log('步骤4: 取消勾选"在新标签打开新文件夹"和"重复打开文件夹时激活已有窗口"');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("设置页面已打开");
    await agent.aiTap("在新标签打开新文件夹文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("在新标签打开新文件夹文字左侧没有蓝色√");
    await agent.aiTap("重复打开文件夹时激活已有窗口文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("重复打开文件夹时激活已有窗口文字左侧没有蓝色√");
    console.log('✅ 设置选项已取消勾选');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');

    // 步骤5: 双击桌面上的计算机图标进入文管计算机界面，为窗口2
    console.log('步骤5: 双击桌面上的计算机图标，打开文管窗口2');
    await agent.aiDoubleClick("桌面上的计算机图标");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文件管理器窗口已打开，显示计算机界面");
    console.log('✅ 文管窗口2已打开');

    // 步骤6: 点击文管右上角三条横线，点击设置，预计进入设置页面，在新标签页中打开新文件夹文字左侧方框的中心，预期在新标签打开新文件夹口前方方框被勾选，关闭设置页面
    console.log('步骤6: 勾选"在新标签打开新文件夹"');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("设置页面已打开");
    await agent.aiTap("在新标签打开新文件夹文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("在新标签打开新文件夹文字左侧有蓝色√");
    console.log('✅ "在新标签打开新文件夹"已勾选');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');

    // 步骤7: 执行win+D，预期显示桌面
    console.log('步骤7: 使用快捷键Win+D显示桌面');
    await device.pressKey("Win+D");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("桌面已显示");
    console.log('✅ 已显示桌面');

    // 步骤8: 双击桌面文件夹A，预期文管窗口2以新标签打开文件夹A，A标签旁边标签是计算机
    console.log('步骤8: 双击桌面文件夹A，预期文管窗口2以新标签打开');
    await agent.aiDoubleClick("桌面上的文件夹A");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文管窗口2以新标签打开文件夹A");
    await agent.aiAssert("A标签旁边标签是计算机");
    console.log('✅ 文件夹A以新标签打开成功');

    console.log('✅ 1935233用例测试完成');

  }, { timeout: 600000, tags: ["1935233", "level3", "new_folder", "chenyi"] });

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
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);

    // 清理创建的测试文件夹
    console.log('清理测试文件夹');
    await system.exec('rm -rf ~/Desktop/A ~/Desktop/B ~/Desktop/C', 500);
    console.log('✅ 测试文件夹已清理');
  });
});
