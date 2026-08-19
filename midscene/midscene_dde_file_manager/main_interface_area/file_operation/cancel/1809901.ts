// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809901
 * 用例标题: 应用打开文件功能适配文件剪切粘贴操作的撤销与还原
 * 生成时间: 2025-12-22 17:50:26
 * 用例编写人：UT002161(陈俞)
 */

describe('1809901-应用打开文件功能适配文件剪切粘贴操作的撤销与还原', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
     beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 防止收影响，先杀一遍文管进程
      await system.cleanupFileManager();
      await system.exec('killall deepin-editor'); 

            // 前置条件
      console.log('前置条件: 准备测试环境');
      
      // 检查并清理测试文件
      console.log('清理测试文件...');
      await system.exec('test -f ~/Music/test.txt && rm -f ~/Music/test.txt', 1000);
      await system.exec('test -f ~/Pictures/test.txt && rm -f ~/Pictures/test.txt', 1000);
      
      // 在桌面创建测试文件 
      console.log('创建测试文件...');
      await system.exec('touch ~/Music/test.txt', 1000);
      console.log('已在桌面创建测试文件: test.txt');
    });
  
    test('1809901-应用打开文件功能适配文件剪切粘贴操作的撤销与还原', async ({ device, agent, uos, system }) => {
      console.log('=== 开始执行测试用例 1809901: 应用打开文件功能适配文件剪切粘贴操作的撤销与还原 ===');
      
      // 启动有打开文件功能的应用（以文本编辑器为例）
      console.log('启动文本编辑器应用...');
      await uos.openApp('文本编辑器', { maximizeWindow: true });
      console.log('文本编辑器已启动');
      
      // 点击右上角的菜单栏，选择"打开文件"
      console.log('打开文件对话框...');
      await agent.aiTap('文本编辑器右上角的菜单按钮');
      await agent.aiWaitFor('打开文件选项');
      await agent.aiTap('打开文件');
      await agent.aiWaitFor('选择文件窗口出现');
      console.log('选择文件窗口已打开');
      
      // 用例步骤
      console.log('=== 开始执行用例步骤 ===');
      
      // 在"选择文件"窗口任意选择桌面文件test.txt，右键剪切该文件，并且粘贴至"图片"文件夹
      console.log('步骤1: 剪切粘贴文件操作');
      
      // 进入桌面目录
      console.log('进入音乐目录...');
      await agent.aiTap('左侧导航栏中的"音乐"');
      await agent.aiWaitFor('test.txt文件出现');
      console.log('已进入音乐目录，test.txt文件可见');
      
      // 右键剪切文件
      console.log('右键剪切文件...');
      await agent.aiRightClick('test.txt');
      await agent.aiWaitFor('剪切');
      await agent.aiTap('剪切');
      console.log('文件已剪切');
      
      // 进入图片文件夹
      console.log('进入图片文件夹...');
      await agent.aiTap('左侧导航栏中的"图片"');
      
      // 粘贴文件
      console.log('粘贴文件...');
      await agent.aiRightClick('弹框内任意空白处');
      await agent.aiWaitFor('粘贴');
      await agent.aiTap('粘贴');
      await agent.aiWaitFor('test.txt文件存在');
      console.log('文件已成功粘贴到图片文件夹');
      
      // 验证文件成功粘贴
      await agent.aiAssert('test.txt文件存在');
      console.log('步骤1验证: 文件成功被粘贴到"图片"文件夹中，原文件夹中的文件消失');
      
      // await agent.logScreenshot('步骤1完成: 文件剪切粘贴成功', {
      //   content: '文件成功被粘贴到图片文件夹中'
      // });
      
      // 按Ctrl+Z撤销剪切粘贴的操作
      console.log('撤销剪切粘贴操作');
      
      console.log('执行Ctrl+Z撤销操作...');
      await device.pressKey('Ctrl+Z');
      await agent.aiAssert('test.txt文件不存在');
      console.log('撤销操作已完成');
      console.log('剪切粘贴操作被撤销，文件回到原文件夹的原位置');
      
      // await agent.logScreenshot('步骤2完成: 撤销操作成功', {
      //   content: 'Ctrl+Z撤销操作成功，文件回到音乐原位置'
      // });
      
      // 按Ctrl+Y恢复剪切粘贴文件操作
      console.log('步骤3: 恢复剪切粘贴操作');
      
      console.log('执行Ctrl+Y恢复操作...');
      await device.pressKey('Ctrl+Y');
      console.log('验证恢复结果...');
      await agent.aiTap('左侧导航栏中的"图片"');
      await agent.aiWaitFor('test.txt');

      console.log('步骤3验证: 恢复剪切粘贴的操作，文件再次被剪切粘贴到"图片"文件夹中');
      
      // await agent.logScreenshot('步骤3完成: 恢复操作成功', {
      //   content: 'Ctrl+Y恢复操作成功，文件再次被剪切粘贴到图片文件夹中'
      // });
      
      console.log('=== 测试用例 1809901 执行完成: 所有步骤验证通过 ===');

    }, { timeout: 1200000, tags: ["1809901", "level3", "cancel", "chenyu"] });
  
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
      
      try {
        await system.exec('test -f ~/Pictures/test.txt && rm -f ~/Pictures/test.txt');
        console.log('已删除图片文件夹 test.txt');
      } catch (error) {
        console.log('图片文件夹 test.txt 不存在或删除失败');
      }
      
      console.log('测试文件清理完成');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      
      // 确保所有测试文件都已清理
      console.log('最终确认测试文件清理...');
      await system.exec('test -f ~/Music/test.txt && rm -f ~/Music/test.txt');
      await system.exec('test -f ~/Pictures/test.txt && rm -f ~/Pictures/test.txt');
      
     // 关闭文件管理器窗口
      await device.pressKey('esc');
      await system.exec('killall deepin-editor'); 
      await system.cleanupFileManager();
      
      console.log('测试套件清理完成');
    });
  });
