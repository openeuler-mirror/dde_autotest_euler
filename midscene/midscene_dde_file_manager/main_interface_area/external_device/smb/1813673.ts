
/**
 * 用例 PMSID: 1813673
 * 用例标题: SMB-匿名挂载
 * 生成时间: 2026-03-02 10:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");


const caseDir = process.env.TESTCASE_DIR;

describe('1813673-SMB-匿名挂载', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813673-SMB-匿名挂载', async ({ device, agent, uos, system,env }) => {

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

    await agent.aiTap('文管窗口右上角X关闭文管窗口');

    await system.exec(`mkdir ~/Desktop/1813673 `, 500);
    await system.exec(`touch ~/Desktop/1813673/1813673.txt`, 500);
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const ip = ipResult.stdout.trim();
    console.log(`获取到本机IP为：${ip}`);
    await agent.aiRightClick('1813673', 300);
    await agent.aiTap('右键菜单中共享文件夹');
    await agent.aiTap('勾选共享此文件夹', { deepThink: true });
    // 判断是否需要设置密码和认证
    const result = await agent.aiBoolean('存在请输入共享密码弹框弹框');
      if (result) {
          console.log('输入系统密码作为smb密码');
          await agent.aiTap('密码输入框', { deepThink: true });
          await device.typeText(env.testPassword, true);
          console.log('需要认证，输入系统认证密码');
          await agent.aiTap('密码输入框', { deepThink: true });
          await device.typeText(env.testPassword, true);
      } else {
          console.log('不需要设置smb密码，不需要认证，smb共享目录设置成功');
      }
    const resulta = await agent.aiBoolean('存在需要授权弹框');
      if(resulta){
          console.log('需要授权，输入系统认证密码');
          await agent.aiTap('密码输入框', { deepThink: true });
          await device.typeText(env.testPassword, true);
      }else{
          console.log('不需要授权，smb共享目录设置成功');
      }   
    await system.exec("sleep 2");    
    await agent.aiAssert('成功勾选共享此文件夹');
    await agent.aiTap('不允许');
    await agent.aiTap('允许');
    await device.pressKey('Esc');

    await device.pressKey('Super+E');
    await agent.aiWaitFor('文管窗口显示');
    await device.pressKey('Ctrl+L');
    await device.pressKey('Ctrl+A');
    await device.typeText(`smb://${ip}`, true);
    await agent.aiAssert("文管窗口内存在文件夹1813673");
    await agent.aiDoubleClick('1813673');
    await agent.aiAssert("显示需要授权来访问弹窗");
    await agent.aiTap('匿名');
    await agent.aiTap('连接');
    await agent.aiAssert("文管窗口内存在文件1813673.txt");
    
  }, { timeout: 1200000, tags: ['1813673', 'level3', 'smb', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.exec(`rm -rf ~/Desktop/18136* `, 500);
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const ip = ipResult.stdout.trim();
    //关闭所有文管窗口
    await system.cleanupFileManager();
    // 卸载smb
      await device.pressKey('Super+E');
      
      await agent.aiWaitFor(`${ip}`, 300);
      await agent.aiRightClick(`${ip}`, 300);
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
