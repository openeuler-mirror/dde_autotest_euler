/**
 * 用例 PMSID: 1975531
 * 用例标题:【控制中心】【账户】终端修改用户密码后保存的密码默认为国密算法sm3
 * 生成时间: 2026-03-31
 * 用例编写人:UT005044(王亮)
 */

describe('1975531-【控制中心】【账户】终端修改用户密码后保存的密码默认为国密算法sm3', () => {
    const testData = {
        username: ['user1', 'user2'],
        password: ['test@user1', 'test@user2'],
        resetpwd: ['test1@user1', 'test2@user2'],
        usertype: [0,1]
    };

    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1975531-【控制中心】【账户】终端修改用户密码后保存的密码默认为国密算法sm3', async ({ device, agent, env, uos, system }) => {
        // 步骤1：获取加密算法dconfig配置
        const encryptAlg = await system.exec(`dde-dconfig get org.deepin.dde.daemon -r org.deepin.dde.daemon.account passwordEncryptionAlgorithm`);
        const encryptAlgDonf = encryptAlg.stdout.trim().replace(/^['"]|['"]$/g, '') ;     
        console.log(`当前系统配置的默认加密算法: ${encryptAlgDonf}`);
        if (!encryptAlgDonf) {
            throw new Error(`未在Dconfig配置中找到系统的加密算法信息[${encryptAlgDonf}]`);
        } 

        // 步骤 2: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 延迟2秒（避免控制中心打开加裁过慢）

        // 步骤 3: 打开账户界面
        await agent.aiTap("账户", { deepThink: true });
        await agent.aiAssert("导航栏显示：账户");
        await agent.aiAssert("右侧区域的存在按钮标题：添加新用户");

        for (let i = 0; i < testData.username.length; i++) {
            console.log(`开始创建用户: ${testData.username[i]}`);
            // 步骤 4: 创建账户
            await agent.aiTap("添加新用户", { deepThink: true });   
            await agent.aiWaitFor("创建新用户弹框");
            if ( testData.usertype[i] === 1 ) {
                await agent.aiTap("点击标准用户", { deepThink: true });   
                await agent.aiTap("点击管理员", { deepThink: true });   
                await new Promise(resolve => setTimeout(resolve, 1000)); // 延迟1秒（避免过快操作）
            }
            await agent.aiTap("点击用户名右侧的输入框", { deepThink: true });   
            await device.typeText(testData.username[i]);
            await agent.aiTap("点击新密码右侧的输入框", { deepThink: true });   
            await device.typeText(testData.password[i]);
            await agent.aiTap("点击重复密码右侧的输入框", { deepThink: true });  
            await device.typeText(testData.password[i]); 
            await agent.aiTap("点击创建用户按钮", { deepThink: true }); 
            if ( await agent.aiBoolean("是否有修改用户数据需要认证的弹框", { timeout: 3000 })) {
                await device.typeText(env.testPassword);
                await agent.aiTap("点击确定按钮", { deepThink: true });  
            }
            // 可选：等待上一次操作完成（根据实际需求调整）
            await new Promise(resolve => setTimeout(resolve, 2000)); // 延迟2秒（避免过快操作）
            console.log(`${testData.username[i]}用户创建完成！`);

            // 步骤 5: 终端修改新建账户的密码
            const pwdResult = await system.exec(`echo ${env.testPassword} | sudo -S su -c "echo ${testData.resetpwd[i]} | passwd --stdin ${testData.username[i]}"`);

            // 步骤6：读取/etc/shadow文件中对应账户的加密算法数据
            const shadowResult = await system.exec(`echo ${env.testPassword} | sudo -S cat /etc/shadow | grep '^${testData.username[i]}:' | awk -F'\$' '{print $2}'`);
            const userShadowLine = shadowResult.stdout.trim();      
            console.log(`当前登录账户名${testData.username[i]}的加密算法: ${userShadowLine}`);
            if (!userShadowLine) {
                throw new Error(`未在/etc/shadow中找到账户[${userShadowLine}]的信息`);
            }

            // 检查1：断言加密算法与目标配置的sm3一致
            await agent.aiAssert(`[${userShadowLine}]的值与[${encryptAlgDonf}]的值一致`);
        }               

    }, { timeout: 600000, tags: ["1975531", "level2", "smoke" ] });
  
    afterEach(async ({ device, system, uos, env }) => {
        console.log('4. afterEach: 每个测试后的清理');

        //清理环境，删除新创建的用户
        for (let i = 0; i < testData.username.length; i++) {
            const ret = await system.exec(`echo  ${env.testPassword} | sudo -S userdel -r ${testData.username[i]}`);
            if (ret.success && ret.stdout != "" ) {
                console.log ('删除用户成功 ', ret.stdout);
            } else {
                console.log ('删除用户失败,或不存在', ret.stderr);
            }
        }

        await system.exec(`echo ${env.testPassword} | sudo -S pkill -9 -f polkit-agent-helper-deepin`);   
    });
  
    afterAll(async ({ uos, agent, system }) => {
        console.log('5. afterAll: 清理测试套件');
        //还原环境：涉及到授权框，确认控制中心是否正常退出，并强制杀掉
        await system.exec(`killall dde-control-center`);
    });
  });
  