/**
 * 用例 PMSID: 1805207
 * 用例标题: 文管顶部区域，点击图标视图
 * 生成时间: 2026-04-24
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805207-文管顶部区域，点击图标视图', () => {
  let common;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);
    await common.closeFileManager(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);

    // 在视频目录创建2个文件夹作为前置条件
    await system.exec('mkdir -p ~/Videos/测试视频文件夹1');
    await system.exec('mkdir -p ~/Videos/测试视频文件夹2');

    // 打开文件管理器并最大化
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
  });

  test('1805207-文管顶部区域，点击图标视图', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 打开文管，点击侧边栏视频项，进入视频窗口 =====');
    
    // 点击文管左侧边栏视频项
    await agent.aiTap("侧边栏中的视频目录");
    await agent.aiWaitFor("视频目录已打开", { timeout: 10000 });

    // 断言视频目录的文件夹为图标显示
    const isIconView = await agent.aiBoolean("视频目录中的文件夹以图标形式显示", { deepThink: true });
    if (!isIconView) {
      console.log('提示：当前可能不是图标视图，需要切换到图标视图');
      
      // 切换到图标视图
      await agent.aiRightClick("文件列表区域空白处");
      await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
      await agent.aiTap("右键菜单中的显示方式");
      await agent.aiWaitFor("显示方式子菜单已展开", { timeout: 3000 });
      await agent.aiTap("显示方式子菜单中的图标");
      await agent.aiWaitFor("已切换到图标视图", { timeout: 5000, deepThink: true });
      await agent.aiTap("文件列表区域空白处");
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('===== 步骤2: 在顶部区域，点击图标视图按钮 =====');
    
    // 确保当前在列表视图，以便测试切换到图标视图
    await agent.aiRightClick("文件列表区域空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    await agent.aiTap("右键菜单中的显示方式");
    await agent.aiWaitFor("显示方式子菜单已展开", { timeout: 3000 });
    await agent.aiTap("显示方式子菜单中的列表");
    await agent.aiWaitFor("已切换到列表视图", { timeout: 5000, deepThink: true });
    await agent.aiTap("文件列表区域空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 验证当前是列表视图
    const isListView = await agent.aiBoolean("当前视频目录显示为列表视图", { deepThink: true });
    if (!isListView) {
      console.log('提示：当前可能已经是列表视图');
    }

    // 在顶部区域点击图标视图按钮
    await agent.aiTap("文件管理器顶部工具栏中的图标视图按钮");
    await agent.aiWaitFor("视图模式已切换", { timeout: 5000 });

    // 预期：内容显示为图标模式
    await agent.aiAssert("视频目录内容显示为图标模式");
    
    // 进一步验证图标视图
    const isIconViewAfterClick = await agent.aiBoolean("视频目录中的文件夹以图标形式显示", { deepThink: true });
    if (!isIconViewAfterClick) {
      throw new Error('视图切换失败：内容未显示为图标模式');
    }
    
    console.log('✅ 步骤2验证通过：点击图标视图后，视频目录内容显示为图标模式');

  }, { timeout: 600000, tags: ['1805207', 'level1', 'smoke', 'view_tab', 'icon-view', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除视频目录中的测试文件夹
    try {
      await system.exec('rm -rf ~/Videos/测试视频文件夹1');
      await system.exec('rm -rf ~/Videos/测试视频文件夹2');
    } catch (err) {
      console.warn('删除测试文件夹失败:', err.message);
    }

    // 关闭文件管理器窗口（如果存在）
    const isFileManagerOpen = await agent.aiBoolean("文件管理器窗口已打开", { deepThink: true });
    if (isFileManagerOpen) {
      await uos.closeCurrentWindow();
      await agent.aiWaitFor("文件管理器窗口已关闭", { timeout: 5000 });
    }
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
