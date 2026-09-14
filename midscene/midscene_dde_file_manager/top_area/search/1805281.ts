/**
 * 用例 PMSID: 1805281
 * 用例标题: 【搜索】高级搜索-随机组合筛选
 * 生成时间: 2026-03-06 15:17:03
 * 用例编写人: UT000193（郑豪）
 */

describe('1805281-【搜索】高级搜索-随机组合筛选', () => {
  // 测试资源文件变量定义
  const videoFileName = 'test_video_200M.mp4';
  const archiveFileName = 'test_archive_3G.zip';
  const desktopPath = `/home/${process.env.TEST_USERNAME}/Desktop`;
  const videoFilePath = `${desktopPath}/${videoFileName}`;
  const archiveFilePath = `${desktopPath}/${archiveFileName}`;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建指定大小的测试文件
    await system.exec(`dd if=/dev/zero of=${videoFilePath} bs=1M count=250`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    await system.exec(`dd if=/dev/zero of=${archiveFilePath} bs=1M count=3072`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  test('1805281-【搜索】高级搜索-随机组合筛选', async ({ device, agent, uos, system }) => {
    // 步骤1：随机搜索文件类型：视频，文件大小：200M，修改时间为：本周，搜索范围：所有子文件夹
    console.log('步骤1：随机搜索文件类型：视频，文件大小：200M，修改时间为：本周，搜索范围：所有子文件夹');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    
    // 点击搜索框
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 输入视频文件名的一部分
    await device.pressKey('Ctrl', 'a');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText(videoFileName.substring(0, 8));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 点击筛选图标打开高级搜索
    await agent.aiTap("搜索框右侧筛选图标");
    await agent.aiWaitFor("文件管理器筛选界面已显示");
    
    // 设置文件类型为视频
    await agent.aiTap("文件类型右侧的下拉选择框");
    await agent.aiWaitFor("文件类型下拉框已显示");
    await agent.aiTap("文件类型下拉框选择'视频'");
    await agent.aiWaitFor("文件类型已设置为视频");
    
    // 设置文件大小为200M
    await agent.aiTap("文件大小右侧的输入框");
    await agent.aiWaitFor("文件大小下拉框已显示");
    await agent.aiTap("文件大小下拉框选择'100M~1GB'");
    await agent.aiWaitFor("文件大小已设置为100M~1GB");
    
    // 设置修改时间为本周
    await agent.aiTap("修改时间右侧的输入框");
    await agent.aiWaitFor("修改时间下拉框已显示");
    await agent.aiTap("修改时间下拉框选择'本周'");
    await agent.aiWaitFor("修改时间已设置为本周");
    
    // 设置搜索范围为所有子文件夹
    await agent.aiTap("搜索范围右侧的输入框");
    await agent.aiWaitFor("搜索范围下拉框已显示");
    await agent.aiTap("搜索范围下拉框选择'所有子文件夹'");
    await agent.aiWaitFor("搜索范围已设置为所有子文件夹");
    
    // 断言1：可以搜索文件成功
    await agent.aiAssert(`搜索结果中包含视频文件 ${videoFileName}`);

    // 步骤2：随机搜索文件类型：压缩文件，文件大小：3G，修改时间为：本周，搜索范围：当前文件夹
    console.log('步骤2：随机搜索文件类型：压缩文件，文件大小：3G，修改时间为：本周，搜索范围：当前文件夹');
    // 先清除之前的搜索条件
    await agent.aiTap("访问时间右侧的重置按钮");
    
    // 点击搜索框
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 输入压缩文件名的一部分
    await device.pressKey('Ctrl', 'a');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText(archiveFileName.substring(0, 8));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 设置文件类型为压缩文件
    await agent.aiTap("文件类型右侧的输入框");
    await agent.aiWaitFor("文件类型下拉框已显示");
    await agent.aiTap("文件类型下拉框选择'压缩文件'");
    await agent.aiWaitFor("文件类型已设置为压缩文件");
    
    // 设置文件大小为1G
    await agent.aiTap("文件大小右侧的输入框");
    await agent.aiWaitFor("文件大小下拉框已显示");
    await agent.aiTap("文件大小下拉框选择'>1GB'");
    await agent.aiWaitFor("文件大小已设置为'>1GB");
    
    // 设置搜索范围为当前文件夹
    await agent.aiTap("搜索范围右侧的输入框");
    await agent.aiWaitFor("搜索范围下拉框已显示");
    await agent.aiTap("搜索范围下拉框选择'当前文件夹'");
    await agent.aiWaitFor("搜索范围已设置为当前文件夹");
    await agent.aiWaitFor("搜索结果已显示或显示'无搜索结果'");
    
    // 断言2：可以搜索文件成功
    await agent.aiAssert(`搜索结果中不包含压缩文件 ${archiveFileName}`);

  }, { timeout: 600000, tags: ['1805281', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除测试文件
    await system.exec(`rm -f ${videoFilePath}`);
    await system.exec(`rm -f ${archiveFilePath}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});