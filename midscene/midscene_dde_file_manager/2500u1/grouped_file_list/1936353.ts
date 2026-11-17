/**
 * 用例 PMSID: 1936353
 * 用例标题: 【文件列表支持分组】分组功能入口
 * 生成时间: 2026-07-16
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1936353-【文件列表支持分组】分组功能入口', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });

  test('1936353-【文件列表支持分组】分组功能入口', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文管，进入数据盘，点击标题栏中排序方式，检查最后一个选项是否有分组方式
    console.log('===== 步骤1：打开文管，进入数据盘，点击排序方式检查分组方式入口 =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 进入数据盘
    await agent.aiTap('文件管理器侧边栏的数据盘');
    await agent.aiWaitFor('数据盘页面已打开', { timeout: 5000 });

    // 点击标题栏中排序方式
    await agent.aiTap('标题栏中的排序方式右侧的下拉菜单按钮',{deepthink:true});
    await agent.aiWaitFor('排序方式下拉菜单已显示', { timeout: 3000 });

    // 预期1：最后一个选项有分组方式
    console.log('预期1：排序方式下拉菜单最后一个选项有分组方式');
    await agent.aiAssert('排序方式下拉菜单的最后一个选项是分组方式');

    // 步骤2：点击分组方式选项，检查是否有如下6个子菜单：无，名称，修改时间，创建时间，大小，类型
    console.log('===== 步骤2：点击分组方式，查看6个子菜单 =====');
    await agent.aiTap('分组方式');
    await agent.aiWaitFor('分组方式子菜单已显示', { timeout: 3000 });

    // 预期2：有6个子菜单：无，名称，修改时间，创建时间，大小，类型，默认勾选"无"
    console.log('预期2：分组方式子菜单显示6个选项，默认勾选无');
    await agent.aiAssert('分组方式子菜单中有无、名称、修改时间、创建时间、大小、类型共6个选项');
    await agent.aiAssert('分组方式子菜单中没有选项被勾选');

    // 关闭排序方式下拉菜单
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('Esc');

    // 步骤3：右键文管空白处，检查排序方式下方是否有分组方式，且有6个子菜单
    console.log('===== 步骤3：右键空白处，检查排序方式下方有分组方式 =====');
    await agent.aiRightClick('文件管理器内容区域空白处');
    await agent.aiWaitFor('右键菜单已显示', { timeout: 3000 });

    // 预期3：排序方式下方有分组方式，且有6个子菜单：无，名称，修改时间，创建时间，大小，类型，默认勾选"无"
    console.log('预期3：右键菜单中排序方式下方有分组方式，且有6个子菜单');
    await agent.aiAssert('右键菜单中排序方式下方有分组方式选项');
    await agent.aiHover('右键菜单中的分组方式');
    await agent.aiWaitFor('分组方式子菜单已显示', { timeout: 3000 });
    await agent.aiAssert('分组方式子菜单中有无、名称、修改时间、创建时间、大小、类型共6个选项');
    await agent.aiAssert('分组方式子菜单中选项默认勾选的选项为“无”');

    // 关闭右键菜单
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936353', 'level4', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});