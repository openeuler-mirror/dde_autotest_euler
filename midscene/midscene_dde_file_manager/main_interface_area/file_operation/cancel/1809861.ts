// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809861
 * 用例标题: 多次进行撤销操作与恢复操作
 * 生成时间: 2025-12-22 17:50:26
 * 用例编写人：UT002161(陈俞)
 */

describe('1809861-多次进行撤销操作与恢复操作', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 检查并删除桌面目录下的新建文本.txt
      await system.exec('test -f ~/Desktop/新建文本.txt && rm -f ~/Desktop/新建文本.txt', 500);

      // 检查图片目录下是否存在test.txt文档，如果有则删除
      await system.exec('test -f ~/Desktop/test.txt && rm ~/Desktop/test.txt', 500);

      // 检查图片目录下是否存在test.txt文档，如果有则删除
      await system.exec('test -f ~/Documents/test.txt && rm ~/Documents/test.txt', 500);

      // 检查文档目录下是否存在test.txt文档，如果有则删除
      await system.exec('test -f ~/Pictures/test.txt && rm ~/Pictures/test.txt', 500);

     // 清空回收站以免后面出现重复文件
      await system.exec('rm -rf ~/.local/share/Trash/*', 500);

      // 启动DDE文件管理器应用
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });
  
    test('1809861-多次进行撤销操作与恢复操作', async ({ device, agent, uos, system }) => {

      //进入新建文本.txt文件所在的目录界面
      await agent.aiTap('文件管理器左侧的“桌面”');
      await agent.aiWaitFor('新建文本.txt文件不存在');

      // 新建新建文本.txt文件
      await agent.aiRightClick('任意空白处');
      await agent.aiTap('新建文档');
      await agent.aiTap('文本文档');
      await agent.aiTap('任意空白处');
      await agent.aiWaitFor('新建文本');

      // 将test.txt文件重命名为new.txt
      await agent.aiRightClick("新建文本.txt");
      await agent.aiTap("重命名");
      await device.typeText('test');
      await agent.aiTap("任意空白处");
      await agent.aiWaitFor("test.txt存在");

      // 将test.txt文件拖拽到左侧的图片目录
      await agent.aiAction('将test.txt文件拖拽到左侧的图片');
      await agent.aiTap('图片');
      await agent.aiWaitFor('test.txt文件存在');

      // 将test.txt文件拖拽到左侧的文档目录
      await agent.aiTap('任意空白处');
      await agent.aiAction('将test.txt文件拖拽到左侧的文档');
      await agent.aiTap('文档');
      await agent.aiWaitFor('test.txt文件存在');

      // 删除文件test.txt到回收站
      await agent.aiRightClick('test.txt');
      await agent.aiTap('删除');
      await agent.aiWaitFor('test.txt文件不存在');
      await agent.aiTap('左侧的回收站');
      await agent.aiWaitFor('test.txt');

      // 使用Ctrl+Z第一次撤销，test.txt撤销到文档目录
      await device.pressKey('Ctrl+Z');
      await agent.aiWaitFor("test.txt不存在");
      await agent.aiTap('左侧的文档');
      await agent.aiWaitFor("test.txt存在");

      // 使用Ctrl+Z第二次撤销，test.txt撤销到图片目录
      await device.pressKey('Ctrl+Z');
      await agent.aiWaitFor("test.txt不存在");
      await agent.aiTap('左侧的图片');
      await agent.aiWaitFor("test.txt存在");

      // 使用Ctrl+Z第三次撤销，test.txt撤销到桌面目录
      await device.pressKey('Ctrl+Z');
      await agent.aiWaitFor("test.txt不存在");
      await agent.aiTap('左侧的桌面');
      await agent.aiWaitFor("test.txt存在");

      // 使用Ctrl+Z第四次撤销，test.txt撤销到新建文本.txt
      await device.pressKey('Ctrl+Z');
      await agent.aiAssert("test.txt不存在");
      await agent.aiWaitFor('新建文本.txt存在');

      //  使用Ctrl+Y第一次恢复撤销，test.txt恢复
      await device.pressKey('Ctrl+Y');
      await agent.aiTap('任意空白处'); //防止组合键多次执行
      await agent.aiAssert("新建文本.txt不存在");
      await agent.aiWaitFor('test.txt存在');

      //  使用Ctrl+Y第二次恢复撤销，test.txt恢复到图片目录
      await device.pressKey('Ctrl+Y');
      await agent.aiTap('任意空白处'); //防止组合键多次执行
      await agent.aiTap('左侧的图片');
      await agent.aiAssert("test.txt存在");

      //  使用Ctrl+Y第三次恢复撤销，test.txt恢复到文档目录
      await device.pressKey('Ctrl+Y');
      await agent.aiTap('任意空白处'); //防止组合键多次执行
      await agent.aiTap('左侧的文档');
      await agent.aiAssert("test.txt存在");

      //  使用Ctrl+Y第四次恢复撤销，test.txt恢复到删除状态，在回收站
      await device.pressKey('Ctrl+Y');
      await agent.aiTap('任意空白处'); //防止组合键多次执行
      await agent.aiTap('左侧的回收');
      await agent.aiAssert("test.txt存在");

    }, { timeout: 1200000, tags: ["1809861", "level3", "cancel", "chenyu"] });
  
    afterEach(async ({ device, system }) => {
      console.log('4. afterEach: 每个测试后的清理');

      //  删除测试数据
      await system.exec('rm -f ~/Documents/test.txt', 500);
      await system.exec('rm -f ~/Desktop/test.txt', 500);
      await system.exec('rm -f ~/Pictures/test.txt', 500);
      await system.exec('rm -rf ~/.local/share/Trash/*', 500);

    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
      
    });
  });
