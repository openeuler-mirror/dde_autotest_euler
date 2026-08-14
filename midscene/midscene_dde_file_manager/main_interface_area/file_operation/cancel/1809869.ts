// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809869
 * 用例标题: 将多个文件移动后Ctrl+Z撤销移动操作，再利用Ctrl+Y恢复
 * 生成时间: 2025-12-17 19:45:50
 * 用例编写人：UT002161(陈俞)
 */

describe('1809869-将多个文件移动后Ctrl+Z撤销移动操作，再利用Ctrl+Y恢复', () => {
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

      // 检查并删除下载目录中是否存在test1 2 3.txt
      await system.exec('rm -f ~/Downloads/test1.txt ~/Downloads/test2.txt ~/Downloads/test3.txt', 500);

      // 创建niu文件夹并在niu文件夹下创建3个文本文档
      await system.exec('mkdir -p ~/niu && touch ~/niu/test1.txt ~/niu/test2.txt ~/niu/test3.txt', 500);

      // 启动DDE文件管理器应用
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });
  
    test('1809869-将多个文件移动后Ctrl+Z撤销移动操作，再利用Ctrl+Y恢复', async ({ device, agent, uos, system }) => {

      // 打开文件管理器并进入文件所在目录
      await agent.aiTap('文件管理器左侧的"主目录"');
      await agent.aiDoubleClick('niu');
      await agent.aiWaitFor('test1.txt文件出现');
      await agent.aiWaitFor('test2.txt文件出现');
      await agent.aiWaitFor('test3.txt文件出现');

      // 步骤1：将文档test1.txt、test2.txt、test3.txt全部选中拖动至"下载"文件夹中--目前无长按方法，使用ctrl+A代替
      await device.pressKey('Ctrl+A')
      await agent.aiAction('将文件test2.txt拖拽到左侧的"下载"文件夹');
      
      // 验证文件已移动到下载文件夹
      await agent.aiTap('文件管理器左侧的"下载"');
      await agent.aiWaitFor('test1.txt文件存在');
      await agent.aiWaitFor('test2.txt文件存在');
      await agent.aiWaitFor('test3.txt文件存在');

      // 步骤2：Ctrl+Z撤销移动操作
      await device.pressKey('Ctrl+Z');
      await agent.aiTap('任意空白处'); //防止组合键多次执行
      await agent.aiAssert("test1.txt文件不存在");
      await agent.aiAssert("test2.txt文件不存在");
      await agent.aiAssert("test3.txt文件不存在");

      // 验证文件回到主目录的对应文件夹
      await agent.aiTap('文件管理器左侧的"主目录"');
      await agent.aiDoubleClick('niu');
      await agent.aiWaitFor('test1.txt文件存在');
      await agent.aiWaitFor('test2.txt文件存在');
      await agent.aiWaitFor('test3.txt文件存在');

      // 步骤3：Ctrl+Y恢复移动操作
      await agent.aiTap('任意空白处'); //防止组合键多次执行
      await device.pressKey('Ctrl+Y');
      await agent.aiAssert("test1.txt文件不存在");
      await agent.aiAssert("test2.txt文件不存在");
      await agent.aiAssert("test3.txt文件不存在");

      // 验证文件再次移动到下载文件夹
      await agent.aiTap('文件管理器左侧的"下载"');
      await agent.aiWaitFor('test1.txt文件存在');
      await agent.aiWaitFor('test2.txt文件存在');
      await agent.aiWaitFor('test3.txt文件存在');

    }, { timeout: 1200000, tags: ["1809869", "level2", "cancel", "chenyu"] });
  
    afterEach(async ({ device, system }) => {

      // 删除测试数据
      await system.exec('rm -rf ~/niu', 500);
      await system.exec('rm -f ~/Downloads/test1.txt ~/Downloads/test2.txt ~/Downloads/test3.txt', 500);
      console.log('4. afterEach: 每个测试后的清理');

    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
      
    });
  });
