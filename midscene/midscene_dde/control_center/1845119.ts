/**
 * 用例 PMSID: 1845119
 * 用例标题:【控制中心】【账户】【自动登录】自动登录开启后，同步开启白盒密码技术
 * 生成时间: 2026-01-29
 * 用例编写人:UT005044(王亮)
 */

describe('1845119-【控制中心】【账户】【自动登录】自动登录开启后，同步开启白盒密码技术', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1845119-【控制中心】【账户】【自动登录】自动登录开启后，同步开启白盒密码技术', async ({ device, agent, uos, env, system }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

       // 步骤 2: 点击账户
        await agent.aiTap("账户", { deepThink: true });
        await agent.aiAssert("导航栏显示：账户");
        await agent.aiAssert("右侧区域中存在设置项标题：自动登录，对应最右侧展示开关按钮，默认关闭状态，灰色效果");

        // 步骤 3: 开启自动登录的开关
        await agent.aiTap("点击自动登录设置项同一水平线最右侧的灰色开关按钮", { deepThink: true });
        await device.typeText(env.testPassword);
        await agent.aiTap("确定按钮", { deepThink: true });
        await agent.aiWaitFor("自动登录设置项同一水平线对应最右侧的开关按钮更新为开启状态", { timeout: 6000 });
        await agent.aiAssert("授权框关闭，“自动登录”设置项对应最右侧的开关按钮开启，更新为活动色高亮效果")

        // 检查 1: 白盒密码技术文件存在且状态内容为11
        const ret = await system.exec('cat ~/.local/share/deepin-keyrings-wb/status');
        if (ret.success) {
            console.log ('执行成功status内容：', ret.stdout);
        } else {
            console.error ('执行失败:', ret.stderr);
        }
        await agent.aiAssert(`${ret.success} 等于true，且 ${ret.stdout} 等于11，表示文件存在，且内容状态正常`);

    }, { timeout: 600000, tags: ["1845119", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos, env }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 还原环境1: 关闭自动登录的开关项
        await agent.aiTap("点击“自动登录”设置项最右侧的开关按钮", { deepThink: true });
        await device.typeText(env.testPassword);
        await agent.aiTap("确定按钮", { deepThink: true });
        await agent.aiWaitFor("自动登录设置项对应最右侧的开关按钮更新为关闭状态", { timeout: 6000 });
        
        // 还原环境2，恢复窗口大小并退出
        await device.pressKey("Esc");
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  