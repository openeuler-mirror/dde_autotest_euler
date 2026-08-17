// import "dotenv/config";
// import { describe, test } from "midscene-uos";
// import { Agent } from "http";

/**
 * 用例 PMSID: 1809903
 * 用例标题: 浏览器网页文件提交功能适配文件删除操作的撤销与还原
 * 生成时间: 2025-12-26 17:50:26
 * 用例编写人：002161(陈俞)
 */

describe('1809903-浏览器网页文件提交功能适配文件删除操作的撤销与还原', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 检查并清理测试文件
      console.log('清理测试文件...');
      await system.exec('test -f ~/Music/test.txt && rm -f ~/Music/test.txt', 1000);
      
      // 在音乐目录创建测试文件
      console.log('创建测试文件...');
      await system.exec('touch ~/Music/test.txt', 1000);
      console.log('已在音乐目录创建测试文件: test.txt');
    });
  
    test('1809903-浏览器网页文件提交功能适配文件删除操作的撤销与还原', async ({ device, agent, uos, system }) => {
      console.log('=== 开始执行测试用例 1809903: 浏览器网页文件提交功能适配文件删除操作的撤销与还原 ===');
      
      // 打开浏览器
      console.log('打开浏览器...');
      await uos.openApp('浏览器', { maximizeWindow: true });
      console.log('浏览器已启动');
      
      // 打开有文件提交功能的网站
      console.log('打开网站...');
      await agent.aiTap('浏览器地址栏');
      await device.pressKey('Ctrl+A');
      await device.pressKey('Backspace');
      await device.typeText('https://pms.uniontech.com/bug-browse-441.html');
      await device.pressKey('Enter');
      console.log('网站已打开');
      
      // 检测并处理统信软件技术有限公司项目管理系统登录弹框
      try {
        await agent.aiWaitFor('统信软件技术有限公司项目管理系统');
        console.log('检测到项目管理系统登录弹框');
        
        // 1. 账号输入 ut002161
        await agent.aiTap('用户名输入框');
        await device.pressKey('Ctrl+A');
        await device.pressKey('Backspace');
        await device.typeText('ut002161');
        console.log('已输入账号');
        
        // 2. 密码输入 chenyu123//
        await agent.aiTap('密码输入框');
        await device.pressKey('Ctrl+A');
        await device.pressKey('Backspace');
        await device.typeText('chenyu123``');
        console.log('已输入密码');
        
        // 3. 点击登录
        await agent.aiTap('登录按钮');
        await agent.aiWaitFor('登录成功', 1000);
        console.log('登录成功');
      } catch (error) {
        console.log('未检测到登录弹框，继续执行测试');
      }
      
      // 5. 在"建用例"界面下方的"附件"处点击"添加文件"
      console.log('建bug并添加附件');
      await agent.aiTap('+提Bug');
      await agent.aiWaitFor('当前指派');
      await agent.aiScroll('右侧任意处', {direction:'down', distance:5});
      // await agent.aiTap('建用例界面下方的附件区域');
      await agent.aiTap('+添加文件');
      await agent.aiWaitFor('主目录');
      console.log('打开文件窗口已出现');
      
      // 用例步骤
      console.log('=== 开始执行用例步骤 ===');
      
      // 步骤1: 在弹出的"打开文件"窗口中选择音乐目录下的test.txt,对文件进行删除
      console.log('步骤1: 选择并删除文件');
      
      // 进入音乐目录
      console.log('进入音乐目录...');
      await agent.aiTap('左侧导航栏中的"音乐"');
      await agent.aiWaitFor('test.txt文件出现', 5000);
      console.log('已进入音乐目录，test.txt文件可见');
      
      // 删除文件
      console.log('删除文件...');
      await agent.aiRightClick('test.txt');
      await agent.aiWaitFor('右键菜单出现');
      await agent.aiTap('删除');
      await agent.aiAssert('test.txt文件不存在');
      console.log('文件已成功删除');
      
      // 按Ctrl+Z撤销删除文件的操作
      console.log('步骤2: 撤销删除操作');
      console.log('执行Ctrl+Z撤销操作...');
      await device.pressKey('Ctrl+Z');
      await agent.aiWaitFor('test.txt文件存在');
      console.log('撤销操作已完成');
      
      // 按Ctrl+Y恢复删除文件操作
      console.log('步骤3: 恢复删除操作'); 
      console.log('执行Ctrl+Y恢复操作...');
      await device.pressKey('Ctrl+Y');
      await agent.aiTap('任意空白处'); // 防止组合键多次执行
      await agent.aiAssert('test.txt文件不存在');
      console.log('恢复操作已完成');
      
      console.log('=== 测试用例 1809903 执行完成: 所有步骤验证通过 ===');

      // 关闭弹框窗口
      await device.pressKey('ESC');

    }, { timeout: 1200000, tags: ["1809903", "level3", "cancel", "chenyu"] });
  
    afterEach(async ({ device, system }) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 清理测试文件
      console.log('清理测试文件...');
      try {
        await system.exec('test -f ~/Music/test.txt && rm -f ~/Music/test.txt');
        console.log('已删除音乐 test.txt');
      } catch (error) {
        console.log('音乐 test.txt 不存在或删除失败');
      }

      // 再次确认关闭弹框窗口
      await device.pressKey('ESC');
      
      console.log('测试文件清理完成');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 确保所有测试文件都已清理
      console.log('最终确认测试文件清理...');
      await system.exec('test -f ~/Music/test.txt && rm -f ~/Music/test.txt');
      // 清除回收站数据
      await system.exec('rm -rf ~/.local/share/Trash/*', 500);
      
      // 关闭应用窗口
      console.log('关闭应用窗口...');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      await system.exec('killall browser'); 
      
      console.log('测试套件清理完成');
    });
  });
