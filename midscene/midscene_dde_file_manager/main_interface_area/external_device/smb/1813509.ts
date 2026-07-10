
/**
 * 用例 PMSID: 1813509
 * 用例标题: 右键菜单-侧边栏smb目录右键-退出登录并卸载
 * 生成时间: 2026-02-25 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1813509-右键菜单-侧边栏smb目录右键-退出登录并卸载', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813509-右键菜单-侧边栏smb目录右键-退出登录并卸载', async ({ device, agent, uos, system, env}) => {
    let ip =  process.env.SMB_IP
    await uos.openApp("文件管理器");
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
      await device.typeText(env.testPassword, true);
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

    await system.cleanupFileManager();
    // smb挂载
    try {
        await system.exec(`/usr/bin/dde-file-manager smb://${process.env.SMB_IP}`, 500);
        await agent.aiWaitFor('文管窗口显示');
        await agent.aiDoubleClick("SmbTest");
        console.log('输入账户密码');
        await device.typeText(process.env.SMB_USERNAME);
        await agent.aiInput( process.env.SMB_PASSWORD,'密码输入框');
        await agent.aiTap("记住密码文本");
        await agent.aiTap("连接");

        //  检测是否会出现授权弹框，需要即授权认证
      try {
        await agent.aiWaitFor('挂载或卸载文件系统需要授权');
        await device.typeText(env.testPassword,true);
        await agent.aiWaitFor('测试数据');
        console.log("smb挂载成功！")
      } catch (error) {
        // 没有检测到系统授权弹框，直接继续
        console.log('系统密码已认证');
      }

    } catch (error) {
      console.log('挂载失败'); 
    }

    // 开始卸载
    await system.cleanupFileManager();
    // 卸载smb
    // 右键点击process.env.SMB_IP
      await device.pressKey('Super+E');
      await agent.aiWaitFor(process.env.SMB_IP, 300);
      await agent.aiRightClick(process.env.SMB_IP, 300);
      await agent.aiWaitFor('右键菜单');
      // 点击"取消记住密码并卸载"
      try{
      await agent.aiTap('取消记住密码并卸载');
      // 等待弹出挂载或卸载文件系统需要授权的弹框
      await agent.aiWaitFor('挂载或卸载文件系统需要授权', 500);
      // 密码弹框输入配置文件密码
      await device.typeText(env.testPassword, true);
      await agent.aiAssert(`smb卸载成功，文管窗口不显示${ip}`);
    }catch(error){
      await agent.aiTap('移除');
      await agent.aiAssert(`smb卸载成功，文管窗口不显示${ip}`);
    }
    await system.cleanupFileManager();
    console.log('卸载成功，开始第二次挂载smb');
    // 第二次smb挂载
    
        await system.exec(`/usr/bin/dde-file-manager smb://${process.env.SMB_IP}`, 500);
        await agent.aiWaitFor('文管窗口显示');
        await agent.aiDoubleClick("SmbTest");
        console.log('输入账户密码');
        await device.typeText(process.env.SMB_USERNAME);
        await agent.aiInput( process.env.SMB_PASSWORD,'密码输入框');
        await agent.aiTap("记住密码文本");
        await agent.aiTap("连接");

        //  检测是否会出现授权弹框，需要即授权认证
        try{
          await agent.aiWaitFor('挂载或卸载文件系统需要授权');
          await device.typeText(env.testPassword,true);
          console.log('授权成功！');
        }catch(error){
          console.log('不需要系统授权');
        }
        
        await agent.aiTap('文管窗口右上角最大化', { deepThink: true });
        await agent.aiAssert(`smb挂载成功，文管窗口存在${ip}`);
        console.log("第二次smb挂载成功！")
                
  }, { timeout: 1200000, tags: ['1813509', 'level2', 'smb', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.cleanupFileManager();
    // 卸载smb
    // 右键点击process.env.SMB_IP
      await device.pressKey('Super+E');
      await agent.aiWaitFor(process.env.SMB_IP, 300);
      await agent.aiRightClick(process.env.SMB_IP, 300);
      await agent.aiWaitFor('右键菜单');
      // 点击"取消记住密码并卸载"
      try{
      await agent.aiTap('取消记住密码并卸载');
      // 等待弹出挂载或卸载文件系统需要授权的弹框
      await agent.aiWaitFor('挂载或卸载文件系统需要授权', 500);
      // 密码弹框输入配置文件密码
      await device.typeText(env.testPassword, true);
    }catch(error){
      await agent.aiTap('移除');
    }
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
