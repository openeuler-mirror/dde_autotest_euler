// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809855
 * 用例标题: 将回收站中文件还原后Ctrl+Z撤销还原文件，再利用Ctrl+Y恢复撤销
 * 生成时间: 2025-12-16 21:14:06
 * 用例编写人：UT002161(陈俞)
 */

describe('1809855-将回收站中文件还原后Ctrl+Z撤销还原文件，再利用Ctrl+Y恢复撤销', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 检查并删除已存在的测试目录
      await system.exec('test -d ~/Desktop/test_recycle && rm -rf ~/Desktop/test', 500);

      // 情况回收站以免后面出现重复文件
      await system.exec('rm -rf ~/.local/share/Trash/*', 500);

      // 创建测试文件
      await system.exec('mkdir ~/Desktop/test && touch ~/Desktop/test/test.txt', 500);

      // 启动DDE文件管理器应用
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });
  
    test('1809855-将回收站中文件还原后Ctrl+Z撤销还原文件，再利用Ctrl+Y恢复撤销', async ({ device, agent, uos, system }) => {
      // 打开文件管理器
      await agent.aiTap('文件管理器左侧的"桌面"');
      await agent.aiWaitFor('名称为test的文件夹出现');
      await agent.aiDoubleClick('test');

      // 删除测试文件到回收站
      await agent.aiRightClick("test.txt");
      await agent.aiTap("删除");
      await agent.aiAssert("test.txt文件不存在");

      // 打开回收站
      await agent.aiTap('文件管理器左侧的"回收站"');
      await agent.aiWaitFor('test.txt文件存在');

      // 还原回收站中的文件
      await agent.aiRightClick("test.txt");
      await agent.aiTap("还原");
      await agent.aiAssert("test.txt文件不存在"); 

      // 回到桌面目录验证文件已还原
      await agent.aiTap('文件管理器左侧的"桌面"');
      await agent.aiWaitFor('名称为test的文件夹出现');
      await agent.aiTap('文件管理器窗口右下角空白处');
      await system.exec('sleep 1');
      await agent.aiDoubleClick('test');
      await agent.aiAssert("test.txt文件存在");

      // 使用Ctrl+Z撤销还原操作
      await device.pressKey('Ctrl+Z');
      await agent.aiTap('任意空白处');
      await agent.aiAssert("test.txt文件不存在");

      // 验证文件回到回收站
      await agent.aiTap('文件管理器左侧的"回收站"');
      await agent.aiWaitFor("test.txt文件存在");

      // 使用Ctrl+Y恢复撤销操作
      await device.pressKey("Ctrl+Y");
      await agent.aiAssert("test.txt文件不存在");

      // 验证文件再次被还原到桌面
      await agent.aiTap('文件管理器左侧的"桌面"');
      await agent.aiWaitFor('名称为test的文件夹出现');
      await agent.aiDoubleClick('test正上方的文件夹');
      await agent.aiAssert("test.txt文件存在");

    }, { timeout: 1200000, tags: ["1809855", "level2", "cancel", "chenyu"] });
  
    afterEach(async ({ device, system }) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 删除测试数据
      await system.exec('test -d ~/Desktop/test && rm -rf ~/Desktop/test', 500);

      // 清除回收站数据
      await system.exec('rm -rf ~/.local/share/Trash/*', 500);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      
      // 初始化文管配置和进程
      await system.cleanupFileManager();

    });
  });
