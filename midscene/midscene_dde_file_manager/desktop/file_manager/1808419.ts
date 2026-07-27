/**
 * 用例 PMSID: 1808419
 * 用例标题: 选中文件-按shift/ctrl选中多个文件/文件夹
 * 生成时间: 2026-02-4 15:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808419-选中文件-按shift/ctrl选中多个文件/文件夹', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //释放所有按键
    await device.releaseAllKeys();
    //移动桌面图标避免干扰
    await system.exec("mkdir -p ~/Downloads/testBak && mv ~/Desktop/* ~/Downloads/testBak");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    //在桌面创建测试文件夹和文件
    await system.exec('bash -c "mkdir -p ~/Desktop/YF文件夹{01..03}"');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await system.exec('touch ~/Desktop/test180849.txt');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    //显示桌面
     //await uos.showDesktop();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    //设置纯色壁纸，规避无法识别选中的状态问题
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiWaitFor("个性化");
    await agent.aiTap("个性化");
    await agent.aiTap("壁纸");
    await agent.aiTap("纯色壁纸的第一个带笔的图片");
    await agent.aiTap("保存");
    //显示桌面
    //await uos.showDesktop();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808419-选中文件-按shift/ctrl选中多个文件/文件夹', async ({ device, agent, uos, system, env }) => {

    //步骤1：多选文件或文件夹
    // 按Ctrl 进行多选
    await device.keyDown("Ctrl");//长按
    await agent.aiTap("YF文件夹01");
    await agent.aiTap("YF文件夹02");
    await agent.aiTap("test180849.txt");
    await agent.aiAssert("YF文件夹01、YF文件夹02、test180849.txt 三个都被选中");
    await device.keyUp("Ctrl"); //释放
    await agent.aiTap("桌面空白处");

    //按shift 进行多选
    await device.keyDown("Shift");//长按
    await agent.aiTap("YF文件夹01");
    await agent.aiTap("test180849.txt");
    await agent.aiAssert("YF文件夹01到test180849.txt之间的文件和图标都被选中");
    await device.keyUp("Shift"); //释放
    await agent.aiTap("桌面空白处");

  }, { timeout: 600000, tags: ["1808419", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.releaseAllKeys();
    await system.exec('rm -rf ~/Desktop/YF文件夹0*');
    await system.exec('rm -rf ~/Desktop/test180849.txt');
    //恢复桌面图标
    await system.exec("mv ~/Downloads/testBak/* ~/Desktop");
    await system.exec("rm -rf ~/Downloads/testBak");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //恢复控制中心壁纸
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化");
    await agent.aiTap("bloom");
    await agent.aiTap("origin");
    await system.exec("killall dde-control-center");
  });
}); 