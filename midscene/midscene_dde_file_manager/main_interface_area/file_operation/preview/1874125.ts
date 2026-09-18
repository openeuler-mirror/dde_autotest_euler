/**
 * 用例 PMSID: 1874125
 * 用例标题: 预览含有大量文件目录中的文件
 * 生成时间: 2025-12-22
 * 用例编写人: UT000054（叶飞）
 */

describe('1874125-预览含有大量文件目录中的文件', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1874125-预览含有大量文件目录中的文件', async ({ device, agent, uos, system }) => {

    console.log('步骤1: 在测试目录下创建1000个txt文件');
    //在家目录下创建文件夹1874125 ，在该文件夹下创建1000个txt文件，内容写入 this is for test.

    // 创建测试目录
    await system.exec("mkdir -p ~/1874125");

    // 创建10000个txt文件
    for (let i = 1; i <= 1000; i++) {
      const filename = `file_${i.toString().padStart(4, '0')}.txt`;
      await system.exec(`echo "this is for test." > ~/1874125/${filename}`);
    }

    console.log('已创建10000个txt文件在 ~/1874125 目录下');

    //命令行打开预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");

    //步骤2： 打开文管，进入主目录/1874125目录下,最大化窗口后，滚动鼠标至中部，选中任意一个txt，按Space键，检查文本预览显示

    console.log('步骤2: 打开文管并预览文件');

    // 打开文件管理器
    await uos.openApp("文件管理器", { maximizeWindow: true });

    // 进入主目录/1874125目录
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiDoubleClick("1874125");
    await agent.aiWaitFor("目录下显示文件占满当前窗口");

    // 滚动鼠标至中部
    await agent.aiScroll('file_0001.txt', { direction: 'down', distance: 300 });

    // 选中任意一个txt文件
    await agent.aiTap("任意一个txt文件");
    await agent.aiWaitFor("文件被选中", { timeoutMs: 5000 });
    // 按Space键预览
    await device.pressKey("Space");
    await agent.aiWaitFor("文本预览窗口打开", { timeoutMs: 5000 });

    // 检查文本预览显示
    const previewContent = await agent.aiQuery("预览窗口中的文本内容");
    console.log('预览内容:', previewContent);

    // 验证预览内容包含测试文本
    if (previewContent && previewContent.includes("this is for test")) {
      console.log('✓ 文本预览显示正常');
      await agent.aiAssert("预览内容：this is for test");
    } else {
      console.log('✗ 文本预览显示异常');
    }
    await device.pressKey("Space");//关闭预览

  }, { timeout: 600000, tags: ["1874125", "level3", "preview", "yefei"] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/1874125*");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("killall dde-file-manager");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
