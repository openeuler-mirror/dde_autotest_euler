
/**
 * 用例 PMSID: 1813297
 * 用例标题: 右键共享-文件夹右键共享到smb
 * 生成时间: 2026-03-02 10:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1813297-右键共享-文件夹右键共享到smb', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813297-右键共享-文件夹右键共享到smb', async ({ device, agent, uos, system,env }) => {
    await system.exec(`mkdir ~/Desktop/1813297 & mkdir ~/Desktop/181329x`, 500);
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const ip = ipResult.stdout.trim();
    console.log(`获取到本机IP为：${ip}`);
    await agent.aiRightClick('1813297', 300);
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

    await agent.aiRightClick('181329x', 300);
    await agent.aiTap('右键菜单中属性');
    await agent.aiTap('共享管理');
    await agent.aiTap('勾选共享此文件夹', { deepThink: true });
    await agent.aiAssert('成功勾选共享此文件夹');
    await device.pressKey('Esc');

    //挂载smb
    await system.exec(`/usr/bin/dde-file-manager smb://${ip}`, 500);
    await agent.aiWaitFor('文管窗口显示');
    const resultf = await agent.aiBoolean('文管窗口是最大化状态');
    if(resultf){
      console.log('文管窗口已是最大化');
    }else{
      await agent.aiTap('文管窗口右上角最大化', { deepThink: true });
    }
    
    await agent.aiAssert(`文管窗口左侧边栏选中${ip}，文管窗口内存在1813297、和181329x文件夹`);
    
  }, { timeout: 1200000, tags: ['1813297', 'level2', 'smb', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Desktop/181329* `, 500);
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
