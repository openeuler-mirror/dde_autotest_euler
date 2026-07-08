/**
 * 用例 PMSID: 1808295
 * 用例标题: 右键菜单-勾选自动排列右键菜单呼出正常
 * 生成时间: 2026-01-21 11:27:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808295-右键菜单-勾选自动排列右键菜单呼出正常', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
   // await uos.showDesktop();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
    await system.exec('mkdir -p ~/Desktop/test && touch ~/Desktop/test.txt'); //创建测试文件
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

    //设置自动排序
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("桌面设置");
    //开关按钮是否是打开状态， 如果未打开，则执行下面动作，否则不执行
    const switchStatus = await agent.aiBoolean(`自动排列图标后面的开关按钮的状态`);
    if (switchStatus == false) {
      await agent.aiTap("自动排列图标后面的开关按钮");
    }
     //开关按钮是否是打开状态， 如果未打开，则执行下面动作，否则不执行
    const DesktopStatus = await agent.aiBoolean(`启用桌面整理的开关按钮状态`);
    if (DesktopStatus == false) {
      await agent.aiTap("启用桌面整理的开关按钮");
    }
    await device.pressKey("ESC");

  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808295-右键菜单-勾选自动排列右键菜单呼出正常', async ({ device, agent, uos, system, env }) => {

    //步骤1：在桌面空白处按ALT+M键
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("右键菜单显示顺序为：新建文件夹、新建文档、全选、粘贴(P)、刷新、整理桌面、排序方式、桌面设置、在终端中打开、显示设置、设置壁纸等内容");
    await device.pressKey("ESC");

    //步骤2：选择test 文件夹
    await agent.aiTap("test");
    await device.pressKey("Alt+M");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("右键菜单显示顺序为：打开(O)、打开方式、压缩、添加到“test.7z”、添加到“test.zip”、剪切(T)、复制(C)、重命名(M)、删除(D)、反选、共享文件夹、发送到、标记信息、以管理员身份打开、在终端中打开、病毒查杀、属性(R)等内容");
    await device.pressKey("ESC");
    //步骤3：选中文本文件test.txt
    await agent.aiTap("test.txt");
    await device.pressKey("Alt+M");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("右键菜单显示顺序为：打开(O)、打开方式、压缩、添加到“test.7z”、添加到“test.zip”、剪切(T)、复制(C)、重命名(M)、删除(D)、反选、发送到、标记信息、添加到AI知识库、病毒查杀、属性(R)等内容");
    await device.pressKey("ESC");


  }, { timeout: 600000, tags: ["1808295", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    await system.exec(`rm -rf ~/Desktop/test && rm -rf ~/Desktop/test.txt`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("桌面设置");
    //开关按钮是否是打开状态， 如果打开，则执行下面动作，否则不执行
    const switchStatus = await agent.aiQuery("自动排列图标后面的开关按钮的状态");
    if (switchStatus === "开启") {
      await agent.aiTap("自动排列图标后面的开关按钮");
    }
    await device.pressKey("ESC");
    // 初始化文管配置和进程
    await system.cleanupFileManager();
  });
}); 