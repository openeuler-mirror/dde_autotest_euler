
/**
 * 用例 PMSID: 1813515
 * 用例标题: 挂载smb时关闭鉴权窗口，双击导航栏面包屑不会使文管崩溃
 * 生成时间: 2026-03-02 10:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1813515-挂载smb时关闭鉴权窗口，双击导航栏面包屑不会使文管崩溃', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813515-挂载smb时关闭鉴权窗口，双击导航栏面包屑不会使文管崩溃', async ({ device, agent, uos, system,env }) => {
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

    await system.exec(`/usr/bin/dde-file-manager smb://${process.env.SMB_IP}`, 500);
    await agent.aiWaitFor('文管窗口显示');
    await agent.aiTap('文管窗口右上角最大化', { deepThink: true });
    await agent.aiAssert(`文管窗口左侧边栏选中${process.env.SMB_IP}，文管窗口内存在SmbTest文件夹`);

    await agent.aiDoubleClick("SmbTest");
    await agent.aiWaitFor("有需要授权来访问弹窗显示");
    await device.pressKey('Esc');
    await agent.aiAssert("无需要授权来访问弹窗显示");

    await agent.aiDoubleClick("文管窗口顶部地址栏SmbTest");
    await agent.aiAssert("文管窗口存在并且显示需要授权来访问弹窗");
    await system.exec(`killall dde-file-manager`, 500);
    
  }, { timeout: 1200000, tags: ['1813515', 'level3', 'smb', 'huhongjie'] });

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
