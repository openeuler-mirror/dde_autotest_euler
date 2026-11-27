/**
 * 用例 PMSID: 1809075
 * 用例标题: 分组折叠-网络展开
 * 生成时间: 2026-08-20 20:29:31
 * 用例编写人: UT002411（胡戬）
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809075-分组折叠-网络展开', () => {
  let common;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
  });

  test('1809075-分组折叠-网络展开', async ({ device, agent, uos, system }) => {
    // 步骤1: 最大化窗口打开文件管理器
    console.log('步骤1: 最大化窗口打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();

    // 步骤2: 判断网络分区是否为折叠状态，能看到网络邻居即为展开状态，看不到为折叠状态。是展开状态则切换为折叠状态
    console.log('步骤2: 判断网络分区折叠状态，如展开则切换为折叠');
    const isExpanded = await agent.aiBoolean('侧边栏网络分组下方能看到网络邻居项', { deepThink: true });
    if (isExpanded) {
      console.log('网络分区为展开状态，切换为折叠状态');
      await agent.aiDoubleClick('侧边栏的网络分组');
      // await agent.aiHover('侧边栏的网络分组');
      // await agent.aiTap('网络目录右侧的折叠箭头图标（向上的箭头^）');
      await agent.aiWaitFor('网络分组下方不显示网络邻居项', { timeout: 5000, deepThink: true });
    } else {
      console.log('网络分区已为折叠状态，无需操作');
    }

    // 步骤3: 折叠状态下，鼠标悬停到侧边栏网络分区
    console.log('步骤3: 折叠状态下，鼠标悬停到侧边栏网络分区');
    await agent.aiHover('侧边栏的网络分组');

    // 断言: 分区右侧显示展开按钮"v"
    console.log('断言: 分区右侧显示展开按钮');
    await agent.aiAssert('名称为网络的分组右侧显示展开按钮（向下的箭头v）', { deepThink: true });
    console.log('断言通过: 展开按钮显示正确');

    // 步骤4: 点击展开按钮
    console.log('步骤4: 点击展开按钮');
    await agent.aiTap('网络分组右侧的展开箭头图标（向下的箭头v）');
    await agent.aiWaitFor('网络分组下方的网络邻居项已显示', { timeout: 5000, deepThink: true });

    // 断言: 网络分区下能看到网络邻居
    console.log('断言: 网络分组下能看到网络邻居');
    await agent.aiAssert('网络分组下方能看到网络邻居项', { deepThink: true });
    console.log('断言通过: 网络邻居项可见');

  }, { timeout: 600000, tags: ['1809075', 'level2', 'group_collapse', 'hujian'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    // 后置步骤1: 恢复网络分区为展开状态
    try {
      const isExpanded = await agent.aiBoolean('侧边栏网络分组下方能看到网络邻居项', { deepThink: true });
      if (!isExpanded) {
      console.log('网络分区为折叠状态，切换为展开状态');
      await agent.aiDoubleClick('侧边栏的网络分组');
      // await agent.aiHover('侧边栏的网络分组');
      // await agent.aiTap('网络目录右侧的折叠箭头图标（向上的箭头^）');
      await agent.aiWaitFor('网络分组下方显示网络邻居项', { timeout: 5000, deepThink: true });
    } else {
      console.log('网络分区已为展开状态，无需操作');
    }
    } catch (err) {
      console.warn('检查网络展开状态失败:', err.message);
    }
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await uos.showDesktop();
  });
});
