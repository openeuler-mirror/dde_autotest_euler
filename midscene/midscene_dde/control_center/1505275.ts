/**
 * 用例 PMSID: 1505275
 * 用例标题:【控制中心】【账户】【权限】授权认证提示框认证流程
 * 生成时间: 2026-06-18
 * 用例编写人:UT005044(王亮)
 */

describe('1505275-【控制中心】【账户】【权限】授权认证提示框认证流程', () => {
    const testData = {
        username: ['user1'],
        password: ['test@user1']
    };

    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');

    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1505275-【控制中心】【账户】【权限】授权认证提示框认证流程', async ({ device, agent, env, uos, system }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 延迟2秒（避免控制中心打开加裁过慢）

        // 步骤 2: 打开账户界面
        await agent.aiTap("账户", { deepThink: true });
        await agent.aiAssert("导航栏显示：账户");
        await agent.aiAssert("右侧区域的存在按钮标题：添加新用户");

        // 步骤 3: 创建账户
        await agent.aiTap("添加新用户", { deepThink: true });   
        await agent.aiWaitFor("创建新用户弹框");
        await agent.aiTap("点击用户名右侧的输入框", { deepThink: true });   
        await device.typeText(testData.username[0]);
        await agent.aiTap("点击新密码右侧的输入框", { deepThink: true });   
        await device.typeText(testData.password[0]);
        await agent.aiTap("点击重复密码右侧的输入框", { deepThink: true });  
        await device.typeText(testData.password[0]); 
        await agent.aiTap("点击创建用户按钮", { deepThink: true }); 

        // 检查1：弹出授权框，和授权框界面展示
        await agent.aiAssert("弹框中的标题文案：修改用户数据需要认证，下方的账户默认为：uos,密码框有焦点和灰色提示文案：请输入密码，底部存在按钮：取消和确定");

        // 检查2：输入错误密码展示
        await device.typeText(testData.password[0]);
        await agent.aiTap("点击确定按钮", { deepThink: true });  
        await agent.aiAssert("弹出TIPS文案：密码验证失败，您还可以尝试4次，密码框底色置红，密码字符全选状态");

        // 检查2：输入正确密码展示     
        await device.typeText(env.testPassword);
        await agent.aiTap("点击确定按钮", { deepThink: true }); 
        await agent.aiAssert("认证成功，弹框不存在");

    }, { timeout: 600000, tags: ["1505275", "level2", "smoke" ] });
  
    afterEach(async ({ device, system, uos, env }) => {
        console.log('4. afterEach: 每个测试后的清理');

        //清理环境1，删除新创建的用户
        const ret = await system.exec(`echo  ${env.testPassword} | sudo -S userdel -r ${testData.username[0]}`);
        if (ret.success && ret.stdout != "" ) {
            console.log ('删除用户成功 ', ret.stdout);
        } else {
            console.log ('删除用户失败,或不存在', ret.stderr);
        }
        await uos.closeCurrentWindow();        

        //清理环境2，清理polkit 弹窗
        console.log('检查是否存在 polkit 弹窗...');
        const checkResult = await system.exec('pgrep -f polkit-agent-helper-deepin');
        if (checkResult.success && checkResult.stdout.trim() !== '') {
            console.log('检测到 polkit 弹窗进程，准备强杀...');
            await system.exec(`echo ${env.testPassword} | sudo -S pkill -9 -f polkit-agent-helper-deepin`);
            console.log('polkit 弹窗进程已强杀');
        } else {
            console.log('未检测到 polkit 弹窗');
        }
    });
  
    afterAll(async ({ uos, agent, system }) => {
        console.log('5. afterAll: 清理测试套件');
        //还原环境：涉及到授权框，确认控制中心是否正常退出，并强制杀掉
        await system.exec(`killall dde-control-center`);
    });
  });
  