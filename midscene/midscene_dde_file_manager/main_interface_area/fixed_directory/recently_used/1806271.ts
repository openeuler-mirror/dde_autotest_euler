/**
 * 用例 PMSID: 1806271
 * 用例标题: 最近使用数据同步-多窗口记录同步
 * 生成时间: 2026-07-15 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806271-最近使用数据同步-多窗口记录同步', () => {
  

  const username = process.env.TEST_USERNAME;
  const caseDir = process.env.TESTCASE_DIR;
  const recentUtil = `${caseDir}midscene_dde_file_manager/main_interface_area/fixed_directory/recently_used/common.ts`;

  const test_file = 'test_1806271.txt';
  const work_dir = `/home/${username}/Desktop/`;
  const test_file_path = `${work_dir}${test_file}`;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤：清理最近使用
    console.log('准备步骤：清理最近使用');
    const { clearRecent } = await import(recentUtil);
    await clearRecent(device, system, agent);

    // 准备步骤: 创建测试文件
    console.log('准备步骤：创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤：清理最近使用
    console.log('清理步骤：清理最近使用');
    const { clearRecent } = await import(recentUtil);
    await clearRecent(device, system, agent);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 如果测试中没有关闭打开文件的程序窗口, 关闭打开文件的程序窗口
    console.log('清理步骤：如果测试中没有关闭打开文件的程序窗口， 关闭打开文件的程序窗口');
    await system.exec(`ps aux | grep ${test_file.slice(0, 10)} | grep -v grep | awk '{print $2}' | xargs kill -15`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  test('1806271-最近使用数据同步-多窗口记录同步', async ({ device, agent, uos, system }) => {
    const { openRecent, confirmIfNeed, showDesktop } = await import(recentUtil);

    const window_count = 3;

    // 步骤 1: 打开${window_count}个最近使用窗口
    console.log(`步骤 1：打开${window_count}个最近使用窗口`);
    for (let i = 0; i < window_count; i++) {
      await openRecent(agent, device, system);
    }

    // 步骤 2: 打开测试文件
    console.log('步骤 2：打开测试文件');
    await showDesktop(agent, device);
    await agent.aiDoubleClick(`桌面上的${test_file}`);
    await agent.aiWaitFor(`文件${test_file}打开成功, 可能只显示部分文件名`);

    // 步骤 3: 关闭打开的应用
    console.log('步骤 3：关闭打开的应用');
    await system.exec(`ps aux | grep ${test_file.slice(0, 10)} | grep -v grep | awk '{print $2}' | xargs kill -15`);
    await agent.aiWaitFor(`没有文件${test_file}被打开`);

    // 预期 4: 打开最近使用窗口中都有${test_file}文件
    console.log('预期 4：最近使用窗口中没有${test_file}文件');
    // 切换${window_count}个最近使用窗口, 并依次断言
    for (let i = 0; i < window_count; i++) {
      await agent.aiTap('任务栏上的文件管理器图标');
      await agent.aiWaitFor('文件管理器最近使用窗口切换成功');
      await device.pressKey('F5');
      await agent.aiAssert(`文件管理器最近使用窗口中有${test_file}文件`);
    }

    // 步骤 5: 右键删除测试文件
    console.log('步骤 5：右键删除测试文件');
    await agent.aiRightClick(`文件管理器最近使用窗口中的${test_file}文件`);
    await agent.aiWaitFor(`文件${test_file}右键菜单已打开`);
    await agent.aiTap(`文件${test_file}右键菜单中的移除选项`);
    await confirmIfNeed(agent);

    // 预期 5: 最近使用窗口中没有${test_file}文件
    console.log('预期 5：最近使用窗口中没有${test_file}文件');
    // 切换${window_count}个最近使用窗口, 并依次断言
    for (let i = 0; i < window_count; i++) {
      await agent.aiTap('任务栏上的文件管理器图标');
      await agent.aiWaitFor('文件管理器最近使用窗口切换成功');
      await device.pressKey('F5');
      await agent.aiAssert(`文件管理器最近使用窗口中没有${test_file}文件`);
    }

  }, { timeout: 600000, tags: ['1806271', 'level3', 'remote', 'DITT', 'youwei', 'file manager', 'dde-file-manager', 'long file name', 'recent', 'recently used'] });
});
