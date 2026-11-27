/**
 * 用例 PMSID: 1812201
 * 用例标题: 长文件名功能 - 最近使用，文件右键移除
 * 生成时间: 2026-07-10 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1812201-长文件名功能 - 最近使用，文件右键移除', () => {
  

  const username = process.env.TEST_USERNAME;
  const caseDir = process.env.TESTCASE_DIR;
  const recentUtil = `${caseDir}midscene_dde_file_manager/main_interface_area/fixed_directory/recently_used/common.ts`;

  const test_file = 'test_1812201_abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd.txt';
  const work_dir = `/home/${username}/Desktop/`;
  const test_file_path = `${work_dir}${test_file}`;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 开启长文件名功能
    console.log('准备步骤：开启长文件名功能');
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

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

    // 清理步骤: 如果测试中没有关闭打开文件的程序窗口, 关闭打开文件的程序窗口
    console.log('清理步骤：如果测试中没有关闭打开文件的程序窗口， 关闭打开文件的程序窗口');
    await system.exec(`ps aux | grep ${test_file.slice(0, 10)} | grep -v grep | awk '{print $2}' | xargs kill -15`);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

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

  test('1812201-长文件名功能 - 最近使用，文件右键移除', async ({ device, agent, uos, system }) => {
    const { openRecent, confirmIfNeed } = await import(recentUtil);

    // 步骤 1: 打开测试文件
    console.log('步骤 1：打开测试文件');
    await agent.aiDoubleClick(`桌面上的${test_file}`);
    await agent.aiWaitFor(`文件${test_file}打开成功, 可能只显示部分文件名`);

    // 步骤 2: 关闭打开的应用
    console.log('步骤 2：关闭打开的应用');
    await system.exec(`ps aux | grep ${test_file.slice(0, 10)} | grep -v grep | awk '{print $2}' | xargs kill -15`);
    await agent.aiWaitFor(`没有文件${test_file}被打开`);

    // 步骤 3: 打开文件管理器最近使用窗口
    console.log('步骤 3：打开文件管理器最近使用窗口');
    await openRecent(agent, device, system);

    // 步骤 4: 右键删除测试文件
    console.log('步骤 4：右键删除测试文件');
    await agent.aiRightClick(`文件管理器最近使用窗口中的${test_file}文件`);
    await agent.aiWaitFor(`文件${test_file}右键菜单已打开`);
    await agent.aiTap(`文件${test_file}右键菜单中的移除选项`);
    await confirmIfNeed(agent);

    // 预期 4: 最近使用窗口中没有${test_file}文件
    console.log('预期 4：最近使用窗口中没有${test_file}文件');
    await openRecent(agent, device, system);
    await agent.aiAssert(`文件管理器最近使用窗口中没有${test_file}文件`);

  }, { timeout: 600000, tags: ['1812201', 'level3', 'remote', 'DITT', 'youwei', 'file manager', 'dde-file-manager', 'long file name', 'recent', 'recently used'] });
});
