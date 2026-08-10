// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809857
 * 用例标题: 将回收站中文件彻底删除后Ctrl+Z撤销，不能撤销删除操作
 * 生成时间: 2025-12-22 16:50:26
 * 用例编写人：UT002161(陈俞)
 */

describe('1809857-将回收站中文件彻底删除后Ctrl+Z撤销，不能撤销删除操作', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 检查并删除文档目录下的test.txt
      await system.exec('test -f ~/Documents/test.txt && rm -f ~/Documents/test.txt', 500);

      // 文档目录下新建文本文档test.txt
      await system.exec('touch ~/Documents/test.txt', 500);

      // 情况回收站以免后面出现重复文件
      await system.exec('rm -rf ~/.local/share/Trash/*', 500);

      // 启动DDE文件管理器应用
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });

    test('1809857-将回收站中文件彻底删除后Ctrl+Z撤销，不能撤销删除操作', async ({ device, agent, uos, system }) => {

      //进入test.txt文件所在的目录界面
      await agent.aiTap('文件管理器左侧的“文档”');
      await agent.aiWaitFor('test.txt');

      // 删除测试文件
      await agent.aiRightClick("test.txt");
      await agent.aiTap("删除");
      await agent.aiAssert("test.txt文件不存在");

       // 打开回收站
      await agent.aiTap('文件管理器左侧的"回收站"');
      await agent.aiWaitFor('test.txt文件存在');

      // 清空回收站数据
      await agent.aiTap('右上角的清空按钮');
      await agent.aiWaitFor('您确定要清空回收站');
      await agent.aiTap('清空');

      // 使用Ctrl+Z撤销删除
      await device.pressKey("Ctrl+Z");
      await agent.aiWaitFor("test.txt文件不存在");
      await agent.aiTap('弹框右上角关闭按钮:X'); 

    }, { timeout: 1200000, tags: ["1809857", "level3", "cancel", "chenyu"] });
  
    afterEach(async ({ device, system }) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 检查并删除文档目录下的test.txt
      await system.exec('test -f ~/Documents/test.txt && rm -f ~/Documents/test.txt', 500);

      // 清空回收站数据
      await system.exec('rm -rf ~/.local/share/Trash/*', 500);

    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

    });
  });
