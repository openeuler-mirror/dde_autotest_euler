/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809117
 * 用例标题: 分组折叠--多选文件夹到快捷访问包括已添加到快捷访问文件夹
 * 生成时间: 2026-02-09 14:09:39
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe('1809117-分组折叠--多选文件夹到快捷访问包括已添加到快捷访问文件夹', () => {
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

  test('1809117-分组折叠--多选文件夹到快捷访问包括已添加到快捷访问文件夹', async ({ device, agent, uos, system }) => {

    // 步骤1: 在视频目录创建文件夹folder1、folder2
    console.log('步骤1: 在视频目录创建文件夹folder1、folder2');
    await system.exec(`mkdir -p ~/Videos/folder1 ~/Videos/folder2`, 5000);
    const result1 = await system.exec(`ls -d ~/Videos/folder* | wc -l`, 5000);
    console.log(`创建完成，实际检测到 ${result1.stdout.trim()} 个文件夹`);

    // 步骤2: 从启动器打开文件管理器，点击文件管理器左侧边栏'视频'菜单
    console.log('步骤2: 从启动器打开文件管理器，点击文件管理器左侧边栏视频菜单');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
    await agent.aiTap("文件管理器左侧边栏的'视频'菜单");
    await agent.aiWaitFor("显示视频窗口", { timeout: 5000 });

    // 步骤3: 快捷点击Ctrl+A，hover至folder1文件夹，右键点击folder1文件夹，点击右键菜单中的"添加到快捷访问"选项
    console.log('步骤3: 快捷点击Ctrl+A，hover至folder1文件夹，右键点击folder1文件夹，点击右键菜单中的"添加到快捷访问"选项');
    await device.pressKey("Ctrl+A");
    await agent.aiHover("folder1文件夹");
    await agent.aiRightClick("folder1文件夹");
    await agent.aiTap("右键菜单中的'添加到快捷访问'选项");
    // 等待配置文件写入（预留1分钟，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 60000));

    // 步骤4: 断言左侧边栏快捷访问下存在folder1选项
    console.log('步骤4: 断言左侧边栏快捷访问下存在folder1选项');
    await agent.aiAssert("文件管理器左侧边栏快捷访问下存在folder1选项", { timeout: 120000 });

    // 步骤5: 在视频目录创建folder3、folder4文件夹
    console.log('步骤5: 在视频目录创建folder3、folder4文件夹');
    await system.exec(`mkdir -p ~/Videos/folder3 ~/Videos/folder4`, 5000);
    const result2 = await system.exec(`ls -d ~/Videos/folder* | wc -l`, 5000);
    console.log(`创建完成，实际检测到 ${result2.stdout.trim()} 个文件夹`);

    // 步骤6: 鼠标点击文件管理器空白窗口
    console.log('步骤6: 鼠标点击文件管理器空白区域');
    await agent.aiTap("文件管理器右侧窗口的空白区域");

    // 步骤7: 快捷点击Ctrl+A，hover至folder3文件夹，右键点击folder3文件夹，点击右键菜单中的'添加到快捷访问'选项，文件管理器左侧边栏快捷访问下存在folder3选项，且显示在folder2下面
    console.log('步骤7: 快捷点击Ctrl+A，hover至folder3文件夹，右键点击folder3文件夹，点击右键菜单中的"添加到快捷访问"选项，断言folder3显示在folder2下面');
    await device.pressKey("Ctrl+A");
    await agent.aiHover("folder3文件夹");
    await agent.aiRightClick("folder3文件夹");
    await agent.aiTap("右键菜单中的'添加到快捷访问'选项");
    // 等待配置文件写入（预留1分钟，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 60000));
    await agent.aiWaitFor("文件管理器左侧边栏快捷访问下存在folder3选项，且显示在folder2下面", { timeout: 120000 });

    //移除添加的快捷访问
    await agent.aiRightClick("folder3文件夹");
    await agent.aiTap("右键菜单中的'从到快捷访问移除'选项");
    // 等待配置文件写入（预留1分钟，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 60000));
    await agent.aiWaitFor("文件管理器左侧边栏快捷访问下不显示'folder1'选项", { timeout: 120000 });


  }, { timeout: 1500000, tags: ['1809117', 'level3', 'group_collapse', 'DITT', 'sushanshan'] });

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
