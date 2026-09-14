
/**
 * 用例 PMSID: 1805283
 * 用例标题: 【搜索】高级搜索--多标签搜索
 * 生成时间: 2026-03-06 15:13:12
 * 用例编写人: UT000193（郑豪）
 */

describe('1805283-【搜索】高级搜索--多标签搜索', () => {
  // 测试资源文件变量定义
  const folderName = '1805283';
  const docFileName = 'testfile.txt';
  const musicFileName = 'test_music.mp3';
  const desktopPath = '~/Desktop';
  const folderPath = `${desktopPath}/${folderName}`;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建测试文件夹和文件
    await system.exec(`mkdir -p ${folderPath}`);
    await system.exec(`echo "This is a test document" > ${folderPath}/${docFileName}`);
    await system.exec(`echo "fake music file" > ${desktopPath}/${musicFileName}`);
    // 在桌面创建一些其他类型的文件用于测试
    await system.exec(`echo "test" > ${desktopPath}/test_image.jpg`);
    await system.exec(`echo "test" > ${desktopPath}/test_video.mp4`);
    await system.exec(`echo "test" > ${desktopPath}/test_archive.zip`);
  });

  test('1805283-【搜索】高级搜索--多标签搜索', async ({ device, agent, uos, system }) => {
    // 步骤1：在桌面选中文件夹a，点击右键--新标签打开，查看软件显示
    console.log('步骤1：在桌面选中文件夹a，点击右键--新标签打开');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiWaitFor("桌面文件列表已显示");
    await agent.aiRightClick(`${folderName}文件夹图标`);
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiTap("右键菜单中的'新标签打开'选项");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 断言1：会在新标签中打开文件夹a
    await agent.aiAssert(`文件管理器标签页显示${folderName}`);

    // 步骤2：在标签a中进行高级搜索：筛选文件类型为"文档"，查看显示
    console.log('步骤2：在标签a中进行高级搜索：筛选文件类型为"文档"');
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Ctrl', 'a');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText(docFileName.substring(0, 4));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap("搜索框右侧类似漏斗形状的筛选图标", { deepThink: true });
    await agent.aiWaitFor("文件管理器筛选界面已显示");
    await agent.aiTap("文件类型右侧的输入框");
    await agent.aiWaitFor("文件类型下拉框已显示");
    await agent.aiTap("文件类型下拉框选择'文档'");
    await agent.aiWaitFor("筛选条件已应用");
    
    // 断言2：在标签a中筛选的文件都为："文档"
    await agent.aiAssert(`搜索结果中只显示文档类型的文件，包含${docFileName}`);

    // 步骤3：切换回桌面，在桌面中进行筛选搜索："音频"，查看显示
    console.log('步骤3：切换回桌面，在桌面中进行筛选搜索："音频"');
    await agent.aiTap("文件管理器左侧栏的桌面");
    await agent.aiWaitFor("桌面文件列表已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Ctrl', 'a');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText(musicFileName.substring(0, 4));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap("搜索框右侧筛选图标");
    await agent.aiWaitFor("文件管理器筛选界面已显示");
    await agent.aiTap("文件类型右侧的输入框");
    await agent.aiWaitFor("文件类型下拉框已显示");
    await agent.aiTap("文件类型下拉框选择'音频'");
    await agent.aiWaitFor("筛选条件已应用");
    
    // 断言3：桌面筛选的文件类型都为："音频"
    await agent.aiAssert(`搜索结果中只显示音频类型的文件，包含${musicFileName}`);

  }, { timeout: 600000, tags: ['1805283', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除测试文件
    await system.exec(`rm -rf ${folderPath}`);
    await system.exec(`rm -f ${desktopPath}/${musicFileName}`);
    await system.exec(`rm -f ${desktopPath}/test_image.jpg`);
    await system.exec(`rm -f ${desktopPath}/test_video.mp4`);
    await system.exec(`rm -f ${desktopPath}/test_archive.zip`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
