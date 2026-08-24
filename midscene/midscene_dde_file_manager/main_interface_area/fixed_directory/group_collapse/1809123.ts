/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809123
 * 用例标题: 分组折叠-拖拽超过100文件夹到快捷访问
 * 生成时间: 2026-02-05
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe('1809123-分组折叠-拖拽超过100文件夹到快捷访问', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 引用公共方法清理应用进程
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    // 清理视频目录
    await system.exec(`rm -rf ~/Videos/*`, 5000);

  });

  test('1809123-分组折叠-拖拽超过100文件夹到快捷访问', async ({ device, agent, uos, system }) => {

    // 步骤1: 在视频目录循环创建1000个文件夹folder*
    console.log('步骤1: 在视频目录循环创建100个文件夹folder*');
    // 显式调用 bash 执行，确保大括号扩展 {1..100} 生效
    const cmd = ` bash -c 'mkdir -p ~/Videos/folder{1..100}'`;
    const res = await system.exec(cmd, 10000);
    console.dir(res);

    // 验证创建成功，获取实际文件夹数量
    const result = await system.exec(`ls -d ~/Videos/folder* 2>/dev/null | wc -l`, 5000);
    const folderCount = result.stdout.trim();
    console.log(`创建完成，实际检测到 ${folderCount} 个文件夹`);

    // 步骤2: 从启动器打开文件管理器
    console.log('步骤2: 从启动器打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    // 步骤3: 点击文件管理器左侧边栏视频菜单，进入视频窗口
    console.log('步骤3: 点击文件管理器左侧边栏视频菜单，进入视频窗口');
    await agent.aiTap("文件管理器左侧边栏的'视频'菜单");
    await agent.aiWaitFor("显示视频窗口", { timeout: 5000 });

    // 步骤4: 快捷点击Ctrl+A
    console.log('步骤4: 快捷点击Ctrl+A');
    await device.pressKey("Ctrl+A");

    // 步骤5: hover至folder1文件夹，右键点击folder1，弹出右键菜单，点击'添加到快捷访问'
    console.log('步骤5: hover至folder1文件夹，右键点击folder1，弹出右键菜单，点击"添加到快捷访问"');
    await agent.aiHover("folder1文件夹");
    await agent.aiRightClick("folder1文件夹");
    await agent.aiTap("右键菜单中的'添加到快捷访问'选项");
    // 等待配置文件写入（预留1分钟，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 60000));

    // 步骤6: 断言文件管理器左侧边栏存在folder1选项
    console.log('步骤6: 断言文件管理器左侧边栏存在folder1选项');
    await agent.aiWaitFor("文件管理器左侧边栏快捷访问下存在folder10选项", { timeout: 120000 });

    // 步骤7: hover至文件管理器右侧窗口folder1文件夹
    console.log('步骤7: hover至文件管理器右侧窗口folder1文件夹');
    await agent.aiHover("右侧窗口中的folder1文件夹");

    // 步骤8: 快捷点击Ctrl+A，右键点击folder1，弹出右键菜单，点击'从快捷访问移除'
    console.log('步骤8: 快捷点击Ctrl+A，右键点击folder1，弹出右键菜单，点击"从快捷访问移除"');
    await device.pressKey("Ctrl+A");
    await agent.aiRightClick("folder1文件夹");
    await agent.aiTap("右键菜单中的'从快捷访问移除'选项");
    // 等待配置文件写入（预留1分钟，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 60000));

    // 步骤9: 断言文件管理器左侧边栏不存在folder1选项
    console.log('步骤9: 断言文件管理器左侧边栏不存在folder1选项');
    await agent.aiWaitFor("文件管理器左侧边栏快捷访问下不存在folder10选项", { timeout: 120000 });
  }, { timeout: 1500000, tags: ['1809123', 'level4', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    // 清理视频目录
    await system.exec(`rm -rf ~/Videos/folder*`, 10000);
    await uos.closeCurrentWindow();
    console.log('文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
