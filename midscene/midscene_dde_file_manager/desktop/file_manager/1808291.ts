/**
 * 用例 PMSID: 1808291
 * 用例标题: 右键菜单-gsettings默认为true时快捷键唤出右键菜单
 * 生成时间: 2026-01-21 10:03:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808291-右键菜单-gsettings控制右键菜单默认值检查', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    await uos.showDesktop();
    //await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await system.exec('mkdir -p ~/Desktop/test && touch ~/Desktop/test.txt'); //创建测试文件
    await new Promise(resolve => setTimeout(resolve, 2000));//等到2秒

  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808291-右键菜单-gsettings控制右键菜单默认值检查', async ({ device, agent, uos, system, env }) => {

    //步骤1：在桌面空白处按ALT+M键
    await device.pressKey("Alt+M");
    await new Promise(resolve => setTimeout(resolve, 2000));//等到2秒
    await agent.aiAssert("显示右键菜单:新建文件夹、新建文档、全选、刷新等内容", { fuzzyMatch: true });
    await device.pressKey("ESC");
    await new Promise(resolve => setTimeout(resolve, 1000));//等到1秒
    //步骤2：选择test 文件夹
    await agent.aiTap("test");
    await device.pressKey("Alt+M");
    await new Promise(resolve => setTimeout(resolve, 2000));//等到2秒
    await agent.aiAssert("显示右键菜单：打开、打开方式、压缩、剪切、复制、重命名、删除等内容", { fuzzyMatch: true });
    //步骤3：选中文本文件test.txt
    await device.pressKey("ESC");
    await new Promise(resolve => setTimeout(resolve, 1000));//等到1秒
    await agent.aiTap("test.txt");
    await device.pressKey("Alt+M");
    await new Promise(resolve => setTimeout(resolve, 2000));//等到2秒
    await agent.aiAssert("显示右键菜单：打开、打开方式、压缩、剪切、复制、重命名、删除等内容", { fuzzyMatch: true });
    await device.pressKey("ESC");
    await new Promise(resolve => setTimeout(resolve, 1000));//等到1秒

  }, { timeout: 600000, tags: ["1808291", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, device, agent }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    await system.exec(`rm -rf ~/Desktop/test &&  rm -rf ~/Desktop/test.txt`);
  });
}); 