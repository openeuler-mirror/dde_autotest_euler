/**
 * 用例 PMSID: 1846457
 * 用例标题:【桌面】【OSD】【3D窗口特效】窗口特效模式OSD界面展示
 * 生成时间: 2025-12-17
 * 用例编写人:UT005044(王亮)
 */

describe('1846457-【桌面】【OSD】【3D窗口特效】窗口特效模式OSD界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
        userType = await system.exec(`dde-dconfig get org.kde.kwin -r org.kde.kwin.compositing user_type`);
        if (userType.success) {
            console.log('输出:', userType.stdout);
        } else {
            console.error('错误:', userType.stderr);
        }
    });
  
    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1846457-【桌面】【OSD】【3D窗口特效】窗口特效模式OSD界面展示', async ({ device, agent, uos }) => {
        // 步骤 1: 快捷键Shift+Super+Tab
        await device.keyDown("Super", "Shift", "Tab");
        await device.keyUp("Tab");

        //检查1：窗口特效模式OSD界面的展示
        await agent.aiAssert("在屏幕偏下方的居中位置展示OSD框, 存在三个菜单项，从上到下标题依次为：标题1：最佳性能，左侧展示对应图标，第二行副文案：关闭所有界面和窗口特效，保障系统高效运行 \
            标题2：均衡，左侧展示对应图标，第二行副文案：均衡：限制部分窗口特效，保障出色的视觉体验，同时维持系统流畅运行 \
            标题3：最佳视觉，左侧展示对应图标，第二行副文案：最佳视觉：启用所有界面和窗口特效，体验最佳视觉效果;最右侧存在勾选态，高亮色标识");

    }, { timeout: 120000, tags: ["1846457", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, env, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 还原为系统初始的窗口特效模式
        await device.keyUp("Super", "Shift");
        await system.exec(`dde-dconfig set org.kde.kwin -r org.kde.kwin.compositing user_type -v ${userType.stdout}`);
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  