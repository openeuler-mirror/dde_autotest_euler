/**
 * 用例 PMSID:1935231
 * 用例标题:【在新标签页中打开新文件夹】打开多个文管窗口后打开桌面上新文件夹
 * 生成时间: 2026-07-07
 * 用例编写人: UT000211(陈依)
 */

describe('1935231-【在新标签页中打开新文件夹】打开多个文管窗口后打开桌面上新文件夹', () => {
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
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1935231-【在新标签页中打开新文件夹】打开多个文管窗口后打开桌面上新文件夹', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：打开多个文管窗口后打开桌面上新文件夹 ===');

    // 步骤1: 双击桌面计算机图标，双击系统盘，预期进入到系统盘界面，此为文管窗口1
    console.log('步骤1: 打开文管窗口1，进入系统盘');
    await agent.aiDoubleClick("桌面上的计算机图标");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiDoubleClick("系统盘");
    await agent.aiAssert("当前显示系统盘界面");
    console.log('✅ 文管窗口1已打开，进入系统盘界面');

    // 步骤2: 再次双击桌面计算机图标，此为文管窗口2
    console.log('步骤2: 打开文管窗口2');
    await agent.aiDoubleClick("桌面上的计算机图标");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文管窗口2已打开');

    // 步骤3: 点击文管右上角三条横线，点击设置，预计进入设置页面，点击在新标签打开新文件夹文字左侧方框的中心，预期在新标签打开新文件夹前方方框被勾选
    console.log('步骤3: 打开设置，勾选"在新标签打开新文件夹"选项');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("设置页面已打开");
    await agent.aiTap("在新标签打开新文件夹文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("在新标签打开新文件夹文字左侧有蓝色√");
    console.log('✅ "在新标签打开新文件夹"选项已勾选');

    // 关闭设置窗口
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');

    // 步骤4: 快捷键win+D,预期显示桌面
    console.log('步骤4: 使用快捷键Win+D显示桌面');
    await device.pressKey("Win+D");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("桌面已显示");
    console.log('✅ 已显示桌面');

    // 步骤5: 双击桌面文件夹A，预期文管窗口2以新标签打开文件夹A，A标签旁边标签是计算机
    console.log('步骤5: 双击桌面文件夹A，预期以新标签打开');
    await agent.aiDoubleClick("桌面上的文件夹A");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文管窗口2以新标签打开文件夹A");
    await agent.aiAssert("A标签旁边标签是计算机");
    console.log('✅ 文件夹A以新标签打开成功');

    // 步骤6: 文件夹A空白处右键，点击新建文件夹，点击文件夹A空白处，创建文件夹成功
    console.log('步骤6: 在文件夹A中新建文件夹');
    await agent.aiRightClick("文件夹A的空白处");
    await agent.aiTap("右键菜单中的新建文件夹", { deepThink: true });
    await agent.aiTap("文件夹A的空白处");
    await agent.aiAssert("文件夹A中显示新建的文件夹");
    console.log('✅ 新建文件夹成功');

    // 步骤7: 文件夹A空白处右键，点击新建文档，点击办公文档，点击文件夹A空白处，创建文件成功
    console.log('步骤7: 在文件夹A中新建办公文档');
    await agent.aiRightClick("文件夹A的空白处");
    await agent.aiTap("右键菜单中的新建文档", { deepThink: true });
    await agent.aiTap("子菜单中的办公文档", { deepThink: true });
    await agent.aiTap("文件夹A的空白处");
    await agent.aiAssert("文件夹A中显示新建的办公文档");
    console.log('✅ 新建办公文档成功');

    console.log('✅ 1935231用例测试完成');

  }, { timeout: 600000, tags: ["1935231", "level3", "new_folder", "chenyi"] });

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
    await system.exec('rm -rf ~/Desktop/A ~/Desktop/B ~/Desktop/C', 500);
    console.log('✅ 测试文件夹已清理');
  });
});
