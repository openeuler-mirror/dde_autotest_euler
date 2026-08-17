/**
 * 用例 PMSID: 1812103
 * 用例标题: 【计算机】书签组策略和配置文件信息检查
 * 生成时间: 2026-06-09 19:30:00
 * 用例编写人: UT000159（游伟）
 */

const caseDir = process.env.TESTCASE_DIR;
const commonFile = `${caseDir}/midscene_dde_file_manager/main_interface_area/fixed_directory/computer/common.ts`;

describe('1812103-【计算机】书签组策略和配置文件信息检查', () => {
  const username = process.env.TEST_USERNAME;

  const workdir = `/home/${username}/Videos/testdir_1812103`;
  const testdirs = ["A", "B", "C", "D" ]; // 多定义一个目录, 便于后续测试
  // const bookmark_config = "~/.config/deepin/dde-file-manager.json";

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 打开文件管理器窗口
    console.log('准备步骤: 打开文件管理器窗口');
    const {
      openDir,
      rmBookmarks,
    } = await import(commonFile);
    await openDir(agent, system, device, "computer:///");

    // 准备步骤: 移除可能存在的快捷方式
    console.log('准备步骤: 移除可能存在的快捷方式');
    await rmBookmarks(agent, system, device, testdirs);

    // 准备步骤: 删除可能存在的测试文件夹
    console.log('准备步骤: 删除可能存在的测试文件夹');
    await system.exec(`test -d ${workdir} && rm -rf ${workdir} || true`);

    // 准备步骤: 创建测试文件夹
    console.log('准备步骤: 创建测试文件夹');
    await system.exec(`mkdir -p ${workdir}`);
    for (const dir of testdirs) {
      await system.exec(`mkdir -p ${workdir}/${dir}`);
    }
  });

  beforeEach(async ({ uos, env, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 关闭所有文件管理器窗口
    console.log('准备步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');

    // 准备步骤: 打开工作目录${workdir}
    console.log(`准备步骤: 打开工作目录${workdir}`);
    const {
      openDir,
    } = await import(commonFile);
    await openDir(agent, system, device, workdir);
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
    await rmBookmarks(agent, system, device, testdirs);

    // 清理步骤: 删除测试目录
    console.log('清理步骤: 删除测试目录');
    await system.exec(`test -d ${workdir} && rm -rf ${workdir} || true`);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  test('1812103-【计算机】书签组策略和配置文件信息检查', async ({ device, agent, uos, env, system }) => {
    const {
      addDirsToBookmark,
      assertDirsInBookmarkGroupPolicy,
      assertDirsRightInBookmarkConfig,
      rmBookmarks,
    } = await import(commonFile);

    // 步骤 1: 依次将测试文件夹${testdirs}添加到书签
    console.log(`步骤 1: 依次将测试文件夹${testdirs}添加到书签`);
    await addDirsToBookmark(agent, testdirs, workdir);

    // 预期 1-1: 组策略中有${testdirs}目录
    console.log(`预期 1-1: 组策略中有${testdirs}目录`);
    await assertDirsInBookmarkGroupPolicy(assertTrue, system, testdirs, workdir);

    // 预期 1-2: 配置文件中有${testdirs}目录, 且顺序正确
    console.log(`预期 1-2: 配置文件中有${testdirs}目录, 且顺序正确`);
    await assertDirsRightInBookmarkConfig(assertTrue, system, testdirs, workdir);

    // 步骤 2: 移除书签${testdirs[0]}
    console.log(`步骤 2: 移除书签${testdirs[0]}`);
    await rmBookmarks(agent, system, device, testdirs[0]);

    // 预期 2-1: 组策略中没有${testdirs[0]}目录
    console.log(`预期 2-1: 组策略中没有${testdirs[0]}目录`);
    await assertDirsInBookmarkGroupPolicy(assertTrue, system, testdirs.slice(1), workdir);

    // 预期 2-2: 配置文件中没有${testdirs[0]}目录
    console.log(`预期 2-2: 配置文件中没有${testdirs[0]}目录`);
    await assertDirsRightInBookmarkConfig(assertTrue, system, testdirs.slice(1), workdir);

    // 步骤 3: 移除书签${testdirs[1]}和${testdirs[2]}
    console.log(`步骤 3: 移除书签${testdirs[1]}和${testdirs[2]}`);
    await rmBookmarks(agent, system, device, testdirs.slice(1, 3));

    // 预期 3-1: 组策略中没有${testdirs[1]}和${testdirs[2]}目录
    console.log(`预期 3-1: 组策略中没有${testdirs[1]}和${testdirs[2]}目录`);
    await assertDirsInBookmarkGroupPolicy(assertTrue, system, testdirs.slice(3), workdir);

    // 预期 3-2: 配置文件中没有${testdirs[1]}和${testdirs[2]}目录
    console.log(`预期 3-2: 配置文件中没有${testdirs[1]}和${testdirs[2]}目录`);
    await assertDirsRightInBookmarkConfig(assertTrue, system, testdirs.slice(3), workdir);

  }, { timeout: 600000, tags: ['1812103', 'level2', 'main interface area', 'fixed directory', 'computer', 'DITT', 'youwei', 'file-manager', 'bookmark', 'config file', 'group policy'] });
});
