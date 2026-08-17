/**
 * 用例 PMSID: 1807471
 * 用例标题:  打开方式页面-主目录存在icon同名文件夹检查右键打开方式应用图标显示
 * 生成时间: 2026-03-20 13:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1807471-打开方式页面-主目录存在icon同名文件夹检查右键打开方式应用图标显示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //创建测试文件，后续测试
    await system.exec('touch /home/$USER/Desktop/test办公文档.pdf')

      });

  test('1807471-打开方式页面-主目录存在icon同名文件夹检查右键打开方式应用图标显示', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器，选择文档查看器，鼠标右键发送到桌面
    console.log('步骤 1: 打开启动器，选择文档查看器，鼠标右键发送到桌面');
    await uos.openLauncher();
    await uos.searchInLauncher('文档查看器')
    await agent.aiRightClick('文档查看器')
    await agent.aiTap('发送到桌面')

    // 步骤 2: 回到桌面，右键以文本编辑器打开文档查看器应用
    console.log('步骤 2: 回到桌面，右键以文本编辑器打开文档查看器应用');
    await uos.showDesktop();
    await agent.aiRightClick('文档查看器')
    await agent.aiTap('打开方式')
    await agent.aiTap('文本编辑器')
    await agent.aiAssert('显示内容：Icon=deepin-reader')

    await agent.aiTap('标签栏+号左侧的x')
    await system.exec("ps aux | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('文本编辑器窗口已关闭');

    // 步骤 3: 在主目录新建deepin-reader的文件夹
    console.log('步骤 3: 在主目录新建deepin-reader的文件夹');
    await system.exec('mkdir -p /home/$USER/deepin-reader')

    // 步骤 4: 选择任意pdf文件，鼠标右键，查看打开方式显示的文档查看器图标
    console.log('步骤 4: 选择任意pdf文件，鼠标右键，查看打开方式显示的文档查看器图标');
    await uos.showDesktop();
    await agent.aiRightClick('test办公文档.pdf')
    await agent.aiTap('打开方式')
    await agent.aiAssert('显示选项：文档查看器')

    //清理环境1: 删除桌面文档查看器应用
    await agent.aiTap('桌面空白处')
    await agent.aiRightClick('文档查看器')
    await agent.aiTap('删除')
    await agent.aiAssert('桌面不显示文档查看器')
    //清理环境2: 删除文件管理器的最近使用记录
    await uos.openApp('文件管理器')
    await agent.aiTap('最近使用')
    await agent.aiRightClick('最近使用')
    await agent.aiTap('清除最近访问')

  }, { timeout: 600000, tags: ["1807471", "level3", "menu","DITT", "hushimin1"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm -rf  /home/$USER/Desktop/test*')
    await system.exec('rm -rf  /home/$USER/deepin-reader')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});