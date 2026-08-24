/**
 * 用例 PMSID: 1809115
 * 用例标题: 分组折叠-快捷访问拖拽调整位置
 * 生成时间: 2026-02-09 14:16:18
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809115-分组折叠-快捷访问拖拽调整位置', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 引用公共方法清理应用进程
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    // 清理视频目录
    await system.exec(`rm -rf ~/Videos/*`, 5000);

    // 步骤1: 打开文件管理器，点击右上方设置菜单
    console.log('===== 打开文件管理器，点击右上方设置菜单 =====');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
    await agent.aiTap('文件管理器右上角的设置菜单');
    await agent.aiTap('设置');
    await agent.aiAssert('弹出文件管理器设置窗口');

    // 步骤2: 点击设置页面的侧边栏
    console.log('===== 点击设置页面的侧边栏 =====');
    await agent.aiTap('设置窗口中的侧边栏搜索项');

    // 步骤3: 滑动设置页面到最底部，点击恢复默认
    console.log('===== 滑动设置页面到最底部，点击恢复默认 =====');
    await agent.aiScroll('设置页面', { direction: 'down', distance: 30 });
    await agent.aiTap('设置页面底部的恢复默认按钮');

    // 步骤4: 关闭设置菜单
    console.log('===== 关闭设置菜单 =====');
    await agent.aiTap('设置窗口右上角的关闭按钮');
    await agent.aiAssert('设置窗口被关闭');

    // 步骤5: 按F5刷新窗口
    console.log('===== 按F5刷新窗口 =====');
    await device.pressKey("F5");
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809115-分组折叠-快捷访问拖拽调整位置', async ({ device, agent, uos, system }) => {

    // 步骤1: 在视频目录创建 folder1、folder2文件夹
    console.log('步骤1: 在视频目录创建 folder1、folder2文件夹');
    await system.exec(`mkdir -p ~/Videos/folder1 ~/Videos/folder2`);

    // 步骤2: 点击文件管理器左侧边栏的视频菜单，显示视频窗口
    console.log('步骤2: 点击文件管理器左侧边栏的视频菜单，显示视频窗口');
    await agent.aiTap("文件管理器左侧边栏的'视频'菜单");
    await agent.aiWaitFor("显示文件管理器视频窗口", { timeout: 5000 });

    // 步骤3: 快捷点击Ctrl+A,hover至folder1文件夹，右键点击folder1文件夹，点击右键菜单中的'添加到快捷访问'选项
    console.log('步骤3: 快捷点击Ctrl+A,hover至folder1文件夹，右键点击folder1文件夹，点击右键菜单中的添加到快捷访问选项');
    await device.pressKey("Ctrl+A");
    await agent.aiWaitFor("folder1和folder2都被选中", { timeout: 3000 });
    await agent.aiHover("folder1文件夹");
    await agent.aiRightClick("folder1文件夹");
    await agent.aiTap("右键菜单中的'添加到快捷访问'选项");

    // 步骤4: 文件管理器左侧边栏快捷访问下存在folder1选项，拖动左侧边栏folder1至左侧边栏最近使用项下方，断言folder1显示在左侧边栏最近使用下面
    console.log('步骤4: 拖动左侧边栏folder1至左侧边栏最近使用项下方');
    await agent.aiWaitFor("左侧边栏快捷访问下存在folder1选项", { timeout: 5000 });
    await agent.aiDrag("左侧边栏快捷访问下的'folder1'选项", "左侧边栏'最近使用'紧邻下方");
    await agent.aiAssert("左侧边栏'folder1'项显示在左侧边栏'最近使用'下方");

    // 步骤5: 拖动左侧边栏桌面至图片下方，左侧边栏桌面选项显示在图片下方
    console.log('步骤5: 拖动左侧边栏桌面至图片下方');
    await agent.aiDrag("左侧边栏'桌面'选项", "左侧边栏'图片'紧邻下方");
    await agent.aiAssert("左侧边栏'桌面'选项显示在'图片'下方");

    // 步骤6: 拖动左侧边栏视频至文档下面，左侧边栏视频项显示在文档项下方
    console.log('步骤6: 拖动左侧边栏视频至文档下面');
    await agent.aiDrag("左侧边栏'视频'项", "左侧边栏'文档'紧邻下方");
    await agent.aiAssert("左侧边栏'视频'选项显示在'文档'项下方");

    // 步骤7: 拖动最近使用在左侧边栏下载项下方，左侧边栏最近使用显示在下载项下方
    console.log('步骤7: 拖动最近使用在左侧边栏下载项下方');
    await agent.aiDrag("左侧边栏'最近使用'项", "左侧边栏'下载'紧邻下方");
    await agent.aiAssert("左侧边栏'最近使用'显示在'下载'项下方");

    // 步骤8: 拖动左侧边栏回收站项至主目录下方，左侧边栏回收站显示在主目录下方
    console.log('步骤8: 拖动左侧边栏回收站项至主目录下方');
    await agent.aiDrag("左侧边栏'回收站'项", "左侧边栏'主目录'紧邻下方");
    await agent.aiAssert("左侧边栏'回收站'显示在'主目录'下方");

    // 步骤9: 关闭文件管理器窗口
    console.log('步骤9: 关闭文件管理器窗口');
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤10: 从启动器打开文件管理器
    console.log('步骤10: 从启动器打开文件管理器');

    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    // 步骤11: 验证排序结果
    console.log('步骤11: 验证排序结果');
    await agent.aiAssert("左侧边栏'桌面'选项显示在'图片'下方");
    await agent.aiAssert("左侧边栏'视频'项显示在'文档'项下方");
    await agent.aiAssert("左侧边栏'最近使用'显示在'下载'项下方");
    await agent.aiAssert("左侧边栏'回收站'显示在'主目录'项下方");

    // 步骤12: 取消添加的快捷访问
    console.log('步骤12: 取消添加的快捷访问');
    await agent.aiTap("文件管理器左侧边栏的'视频'菜单");
    await agent.aiWaitFor("显示文件管理器视频窗口", { timeout: 5000 });

    await device.pressKey("Ctrl+A");
    await agent.aiWaitFor("folder1和folder2都被选中", { timeout: 3000 });
    await agent.aiHover("folder1文件夹");
    await agent.aiRightClick("folder1文件夹");
    await agent.aiTap("右键菜单中的'从快捷访问移除'选项");
    // 等待配置文件写入（预留1分钟，避免断言时机过早）
    await new Promise(resolve => setTimeout(resolve, 60000));
    await agent.aiWaitFor("文件管理器左侧边栏快捷访问下不显示'folder1'选项", { timeout: 120000 });


  }, { timeout: 1200000, tags: ['1809115', 'level3', 'group_collapse', 'DITT', 'sushanshan'] });

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
