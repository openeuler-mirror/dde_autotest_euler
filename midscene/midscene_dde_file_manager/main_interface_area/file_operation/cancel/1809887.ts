// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1809887
 * 用例标题: Samba远程路径将文件进行剪切并且粘贴到其他文件夹后，Ctrl+Z撤销粘贴文件，再利用Ctrl+Y恢复撤销
 * 生成时间: 2025-12-15 09:50:26
 * 用例编写人：UT002161(陈俞)
 */

describe('1809887-Samba远程路径将文件进行剪切并且粘贴到其他文件夹后，Ctrl+Z撤销粘贴文件，再利用Ctrl+Y恢复撤销', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
      
      // 启动DDE文件管理器应用
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });

    test('1809887-Samba远程路径将文件进行剪切并且粘贴到其他文件夹后，Ctrl+Z撤销粘贴文件，再利用Ctrl+Y恢复撤销', async ({ device, agent, uos, system, env }) => {

 // 判断smb服务器是否已经挂载，如挂载即取消挂载
    try {
      await agent.aiWaitFor(process.env.SMB_IP, 300);
      console.log('检测到SMB_IP已存在，执行取消记住密码并卸载操作');
      
      // 右键点击process.env.SMB_IP
      await agent.aiRightClick(process.env.SMB_IP, 300);
      await agent.aiWaitFor('右键菜单');

      // 查看服务器是否已认证挂载 
      try{
        // 点击"取消记住密码并卸载"
      await agent.aiAssert('取消记住密码并卸载');
      await agent.aiTap('取消记住密码并卸载');
      // 等待弹出挂载或卸载文件系统需要授权的弹框
      await agent.aiWaitFor('挂载或卸载文件系统需要授权', 500);
      // 密码弹框输入配置文件密码
      await device.typeText(env.testPassword);
      await agent.aiTap('确定');
      }catch (error1) {
        console.log('未找到“取消记住密码并卸载”，尝试查找是否点击“移除”');
      }

      try{
        // 检查是否存在移除，有则点击移除--即表示服务器未认证挂载
        await agent.aiAssert('移除');
        await agent.aiTap('移除');
      }catch (error2) {
        console.log('未找到“移除”，即服务器未挂载，进入下一步');
      }

    } catch (error) {
      console.log('未检测到SMB_IP，无需卸载服务器');
    }

    // 挂载smb服务器：10.20.63.143
    await agent.aiTap('文件管理器右上角的菜单按钮');
    await agent.aiWaitFor('连接服务器');
    await agent.aiTap('连接服务器');
    await agent.aiWaitFor('smb');
    await agent.aiTap('服务器地址输入框');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Backspace');
    await device.typeText('10.20.63.143');
    await agent.aiTap('弹框内任意空白处');
    await agent.aiTap('连接按钮');
    await agent.aiWaitFor('SmbTest');

    // 进入服务器目录，验证是否需要认证
    await agent.aiDoubleClick('SmbTest');
    // 检测是否需要授权弹框
    try {
      await agent.aiWaitFor('用户名');
      // 检测到需要授权，输入用户名和密码
      await agent.aiTap('用户名输入框');
      await device.pressKey('Ctrl+A');
      await device.pressKey('Backspace');
      await device.typeText(process.env.SMB_USERNAME);
      await agent.aiTap('密码输入框');
      await device.typeText(process.env.SMB_PASSWORD);
      await agent.aiTap('连接按钮');
      //  检测是否会出现授权弹框，需要即授权认证
      try {
        await agent.aiWaitFor('挂载或卸载文件系统需要授权');
        //  await agent.aiTap('第二个输入框', 100);
        await device.typeText(env.testPassword);
        await agent.aiTap('确定',5000);
        // await agent.aiWaitFor('测试数据');
      } catch (error) {
        // 没有检测到系统授权弹框，直接继续
        console.log('系统密码已认证', 5000);
        // await agent.aiWaitFor('测试数据');
      }

    } catch (error) {
      // 没有检测到服务器授权弹框，直接继续
      console.log('服务器已认证',5000);
      // await agent.aiWaitFor('测试数据');
    }

      // 检测是否存在文件文本.txt，有则删除
       try {
        await agent.aiWaitFor('test.txt', 2000);
        // 如果存在新建文本.txt，则删除
        await agent.aiRightClick('test.txt');
        await agent.aiTap('删除');
        await agent.aiWaitFor('您要彻底删除吗？');
        await agent.aiTap('删除');
        await agent.aiAssert('test.txt不存在', 3000);
        console.log('已删除已存在的test.txt');
      } catch (error) {
        // 没有检测到新建文件夹，直接继续
        console.log('目录下不存在test.txt，直接继续');
      }

      // 新建新建文本.txt文件并重命名为test.txt
      await agent.aiRightClick('任意空白处');
      await agent.aiTap('新建文档');
      await agent.aiTap('文本文档');
      await device.typeText('test');
      await agent.aiTap('任意空白处');

       // 检测是否存在new文件夹，有则删除
       try {
        await agent.aiWaitFor('名称为new的文件夹', 200);
        // 如果存在新建文件夹，则删除
        await agent.aiRightClick('名称为new的文件夹');
        await agent.aiTap('删除');
        await agent.aiWaitFor('彻底删除');
        await agent.aiTap('弹框右下角红色字体的“删除”');
        await agent.aiWaitFor('new', 300);
        console.log('已删除已存在的new文件夹');
      } catch (error) {
        // 没有检测到新建文件夹，直接继续
        console.log('目录下不存在new文件夹，直接继续');
      }

      // 新建new文件夹
      await agent.aiRightClick('任意空白处');
      await agent.aiTap('新建文件夹');
      await device.typeText('new');
      await agent.aiTap('任意空白处');
      await agent.aiTap('任意空白处'); //点击两次空白处，防止误操作

      // 对文件test.txt进行剪切并粘贴到文件夹new中
      await agent.aiRightClick('test.txt')
      await agent.aiTap('剪切');
      await agent.aiDoubleClick('new文件夹');
      await agent.aiRightClick('任意空白处');
      await agent.aiTap('粘贴');
      await agent.aiWaitFor('test.txt');

      // 使用Ctrl+Z撤销
      await agent.aiTap('空白处');
      await device.pressKey('Ctrl+Z');
      await agent.aiWaitFor('test.txt不存在');
 
      //  使用Ctrl+Y恢复撤销
      await device.pressKey('Ctrl+Y');
      await agent.aiWaitFor('test.txt存在');

      //  删除测试数据test.txt和new文件夹
      await agent.aiTap('窗口上方的“10.20.63.143”');
      await agent.aiWaitFor('new');
      await agent.aiRightClick('new');
      await agent.aiTap('删除');
      await agent.aiWaitFor('彻底删除');
      await agent.aiTap('弹框右下角红色字体的“删除”');

    }, { timeout: 1200000, tags: ["1809887", "level3", "cancel", "chenyu"] });
  
       afterEach(async ({ device, agent, env }) => {
      console.log('4. afterEach: 每个测试后的清理');

    // 判断smb服务器是否已经挂载，如挂载即取消挂载
    try {
      await agent.aiWaitFor(process.env.SMB_IP, 300);
      console.log('检测到SMB_IP已存在，执行取消记住密码并卸载操作');
      
      // 右键点击process.env.SMB_IP
      await agent.aiRightClick(process.env.SMB_IP, 300);
      await agent.aiWaitFor('右键菜单');

      // 查看服务器是否已认证挂载 
      try{
        // 点击"取消记住密码并卸载"
      await agent.aiAssert('取消记住密码并卸载');
      await agent.aiTap('取消记住密码并卸载');
      // 等待弹出挂载或卸载文件系统需要授权的弹框
      await agent.aiWaitFor('挂载或卸载文件系统需要授权', 500);
      // 密码弹框输入配置文件密码
      await device.typeText(env.testPassword);
      await agent.aiTap('确定');
      }catch (error1) {
        console.log('未找到“取消记住密码并卸载”，尝试查找是否点击“移除”');
      }

      try{
        // 检查是否存在移除，有则点击移除--即表示服务器未认证挂载
        await agent.aiAssert('移除');
        await agent.aiTap('移除');
      }catch (error2) {
        console.log('未找到“移除”，即服务器未挂载，进入下一步');
      }

    } catch (error) {
      console.log('未检测到SMB_IP，无需卸载服务器');
    }
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
      console.log('5. afterAll: 清理测试套件');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
      
    });
    });
