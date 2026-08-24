/**
 * 用例 PMSID: 1811417
 * 用例标题:  [t]保险箱文件右键菜单-去除“在终端中打开”
 * 生成时间: 2026-05-11 16:30:00
 * 用例编写人: UT000159（游伟）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811417-【t】保险箱文件右键菜单-去除“在终端中打开”', () => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  // const encryption_key = 'Uos123!!';

  const vault_unlocked = `/home/${username}/.config/Vault/vault_unlocked`;
  const test_dirs = ["testdir_1911471_0", "testdir_1911471_1", "testdir_1911471_2"];
  const search_string = "testdir";
  const test_files = ["testfile_1811417_0.txt", "testfile_1811417_1.txt", "testfile_1811417_2.txt"];

  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const { createNoPasswordVault, clearEnvironment, rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 恢复部分文管设置到默认值
    console.log('准备步骤: 恢复部分文管设置到默认值');
    await clearEnvironment(system);

    // 准备步骤: 删除保险箱
    console.log('准备步骤: 删除保险箱');
    await rmVault(system);

    // 准备步骤: 创建保险箱
    console.log('准备步骤: 创建保险箱');
    await createNoPasswordVault(uos, env, agent, device, system);

    // 准备步骤: 创建测试文件夹
    console.log('准备步骤: 创建测试文件夹');
    for(let test_dir of test_dirs){
      await system.exec(`mkdir -pv ${vault_unlocked}/${test_dir}`);
    };

    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    for(let test_file of test_files){
      await system.exec(`yes "Hello World" | head -n 10 | tee -a ${vault_unlocked}/${test_file}`);
    }
  });

  beforeEach(async ({ uos, env, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 关闭所有文件管理器窗口
    console.log('准备步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');

    // 准备步骤: 打开文件管理器
    console.log('准备步骤: 打开文件管理器');
    await system.exec(`dde-file-manager`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor("文件管理器窗口已打开");

    // 准备步骤: 打开保险箱
    console.log('准备步骤: 打开保险箱');
    await agent.aiTap('侧边栏中的保险箱');
    await agent.aiWaitFor('左侧边栏显示当前目录为保险箱');
  });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 释放所有按键
    console.log('清理步骤: 释放所有按键');
    await device.releaseAllKeys();

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  afterAll(async ({ uos, agent, device, env, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 按Esc关闭可能未关闭的右击菜单
    console.log('清理步骤: 按Esc关闭可能未关闭的右击菜单');
    await device.pressKey('Esc');

    // 清理步骤: 删除保险箱
    console.log('清理步骤: 删除保险箱');
    const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 删除保险箱
    await rmVault(system);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  test('1811417-【t】保险箱文件右键菜单-去除“在终端中打开”_文件夹右键', async ({ device, agent, uos, env, system }) => {
    // 步骤 1: 右击文件管理器右侧内容窗口中文件夹${testdirs[0]}图标
    console.log(`步骤 1: 右击文件管理器右侧内容窗口中文件夹${test_dirs[0]}图标`);
    await agent.aiRightClick(`文件管理器右侧内容窗口中文件夹${test_dirs[0]}图标`);
    await agent.aiWaitFor('右击菜单打开');

    // 预期 1: 右键菜单中没有“在终端中打开”选项
    console.log('预期 1: 右键菜单中没有“在终端中打开”选项');
    await agent.aiAssert('右键菜单中没有“在终端中打开”选项');

  }, { timeout: 600000, tags: ['1811417','level2', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'right-click menu', 'terminal', 'no open in terminal', 'folder'] });

  test('1811417-【t】保险箱文件右键菜单-去除“在终端中打开”_多文件夹右键', async ({ device, agent, uos, env, system }) => {
    // 步骤 1: 使用ctrl键连续选中文件管理器右侧内容窗口中文件夹${testdirs[0]}和${testdirs[1]}图标
    console.log(`步骤 1: 使用ctrl键连续选中文件管理器右侧内容窗口中文件夹${test_dirs[0]}和${test_dirs[1]}图标`);
    await device.keyDown('Control');
    await agent.aiTap(`文件管理器右侧内容窗口中文件夹${test_dirs[0]}图标`);
    await agent.aiWaitFor(`文件夹${test_dirs[0]}已选中`);
    await agent.aiTap(`文件管理器右侧内容窗口中文件夹${test_dirs[1]}图标`);
    await device.keyUp('Control');
    await agent.aiWaitFor(`文件夹${test_dirs[0]}和${test_dirs[1]}已选中`);

    // 步骤 2: 右击文件管理器右侧内容窗口中${testdirs[1]}图标
    console.log(`步骤 2: 右击文件管理器右侧内容窗口中文件夹${test_dirs[1]}图标`);
    await agent.aiRightClick(`文件管理器右侧内容窗口中文件夹${test_dirs[1]}图标`);
    await agent.aiWaitFor('右击菜单打开');

    // 预期 2: 右键菜单中没有“在终端中打开”选项
    console.log('预期 2: 右键菜单中没有“在终端中打开”选项');
    await agent.aiAssert('右键菜单中没有“在终端中打开”选项');

  }, { timeout: 600000, tags: ['1811417','level2', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'right-click menu', 'terminal', 'no open in terminal', 'folder', 'multiple folders'] });

  test('1811417-【t】保险箱文件右键菜单-去除“在终端中打开”_文件右键', async ({ device, agent, uos, env, system }) => {
    // 步骤 1: 文件管理器右侧内容窗口中文件${test_files[0]}
    console.log(`步骤 1: 文件管理器右侧内容窗口中文件${test_files[0]}`);
    await agent.aiRightClick(`文件管理器右侧内容窗口中文件${test_files[0]}`);
    await agent.aiWaitFor('右击菜单打开');

    // 预期 1: 右键菜单中没有“在终端中打开”选项
    console.log('预期 1: 右键菜单中没有“在终端中打开”选项');
    await agent.aiAssert('右键菜单中没有“在终端中打开”选项');

  }, { timeout: 600000, tags: ['1811417','level2', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'right-click menu', 'terminal', 'no open in terminal', 'file'] });

  test('1811417-【t】保险箱文件右键菜单-去除“在终端中打开”_多文件右键', async ({ device, agent, uos, env, system }) => {
    // 步骤 1: 使用ctrl键连续选中文件管理器右侧内容窗口中文件${test_files[0]}和${test_files[1]}
    console.log(`步骤 1: 使用ctrl键连续选中文件管理器右侧内容窗口中文件${test_files[0]}和${test_files[1]}`);
    await device.keyDown('Control');
    await agent.aiTap(`文件管理器右侧内容窗口中文件${test_files[0]}图标`);
    await agent.aiWaitFor(`文件${test_files[0]}已选中`);
    await agent.aiTap(`文件管理器右侧内容窗口中文件${test_files[1]}图标`);
    await device.keyUp('Control');
    await agent.aiWaitFor(`文件${test_files[0]}和${test_files[1]}已选中`);

    // 步骤 2: 文件管理器右侧内容窗口中文件${test_files[1]}
    console.log(`步骤 2: 文件管理器右侧内容窗口中文件${test_files[1]}`);
    await agent.aiRightClick(`文件管理器右侧内容窗口中文件${test_files[1]}`);
    await agent.aiWaitFor('右击菜单打开');

    // 预期 1: 右键菜单中没有“在终端中打开”选项
    console.log('预期 1: 右键菜单中没有“在终端中打开”选项');
    await agent.aiAssert('右键菜单中没有“在终端中打开”选项');

  }, { timeout: 600000, tags: ['1811417','level2', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'right-click menu', 'terminal', 'no open in terminal', 'file', 'multiple files'] });

  test('1811417-【t】保险箱文件右键菜单-去除“在终端中打开”_空白处右键', async ({ device, agent, uos, env, system }) => {
    // 步骤 1: 文件管理器右侧内容窗口中空白处
    console.log(`步骤 1: 文件管理器右侧内容窗口中空白处`);
    await agent.aiRightClick('文件管理器右侧内容窗口中空白处');
    await agent.aiWaitFor('右击菜单打开');

    // 预期 1: 右键菜单中没有“在终端中打开”选项
    console.log('预期 1: 右键菜单中没有“在终端中打开”选项');
    await agent.aiAssert('右键菜单中没有“在终端中打开”选项');

  }, { timeout: 600000, tags: ['1811417','level2', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'right-click menu', 'terminal', 'no open in terminal', 'blank'] });

  test('1811417-【t】保险箱文件右键菜单-去除“在终端中打开”_搜索结果文件夹右键', async ({ device, agent, uos, env, system }) => {
    // 步骤 1: 搜索${search_string}
    console.log(`步骤 1: 搜索${search_string}`);
    await device.pressKey('LeftControl', 'F');
    await device.typeText(search_string, true);
    await agent.aiWaitFor(`搜索结果中有文件夹${test_dirs[0]}, 文件夹${test_dirs[1]}和文件夹${test_dirs[2]}`);

    // 步骤 2: 右击文件管理器右侧内容窗口中文件夹${test_dirs[0]}图标
    console.log(`步骤 2: 右击文件管理器右侧内容窗口中文件夹${test_dirs[0]}图标`);
    await agent.aiRightClick(`文件管理器右侧内容窗口中文件夹${test_dirs[0]}图标`);
    await agent.aiWaitFor('右击菜单打开');

    // 预期 2: 右键菜单中没有“在终端中打开”选项
    console.log('预期 1: 右键菜单中没有“在终端中打开”选项');
    await agent.aiAssert('右键菜单中没有“在终端中打开”选项');

  }, { timeout: 600000, tags: ['1811417','level2', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'right-click menu', 'terminal', 'no open in terminal', 'folder', 'search'] });

  test('1811417-【t】保险箱文件右键菜单-去除“在终端中打开”_搜索结果多文件夹右键', async ({ device, agent, uos, env, system }) => {
    // 步骤 1: 搜索${search_string}
    console.log(`步骤 1: 搜索${search_string}`);
    await device.pressKey('LeftControl', 'F');
    await device.typeText(search_string, true);
    await agent.aiWaitFor(`搜索结果中有文件夹${test_dirs[0]}, 文件夹${test_dirs[1]}和文件夹${test_dirs[2]}`);

    // 步骤 2: 使用ctrl键连续选中文件管理器右侧内容窗口中文件夹${testdirs[0]}和${testdirs[1]}图标
    console.log(`步骤 2: 使用ctrl键连续选中文件管理器右侧内容窗口中文件夹${test_dirs[0]}和${test_dirs[1]}图标`);
    await device.keyDown('Control');
    await agent.aiTap(`文件管理器右侧内容窗口中文件夹${test_dirs[0]}图标`);
    await agent.aiWaitFor(`文件夹${test_dirs[0]}已选中`);
    await agent.aiTap(`文件管理器右侧内容窗口中文件夹${test_dirs[1]}图标`);
    await device.keyUp('Control');
    await agent.aiWaitFor(`文件夹${test_dirs[0]}和${test_dirs[1]}已选中`);

    // 步骤 3: 右击文件管理器右侧内容窗口中${testdirs[1]}图标
    console.log(`步骤 3: 右击文件管理器右侧内容窗口中文件夹${test_dirs[1]}图标`);
    await agent.aiRightClick(`文件管理器右侧内容窗口中文件夹${test_dirs[1]}图标`);
    await agent.aiWaitFor('右击菜单打开');

    // 预期 3: 右键菜单中没有“在终端中打开”选项
    console.log('预期 3: 右键菜单中没有“在终端中打开”选项');
    await agent.aiAssert('右键菜单中没有“在终端中打开”选项');

  }, { timeout: 600000, tags: ['1811417','level2', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'right-click menu', 'terminal', 'no open in terminal', 'folder', 'multiple folders', 'search'] });
});