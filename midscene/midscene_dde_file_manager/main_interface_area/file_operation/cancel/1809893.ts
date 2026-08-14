// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809893
 * 用例标题: 多个文件重命名操作的撤销与恢复
 * 生成时间: 2025-12-25 14:00:26
 * 用例编写人：UT002161(陈俞)
 */

describe('1809893-多个文件重命名操作的撤销与恢复建用例', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 检查主目录下是否存在new文件夹，有则删除
      console.log('检查并清理new文件夹...');
      await system.exec('test -d ~/new && rm -rf ~/new', 1000);
      
      // 在主目录下创建new文件夹并在文件夹内创建test1.txt，test2.txt与test3.txt
      console.log('创建new文件夹和测试文件...');
      await system.exec('mkdir -p ~/new');
      await system.exec('touch ~/new/test1.txt ~/new/test2.txt ~/new/test3.txt', 1000);
      console.log('已在new文件夹内创建测试文件: test1.txt, test2.txt, test3.txt');
      
      // 启动DDE文件管理器应用
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });

    test('1809893-多个文件重命名操作的撤销与恢复建用例', async ({ device, agent, uos, system }) => {
      console.log('=== 开始执行测试用例 1809893: 多个文件重命名操作的撤销与恢复 ===');
      
      // 进入new文件夹
      await agent.aiTap('文件管理器左侧的"主目录"');
      await agent.aiDoubleClick('new文件夹');
      await agent.aiWaitFor('test1.txt文件出现');
      await agent.aiWaitFor('test2.txt文件出现');
      await agent.aiWaitFor('test3.txt文件出现');
      console.log('测试文件已成功显示在new文件夹中');
      
      // 选中三个文本文档，在鼠标右键菜单中选择“重命名”
      console.log('选中文件并打开重命名菜单');
      
      // 使用Ctrl+A全选文件
      console.log('使用Ctrl+A全选文件...');
      await device.pressKey('Ctrl+A');
      
      // 右键点击选中的文件，选择重命名
      await agent.aiRightClick('test1.txt');
      await agent.aiWaitFor('重命名');

      // 多文件“重命名”功能栏
      await agent.aiTap('重命名');
      await agent.aiWaitFor('替换');
      
      // 在文件管理器上方的下拉框中选择“替换文本”，将“test”文本替换为“word”，点击“重命名”
      console.log(' 执行替换文本重命名操作');
      
      // 选择替换文本模式
      console.log('选择重命名模式...');
      await agent.aiTap('重命名模式下拉框');
      await agent.aiWaitFor('替换文本选项');
      await agent.aiTap('替换文本');
      console.log('已选择替换文本模式');
      
      // 替换文本
      console.log('输入要替换的文本...');
      await agent.aiTap('查找右侧的输入框');
      await device.typeText('test');
      await agent.aiTap('选填输入框');
      await device.typeText('word');
      console.log('已输入替换文本: word');
      
      // 点击重命名按钮
      console.log('点击重命名按钮...');
      await agent.aiTap('重命名按钮');
      console.log('重命名操作已完成');
      
      // 验证重命名成功
      console.log('验证重命名结果...');
      await agent.aiWaitFor('word1.txt文件存在');
      await agent.aiWaitFor('word2.txt文件存在');
      await agent.aiWaitFor('word3.txt文件存在');
      await agent.aiAssert('test1.txt文件不存在');
      await agent.aiAssert('test2.txt文件不存在');
      await agent.aiAssert('test3.txt文件不存在');
      console.log('重命名验证成功: 文件名已改为word1.txt, word2.txt, word3.txt');
      
      // 按Ctrl+Z撤销替换操作
      await agent.aiTap('又下角空白处');
      console.log('执行Ctrl+Z撤销操作...');
      await device.pressKey('Ctrl+Z');
      await agent.aiWaitFor('test1.txt, test2.txt, test3.txt存在');
      await agent.aiAssert('word1.txt, word2.txt, word3.txt不存在');
      console.log('撤销操作已完成');
      
      // 按Ctrl+Y恢复重命名操作
      await agent.aiTap('又下角空白处');
      console.log('执行Ctrl+Y恢复操作...');
      await device.pressKey('Ctrl+Y');
      await agent.aiTap('任意空白处'); // 防止组合键多次执行
      await agent.aiWaitFor('word存在');
      console.log('恢复操作已完成');
      
    }, { timeout: 1200000, tags: ["1809893", "level3", "cancel", "chenyu"] });
  
    afterEach(async ({ device, system }) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 清理测试文件和文件夹
      console.log('清理测试文件和文件夹...');
      try {
        await system.exec('test -d ~/new && rm -rf ~/new', 1000);
        console.log('已删除 new文件夹');
      } catch (error) {
        console.log('new文件夹不存在');
      }
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
      
    });
    });
