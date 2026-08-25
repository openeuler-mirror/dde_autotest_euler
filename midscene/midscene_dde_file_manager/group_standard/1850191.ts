/**
 * 用例 PMSID: 1850191
 * 用例标题: 显示文件夹、文本文档、压缩文件图标
 * 生成时间: 2026-04-17 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850191-显示文件夹、文本文档、压缩文件图标', () => {

  // 测试相关变量定义
  const work_dir = "~/Desktop/";

  const test_folder = "testdir_1850191";
  const test_file = "testfile_1850191.txt";
  const test_zip = "testzip_1850191.zip";

  const test_folder_path = work_dir + test_folder;
  const test_file_path = work_dir + test_file;
  const test_zip_path = work_dir + test_zip;

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 测试前清理桌面文件, 避免之前测试影响
    // 准备步骤: 删除测试文件夹${test_folder}, 文件${test_file}和压缩文件${test_zip}
    console.log(`准备步骤 : 清理测试文件夹${test_folder}, 文件${test_file}和压缩文件${test_zip}`);
    await system.exec(`test -d ${test_folder_path} && rm -rf ${test_folder_path} | true`);
    await system.exec(`test -f ${test_file_path} && rm -v ${test_file_path} | true`);
    await system.exec(`test -f ${test_zip_path} && rm -v ${test_zip_path} | true`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 删除测试文件夹${test_folder}, 文件${test_file}和压缩文件${test_zip}
    console.log(`清理步骤 : 清理测试文件夹${test_folder}, 文件${test_file}和压缩文件${test_zip}`);
    await system.exec(`test -d ${test_folder_path} && rm -rf ${test_folder_path} | true`);
    await system.exec(`test -f ${test_file_path} && rm -v ${test_file_path} | true`);
    await system.exec(`test -f ${test_zip_path} && rm -v ${test_zip_path} | true`);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850191-显示文件夹、文本文档、压缩文件图标_文件夹', async ({ device, system, agent, uos }) => {
    // 步骤 1: 创建测试文件夹${test_folder}
    console.log(`步骤 1: 创建测试文件夹${test_folder}`);
    await system.exec(`mkdir ${test_folder_path}`);

    // 预期 1: 桌面显示文件夹${test_folder}图标
    console.log(`预期 1: 桌面显示文件夹${test_folder}图标`);
    await agent.aiAssert(`桌面显示文件夹${test_folder}图标`);

  }, { timeout: 600000, tags: ['1850191', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'desktop', 'folder', 'icon'] });

  test('1850191-显示文件夹、文本文档、压缩文件图标_文本文档', async ({ device, system, agent, uos }) => {
    // 步骤 1: 创建测试文本文档${test_file}
    console.log(`步骤 1: 创建测试文本文档${test_file}`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);

    // 预期 1: 桌面显示文本文档${test_file}图标
    console.log(`预期 1: 桌面显示文本文档${test_file}图标`);
    await agent.aiAssert(`桌面显示文本文档${test_file}图标`);

  }, { timeout: 600000, tags: ['1850191', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'desktop', 'txt', 'icon'] });

  test('1850191-显示文件夹、文本文档、压缩文件图标_压缩文件', async ({ device, system, agent, uos }) => {
    // 步骤 1: 创建测试压缩文件${test_zip}
    console.log(`步骤 1: 创建测试压缩文件${test_zip}`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);
    await system.exec(`zip ${test_zip_path} ${test_file_path}`);

    // 预期 1: 桌面显示压缩文件${test_zip}图标
    console.log(`预期 1: 桌面显示压缩文件${test_zip}图标`);
    await agent.aiAssert(`桌面显示压缩文件${test_zip}图标`);

  }, { timeout: 600000, tags: ['1850191', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'desktop', 'zip', 'icon'] });
});
