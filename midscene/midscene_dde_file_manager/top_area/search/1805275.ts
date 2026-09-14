/**
 * 用例 PMSID: 1805275
 * 用例标题: 【搜索】高级搜索-选择范围
 * 生成时间: 2026-03-06 15:24:14
 * 用例编写人: UT000193（郑豪）
 */

describe('1805275-【搜索】高级搜索-选择范围', () => {
  // 测试资源文件变量定义
  const homePath = `/home/${process.env.TEST_USERNAME}`;
  const fileNames = ['1.sh', '2.sh', '3.sh'];
  const dirName = '111';
  const subDirName = '222';
  const subFileNames = ['a.sh', 'b.sh', 'c.sh'];
  const dirPath = `${homePath}/${dirName}`;
  const subDirPath = `${dirPath}/${subDirName}`;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：1、在111目录下创建1.sh 2.sh 3.sh ，然后创建目录222并添加文件a.sh b.sh c.sh
    await system.exec(`mkdir -p ${subDirPath}`);
    for (const fileName of fileNames) {
      await system.exec(`touch ${dirPath}/${fileName}`);
    }

    for (const subFileName of subFileNames) {
      await system.exec(`touch ${subDirPath}/${subFileName}`);
    }
  });

  test('1805275-【搜索】高级搜索-选择范围', async ({ device, agent, uos }) => {
    // 步骤1：打开文管后先进dirPath
    console.log('步骤1：打开文管后先进dirPath');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    
    // 点击左侧栏的“主目录”
    await agent.aiTap("文件管理器左侧栏的主目录");
    await agent.aiWaitFor("主目录文件列表已显示");
    
    // 双击进入111目录
    await agent.aiDoubleClick(`文件列表中的${dirName}文件夹`);
    await agent.aiWaitFor("111目录文件列表已显示");
    
    // 在地址栏中输入：sh ，然后回车，选择搜索条件“当前文件夹”
    console.log('步骤1：在地址栏中输入：sh ，然后回车，选择搜索条件“当前文件夹”');

    // 点击搜索框
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 输入 sh
    await device.typeText('sh');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 回车
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 选择搜索条件“当前文件夹”
    await agent.aiTap("搜索框右侧筛选图标");
    await agent.aiWaitFor("文件管理器筛选界面已显示");
    await agent.aiTap("搜索范围右侧的下拉框",{ deepThink: true });
    await agent.aiWaitFor("搜索范围下拉框已显示");
    await agent.aiTap("搜索范围下拉框选择'当前文件夹'");
    await agent.aiWaitFor("搜索范围已设置为当前文件夹");
    
    // 断言1：显示结果：1.sh 2.sh 3.sh（当前目录下的文件）
    await agent.aiAssert(`搜索结果中包含文件 ${fileNames}`);

    // 步骤2：在地址栏中输入：sh ，然后回车，选择搜索条件“所有子文件夹”
    console.log('步骤2：在地址栏中输入：sh ，然后回车，选择搜索条件“所有子文件夹"');
    // 清除之前的搜索条件
    await agent.aiTap("搜索范围右侧的下拉框",{ deepThink: true });
    await agent.aiWaitFor("搜索范围下拉框已显示");
    await agent.aiTap("搜索范围下拉框选择'所有子文件夹'");
    await agent.aiWaitFor("搜索范围已设置为所有子文件夹");
    
    // 断言2：搜索结果会显示当前目录下和子目录下所有的sh文件（即1.sh 2.sh 3.sh 和 a.sh b.sh c.sh）
    await agent.aiAssert(`搜索结果中包含文件 ${fileNames}和${subFileNames}`);

  }, { timeout: 600000, tags: ['1805275', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除测试文件
    await system.exec(`rm -rf ${dirPath}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
