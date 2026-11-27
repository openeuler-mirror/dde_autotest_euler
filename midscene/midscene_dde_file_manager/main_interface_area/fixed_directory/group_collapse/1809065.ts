/**
 * 用例 PMSID: 1809065
 * 用例标题: 分组折叠-标签悬停鼠标
 * 生成时间: 2026-08-20 20:29:31
 * 用例编写人: UT002411（胡戬）
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809065-分组折叠-标签悬停鼠标', () => {
  let common;
  const markUtil = `${caseDir}midscene_dde_file_manager/main_interface_area/fixed_directory/mark/common.ts`;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);

    // 前置条件1: 在文档目录创建一个测试文件1809065te.txt，并给其打上test标记
    console.log('前置条件1: 创建测试文件1809065te.txt并打上test标记');
    await system.exec(`touch ~/Documents/1809065te.txt`);

    // 打开文件管理器，给文件打上test标记
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiTap('文件管理器侧边栏的文档');
    await agent.aiRightClick('文件管理器右侧内容窗口中的1809065te.txt文件');
    await agent.aiWaitFor('右键菜单已显示', { deepThink: true });
    await agent.aiTap('右键菜单中的标记信息');
    await agent.aiWaitFor('文件图标下出现一个矩形框，里边有光标', { timeout: 5000 });
    await device.typeText('test', true);
    await device.pressKey('Enter');
    await device.pressKey('Escape');
    const isExpanded = await agent.aiBoolean('文件管理器侧边栏出现标记分组，能看到test标记', { deepThink: true });
    if (isExpanded) {
      console.log('标记分区为展开状态，无需操作');
    } else {
      console.log('标记分区为折叠状态，切换为展开状态');
      await agent.aiHover('侧边栏的标记分组');
      await agent.aiTap('标记右侧的展开箭头图标（向下的箭头v）');
      await agent.aiWaitFor('标记分组下方能看到test标记', { timeout: 5000, deepThink: true });
    }
    await device.pressKey('alt', 'f4');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
  });

  test('1809065-分组折叠-标签悬停鼠标', async ({ device, agent, uos, system }) => {
    // 步骤1: 最大化窗口打开文件管理器
    console.log('步骤1: 最大化窗口打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文件管理器窗口已显示', { timeout: 10000 });

    // 断言1: 侧边栏有标记分组
    console.log('断言1: 侧边栏有标记分组');
    await agent.aiAssert('文件管理器侧边栏有标记分组，能看到test标记', { deepThink: true });
    console.log('断言1通过: 侧边栏有标记分组');

    // 步骤2: 鼠标悬停到标记分区
    console.log('步骤2: 鼠标悬停到标记分区');
    await agent.aiHover('文件管理器侧边栏的标记分区');

    // 断言2: 标记分区右侧显示折叠按钮"^"
    console.log('断言2: 标记分区右侧显示折叠按钮');
    await agent.aiAssert('标记分组右侧显示折叠按钮（向上的箭头^）', { deepThink: true });
    console.log('断言2通过: 折叠按钮显示正确');

    // 步骤3: 点击标记分区右侧的折叠按钮"^"
    console.log('步骤3: 点击标记分区右侧的折叠按钮');
    await agent.aiTap('标记分组右侧的折叠箭头图标（向上的箭头^）');
    await agent.aiWaitFor('标记分组下方不显示test标记', { timeout: 5000, deepThink: true });
    await agent.aiHover('文件管理器侧边栏的标记分组');

    // 断言3: 标记分区右侧显示展开按钮"v"
    console.log('断言3: 标记分组右侧显示展开按钮');
    await agent.aiAssert('标记右侧显示展开按钮（向下的箭头v）', { deepThink: true });
    console.log('断言3通过: 展开按钮显示正确');

  }, { timeout: 600000, tags: ['1809065', 'level2', 'group_collapse', 'hujian'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    // 后置步骤1: 点击标记分区右侧的展开按钮"v"
    console.log('步骤4: 点击标记分区右侧的展开按钮');
    await agent.aiHover('文件管理器侧边栏的标记分组');
    await agent.aiTap('标记分组右侧的展开箭头图标（向下的箭头v）');
    await agent.aiWaitFor('标记分组已展开，test标记已显示', { timeout: 5000, deepThink: true });

    // 后置步骤2: 移除掉所有的标记，删除测试文件
    await agent.aiRightClick(`标记分组下方的test标记`);
    await agent.aiTap('右键菜单中的移除');
    await agent.aiTap('删除确认弹窗中的删除按钮');
    await system.exec('rm -f ~/Documents/1809065te.txt');

    // 后置步骤2: 清理环境
    await common.closeFileManager(system);
    await uos.showDesktop();
  });
});
