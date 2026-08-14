/**
 * 用例 PMSID: 1850163
 * 用例标题: 文件右键-复制粘贴、剪切粘贴、删除、重命名、压缩
 * 生成时间: 2026-02-09 16:00:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850163-文件右键-复制粘贴、剪切粘贴、删除、重命名、压缩', () => {
  // 测试相关变量定义
  const test_dir = "~/Videos/testdir";
  const tmp_dir = "~/Videos/tmpdir";
  const test_file = "testfile.txt";

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 步骤 1: 清空回收站
    console.log('步骤 1: 清空回收站');
    await system.exec('gio trash --empty');

    // 步骤 2: 创建测试目录${test_dir}和临时目录${tmp_dir}
    console.log(`步骤 2: 创建测试目录${test_dir}和临时目录${tmp_dir}`);
    await system.exec(`mkdir -pv ${test_dir}`);
    await system.exec(`mkdir -pv ${tmp_dir}`);

    // 步骤 3: 打开${test_dir}目录
    console.log(`步骤 3: 打开${test_dir}目录`);
    await system.exec(`dde-file-manager ${test_dir}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${test_dir}目录`);

    // 步骤 4: 最大化文件管理器窗口
    console.log('步骤 4: 最大化文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口填满除任务栏的桌面区域');

    // 步骤 5: 创建测试文件${test_file}和临时文件${tmp_file}
    console.log(`步骤 5: 创建测试文件${test_file}`);
    await system.exec(`yes "Hello World! 你好, 世界!" | head -n 10 > ${test_dir}/${test_file}`);
    await agent.aiWaitFor(`文件管理器窗口有${test_file}`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清空回收站
    console.log('清空回收站');
    await system.exec('gio trash --empty');

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -d ${test_dir} && rm -rf ${test_dir} || true`);
    await system.exec(`test -d ${tmp_dir} && rm -rf ${tmp_dir} || true`);
    await agent.aiWaitFor('文件管理器窗口已清空');

    // 清理步骤: 关闭可能未关闭的归档管理器
    console.log('清理步骤: 关闭可能未关闭的归档管理器');
    await system.exec("ps aux | grep deepin-compressor | grep -v grep | awk '{print $2}' | xargs kill -15");

    // 清理步骤: 恢复文件管理器视图和排序配置文件，并关闭所有文件管理器窗口
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

  test('1850163-文件右键-复制粘贴、剪切粘贴、删除、重命名、压缩_复制粘贴', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右击${test_file}
    console.log(`步骤 1: 右击${test_file}`);
    await agent.aiRightClick(`文件管理器窗口中的${test_file}图标`);
    await agent.aiWaitFor('右击菜单已弹出');

    // 步骤 2: 点击复制
    console.log('步骤 2: 点击复制');
    await agent.aiTap('右击菜单中的复制');

    // 步骤 3: 打开临时目录${tmp_dir}并最大化窗口
    console.log(`步骤 3: 打开临时目录${tmp_dir}并最大化窗口`);
    // 步骤 3-1: 打开临时目录${tmp_dir}
    console.log(`步骤 3-1: 打开临时目录${tmp_dir}`);
    await system.exec(`dde-file-manager ${tmp_dir}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${tmp_dir}目录`);

    // 步骤 3-2: 最大化文件管理器窗口
    console.log('步骤 3-2: 最大化文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口填满除任务栏的桌面区域');

    // 步骤 4: 右击空白区域
    console.log('步骤 4: 右击空白区域');
    await agent.aiRightClick('文件管理器窗口中的空白区域');
    await agent.aiWaitFor('右击菜单已弹出');

    // 步骤 5: 点击粘贴
    console.log('步骤 5: 点击粘贴');
    await agent.aiTap('右击菜单中的粘贴');

    // 预期 5: 已复制${test_file}到${tmp_dir}
    console.log(`预期 5: 已复制${test_file}到${tmp_dir}`);
    await agent.aiAssert(`文件管理器窗口中有${test_file}`);
    const result = await system.exec(`ls ${test_dir}/${test_file}`);
    // await agent.aiAssert(`${result.success}等于true, 表示找到${test_file}`);
    assertTrue(result.success, `有${test_dir}/${test_file}`);

  }, { timeout: 600000, tags: ['1850163', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'copy', 'paste'] });

  test('1850163-文件右键-复制粘贴、剪切粘贴、删除、重命名、压缩_剪切粘贴', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右击${test_file}
    console.log(`步骤 1: 右击${test_file}`);
    await agent.aiRightClick(`文件管理器窗口中的${test_file}图标`);
    await agent.aiWaitFor('右击菜单已弹出');

    // 步骤 2: 点击剪切
    console.log('步骤 2: 点击剪切');
    await agent.aiTap('右击菜单中的剪切');

    // 步骤 3: 打开临时目录${tmp_dir}并最大化窗口
    console.log(`步骤 3: 打开临时目录${tmp_dir}并最大化窗口`);
    // 步骤 3-1: 打开临时目录${tmp_dir}
    console.log(`步骤 3-1: 打开临时目录${tmp_dir}`);
    await system.exec(`dde-file-manager ${tmp_dir}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${tmp_dir}目录`);

    // 步骤 3-2: 最大化文件管理器窗口
    console.log('步骤 3-2: 最大化文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口填满除任务栏的桌面区域');

    // 步骤 4: 右击空白区域
    console.log('步骤 4: 右击空白区域');
    await agent.aiRightClick('文件管理器窗口中的空白区域');
    await agent.aiWaitFor('右击菜单已弹出');

    // 步骤 5: 点击粘贴
    console.log('步骤 5: 点击粘贴');
    await agent.aiTap('右击菜单中的粘贴');

    // 预期 5: 已剪切${test_file}到${tmp_dir}
    console.log(`预期 5: 已剪切${test_file}到${tmp_dir}`);
    await agent.aiAssert(`文件管理器窗口中有${test_file}`);
    const result = await system.exec(`ls ${test_dir}/${test_file}`);
    // await agent.aiAssert(`${result.success}等于false, 表示没有找到${test_dir}/${test_file}`);
    assertFalse(result.success, `没有找到${test_dir}/${test_file}`);

  }, { timeout: 600000, tags: ['1850163', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'cut', 'paste'] });

  test('1850163-文件右键-复制粘贴、剪切粘贴、删除、重命名、压缩_删除', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右击${test_file}
    console.log(`步骤 1: 右击${test_file}`);
    await agent.aiRightClick(`文件管理器窗口中的${test_file}图标`);
    await agent.aiWaitFor('右击菜单已弹出');

    // 步骤 2: 点击删除
    console.log('步骤 2: 点击删除');
    await agent.aiTap('右击菜单中的删除');

    // 预期 2: 已删除${test_file}
    console.log(`预期 2: 已删除${test_file}`);
    await agent.aiAssert(`文件管理器窗口中没有${test_file}`);

    // 步骤 3: 打开回收站并最大化窗口
    console.log('步骤 3: 打开回收站并最大化窗口');
    // 步骤 3-1: 打开回收站
    console.log('步骤 3-1: 打开回收站');
    await system.exec(`dde-file-manager trash:///`);
    await agent.aiWaitFor('文件管理器窗口已打开, 并跳转到回收站目录');

    // 步骤 3-2: 最大化文件管理器窗口
    console.log('步骤 3-2: 最大化文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口填满除任务栏的桌面区域');;

    // 预期 3: 文件管理器窗口中有${test_file}
    console.log(`预期 3: 文件管理器窗口中有${test_file}`);
    await agent.aiAssert(`文件管理器窗口中有${test_file}`);

  }, { timeout: 600000, tags: ['1850163', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'delete'] });

  test('1850163-文件右键-复制粘贴、剪切粘贴、删除、重命名、压缩_重命名', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右击${test_file}
    console.log(`步骤 1: 右击${test_file}`);
    await agent.aiRightClick(`文件管理器窗口中的${test_file}图标`);
    await agent.aiWaitFor('右击菜单已弹出');

    // 步骤 2: 点击重命名
    console.log('步骤 2: 点击重命名');
    await agent.aiTap('右击菜单中的重命名');

    const rename_file = 'rename_file';
    const suffix = test_file.split('.').pop();
    // 步骤 3: 输入新文件名${rename_file}
    console.log(`步骤 3: 输入新文件名${rename_file}`);
    await device.pressKey('Backspace');
    await device.typeText(rename_file);

    // 步骤 4: 点击空白区域
    console.log('步骤 4: 点击空白区域');
    await agent.aiTap('文件管理器窗口中的空白区域');

    // 预期 4: 文件管理器窗口中有${rename_file}.${suffix}
    console.log(`预期 4: 文件管理器窗口中有${rename_file}.${suffix}`);
    await agent.aiAssert(`文件管理器窗口中有${rename_file}.${suffix}`);
    await agent.aiAssert(`文件管理器窗口中没有${test_file}`);

  }, { timeout: 600000, tags: ['1850163', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'rename'] });

  test('1850163-文件右键-复制粘贴、剪切粘贴、删除、重命名、压缩_压缩', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右击${test_file}
    console.log(`步骤 1: 右击${test_file}`);
    await agent.aiRightClick(`文件管理器窗口中的${test_file}图标`);
    await agent.aiWaitFor('右击菜单已弹出');

    // 步骤 2: 点击压缩
    console.log('步骤 2: 点击压缩');
    await agent.aiTap('右击菜单中的压缩');

    // 预期 2: 归档管理器打开
    console.log('预期 2: 归档管理器打开');
    await agent.aiAssert('归档管理器打开');

    // 步骤 3: 点击压缩按钮
    console.log('步骤 3: 点击压缩按钮');
    await agent.aiTap('归档管理器中的压缩按钮');

    // 步骤 4: 关闭归档管理器
    console.log('步骤 4: 关闭归档管理器');
    await system.exec('killall -15 deepin-compressor');
    await agent.aiWaitFor('归档管理器窗口已关闭');

    const filename = test_file.split('.')[0];
    // 预期 4: 压缩完成, 生成${filename}.zip
    console.log(`预期 3: 压缩完成, 生成${filename}.zip`);
    await agent.aiAssert(`文件管理器窗口中有${filename}.zip`); // 归档管理器默认zip格式, 文件名与被压缩文件保持一致

  }, { timeout: 600000, tags: ['1850163', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'compress'] });
});
