/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809113
 * 用例标题: 分组折叠-多窗口快捷访问拖拽调整位置
 * 生成时间: 2026-02-09 14:20:40
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809113-分组折叠-多窗口快捷访问拖拽调整位置', () => {
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

  test('1809113-分组折叠-多窗口快捷访问拖拽调整位置', async ({ device, agent, uos, system }) => {

    // 步骤1: 在视频目录创建folder1、folder2文件夹
    console.log('步骤1: 在视频目录创建folder1、folder2文件夹');
    await system.exec(`mkdir -p ~/Videos/folder1 ~/Videos/folder2`, 5000);

    // 步骤2: 从启动器打开文件管理器，使用Super+Left将窗口分左右显示
    console.log('步骤2: 从启动器打开文件管理器并分左右窗口');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
    await agent.aiHover("文件管理器窗口顶部空白区");
    await device.pressKey("Super+Left");
    await agent.aiWaitFor("文件管理器窗口显示在桌面窗口左边", { timeout: 3000 });
    await agent.aiTap("桌面空白区");

    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 15000 });
    await agent.aiTap("打开的文件管理器窗口");
    await device.pressKey("Super+Right");
    await agent.aiWaitFor("文件管理器窗口显示在桌面窗口右边", { timeout: 3000 });

    // 步骤3: 点击左侧文件管理器的视频菜单
    console.log('步骤3: 点击左侧文件管理器的视频菜单');
    await agent.aiTap("左侧文件管理器左侧边栏的'视频'菜单");
    await agent.aiWaitFor("左侧显示文件管理器视频窗口", { timeout: 5000 });
    await device.pressKey("Super+Left");
    await agent.aiTap("左侧文件管理器视频窗口空白区");

    // 步骤4: 使用Ctrl+A，hover到folder1，右键添加到快捷访问
    console.log('步骤4: 使用Ctrl+A，hover到folder1，右键添加到快捷访问');
    await device.pressKey("Ctrl+A");
    await agent.aiWaitFor("folder1和folder2都被选中", { timeout: 3000 });
    await agent.aiHover("folder1文件夹");
    await agent.aiRightClick("folder1文件夹");
    await agent.aiTap("右键菜单中的'添加到快捷访问'选项");

    // 步骤5: 断言folder1在最近使用下，拖动folder1到最近使用项下方，断言位置正确
    console.log('步骤5: 拖动folder1到最近使用项下方并断言位置');
    await agent.aiWaitFor("左侧文件管理器左侧边栏快捷访问下存在'folder1'选项");
    await agent.aiDrag("左侧文件管理器左侧边栏快捷访问下的'folder1'选项", "左侧文件管理器左侧边栏'最近使用'紧邻下方");
    await agent.aiAssert("右侧文件管理器的左侧边栏'folder1'项显示在左侧边栏'最近使用'下方");

    // 步骤6: 拖动桌面至图片下方，验证右侧同步
    console.log('步骤6: 拖动桌面至图片下方并验证右侧同步');
    await agent.aiDrag("左侧文件管理器左侧边栏'桌面'选项", "左侧文件管理器左侧边栏'图片'紧邻下方");
    await agent.aiAssert("右侧文件管理器的左侧边栏'桌面'选项显示在'图片'下方");

    // 步骤7: 拖动视频至文档下面，验证右侧同步
    console.log('步骤7: 拖动左侧边栏视频至文档下面');
    await agent.aiDrag("左侧文件管理器左侧边栏'视频'选项", "左侧文件管理器左侧边栏'文档'紧邻下方");
    await agent.aiAssert("右侧文件管理器左侧边栏'视频'选项显示在'文档'项下方");

    // 步骤8: 拖动最近使用至下载下方，验证右侧同步
    console.log('步骤8: 拖动最近使用在左侧边栏下载项下方');
    await agent.aiDrag("左侧文件管理器左侧边栏'最近使用'选项", "左侧文件管理器左侧边栏'下载'紧邻下方");
    await agent.aiAssert("右侧文件管理器的左侧边栏'最近使用'显示在'下载'项下方");

    // 步骤9: 拖动回收站至主目录下方，验证右侧同步
    console.log('步骤9: 拖动回收站至最近使用下方并验证右侧同步');
    await agent.aiDrag("左侧文件管理器左侧边栏'回收站'选项", "左侧文件管理器左侧边栏'主目录'项紧邻下方");
    await agent.aiAssert("右侧文件管理器左侧边栏'回收站'显示在'主目录'下方");

    // 步骤10: 关闭两个窗口
    console.log('步骤10: 关闭两个文件管理器窗口');
    await agent.aiTap("左侧文件管理器右上角X按钮");
    await agent.aiTap("右侧文件管理器右上角X按钮");
    await agent.aiWaitFor("文件管理器窗口已关闭", { timeout: 3000 });

    // 步骤11: 重新打开验证所有位置保持不变
    console.log('步骤11: 重新打开文件管理器验证位置保持不变');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    await agent.aiAssert("左侧边栏'桌面'选项显示在'图片'下方");
    await agent.aiAssert("左侧边栏'视频'项显示在'文档'项下方");
    await agent.aiAssert("左侧边栏'最近使用'显示在'下载'项下方");
    await agent.aiAssert("左侧边栏'回收站'显示在'主目录'项下方");

    // 步骤12: 取消添加的快捷访问
    console.log('步骤3: 点击文件管理器左侧边栏的视频菜单，显示视频窗口');
    await agent.aiTap("文件管理器左侧边栏的'视频'菜单");
    await agent.aiWaitFor("显示文件管理器视频窗口", { timeout: 5000 });

    console.log('步骤4: 快捷点击Ctrl+A,hover至folder1文件夹，右键点击folder1文件夹，点击右键菜单中的添加到快捷访问选项');
    await device.pressKey("Ctrl+A");
    await agent.aiWaitFor("folder1和folder2都被选中", { timeout: 3000 });
    await agent.aiHover("folder1文件夹");
    await agent.aiRightClick("folder1文件夹");
    await agent.aiTap("右键菜单中的'从到快捷访问移除'选项");
    // 等待配置文件写入（预留1分钟，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 60000));
    await agent.aiWaitFor("文件管理器左侧边栏快捷访问下不显示'folder1'选项", { timeout: 120000 });

  }, { timeout: 1200000, tags: ['1809113', 'level4', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    // 清理视频目录
    await system.exec(`rm -rf ~/Videos/folder*`, 5000);
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
