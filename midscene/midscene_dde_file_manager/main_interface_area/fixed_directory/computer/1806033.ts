/**
 * 用例 PMSID: 1806033
 * 用例标题: 已存在快捷访问A，在文管侧边栏将快捷访问A重命名为快捷访问B
 * 生成时间: 2026-06-09 19:30:00
 * 用例编写人: UT000159（游伟）
 */

const caseDir = process.env.TESTCASE_DIR;
const commonFile = `${caseDir}/midscene_dde_file_manager/main_interface_area/fixed_directory/computer/common.ts`;

describe('1806033-已存在快捷访问A，在文管侧边栏将快捷访问A重命名为快捷访问B', () => {
  const username = process.env.TEST_USERNAME;

  const workdir = `/home/${username}/Videos/testdir_1806033`;
  const testdir = "A";
  const bookmark = "B";

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const {
      openDir,
      rmBookmarks,
    } = await import(commonFile);

    // 准备步骤: 打开文件管理器窗口
    console.log('准备步骤: 打开文件管理器窗口');
    await openDir(agent, system, device, "computer:///");

    // 准备步骤: 移除可能存在的快捷方式
    console.log('准备步骤: 移除可能存在的快捷方式');
    await rmBookmarks(agent, system, device, [testdir, bookmark]);

    // 准备步骤: 删除可能存在的测试文件夹
    console.log('准备步骤: 删除可能存在的测试文件夹');
    await system.exec(`test -d ${workdir} && rm -rf ${workdir} || true`);

  });

  beforeEach(async ({ uos, env, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 关闭所有文件管理器窗口
    console.log('准备步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');

    // 准备步骤: 创建测试文件夹
    console.log('准备步骤: 创建测试文件夹');
    await system.exec(`mkdir -p ${workdir}`);
    await system.exec(`mkdir -p ${workdir}/${testdir}`);
  });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  
  afterAll(async ({ uos, agent, device, env, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 按Esc关闭可能未关闭的右击菜单
    console.log('清理步骤: 按Esc关闭可能未关闭的右击菜单');
    await device.pressKey('Esc');

    // 清理步骤: 删除所有的标签
    console.log('清理步骤: 删除所有的标签');
    const {
      rmBookmarks,
    } = await import(commonFile);
    await rmBookmarks(agent, system, device, bookmark);

    // 清理步骤: 删除测试目录
    console.log('清理步骤: 删除测试目录');
    await system.exec(`test -d ${workdir} && rm -rf ${workdir} || true`);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  test('1806033-已存在快捷访问A，在文管侧边栏将快捷访问A重命名为快捷访问B', async ({ device, agent, uos, env, system }) => {
    const {
      openDir,
      addDirsToBookmark,
      renameDirsInBookmark,
      assertDirsRightInBookmarkConfig,
      assertDirsInBookmarkGroupPolicy,
    } = await import(commonFile);
    // 步骤 1: 打开工作目录${workdir}
    console.log(`步骤 1: 打开工作目录${workdir}`)
    await openDir(agent, system, device, workdir);

    // 步骤 2: 添加${testdir}到快捷访问
    console.log(`步骤 2: 添加${testdir}到快捷访问`)
    await addDirsToBookmark(agent, testdir, workdir);

    // 步骤 3: 修改${testdir}为${bookmark}
    console.log(`步骤 3: 修改${testdir}为${bookmark}`)
    await renameDirsInBookmark(assertTrue, agent, system, device, testdir, bookmark);

    // 预期 3-1: 组策略中name值是${bookmark}
    console.log(`预期 3-1: 组策略中name值是${bookmark}`)
    await assertDirsInBookmarkGroupPolicy(assertTrue, system, testdir, workdir, bookmark);

    // 预期 3-2: 配置文件中name值是${bookmark}
    console.log(`预期 3-2: 配置文件中name值是${bookmark}`)
    await assertDirsRightInBookmarkConfig(assertTrue, system, testdir, workdir, bookmark);

  }, { timeout: 600000, tags: ['1806033', 'level2', 'main interface area', 'fixed directory', 'computer', 'DITT', 'youwei', 'file-manager', 'bookmark', 'rename'] });
});
