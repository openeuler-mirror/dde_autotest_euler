
/**
 * 用例 PMSID: 1805467
 * 用例标题: 【搜索】框下拉列表
 * 生成时间: 2026-02-06 14:36:06
 * 用例编写人: UT000193（郑豪）
 */

describe('1805467-【搜索】框下拉列表', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建测试目录和文件
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/test_dir`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/test_dir/test_file.txt`);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/test_dir/sub_dir`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/test_dir/sub_dir/sub_file.txt`);
  });

  test('1805467-【搜索】框下拉列表', async ({ device, agent, uos }) => {
    // 步骤1：在地址输入框中输入：/
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await device.pressKey("Ctrl+L");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('/');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言1：弹出下拉列表显示/路径下目录名（显示根目录下所有的目录）
    await agent.aiAssert("地址栏下拉列表显示根目录下的目录列表");

    // 步骤2：查看下拉列表显示，在输入能匹配字母，敲击TAB键
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('/h');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Tab");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言2：根据敲击字母自动补全路径
    await agent.aiAssert("地址栏自动补全为/home路径,并切会自动联想下一个路径");

    // 步骤3：在地址栏中输入：/home/主机名，查看下拉列表显示
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText(`/home/${process.env.TEST_USERNAME}/`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言3：下拉列表显示/home/主机名路径下的目录
    await agent.aiAssert(`地址栏下拉列表显示Video、.local、.config、Desktop、Documents等文件夹，包含其中1个即可`);
  }, { timeout: 600000, tags: ['1805467', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试目录和文件
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/test_dir`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
