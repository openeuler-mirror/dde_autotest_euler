/**
 * 用例 PMSID: 1863579
 * 用例标题:【控制中心】【隐私和安全】应用权限管控-“文件和文件夹”中应用项开关关闭后禁止访问
 * 生成时间: 2025-12-23
 * 用例编写人:UT005044(王亮)
 */

describe('1863579-【控制中心】【隐私和安全】应用权限管控-“文件和文件夹”中应用项开关关闭后禁止访问', () => {
    beforeAll(async ({ device, uos, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec(`echo ${env.testPassword} | sudo -S pkill -9 -f polkit-agent-helper-deepin`);   
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1863579-【控制中心】【隐私和安全】应用权限管控-“文件和文件夹”中应用项开关关闭后禁止访问', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击隐私和安全
        await agent.aiTap("隐私和安全", { deepThink: true });
        await agent.aiAssert("导航栏显示：隐私和安全");
        await agent.aiAssert("右侧区域的列表菜单项中存在：文件和文件夹");

        // 步骤 3: 点击文件和文件夹
        await agent.aiTap("文件和文件夹", { deepThink: true });
        await agent.aiAssert("导航栏显示：隐私和安全 / 文件和文件夹");
        await agent.aiAssert("应用列表顶部显示说明文案：允许下面的应用访问您的文件和文件夹");
        await agent.aiAssert("右侧区域的应用列表中存在应用名称项：日志收集工具");

        // 步骤 4: 点击日志收集工具
        await agent.aiTap("日志收集工具", { deepThink: true });
        await agent.aiAssert("向下展示列表菜单项，6个开关项标题分别为：“文档”文件夹，“桌面”文件夹，“图片”文件夹，“视频”文件夹，“音乐”文件夹，“下载”文件夹，各项对应的最右侧展示开关，默认开启状态，活动色亮高效果");

        // 步骤 5: 关闭日志收集工具的“文档”和“图片”访问权限
        await agent.aiTap("点击“文档”文件夹项对应右侧的开关项");
        await agent.aiAssert("弹出授权框，标题文案：修改系统级权限需要认证");       
        await device.typeText(`${env.testPassword}`);
        await agent.aiTap("确定按钮");
        await agent.aiAssert("“文档”文件夹项对应右侧的开关项更新为关闭状态，灰色效果");
        await agent.aiTap("点击“图片”文件夹项对应右侧的开关项");
        await agent.aiAssert("“图片”文件夹项对应右侧的开关项更新为关闭状态，灰色效果");

        await device.pressKey("Super", "D");

        // 步骤 6: 打开日志收集工具，需要使用对应的英文名称，应用窗口没有中文名称
        await uos.openApp("log viewer", 2000, 20000, true);
        await device.pressKey("Super", "Up");
        await agent.aiAssert("界面右上角区域存在按钮：导 出");

        // 步骤 7: 日志收集工具导出日志保存
        await agent.aiTap("点击导出按钮");
        await agent.aiAssert("最上层弹出目录路径选择框，右下角存在2个按钮：取消，保存");

        //检查1：保存为文档目录时管控禁用提示
        await agent.aiTap("点击目录路径选择框中左侧区域的菜单项：文档");
        await agent.aiTap("点击目录路径选择框中右下角的按钮：保存");
        await agent.aiAssert("桌面底部弹出toast提示：导出失败，桌面右下角弹出通知提示：/usr/bin/deepin-log-Viewer已被禁止访问文件和文件夹 请前往控制中心>隐私和安全，打开应用权限。右下角按钮：前往设置");

        //检查2：保存为图片目录时管控禁用提示
        await agent.aiTap("点击导出按钮");
        await agent.aiAssert("最上层弹出目录路径选择框，右下角存在2个按钮：取消，保存");
        await agent.aiTap("点击目录路径选择框中左侧区域的菜单项：图片");
        await agent.aiTap("点击目录路径选择框中右下角的按钮：保存");
        await agent.aiAssert("桌面底部弹出toast提示：导出失败，桌面右下角弹出通知提示：/usr/bin/deepin-log-Viewer已被禁止访问文件和文件夹 请前往控制中心>隐私和安全，打开应用权限。右下角按钮：前往设置");

    }, { timeout: 600000, tags: ["1863579", "level2", "smoke"] });
  
    afterEach(async ({ system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 还原环境，恢复隐私和安全管控设置状态
        await uos.openApp("控制中心", 2000, 20000, true);
        await agent.aiTap("点击“文档”文件夹项对应右侧的开关按钮");
        await agent.aiTap("点击“图片”文件夹项对应右侧的开关按钮");
    });
  
    afterAll(async ({ uos, system, device, env }) => {
        console.log('5. afterAll: 清理测试套件');
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
        await device.pressKey("Alt", "F4");
        await system.exec(`echo ${env.testPassword} | sudo -S pkill -9 -f polkit-agent-helper-deepin`);   
    });
  });
  