/**
 * 用例 PMSID: 1850185
 * 用例标题: 支持右键选单进行复制、剪切和粘贴文件
 * 生成时间: 2026-02-28 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850185-支持右键选单进行复制、剪切和粘贴文件', () => {

  // 测试相关变量定义
  const test_file_name = "testfile";
  const suffix = ".txt";
  const test_file = test_file_name + suffix;
  const copied_file = test_file_name + '（副本）' + suffix;
  const test_dir = "~/Videos/testdir";

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 创建测试文件${test_file}
    console.log(`准备步骤: 创建测试文件${test_file}`);
    await system.exec(`touch ~/Desktop/${test_file}`);

    // 准备步骤: 创建测试文件夹${test_dir}
    console.log(`准备步骤: 创建测试文件夹${test_dir}`);
    await system.exec(`mkdir -pv ${test_dir}`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 删除测试文件${test_file}和副本文件${copied_file}
    console.log(`清理步骤 : 清理测试文件${test_file}和副本文件${copied_file}`);
    await system.exec(`test -f ~/Desktop/${test_file} && rm -v ~/Desktop/${test_file}`);
    await system.exec(`test -f ~/Desktop/${copied_file} && rm -v ~/Desktop/${copied_file}`);

    // 清理步骤: 删除测试文件夹${test_dir}
    console.log(`清理步骤 : 清理测试文件夹${test_dir}`);
    await system.exec(`test -d ${test_dir} && rm -rf -v ${test_dir}`);

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

  test('1850185-支持右键选单进行复制、剪切和粘贴文件_复制', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右击测试文件${test_file}, 点击复制
    console.log(`步骤 1: 右击测试文件${test_file}, 点击复制`);
    await agent.aiRightClick(`文件${test_file}`);
    await agent.aiWaitFor('文件右击菜单已打开');
    await agent.aiTap('复制');

    // 步骤 2: 右击桌面空白位置, 点击粘贴
    console.log(`步骤 2: 右击桌面空白位置, 点击粘贴`);
    await agent.aiRightClick('桌面空白位置');
    await agent.aiWaitFor('右击菜单已打开');
    await agent.aiTap('粘贴');

    // 预期 2: 桌面上有复制的文件${copied_file}
    console.log(`预期 2: 桌面上有复制的文件${copied_file}`);
    await agent.aiAssert(`桌面上有复制的文件${copied_file}`);

  }, { timeout: 600000, tags: ['1850185', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'copy', 'paste'] });

  test('1850185-支持右键选单进行复制、剪切和粘贴文件_剪切', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右击测试文件${test_file}, 点击剪切
    console.log(`步骤 1: 右击测试文件${test_file}, 点击剪切`);
    await agent.aiRightClick(`文件${test_file}`);
    await agent.aiWaitFor('文件右击菜单已打开');
    await agent.aiTap('剪切');

    // 步骤 2: 打开测试文件夹${test_dir}, 并最大化
    console.log(`步骤 2: 打开测试文件夹${test_dir}, 并最大化`);
    await system.exec(`dde-file-manager ${test_dir}`);
    await agent.aiWaitFor(`文件管理器已打开, 并跳转到测试文件夹${test_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口已铺满除任务栏外的整个桌面');

    // 步骤 3: 右击文件管理器右边空白位置, 点击粘贴
    console.log(`步骤 3: 右击文件管理器右边空白位置, 点击粘贴`);
    await agent.aiRightClick('文件管理器右边空白位置');
    await agent.aiWaitFor('右击菜单已打开');
    await agent.aiTap('粘贴');

    // 预期 3: 测试文件夹${test_dir}右侧窗口有文件${test_file}
    console.log(`预期 3: 测试文件夹${test_dir}右侧窗口有文件${test_file}`);
    await agent.aiAssert(`测试文件夹${test_dir}右侧窗口有文件${test_file}`);

    // 步骤 4: 关闭文件管理器窗口
    console.log('步骤 4: 关闭文件管理器窗口');
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 预期 4: 桌面上没有测试文件${test_file}
    console.log(`预期 4: 桌面上没有测试文件${test_file}`);
    await agent.aiAssert(`桌面上没有测试文件${test_file}`);

  }, { timeout: 600000, tags: ['1850185', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'cut', 'paste'] });
});
