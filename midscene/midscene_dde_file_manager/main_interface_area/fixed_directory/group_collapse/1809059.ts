/**
 * 用例 PMSID: 1809059
 * 用例标题: 分组折叠-折叠状态移除标签
 * 生成时间: 2026-04-10 14:00:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809059-分组折叠-折叠状态移除标签', () => {
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
    // 清理视频目录
    await system.exec('rm -rf ~/Videos/*', 5000);
  });

  test('1809059-分组折叠-折叠状态移除标签', async ({ device, agent, uos, system }) => {
    console.log('===== 前置准备：创建测试文件夹并添加到快捷访问 =====');
    await system.exec('mkdir -p ~/Videos/folder1 ~/Videos/folder2');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文件管理器窗口已显示', { timeout: 10000 });

    // 辅助函数：折叠快捷访问
    const collapseQuickAccess = async () => {
      await agent.aiHover('侧边栏的快捷访问目录');
      const isAlreadyCollapsed = await agent.aiBoolean('快捷访问已折叠', { deepThink: true });
      if (!isAlreadyCollapsed) {
        await agent.aiWaitFor('快捷访问目录右侧显示折叠箭头图标', { timeout: 3000, deepThink: true });
        await agent.aiTap('快捷访问目录右侧的折叠箭头图标');
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log('快捷访问已处于折叠状态，无需操作');
      }
    };

    // 辅助函数：展开快捷访问
    const expandQuickAccess = async () => {
      await agent.aiHover('侧边栏的快捷访问目录');
      await agent.aiWaitFor('快捷访问目录右侧显示展开箭头图标', { timeout: 3000, deepThink: true });
      await agent.aiTap('快捷访问目录右侧的展开箭头图标');
      await agent.aiWaitFor('快捷访问已展开', { timeout: 3000, deepThink: true });
    };

    // 先判断视频目录是否有显示，有显示点击视频目录，无显示，取消快捷访问的折叠
    const isVideoVisible = await agent.aiBoolean('侧边栏显示视频目录', { deepThink: true });
    if (isVideoVisible) {
      await agent.aiTap('侧边栏的视频目录');
      await agent.aiWaitFor('视频目录已打开', { timeout: 5000 });
    } else {
      await expandQuickAccess();
      await agent.aiTap('侧边栏的视频目录');
      await agent.aiWaitFor('视频目录已打开', { timeout: 5000 });
    }

    // 添加folder1到快捷访问
    await agent.aiRightClick('folder1文件夹');
    await agent.aiWaitFor('弹出右键菜单', { timeout: 3000, deepThink: true });
    await agent.aiTap('右键菜单中的添加到快捷访问');
    await agent.aiWaitFor('folder1已添加到快捷访问', { timeout: 5000, deepThink: true });

    // 步骤1：折叠快捷访问后移除folder1，验证展开后不显示
    console.log('===== 步骤1: 折叠状态下移除folder1 =====');
    await collapseQuickAccess();
    
    const videoHidden1 = await agent.aiBoolean('侧边栏未显示视频目录', { deepThink: true });
    if (!videoHidden1) throw new Error('步骤1失败：折叠快捷访问后视频目录仍可见');
    console.log('[步骤1.1] 折叠后视频目录隐藏成功 ✅');

    await agent.aiRightClick('folder1文件夹');
    await agent.aiWaitFor('弹出右键菜单', { timeout: 3000, deepThink: true });
    await agent.aiTap('右键菜单中的从快捷访问移除');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await expandQuickAccess();
    
    const folder1Removed = await agent.aiBoolean('侧边栏快捷访问中未显示folder1', { deepThink: true });
    if (!folder1Removed) throw new Error('步骤1失败：移除folder1后展开仍显示');
    console.log('[步骤1.2] 折叠状态移除folder1成功 ✅');

    // 步骤2：添加folder2到快捷访问
    console.log('===== 步骤2: 添加folder2到快捷访问 =====');
    await agent.aiTap('视频目录空白区域');
    await device.pressKey('Ctrl+A');
    await agent.aiWaitFor('所有文件夹已选中', { timeout: 3000 });
    await agent.aiRightClick('folder2文件夹');
    await agent.aiWaitFor('弹出右键菜单', { timeout: 3000, deepThink: true });
    await agent.aiTap('右键菜单中的添加到快捷访问');
    await agent.aiWaitFor('folder2已添加到快捷访问', { timeout: 5000, deepThink: true });

    const folder2Added = await agent.aiBoolean('侧边栏快捷访问中显示folder2', { deepThink: true });
    if (!folder2Added) throw new Error('步骤2失败：folder2未添加到快捷访问');
    console.log('[步骤2] folder2添加成功 ✅');

    // 步骤3：折叠快捷访问后移除folder2，验证展开后不显示
    console.log('===== 步骤3: 折叠状态下移除folder2 =====');
    await collapseQuickAccess();
    
    const videoHidden2 = await agent.aiBoolean('侧边栏未显示视频目录', { deepThink: true });
    if (!videoHidden2) throw new Error('步骤3失败：折叠快捷访问后视频目录仍可见');
    console.log('[步骤3.1] 折叠后视频目录隐藏成功 ✅');

    await agent.aiTap('视频目录空白区域');
    await device.pressKey('Ctrl+A');
    await agent.aiWaitFor('所有文件夹已选中', { timeout: 3000 });
    await agent.aiRightClick('folder2文件夹');
    await agent.aiWaitFor('弹出右键菜单', { timeout: 3000, deepThink: true });
    await agent.aiTap('右键菜单中的从快捷访问移除');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await expandQuickAccess();
    
    const bothRemoved = await agent.aiBoolean('侧边栏快捷访问中未显示folder1和folder2', { deepThink: true });
    if (!bothRemoved) throw new Error('步骤3失败：移除folder2后展开仍显示folder1或folder2');
    console.log('[步骤3.2] 折叠状态移除folder2成功 ✅');

  }, { timeout: 600000, tags: ['1809059', 'level2', 'smoke', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 检查快捷访问展开状态，如未展开则恢复展开
    try {
      const isExpanded = await agent.aiBoolean('侧边栏快捷访问下显示视频项', { deepThink: true });
      if (!isExpanded) {
        console.log('检测到快捷访问处于折叠状态，正在恢复展开...');
        await agent.aiHover('侧边栏的快捷访问目录');
        await agent.aiWaitFor('快捷访问目录右侧显示展开箭头图标', { timeout: 3000, deepThink: true });
        await agent.aiTap('快捷访问目录右侧的展开箭头图标');
        await agent.aiWaitFor('快捷访问已展开', { timeout: 3000, deepThink: true });
        console.log('✅ 快捷访问已恢复展开状态');
      } else {
        console.log('快捷访问已处于展开状态，无需操作');
      }
    } catch (err) {
      console.warn('检查快捷访问展开状态失败:', err.message);
    }

    // 清理视频目录
    await system.exec('rm -rf ~/Videos/folder*', 5000);
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
