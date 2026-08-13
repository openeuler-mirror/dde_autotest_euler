/**
 * 用例 PMSID: 1850155
 * 用例标题: 新建文档、新建文件夹、创建快捷方式
 * 生成时间: 2026-01-30 16:00:00
 * 用例编写人: UT000159（游伟）
 */

const test_dir = '~/Videos/testdir';

describe('1850155-新建文档、新建文件夹、创建快捷方式', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 步骤 1: 创建测试文件夹并打开
    console.log(`步骤 1: 创建并打开测试文件夹${test_dir}`);
    await system.exec(`mkdir -pv ${test_dir}`);
    await system.exec(`dde-file-manager ${test_dir}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${test_dir}目录`);

    // 步骤 2: 最大化文件管理器窗口
    console.log('步骤 2: 最大化文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口已铺满除任务栏外的整个桌面');
  });

  test('1850155-新建文档、新建文件夹、创建快捷方式', async ({ device, agent, uos, system }) => {
    // 步骤 1: 在右侧内容区域右击新建文本文件
    console.log('步骤 1: 在右侧内容区域右击新建文本文件');
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiHover('新建文档');
    await agent.aiWaitFor('新建文档菜单展开完成');
    await agent.aiTap('文本文档');

    // 预期 1: 成功创建"新建文本.txt"（重命名状态）
    console.log('预期 1: 成功创建"新建文本.txt"（重命名状态）');
    await agent.aiWaitFor('右侧窗口新增"新建文本.txt"文件');
    await agent.aiAssert('字符新建文本被选中, 且显示在选中框内');
    
    // 步骤 2: 点击右侧空白处
    console.log('步骤 2: 点击右侧空白处');
    await agent.aiTap('右侧内容区域空白处');
    await agent.aiWaitFor('文本文件创建完成');
    
    // 预期 2: 验证文件创建成功
    console.log('预期 2: 验证文件创建成功');
    await agent.aiAssert('界面存在新建文本.txt');

    // 步骤 3: 在右侧内容区域右击新建文件夹
    console.log('步骤 3: 在右侧内容区域右击新建文件夹');
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('新建文件夹');

    // 预期 3: 成功创建"新建文件夹"（重命名状态）
    console.log('预期 3: 成功创建"新建文件夹"（重命名状态）');
    await agent.aiWaitFor('右侧内容区域新增"新建文件夹"文件夹');
    await agent.aiAssert('字符新建文件夹被选中, 且显示在选中框内');

    // 步骤 4: 点击右侧空白处
    console.log('步骤 4: 点击右侧空白处');
    await agent.aiTap('右侧内容区域空白处');
    await agent.aiWaitFor('文件夹创建完成');

    // 预期 4: 验证文件夹创建成功
    console.log('预期 4: 验证文件夹创建成功');
    await agent.aiAssert('界面存在测试文件夹');

    const filename = "1";
    const suffix = ".txt";
    const testfile = filename + suffix;
    // 步骤 5: 在右侧内容区域选中testfile，右击新建快捷方式
    console.log(`步骤 5: 在右侧内容区域选中${testfile}, 右击新建快捷方式`);
    await system.exec(`touch ${test_dir}/${testfile}`);
    await agent.aiWaitFor(`右侧内容区域新增${testfile}文件`);
    await agent.aiRightClick(`右侧内容区域的${testfile}文件图标`);
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiHover('发送到');
    await agent.aiWaitFor('发送到菜单展开完成');
    await agent.aiTap('创建链接');
    await agent.aiWaitFor('弹出文件保存对话框');
    await agent.aiTap('保存');

    // 预期 5: 验证快捷方式创建成功, 右边窗口存在testfile的快捷方式
    console.log(`预期 5: 验证快捷方式创建成功, 右边窗口存在${filename} 快捷方式${suffix}`);
    await agent.aiAssert(`右侧内容区域存在${filename} 快捷方式${suffix}`);

  }, { timeout: 600000, tags: ['1850155', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'new', 'file', 'folder', 'shortcut'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`rm -rf ${test_dir}`);
    await agent.aiWaitFor('文件管理器右侧窗口已清空');

    // 清理步骤: 关闭可能因失败未关闭的保存对话窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭可能因失败未关闭的保存对话窗口');
    await system.exec("ps aux | grep dde-file-dialog | grep -v grep | awk '{print $2}' | xargs kill -15");

    // 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
