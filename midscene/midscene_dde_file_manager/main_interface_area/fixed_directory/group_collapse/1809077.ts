/**
 * 用例 PMSID: 1809077
 * 用例标题: 分组折叠-网络折叠
 * 生成时间: 2026-04-10 12:00:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809077-分组折叠-网络折叠', () => {
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
  });

  test('1809077-分组折叠-网络折叠', async ({ device, agent, uos, system }) => {

    // 步骤1：鼠标悬停网络-点击折叠按钮
    console.log('===== 步骤1: 鼠标悬停网络-点击折叠按钮 =====');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文件管理器窗口已显示', { timeout: 10000 });

    // 鼠标悬停到网络项，显示折叠按钮
    await agent.aiHover('侧边栏的网络项，不是网络邻居项');
    await agent.aiWaitFor('网络目录右侧显示折叠箭头图标', { timeout: 3000, deepThink: true });

    // 点击折叠按钮
    await agent.aiTap('网络目录右侧的折叠箭头图标');
    await agent.aiWaitFor('网络目录已折叠，网络邻居项被隐藏', { timeout: 5000, deepThink: true });

    // 验证网络已折叠
    const isCollapsed = await agent.aiBoolean('侧边栏网络目录处于折叠状态，未显示网络邻居项', { deepThink: true });
    if (!isCollapsed) {
      throw new Error('网络折叠失败：网络邻居项仍然可见');
    }
    console.log('[步骤1] 网络折叠成功 ✅');

    // 步骤2：关闭文管，再次打开为折叠状态
    console.log('===== 步骤2: 关闭文管，再次打开验证折叠状态保持 =====');
    await uos.closeCurrentWindow();
    await agent.aiWaitFor('文件管理器窗口已关闭', { timeout: 5000 });

    // 再次打开文件管理器
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文件管理器窗口已显示', { timeout: 10000 });

    // 验证网络仍为折叠状态
    const stillCollapsed = await agent.aiBoolean('侧边栏网络目录仍处于折叠状态，未显示网络邻居项', { deepThink: true });
    if (!stillCollapsed) {
      throw new Error('折叠状态未保持：重新打开文管后网络邻居项可见');
    }
    console.log('[步骤2] 折叠状态保持成功 ✅');

    // 展开网络（恢复初始状态）
    await agent.aiHover('侧边栏的网络目录');
    await agent.aiWaitFor('网络目录右侧显示展开箭头图标', { timeout: 3000, deepThink: true });
    await agent.aiTap('网络目录右侧的展开箭头图标');
    await agent.aiWaitFor('网络目录已展开，网络邻居项已显示', { timeout: 5000, deepThink: true });

  }, { timeout: 600000, tags: ['1809077', 'level2', 'smoke', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 检查网络折叠状态，如未展开则恢复展开
    try {
      const isExpanded = await agent.aiBoolean('侧边栏网络目录处于展开状态，显示网络邻居项', { deepThink: true });
      if (!isExpanded) {
        console.log('检测到网络处于折叠状态，正在恢复展开...');
        await agent.aiHover('侧边栏的网络目录');
        await agent.aiWaitFor('网络目录右侧显示展开箭头图标', { timeout: 3000, deepThink: true });
        await agent.aiTap('网络目录右侧的展开箭头图标');
        await agent.aiWaitFor('网络目录已展开，网络邻居项已显示', { timeout: 5000, deepThink: true });
        console.log('✅ 网络已恢复展开状态');
      } else {
        console.log('网络已处于展开状态，无需操作');
      }
    } catch (err) {
      console.warn('检查网络折叠状态失败:', err.message);
    }

    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
