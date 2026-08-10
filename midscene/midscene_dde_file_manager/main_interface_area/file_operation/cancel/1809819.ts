// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809819
 * 用例标题: 删除多个文件后Ctrl+Z撤销删除操作，再利用Ctrl+Y恢复撤销
 * 生成时间: 2025-12-22 09:50:26
 * 用例编写人：UT002161(陈俞)
 */

describe('1809819-删除多个文件后Ctrl+Z撤销删除操作，再利用Ctrl+Y恢复撤销', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 清除回收站数据
      await system.exec('rm -rf ~/.local/share/Trash/*', 500);

      // 检查并删除主目录下已存在的niu目录--由于目前无长按操作方法，故只能在主目录下创建文件夹，对多文件使用全选操作
      await system.exec('test -d ~/niu && rm -rf ~/niu', 500);

      // 创建niu文件夹并在niu文件夹下创建3个文本文档
      await system.exec('mkdir -p ~/niu && touch ~/niu/test1.txt ~/niu/test2.txt ~/niu/test3.txt', 500);

      // 打开文件管理器并进入主目录保险箱
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });

    test('1809819-删除多个文件后Ctrl+Z撤销删除操作，再利用Ctrl+Y恢复撤销', async ({ device, agent, uos, system }) => {

      //进入test.txt文件所在的目录界面
      await agent.aiTap('文件管理器左侧的“主目录”');
      await agent.aiWaitFor('名称为niu的文件夹出现');
      await agent.aiDoubleClick('niu');
      await agent.aiWaitFor('test1.txt和test2.txt和test3.txt');

      // 删除多个测试文件
      await device.pressKey('Ctrl+A');
      await agent.aiRightClick("test2.txt");
      await agent.aiTap("删除");
      await agent.aiAssert("test1.txt、test2.txt、test3.txt文件不存在");

      // 使用Ctrl+Z撤销删除
      await device.pressKey("Ctrl+Z");
      await agent.aiWaitFor("test1.txt、test2.txt、test3.txt文件存在");

      //  使用Ctrl+Y恢复撤销
      await device.pressKey("Ctrl+Y");
      await agent.aiAssert("test1.txt、test2.txt、test3.txt文件不存在");

    }, { timeout: 1200000, tags: ["1809819", "level3", "cancel", "chenyu"] });
  
    afterEach(async ({ device, system }) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 删除测试数据
      await system.exec('test -d ~/niu && rm -rf ~/niu', 500);

      // 清除回收站数据
      await system.exec('rm -rf ~/.local/share/Trash/*', 500);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
     // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  });
