// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809865
 * 用例标题: 将文件移动后Ctrl+Z撤销移动操作，再利用Ctrl+Y恢复
 * 生成时间: 2025-12-16 16:50:26
 * 用例编写人：UT002161(陈俞)
 */

describe('1809865-将文件移动后Ctrl+Z撤销移动操作，再利用Ctrl+Y恢复', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
      
      // 检查并删除已存在的ba目录
      await system.exec('test -d ~/Desktop/ba && rm -rf ~/Desktop/ba', 500);

      // 检查文档目录下是否存在test.txt文档，如果有则删除
      await system.exec('test -f ~/Documents/test.txt && rm ~/Documents/test.txt', 500);

      // 创建test.txt
      await system.exec('mkdir ~/Desktop/ba && touch ~/Desktop/ba/test.txt', 500);

      // 启动DDE文件管理器应用
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });
  
    test('1809865-将文件移动后Ctrl+Z撤销移动操作，再利用Ctrl+Y恢复', async ({ device, agent, uos, system }) => {

      //进入test.txt文件所在的目录界面
      await agent.aiTap('文件管理器左侧的“桌面”');
      await agent.aiWaitFor('名称为ba的文件夹出现');
      await agent.aiDoubleClick('ba');

      // 将test.txt文件拖拽到左侧的文档目录
      await agent.aiAction('将test.txt文件拖拽到左侧的文档');
      await agent.aiTap('文档');
      await agent.aiWaitFor('test.txt文件存在');

      // 使用Ctrl+Z撤销删除
      await device.pressKey('Ctrl+Z');
      await agent.aiWaitFor("test.txt不存在");

      // 检查原目录下test.txt是否恢复
      await agent.aiTap('文件管理器左侧的“桌面”');
      await agent.aiWaitFor('名称为ba的文件夹出现');
      await agent.aiDoubleClick('ba');
      await agent.aiWaitFor('test.txt文件存在');

      //  使用Ctrl+Y恢复撤销
      await device.pressKey('Ctrl+Y');
      await agent.aiTap('任意空白处'); //防止组合键多次执行
      await agent.aiAssert("test.txt文件不存在");

      //  在文管目录下的test.txt是否恢复
      await agent.aiTap('文档');
      await agent.aiWaitFor('test.txt文件存在');

    }, { timeout: 1200000, tags: ["1809865", "level1", "cancel", "chenyu"] });
  
    afterEach(async ({ device, system }) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 删除测试数据
      await system.exec('test -d ~/Desktop/ba && rm -rf ~/Desktop/ba', 500);
      await system.exec('rm -f ~/Documents/test.txt', 500);
      
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      
      // 初始化文管配置和进程
      await system.cleanupFileManager();

    });
  });
