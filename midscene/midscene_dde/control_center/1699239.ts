/**
 * 用例 PMSID: 1699239
 * 用例标题:【控制中心】【个性化】【窗口效果】窗口效果三级界面展示
 * 生成时间: 2026-06-01
 * 用例编写人:UT005044(王亮)
 */

describe('1699239-【控制中心】【个性化】【窗口效果】窗口效果三级界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1699239-【控制中心】【个性化】【窗口效果】窗口效果三级界面展示', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 打开个性化菜单界面
        await agent.aiAssert("导航栏显示：系统");
        await agent.aiTap("左侧区域的菜单项：个性化", { deepThink: true }); 
        await agent.aiAssert("导航栏显示：个性化，右侧区域存在菜单项：窗口效果");

        // 步骤 3: 打开窗口效果菜单界面
        await agent.aiTap("右侧区域的菜单项：窗口效果", { deepThink: true });   
        await agent.aiAssert("导航栏显示：个性化 / 窗口效果");  

        //检查1：插件区域界面展示检查
        await agent.aiAssert("右侧区域上方存在分类标题：界面效果，下方有三个单选项标题：最佳性能，均衡，最佳视觉，默认‘最佳视觉’项最右侧有勾选标识");
        await agent.aiAssert("右侧区域存在分类标题项：窗口设置，下方有三个设置项标题：窗口圆角，窗口移动时启用透明特效，最小化时效果；窗口圆角项默认为：中，有选中高亮边框效果；窗口移动时启用透明特效项为开关项，默认关闭；最小化时效果项为下拉菜单，默认值为：缩放");
        await agent.aiAssert("右侧区域存在标题项：不透明度调节，刻度调节类，最左侧值为：低，最右侧值为：高，默认值调节阀在刻度条的偏左侧位置，活动色高亮效果");
        await agent.aiAssert("右侧区域存在标题项：标题栏高度，下拉菜单类，最右侧有“V”图标标识，默认值为：中");
        await agent.aiAssert("右侧区域存在标题项：滚动条，下拉菜单类，最右侧有“V”图标标识，默认值为：滚动时显示");

    }, { timeout: 300000, tags: ["1699239", "level1", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');        
        //还原环境1：关闭打开的应用      
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await device.pressKey("Alt", "F4");
    });
  });
  