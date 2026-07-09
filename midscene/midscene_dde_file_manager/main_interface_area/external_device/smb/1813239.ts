
/**
 * 用例 PMSID: 1813239
 * 用例标题: 共享密码-修改共享密码
 * 生成时间: 2026-03-02 10:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");


const caseDir = process.env.TESTCASE_DIR;

describe('1813239-共享密码-修改共享密码', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`echo ${env.testPassword} | sudo -S pdbedit -x "$USER"`);
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813239-共享密码-修改共享密码', async ({ device, agent, uos, system,env }) => {

    await system.exec(`mkdir ~/Desktop/1813239 `, 500);
    await agent.aiWaitFor('桌面显示1813239文件夹');
    await system.exec(`touch ~/Desktop/1813239/1813239.txt`, 500);
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const ip = ipResult.stdout.trim();
    console.log(`获取到本机IP为：${ip}`);
    await agent.aiRightClick('1813239', 300);
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
    await device.pressKey('Esc');
    // 挂载smb
    await device.pressKey('Super+E');
    await agent.aiWaitFor('文管窗口显示');
    await device.pressKey('Ctrl+L');
    await device.pressKey('Ctrl+A');
    await device.typeText(`smb://${ip}`, true);
    await agent.aiAssert("文管窗口内存在文件夹1813239");
    await agent.aiDoubleClick('1813239');
    await agent.aiAssert("显示需要授权来访问弹窗");
    await agent.aiTap('密码输入框', { deepThink: true });
    await device.typeText(env.testPassword);
    await agent.aiTap('连接');
    await agent.aiAssert("文管窗口内存在文件1813239.txt"); 

    // 修改密码
    await agent.aiTap('文管窗口右上角菜单按钮', { deepThink: true });
    await agent.aiTap('设置共享密码');
    await device.typeText("1813239",true);
    const result1 = await agent.aiBoolean('存在修改您的共享信息需要认证弹框');
      if (result1) {
          console.log('需要认证，输入系统认证密码');
          await device.typeText(env.testPassword, true);
      } else {
          console.log('不需要认证，共享密码修改成功');
      }
    // 卸载smb，重新挂载
      await system.exec(`kill -SIGTERM $(pidof dde-file-manager)  `, 500);
      await device.pressKey('Super+E');
      await agent.aiTap('文管窗口右上角最大化', { deepThink: true });
      await agent.aiWaitFor(`${ip}`, 300);
      await agent.aiRightClick(`${ip}`, 300);
      await agent.aiWaitFor('右键菜单');
      await agent.aiTap('取消记住密码并卸载');
      console.log('smb卸载成功！');
      // 挂载smb
      await device.pressKey('Ctrl+L');
      await device.pressKey('Ctrl+A');
      await device.typeText(`smb://${ip}`, true);
      await agent.aiAssert("文管窗口内存在文件夹1813239");
      await agent.aiDoubleClick('1813239');
      await agent.aiAssert("显示需要授权来访问弹窗");
      await agent.aiTap('密码输入框', { deepThink: true });
      await device.typeText('1813239');
      await agent.aiTap('连接');
      await agent.aiAssert("文管窗口内存在文件1813239.txt");
    
  }, { timeout: 1200000, tags: ['1813239', 'level2', 'smb', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.exec(`rm -rf ~/Desktop/18132* `, 500);
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const ip = ipResult.stdout.trim();
    //关闭所有文管窗口
    await system.cleanupFileManager();
    // 卸载smb
    await device.pressKey('Super+E');
    await agent.aiTap('文管窗口右上角最大化', { deepThink: true });
    //清除smb密码
    await system.exec(`echo ${env.testPassword} | sudo -S pdbedit -x "$USER"`);

    await agent.aiWaitFor(`${ip}`, 300);
    await agent.aiRightClick(`${ip}`, 300);
    await agent.aiWaitFor('右键菜单');
      // 点击"取消记住密码并卸载"
      try{
        await agent.aiTap('取消记住密码并卸载');
      }catch(error){
        await agent.aiTap('移除');
      }
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await system.exec(`kill -SIGTERM $(pidof dde-file-manager)  `, 500);
    await device.pressKey('Esc');
  });
});
