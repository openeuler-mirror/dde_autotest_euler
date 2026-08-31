/**
 * 用例 PMSID: 1806255
 * 用例标题: 【最近使用】最近使用添加数据-新增不同
 * 生成时间: 2026-02-04
 * 用例编写人: UT000211(陈依)
 */

describe('1806255-【最近使用】最近使用添加数据-新增不同', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await device.pressKey('Esc');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面已出现');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
  });

  test('1806255-【最近使用】最近使用添加数据-新增不同', async ({ device, agent, uos, system }) => {
    // 步骤 1: 复制测试数据到桌面
    console.log("=== 步骤1：复制测试数据到桌面 ===");
    const caseDir = process.env.TESTCASE_DIR;
    await system.exec(`cp -r "${caseDir}"/midscene_dde_file_manager/resources/1806255/* ~/Desktop/`, 500);


    // 步骤 2: 打开文件管理器，最大化，进入桌面目录
    console.log("=== 步骤2：打开文件管理器并进入桌面目录 ===");
    await uos.openApp('文件管理器');
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("文件管理器侧边栏的桌面");
    await agent.aiAssert("当前目录为桌面目录");
    
    // 步骤 3: 打开1.bmp文件
    console.log("=== 步骤3：打开1.bmp文件 ===");
    await agent.aiDoubleClick("桌面目录下的1.bmp文件");
    await agent.aiAssert("1.bmp通过看图打开");
    await agent.aiTap("看图右上角关闭按钮");
    await agent.aiAssert("看图已关闭");

    // 步骤 4: 依次打开2.txt, 3.mkv, Demons.mp3文件
    console.log("=== 步骤4：打开2.txt文件 ===");
    await agent.aiDoubleClick("桌面目录下的2.txt文件");
    await agent.aiAssert("2.txt文件通过文本编辑器打开");
    await agent.aiTap("文本编辑器右上角关闭按钮");
    await agent.aiAssert("文本编辑器已关闭");

    console.log("=== 步骤5：打开3.mkv文件 ===");
    await agent.aiTap("桌面目录下的3.mkv文件");
    await agent.aiRightClick("3.mkv");
    await agent.aiTap("打开方式");
    await agent.aiTap("影院");
    await agent.aiAssert("打开新窗口");
    await system.exec("ps aux |grep movie | grep -v grep | awk '{print $2}' | xargs kill -15");;
    await agent.aiAssert("界面未播放视频");

    console.log("=== 步骤6：打开Demons.mp3文件 ===");
    await agent.aiDoubleClick("桌面目录下的Demons.mp3文件");
    await agent.aiAssert("Demons.mp3文件打开");
    await agent.aiTap("音乐右上角关闭按钮");
    await agent.aiTap("退出前方的圆圈");
    await agent.aiTap("确定");
    await agent.aiAssert("界面未播放音乐");

    // 步骤 5: 点击侧边栏最近使用目录，验证显示所有战死
    console.log("=== 步骤7：验证最近使用目录显示所有文件 ===");
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("已切换到最近使用栏目");
    await agent.aiAssert("最近使用中存在1.bmp文件");
    await agent.aiAssert("最近使用中存在2.txt文件");
    await agent.aiAssert("最近使用中存在3.mkv文件");
    await agent.aiAssert("最近使用中存在Demons.mp3文件");
    console.log("✅ 最近使用目录正确显示所有文件");

    // 步骤 6: 清除最近使用内容
    console.log("=== 步骤8：清除最近使用内容 ===");
    await device.pressKey('Control', 'A');
    await agent.aiAssert("当前目录所有文件被选中");
    await device.pressKey('Delete');
    await agent.aiWaitFor("删除对话框出现")
    await agent.aiTap("删除对话框中的移除按钮");
    await agent.aiAssert("最近使用不存在任何文件");
    console.log("✅ 最近使用内容已清除");

    console.log("===1806255-【最近使用】最近使用添加数据-新增不同，执行成功===");

  }, { timeout: 1200000, tags: ["1806255", "level2", "smoke", "DITT", "chenyi"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除桌面测试文件
    await system.exec('rm -rf ~/Desktop/1.bmp rm -rf ~/Desktop/2.txt rm -rf ~/Desktop/3.mkv rm -rf ~/Desktop/Demons.mp3 ');
  });
  
 
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 文件管理器向下还原再关闭
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    // 关闭所有文件管理器窗口
    await device.pressKey('Esc');
    // 显示桌面
    await uos.showDesktop();
  });
});

