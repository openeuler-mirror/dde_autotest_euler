/**
 * 用例 PMSID: 1850171
 * 用例标题: 文件内容搜索、纯文本文件搜索 
 * 生成时间: 2026-04-23 20:00:30
 * 用例编写人: UT000159（游伟）
 */


describe('1850171-文件内容搜索', () => {

  // 测试相关变量定义
  const test_folder = "1850171";
  const search_string = "提供图形化文件";
  const resource = `http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/${test_folder}.zip`;
  const work_dir = "~/Desktop/"

  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤 : 清理可能存在的测试文件夹${test_folder}以及里边的测试文件, 以免干扰测试
    console.log(`准备步骤 : 清理可能存在的测试文件夹${test_folder}以及里边的测试文件, 以免干扰测试`);
    await system.exec(`test -d ${work_dir}/${test_folder} && rm -rf -v ${work_dir}/${test_folder} || true`);
    await system.exec(`test -f ${work_dir}/${test_folder}.zip && rm -rf -v ${work_dir}/${test_folder}.zip || true`);

    // 准备步骤 : 下载测试文件${test_folder}.zip
    console.log(`准备步骤 : 下载测试文件${test_folder}.zip`);
    await system.exec(`wget -O ${work_dir}/${test_folder}.zip ${resource}`);

    // 准备步骤 : 解压测试文件${test_folder}.zip
    console.log(`准备步骤 : 解压测试文件${test_folder}.zip`);
    await system.exec(`unzip ${work_dir}/${test_folder}.zip -d ${work_dir}`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤 : 清理可能存在的测试文件夹${test_folder}以及里边的测试文件
    console.log(`清理步骤 : 清理可能存在的测试文件夹${test_folder}以及里边的测试文件, 以免干扰测试`);
    await system.exec(`test -d ${work_dir}/${test_folder} && rm -rf -v ${work_dir}/${test_folder} || true`);
    await system.exec(`test -f ${work_dir}/${test_folder}.zip && rm -rf -v ${work_dir}/${test_folder}.zip || true`);

    // 清理步骤 : 关闭所有文件管理器窗口
    console.log('清理步骤 : 关闭所有文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await system.exec('killall dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850171-文件内容搜索', async ({ device, system, agent, uos }) => {
    // 全文搜索默认打开

    // 步骤 1: 打开测试文件夹
    console.log('步骤 1: 打开测试文件夹');
    await system.exec(`dde-file-manager ${work_dir}/${test_folder}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件管理器跳转到测试文件夹${test_folder}`);

    // 步骤 2: 搜索文件内容
    console.log('步骤 2: 搜索文件内容');
    await device.pressKey('Ctrl', 'F');
    await device.typeText(search_string, true);

    // 预期 2: 搜索结果显示
    console.log('预期 2: 搜索结果显示');
    await agent.aiWaitFor(`搜索结果显示包含${search_string}的htm, html, ofd, uof, PDF, txt, xml, sh文件`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过

  }, { timeout: 600000, tags: ['1850171', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'search', 'full text search'] });
});
