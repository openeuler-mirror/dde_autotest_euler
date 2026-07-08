/**
 * 用例 PMSID: 1808383
 * 用例标题: 勾选自动排列-切换排序方式
 * 生成时间: 2026-02-4 13:59:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808383-勾选自动排列-切换排序方式', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    //移动桌面图标避免干扰
    await system.exec("mkdir -p ~/Downloads/testBak && mv ~/Desktop/* ~/Downloads/testBak");
    await new Promise(resolve => setTimeout(resolve, 1000));//构造时间间隔
    //在桌面创建测试文件夹和测试文本文件
    await system.exec('mkdir -p ~/Desktop/123testyf && mkdir -p ~/Desktop/atestyf && mkdir -p ~/Desktop/测试testyf'); //创建测试文件夹
    await system.exec('touch ~/Desktop/test03.txt');
    await new Promise(resolve => setTimeout(resolve, 1000));//构造时间间隔
    await system.exec('echo this is a test >~/Desktop/test02.txt');
    await new Promise(resolve => setTimeout(resolve, 1000));//构造时间间隔
    await system.exec(' echo 这是一份测试数据，仅供测试使用 >~/Desktop/测试te.txt');
    //清理回收站
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //显示桌面
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 3000));//等到3秒
    //勾选自动排列
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("桌面设置");
    //开关按钮是否是打开状态， 如果未打开，则执行下面动作，否则不执行
    const switchStatus = await agent.aiBoolean(`自动排列图标后面的开关按钮的状态`);
    if (switchStatus == false) {
      await agent.aiTap("自动排列图标后面的开关按钮");
    }
    await device.pressKey("ESC");
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808383-勾选自动排列-切换排序方式', async ({ device, agent, uos, system, env }) => {

    //步骤1：桌面空白处右键，设置排序 按名称
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("排序方式");
    await agent.aiTap("名称");

    await agent.aiAssert("桌保持连续对齐网格状态，桌面图标按排序规则重新排列,忽视桌面右下角的水印图标");
    await agent.aiAssert("桌面文件排序依次为： 123testyf、atestyf，测试testyf； test02.txt、test03.txt、测试te.txt");

    //按大小排序
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("排序方式");
    await agent.aiTap("大小");

    await agent.aiAssert("保持连续对齐网格状态，桌面图标按排序规则重新排列，忽视桌面右下角的水印图标");
    await agent.aiAssert("桌面文件排序依次为： 123testyf、atestyf、测试testyf、； test03.txt、test02.txt、测试te.txt");

    //按修改时间排序
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("排序方式");
    await agent.aiTap("修改时间");

    await agent.aiAssert("保持连续对齐网格状态，桌面图标按排序规则重新排列,忽视桌面右下角的水印图标");
    await agent.aiAssert("桌面文件排序依次为： 123testyf、atestyf、测试testyf、 test03.txt、test02.txt、测试te.txt");

    //按类型排序
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("排序方式");
    await agent.aiTap("类型");

    await agent.aiAssert("保持连续对齐网格状态，桌面图标按排序规则重新排列,忽视桌面右下角的水印图标");
    await agent.aiAssert("桌面文件排序依次为：123testyf、atestyf、测试testyf、 test02.txt、test03.txt、测试te.txt");
  }, { timeout: 600000, tags: ["1808383", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    //清理测试文件
    await system.exec('rm -rf ~/Desktop/测试testyf');
    await system.exec('rm -rf ~/Desktop/123testyf');
    await system.exec('rm -rf ~/Desktop/atestyf');
    await system.exec('rm -rf ~/Desktop/test02.txt && rm -rf ~/Desktop/测试te.txt && rm -rf ~/Desktop/test03.txt');
    //清理回收站
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //恢复桌面图标
    await system.exec("mv ~/Downloads/testBak/* ~/Desktop");
    await system.exec("rm -rf ~/Downloads/testBak");
    //关闭自动排列--恢复默认
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("桌面设置");
    await agent.aiTap("自动排列图标后面的开关按钮");
    await device.pressKey("ESC");
  });
}); 