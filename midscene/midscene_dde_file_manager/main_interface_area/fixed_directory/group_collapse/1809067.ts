/**
 * 用例 PMSID: 1809067
 * 用例标题: 分组折叠-标签默认展示
 * 生成时间: 2026-08-20 20:29:31
 * 用例编写人: UT002411（胡戬）
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809067-分组折叠-标签默认展示', () => {
  let common;
  const markUtil = `${caseDir}midscene_dde_file_manager/main_interface_area/fixed_directory/mark/common.ts`;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);

    // 前置条件1: 在文档目录创建一个测试文件1809067te.txt
    console.log('前置条件1: 在文档目录创建测试文件1809067te.txt');
    await system.exec(`touch ~/Documents/1809067te.txt`);

    // 前置条件2: 确保文管中没有文件标记存在，有的话一个个删除然后关闭文管
    console.log('前置条件2: 清理可能存在的标记');
    const { removeAllMarks } = await import(markUtil);
    await removeAllMarks(device, agent, system);
    await system.exec('killall -15 dde-file-manager || true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
  });

  test('1809067-分组折叠-标签默认展示', async ({ device, agent, uos, system }) => {
    // 步骤1: 最大化窗口打开文件管理器
    console.log('步骤1: 最大化窗口打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文件管理器窗口已显示', { timeout: 10000 });

    // 断言1: 侧边栏没有标记分组
    console.log('断言1: 侧边栏没有标记分组');
    await agent.aiAssert('文件管理器侧边栏没有名称为标记的分组', { deepThink: true });
    console.log('断言1通过: 侧边栏没有标记分组');

    // 步骤2: 切换到文档目录，右键点击1809067te.txt，点击右键菜单中的"标记信息"，输入"test"，按enter，再按esc
    console.log('步骤2: 切换到文档目录，右键点击1809067te.txt，点击标记信息，输入test');
    await agent.aiTap('文件管理器侧边栏的文档');
    await agent.aiRightClick('文件管理器右侧内容窗口中的1809067te.txt文件');
    await agent.aiWaitFor('右键菜单已显示', { deepThink: true });
    await agent.aiTap('右键菜单中的标记信息');
    await device.typeText('test', true);
    await device.pressKey('Enter');
    await device.pressKey('Escape');

    // 步骤3: 等待文管侧边栏出现"标记"分组
    console.log('步骤3: 等待文管侧边栏出现标记分组');
    await agent.aiWaitFor('文件管理器侧边栏出现标记分组，能看到test标记', { timeout: 10000, checkIntervalMs: 2000 });

    // 断言2: 侧边栏新增了标记分组，能看到test标记
    console.log('断言2: 侧边栏新增了标记分组，能看到test标记');
    await agent.aiAssert('文件管理器侧边栏新增了名称为标记的分组，分组下能看到test标记', { deepThink: true });
    console.log('断言2通过: 侧边栏有标记分组且能看到test标记');

    // 步骤4: 右键点击test标记，在右键菜单中点击"移除"，弹出彻底删除的确认框，在确认框中点击删除
    console.log('步骤4: 右键点击test标记，点击移除，确认删除');
    await agent.aiRightClick('文件管理器侧边栏标记分组中的test标记');
    await agent.aiTap('右键菜单中的移除');
    await agent.aiWaitFor('出现彻底删除的确认框', { timeout: 5000 });
    await agent.aiTap('确认框中的删除按钮');

    // 断言3: 侧边栏标记分区已被移除
    console.log('断言3: 侧边栏标记分区已被移除');
    await agent.aiAssert('文件管理器侧边栏看不到名称为标记的分组', { deepThink: true });
    console.log('断言3通过: 侧边栏标记分区已被移除');

  }, { timeout: 600000, tags: ['1809067', 'level2', 'group_collapse', 'hujian'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    // 后置步骤1: 删除测试文件
    await system.exec('rm -f ~/Documents/1809067te.txt');
    // 后置步骤2: 清理环境
    await common.closeFileManager(system);
    await uos.showDesktop();
  });
});
