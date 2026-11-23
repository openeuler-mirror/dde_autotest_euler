/**
 * 用例 PMSID:1935235
 * 用例标题:【在新标签页中打开新文件夹】从侧边栏打开新文件夹
 * 生成时间: 2026-07-07
 * 用例编写人: UT000211(陈依)
 */

describe('1935235-【在新标签页中打开新文件夹】从侧边栏打开新文件夹', () => {
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
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("设置页面已打开");
    await agent.aiTap("在新标签打开新文件夹文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("在新标签打开新文件夹文字左侧有蓝色√");
    console.log('✅ "在新标签打开新文件夹"选项已勾选');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
    console.log('✅ 文件管理器已关闭');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1935235-【在新标签页中打开新文件夹】从侧边栏打开新文件夹', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：从侧边栏打开新文件夹 ===');

    // 步骤1: 打开文件管理器，点击侧边栏文档目录，进入文档目录，顶部导航栏标签显示文档
    console.log('步骤1: 打开文件管理器，点击侧边栏文档目录');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("文件管理器左侧侧边栏的文档目录");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("进入文档目录，顶部导航栏标签显示文档");
    console.log('✅ 已进入文档目录');

    // 步骤2: 点击侧边栏的下载，进入下载目录，在当前文管窗口打开下载目录，顶部导航栏标签显示下载
    console.log('步骤2: 点击侧边栏的下载目录');
    await agent.aiTap("文件管理器左侧侧边栏的下载目录");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("在当前文管窗口打开下载目录，顶部导航栏标签显示下载");
    console.log('✅ 已进入下载目录');

    // 步骤3: 点击侧边栏的图片，进入图片目录，在当前文管窗口打开图片目录，顶部导航栏标签显示图片
    console.log('步骤3: 点击侧边栏的图片目录');
    await agent.aiTap("文件管理器左侧侧边栏的图片目录");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("在当前文管窗口打开图片目录，顶部导航栏标签显示图片");
    console.log('✅ 已进入图片目录');

    console.log('✅ 1935235用例测试完成');

  }, { timeout: 600000, tags: ["1935235", "level1", "new_folder", "chenyi"] });

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
    console.log('✅ 测试环境已清理');
  });
});
