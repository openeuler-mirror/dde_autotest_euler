/**
 * 用例 PMSID: 1806091
 * 用例标题: 侧边栏固定目录, 新建文件夹
 * 生成时间: 2025-12-16 10:00:00
 * 用例编写人: UT000159（游伟）
 */


describe('1806091-侧边栏固定目录, 新建文件夹', () => {
  const new_folder_name = '测试文件夹';
  const test_folder_name = '测试文件夹';
  const work_dir_name = '视频';
  const work_dir = "~/Videos/";

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 移除新建文件夹和测试文件夹, 避免干扰测试
    await system.exec(`test -d ${work_dir}${new_folder_name} && rm -rf ${work_dir}${new_folder_name} || true`);
    await system.exec(`test -d ${work_dir}${test_folder_name} && rm -rf ${work_dir}${test_folder_name} || true`);
  });

  test('1806091-侧边栏固定目录, 新建文件夹', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择视频目录
    await agent.aiTap('侧边栏中的视频目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到视频目录');

    // 验证页面已跳转到视频目录
    await agent.aiAssert('当前目录为视频目录');

    // 步骤 3: 在右侧内容区域新建文件夹
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('右键菜单中的新建文件夹');
    await agent.aiWaitFor('新建文件夹输入框已出现');
    await device.typeText('测试文件夹', false);
    await agent.aiTap('右侧内容区域空白处');

    // 验证测试文件夹已创建成功
    await agent.aiAssert('界面存在测试文件夹');

  }, { timeout: 600000, tags: ['1806091', 'level2', 'smoke', 'youwei', 'sidebar', 'file-manager', 'new folder'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 移除新建文件夹和测试文件夹
    await system.exec(`test -d ${work_dir}${new_folder_name} && rm -rf ${work_dir}${new_folder_name} || true`);
    await system.exec(`test -d ${work_dir}${test_folder_name} && rm -rf ${work_dir}${test_folder_name} || true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('窗口右上角关闭按钮:X');
  });
});
