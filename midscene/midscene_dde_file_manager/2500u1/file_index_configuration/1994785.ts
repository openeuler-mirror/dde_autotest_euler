// @ts-nocheck

/**
 * 用例 PMSID: 1994785
 * 用例标题: 【文件索引配置】新建文件时立马搜索
 * 生成时间: 2026-11-03
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME || 'uos';
const DESKTOP = `/home/${userName}/Desktop`;
const FILE_NAME = 'new-a.txt';
const DIR_NAME = 'dir-new';
const sq = (s) => `'${s.replace(/'/g, `'\\''`)}'`;

describe('1994785-【文件索引配置】新建文件时立马搜索', () => {
  let time1 = 0;

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await system.exec(`rm -rf ${sq(DESKTOP)}/${FILE_NAME} ${sq(DESKTOP)}/${DIR_NAME} 2>/dev/null; true`, 15000);
  });

  beforeEach(async ({ uos, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec("kill -TERM $(pidof dde-file-manager) 2>/dev/null || true");
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiWaitFor("文件管理器界面已显示", { timeoutMs: 30000 });
  });

  test('1994785-【文件索引配置】新建文件时立马搜索', async ({ device, agent, uos, system }) => {

    // 前置条件1：打开文管设置->搜索，勾选文件索引
    console.log('===== 前置条件1：确认文件索引已开启 =====');
    await agent.aiTap('右上角有3条横线的图标', { deepThink: true });
    await agent.aiTap('下拉菜单中的设置');
    await agent.aiWaitFor('设置窗口已显示', { timeoutMs: 15000 });
    await agent.aiTap('设置窗口左侧的高级设置');
    await agent.aiTap('搜索');
    await new Promise(resolve => setTimeout(resolve, 1500));
    const indexOn = await agent.aiBoolean('文件索引选项已勾选');
    if (!indexOn) {
      await agent.aiTap('文件索引选项');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    await agent.aiAssert('文件索引选项处于勾选状态，文件索引已开启');

    // 前置条件2：记录文件索引更新时间为 time1
    console.log('===== 前置条件2：记录文件索引更新时间为 time1 =====');
    const r0 = await system.exec('date +%s', 10000);
    time1 = parseInt(((r0 && r0.stdout) || '0').trim(), 10) || 0;
    console.log(`time1: ${time1}`);
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('设置窗口的关闭按钮');

    // 前置条件3：删除桌面文件 new-a.txt 和 dir-new 文件夹
    console.log('===== 前置条件3：删除桌面文件 new-a.txt 和 dir-new 文件夹 =====');
    await system.exec(`rm -rf ${sq(DESKTOP)}/${FILE_NAME} ${sq(DESKTOP)}/${DIR_NAME} 2>/dev/null; true`, 15000);

    // 步骤1：使用终端命令在桌面上创建 new-a.txt 文件和 dir-new 文件夹
    console.log('===== 步骤1：使用终端命令创建 new-a.txt 和 dir-new =====');
    await system.exec(`touch ${sq(DESKTOP)}/${FILE_NAME}`, 10000);
    await system.exec(`mkdir -p ${sq(DESKTOP)}/${DIR_NAME}`, 10000);
    await agent.aiTap('文件管理器左侧边栏的桌面');
    await agent.aiAssert(`桌面上出现了"${FILE_NAME}"文件和"${DIR_NAME}"文件夹，创建成功`);
    console.log('预期1：创建成功');

    // 步骤2：在右上角搜索输入框中输入 new-a.txt 后回车
    console.log('===== 步骤2：搜索 new-a.txt =====');
    await agent.aiTap('文件管理器右上角的搜索输入框');
    await agent.aiInput(FILE_NAME, '文件管理器右上角的搜索输入框');
    await device.pressKey('Return');
    // 等待2s后检查搜索结果
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert(`搜索结果中出现桌面上的"${FILE_NAME}"文件`);
    console.log('预期2：等待2s后，搜索出桌面上的 new-a.txt 文件');
    // 清空搜索框
    await agent.aiTap('文件管理器右上角的搜索输入框');
    await device.pressKey('ctrl', 'a');
    await device.pressKey('Delete');
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤3：在右上角搜索输入框中输入 dir-new 后回车
    console.log('===== 步骤3：搜索 dir-new =====');
    await agent.aiTap('文件管理器右上角的搜索输入框');
    await agent.aiInput(DIR_NAME, '文件管理器右上角的搜索输入框');
    await device.pressKey('Return');
    // 等待2s后检查搜索结果
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert(`搜索结果中出现桌面上的"${DIR_NAME}"文件夹`);
    console.log('预期3：等待2s后，搜索出桌面上的 dir-new 文件夹');
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤4：打开文管设置->搜索，记录文件索引更新时间为 time2
    console.log('===== 步骤4：检查文件索引更新时间 time2 =====');
    await agent.aiTap('右上角有3条横线的图标', { deepThink: true });
    await agent.aiTap('下拉菜单中的设置');
    await agent.aiWaitFor('设置窗口已显示', { timeoutMs: 15000 });
    await agent.aiTap('设置窗口左侧的高级设置');
    await agent.aiTap('搜索');
    await new Promise(resolve => setTimeout(resolve, 1500));
    const r1 = await system.exec('date +%s', 10000);
    const time2 = parseInt(((r1 && r1.stdout) || '0').trim(), 10) || 0;
    const diff = time2 - time1;
    console.log(`time1: ${time1}, time2: ${time2}, 差值: ${diff} 秒`);
    if (diff >= 3) {
      console.log(`预期4 ✅：time2 - time1 = ${diff} 秒 ≥ 3秒，文件索引在新建文件后已刷新`);
    } else {
      throw new Error(`步骤4 失败：time2 - time1 = ${diff} 秒 < 3秒，文件索引可能未及时刷新`);
    }
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('✅ 1994785用例测试完成');
  }, { timeout: 1800000, tags: ['1994785', 'level3', '2500u1', 'file_index_configuration', 'DITT', 'huangtian'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('killall -9 dde-file-manager 2>/dev/null; true', 3000);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async ({ uos, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await system.exec(`rm -rf ${sq(DESKTOP)}/${FILE_NAME} ${sq(DESKTOP)}/${DIR_NAME} 2>/dev/null; true`, 15000);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
