/**
 * 用例 PMSID: 1850153
 * 用例标题: 图标展示、列表展示
 * 生成时间: 2026-01-26 15:30:00
 * 用例编写人: UT000159（游伟）
 */

let test_dir = "~/Videos/testdir";
let sub_dirs = [
    "subdir0",
    "subdir1",
    "subdir2",
]

let test_files = [
  'testfile0.txt',
  'testfile1.txt',
  'testfile2.txt'
];

describe('1850153-图标展示、列表展示', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建测试文件夹和测试文件
    await system.exec(`mkdir -pv ${test_dir}`);

    for (const dir of sub_dirs) {
      await system.exec(`mkdir -pv ${test_dir}/${dir}/${dir}`);
    }

    for (const file of test_files) {
      await system.exec(`echo ${file} > ${test_dir}/${file}`);
    }
  });

  test('1850153-图标展示', async ({ device, system, agent, uos }) => {
    // 步骤 1: 打开测试目录${test_dir}并最大化
    console.log(`步骤 1: 打开测试目录${test_dir}并最大化`);
    // 步骤 1-1: 打开测试目录${test_dir}
    console.log(`步骤 1-1: 打开测试目录${test_dir}`);
    await system.exec(`dde-file-manager ${test_dir}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${test_dir}目录`);

    // 步骤 1-2: 最大化文件管理器窗口
    console.log('步骤 2: 最大化文件管理器窗口');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口已铺满除任务栏外的整个桌面');

    // 预期 1: 有${test_files[0]}, ${test_files[1]}, ${test_files[2]}三个文件和${sub_dirs[0]}, ${sub_dirs[1]}, ${sub_dirs[2]}三个子文件夹
    console.log(`预期 1-1: 有${test_files.length}个文件和${sub_dirs.length}个子文件夹`);
    await agent.aiAssert(`右侧窗口有${test_files.length}个文件和${sub_dirs.length}个子文件夹`);

    // 预期 1: 文件以图标方式展示
    console.log('预期 1: 文件以图标方式展示');
    await agent.aiAssert('右侧窗口中文件以图标方式展示');

    // 步骤 2: 点击顶部的列表视图按钮
    console.log('步骤 2: 点击顶部的列表视图按钮');
    await agent.aiTap('顶部的列表视图按钮', { deepThink: true });
    await agent.aiWaitFor('文件和文件夹以列表方式展示');

    // 预期 2: 文件和文件夹以列表方式展示
    console.log('预期 2: 文件和文件夹以列表方式展示');
    await agent.aiAssert('右侧窗口中文件和文件夹以列表方式展示');

    // 步骤 3: 点击顶部的树形视图按钮
    console.log('步骤 3: 点击顶部的列表视图按钮右边的树形视图按钮');
    await agent.aiTap('顶部的列表视图按钮右边的树形视图按钮', { deepThink: true });
    await agent.aiWaitFor('文件夹左边有>号, 其余文件以列表方式展示, 代表文件以树形方式展示');

    // 预期 3: 文件和文件夹以树形方式展示
    console.log('预期 3: 文件和文件夹以树形方式展示');
    await agent.aiAssert('文件夹左边有>号, 其余文件以列表方式展示, 代表文件以树形方式展示');

    // 步骤 4: 点击顶部的图标视图按钮
    console.log('步骤 4: 点击顶部的图标视图按钮');
    await agent.aiTap('顶部的图标视图按钮', { deepThink: true });
    await agent.aiWaitFor('文件以图标方式展示');

    // 预期 4: 文件以图标方式展示
    console.log('预期 4: 文件以图标方式展示');
    await agent.aiAssert('右侧窗口中文件以图标方式展示');

  }, { timeout: 600000, tags: ['1850153', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'view', 'icon view', 'list view', 'tree view'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
     await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 删除测试文件夹
    console.log('删除测试文件夹');
    let re = await system.exec(`rm -rf -v ${test_dir}`);
    if (re.success) {
      console.log(`测试文件夹 ${test_dir} 已删除`);
    } else {
      console.log(`测试文件夹 ${test_dir} 删除失败`);
    }

    // 清除视图和排序配置
    console.log('清除视图和排序配置');
    re = await system.exec("echo > ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    if (re.success) {
      console.log('清除文件恢复成功');
    } else {
      console.log('清除文件恢复失败');
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
