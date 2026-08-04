/**
 * 用例 PMSID: 1975159
 * 用例标题:【控制中心】【账户】新安装系统默认创建的账户保存的密码默认为国密算法sm3 
 * 生成时间: 2026-03-19
 * 用例编写人:UT005044(王亮)
 */

describe('1975159-【控制中心】【账户】新安装系统默认创建的账户保存的密码默认为国密算法sm3', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1975159-【控制中心】【账户】新安装系统默认创建的账户保存的密码默认为国密算法sm3', async ({ device, agent, env, system }) => {

        // 步骤1：获取当前登录账户名
        const currentUserResult = await system.exec('whoami');
        const currentUser = currentUserResult.stdout.trim();
        console.log(`当前登录账户名: ${currentUser}`);
        if (!currentUser) {
            throw new Error('获取当前账户名失败');
        }

        // 步骤2：读取/etc/shadow文件中当前账户的加密算法数据
        const shadowResult = await system.exec(`echo ${env.testPassword} | sudo -S cat /etc/shadow | grep '^${currentUser}:' | awk -F'\$' '{print $2}'`);
        const userShadowLine = shadowResult.stdout.trim();      
        console.log(`当前登录账户名的加密算法: ${userShadowLine}`);
        if (!userShadowLine) {
            throw new Error(`未在/etc/shadow中找到账户[${userShadowLine}]的信息`);
        }

        // 步骤3：获取加密算法dconfig配置
        const encryptAlg = await system.exec(`dde-dconfig get org.deepin.dde.daemon -r org.deepin.dde.daemon.account passwordEncryptionAlgorithm`);
        const encryptAlgDonf = encryptAlg.stdout.trim().replace(/^['"]|['"]$/g, '') ;     
        console.log(`当前系统配置的默认加密算法: ${encryptAlgDonf}`);
        if (!encryptAlgDonf) {
            throw new Error(`未在Dconfig配置中找到系统的加密算法信息[${encryptAlgDonf}]`);
        }     

        // 检查4：断言加密算法与目标配置的sm3一致
        await agent.aiAssert(`[${userShadowLine}]的值与[${encryptAlgDonf}]的值一致`);

    }, { timeout: 100000, tags: ["1975159", "level2", "smoke" ] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  