/**
 * 用例 PMSID: 1807067
 * 用例标题: 直接通过命令在桌面创建文件
 * 生成时间: 2025-12-23 21:05:45
 * 用例编写人：UT000244（李庆玲）
 */
describe('1807067-直接通过命令在桌面创建文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807067-直接通过命令在桌面创建文件测试', async ({ device, uos, system, agent }) => {
    // 步骤一：通过命令行在桌面创建文件
    await system.exec(`echo "This is a test file" > ~/Desktop/1807067.txt`);
    
    // 步骤二：启动文件管理器验证文件在UI中可见
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('显示计算机');
    await agent.aiTap('左侧导航栏桌面');
    
    // 断言通过命令创建的文件可见
    await agent.aiAssert('桌面目录存在1807067.txt');
    
    // 步骤三：通过命令行在桌面创建文件夹
    await system.exec(`mkdir -p ~/Desktop/1807067`);
    
    // 在文件夹内创建文件
    await system.exec(`echo "Folder file 1" > ~/Desktop/1807067/1807067_1.txt`);
    await system.exec(`echo "Folder file 2" > ~/Desktop/1807067/1807067_2.txt`);
    
    // 验证文件夹结构
    await agent.aiAssert('桌面目录中包含1807067');
    await agent.aiDoubleClick('1807067');
    await agent.aiWaitFor('显示文件夹内容');
    await agent.aiAssert('文件夹中包含1807067_1.txt');
    await agent.aiAssert('文件夹中包含1807067_2.txt');
    
  }, { timeout: 1800000, tags: ['1807067', 'level3', 'drag', 'liqingling'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
    // 删除文件
    await system.exec('rm -rf ~/Desktop/1807067*');
    // await system.exec(`echo ${process.env.TEST_PASSWORD} | sudo rm -rf ~/Desktop/1807067*`);
  });
});