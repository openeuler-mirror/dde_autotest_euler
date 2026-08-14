// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809883
 * 用例标题: 将多个文件进行剪切并且粘贴到其他文件夹后，Ctrl+Z撤销粘贴文件，再利用Ctrl+Y恢复撤销
 * 生成时间: 2025-12-19 10:17:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1809883-将多个文件进行剪切并且粘贴到其他文件夹后，Ctrl+Z撤销粘贴文件，再利用Ctrl+Y恢复撤销', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 检查并删除已存在的niu目录
      await system.exec('test -d ~/niu && rm -rf ~/niu', 500);

      // 检查并删除下载目录下的test1.txt test2.txt test3.txt
      await system.exec('test -f ~/Downloads/test1.txt && rm -f ~/Downloads/test1.txt', 500);
      await system.exec('test -f ~/Downloads/test2.txt && rm -f ~/Downloads/test2.txt', 500);
      await system.exec('test -f ~/Downloads/test3.txt && rm -f ~/Downloads/test3.txt', 500);

      // 创建niu文件夹并在niu文件夹下创建3个文本文档
      await system.exec('mkdir -p ~/niu && touch ~/niu/test1.txt ~/niu/test2.txt ~/niu/test3.txt', 500);
      
      // 启动DDE文件管理器应用
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });
  
    test('1809883-将多个文件进行剪切并且粘贴到其他文件夹后，Ctrl+Z撤销粘贴文件，再利用Ctrl+Y恢复撤销', async ({ device, agent, uos, system }) => {

      // 打开文件管理器并进入主目录/niu文件夹---由于当前没有长按方法，只能创建文件使用ctrl+a全选操作
      await agent.aiTap('文件管理器左侧的"主目录"');
      await agent.aiDoubleClick('niu');
      await agent.aiWaitFor('test1.txt、test2.txt、test3.txt文件出现');

      // 将test.txt右键剪切并且粘贴文档test.txt至"文档"文件夹中
      await device.pressKey('Ctrl+A');
      await agent.aiRightClick("test2.txt");
      await agent.aiTap('剪切');
      await agent.aiTap('文件管理器左侧的"下载"');
      await agent.aiRightClick('任意空白处');
      await agent.aiTap("粘贴");
      await agent.aiWaitFor('test1.txt、test2.txt、test3.txt文件出现');

      // Ctrl+Z撤销粘贴操作
      await device.pressKey('Ctrl+Z');
      await agent.aiAssert("test1.txt、test2.txt、test3.txt文件不存在");

      // 验证文件回到桌面niu文件夹
      await agent.aiTap('文件管理器左侧的"主目录"');
      await agent.aiDoubleClick('niu');
      await agent.aiWaitFor('test1.txt、test2.txt、test3.txt文件存在');

      // 步骤4：Ctrl+Y恢复粘贴操作
      await device.pressKey('Ctrl+Y');
      await agent.aiTap('任意空白处'); //防止组合键多次执行
      await agent.aiAssert("test1.txt、test2.txt、test3.txt文件不存在");

      // 验证文件再次移至"下载"文件夹中
      await agent.aiTap('文件管理器左侧的"下载"');
      await agent.aiWaitFor('test1.txt、test2.txt、test3.txt文件存在');

    }, { timeout: 1200000, tags: ["1809883", "level2", "cancel", "chenyu"] });
  
    afterEach(async ({ device, system }) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 删除测试数据
      await system.exec('rm -rf ~/niu', 500);
      await system.exec('rm -f ~/Downloads/test1.txt ~/Downloads/test2.txt ~/Downloads/test3.txt', 500);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      
      // 初始化文管配置和进程
      await system.cleanupFileManager();
      
    });
  });
