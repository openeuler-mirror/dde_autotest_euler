/**
 * 用例 PMSID: 1850167
 * 用例标题: 按文件名、修改时间段、文件大小搜索
 * 生成时间: 2026-04-22 16:30:00
 * 用例编写人: UT000159（游伟）
 */


describe('1850167-按文件名、修改时间段、文件大小搜索', () => {
  const testdir = '~/Downloads/testdir';
  const search_string = 'testfile_1850167';
  const testfile_name = 'testfile_1850167.txt';
  const testfile_name_not_match = 'testfile_not_match_1850167.txt';
  const not_match_time = '1 days ago';
  const testfile_time_not_match = `testfile_1850167_1_days_ago.txt`;
  const not_match_size = "101K"; // 101KB
  const testfile_size_not_match = `testfile_1850167_101K.txt`;

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 关闭文件管理器
    console.log('准备步骤: 关闭文件管理器');
    await system.exec("killall dde-file-manager");

    // 准备步骤: 清理测试文件夹, 防止干扰测试
    console.log('准备步骤: 清理测试文件夹, 防止干扰测试');
    await system.exec(`test -d ${testdir} && rm -rf ${testdir} || true`);

    // 准备步骤: 创建测试文件夹
    console.log('准备步骤: 创建测试文件夹');
    await system.exec(`mkdir -pv ${testdir}`);

    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    // 创建匹配测试文件
    await system.exec(`yes "Hello World!" | head -n 10 > ${testdir}/${testfile_name}`);
    // 创建名称不匹配测试文件
    await system.exec(`yes "Hello World!" | head -n 10 > ${testdir}/${testfile_name_not_match}`);
    // 创建时间不匹配测试文件
    await system.exec(`touch -d "${not_match_time}" ${testdir}/${testfile_time_not_match}`);
    // 创建大小不匹配测试文件
    await system.exec(`fallocate -l ${not_match_size} ${testdir}/${testfile_size_not_match}`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 清理测试文件夹以及测试文件
    console.log('清理步骤: 清理测试文件夹以及测试文件');
    await system.exec(`test -d ${testdir} && rm -rf ${testdir} || true`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec("killall dde-file-manager");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850167-按文件名、修改时间段、文件大小搜索', async ({ device, system, agent, uos }) => {
    // 步骤 1: 打开测试目录
    console.log('步骤 1: 打开测试目录');
    await system.exec(`dde-file-manager ${testdir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件管理器打开 ${testdir.split('/').pop()} 文件夹成功`);

    // 预期 1: 测试目录中包含所有测试文件
    console.log('预期 1: 测试目录中包含所有测试文件');
    await agent.aiAssert(`文件管理器右侧窗口中有4个以${testfile_name.split('_')[0]}文件图标`);


    // 步骤 2: 搜索文件内容
    console.log('步骤 2: 搜索文件内容');
    await device.pressKey('Ctrl', 'F');
    await device.typeText(search_string, true);

    // 预期 2: 搜索结果显示
    console.log('预期 2: 搜索结果显示');
    await agent.aiWaitFor(`搜索结果显示没有${testfile_name_not_match}文件, 有${testfile_name}文件, 有${testfile_time_not_match}文件, 有${testfile_size_not_match}文件`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过

    // 步骤 3: 打开筛选按钮
    console.log('步骤 3: 打开筛选按钮');
    await agent.aiTap(`文件管理器搜索框右边的漏斗形筛选按钮`);
    await agent.aiWaitFor(`筛选菜单已展开, 有搜索范围, 修改时间, 文件大小等选项`);

    // 步骤 4: 按修改时间筛选今天
    console.log('步骤 4: 按修改时间筛选今天');
    await agent.aiTap('筛选菜单中修改时间下拉菜单按钮');
    await agent.aiWaitFor("修改时间下拉菜单已展开");
    await agent.aiTap(`筛选菜单中今天选项`);

    // 预期 4: 筛选结果显示
    console.log('预期 4: 筛选结果显示');
    await agent.aiWaitFor(`搜索结果没有${testfile_time_not_match}文件, 有${testfile_name}文件, 有${testfile_size_not_match}文件`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过

    // 步骤 5: 按文件大小筛选大于100K
    console.log('步骤 5: 按文件大小筛选大于100K');
    await agent.aiTap('筛选菜单中文件大小下拉菜单按钮');
    await agent.aiWaitFor("文件大小下拉菜单已展开");
    await agent.aiTap(`筛选菜单中0~100 KB选项`);

    // 预期 5: 筛选结果显示
    console.log('预期 5: 筛选结果显示');
    await agent.aiWaitFor(`搜索结果没有${testfile_size_not_match}文件, 有${testfile_name}文件`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过

  }, { timeout: 600000, tags: ['1850167', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'search', 'name', 'time', 'size' ] });
});
