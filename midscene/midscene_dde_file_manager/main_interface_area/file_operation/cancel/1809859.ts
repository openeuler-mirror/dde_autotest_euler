// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809859
 * 用例标题: 新建文件后，对文件内容进行编辑，Ctrl+Z执行撤销后，不支持Ctrl+Y恢复撤销
 * 生成时间: 2025-12-22 17:50:26
 * 用例编写人：UT002161(陈俞)
 */

describe('1809859-新建文件后，对文件内容进行编辑，Ctrl+Z执行撤销后，不支持Ctrl+Y恢复撤销', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      
      // 初始化文管配置和进程
      await system.cleanupFileManager();

      //  检查并删除文档目录下的新建文本.txt
      await system.exec('test -f ~/Documents/新建文本.txt && rm -f ~/Documents/新建文本.txt', 500);
      // 启动DDE文件管理器应用
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });

    test('1809859-新建文件后，对文件内容进行编辑，Ctrl+Z执行撤销后，不支持Ctrl+Y恢复撤销', async ({ device, agent, uos, system }) => {

      //进入新建文本.txt文件所在的目录界面
      await agent.aiTap('文件管理器左侧的“文档”');
      await agent.aiWaitFor('新建文本.txt文件不存在');

      // 新建新建文本.txt文件
      await agent.aiRightClick('任意空白处');
      await agent.aiTap('新建文档');
      await agent.aiTap('文本文档');
      await agent.aiTap('任意空白处');
      await agent.aiWaitFor('新建文本');

      // 打开新建文本.txt文件并进行编辑保存
      await agent.aiDoubleClick("新建文本.txt");
      await device.typeText('hello world!!');
      await device.pressKey('Ctrl+S');
      await agent.aiWaitFor('文件已保存');
      await system.exec('killall deepin-editor'); 

      // 使用Ctrl+Z撤销新建文件，文档被删除
      await agent.aiTap('任意空白处');
      await device.pressKey("Ctrl+Z");
      await agent.aiWaitFor('彻底删除');
      await agent.aiTap('弹框右下角的红色字体的“删除“');
      await agent.aiAssert('新建文本.txt不存在');

      // 使用Ctrl+Y恢复撤销，无法恢复
      await device.pressKey("Ctrl+Y");
      await agent.aiWaitFor('新建文本.txt不存在');
  
    }, { timeout: 1200000, tags: ["1809859", "level3", "cancel", "chenyu"] });
  
     afterEach(async ({ device, system }) => {
      console.log('4. afterEach: 每个测试后的清理');
      
    //  检查并删除文档目录下的新建文本.txt
      await system.exec('rm -f ~/Documents/新建文本.txt', 500);
    });
    
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 关闭文件管理器窗口
      await system.exec('killall deepin-editor');
      
      // 初始化文管配置和进程
      await system.cleanupFileManager();

    });
  });
