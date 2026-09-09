
/**
 * 用例 PMSID: 1832167
 * 用例标题: 【启动器】【全屏模式】【搜索框】搜索框右键菜单及功能
 * 生成时间: 2026-04-14 15:19:39
 * 用例编写人: UT002485(卢燕)
 */

describe('1832167-【启动器】【全屏模式】【搜索框】搜索框右键菜单及功能', () => {
  const searchInputElements = [
    "复制",
    "剪切",
    "粘贴",
    "全选",
    "撤销",
    "重做",
   ];

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832167-【启动器】【全屏模式】【搜索框】搜索框右键菜单及功能', async ({ device, agent, uos }) => {
    // 打开启动器
    await uos.openLauncher();  

    // 切换为全屏模式
    await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
      images: [
        {
          name: '全屏模式小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/fullscreen.png',
        },
      ],
      deepThink: true,
      });
    await agent.aiWaitFor("启动器页面已显示");
    await agent.aiAssert("启动器页面全屏显示，底部中央有一个带放大镜图标的搜索框");

    // 验证搜索框右键菜单项
    await agent.aiRightClick("启动器页面底部中间的搜索");
    for await (const element of searchInputElements) {
      await agent.aiAssert(`搜索右键菜单中存在${element}`, {
        timeoutMs: 5000,
        checkIntervalMs: 500
    });
    console.log(`验证通过: ${element}`);
    }
    console.log("搜索框右键菜单项验证通过");

   //验证搜索框右键功能：撤销
    await agent.aiTap("启动器页面底部中间的放大镜小图标", { deepThink: true });
    await device.typeText('邮箱');
    await agent.aiWaitFor("启动器页面左上角显示邮箱应用图标");
    await agent.aiRightClick("启动器页面底部中间的搜索");
    await agent.aiTap("搜索右键菜单项中的撤销");
    await agent.aiWaitFor("启动器页面底部中间的搜索框内容显示为空，启动器页面显示多款应用软件图标"); 
    await agent.aiAssert("启动器页面底部中间的搜索框内容显示为空，启动器页面显示多款应用软件图标"); 

   //验证搜索框右键功能：重做    
    await agent.aiRightClick("启动器页面底部中间的搜索");
    await agent.aiTap("搜索右键菜单项中的重做");
    await agent.aiWaitFor("启动器页面底部中间的搜索框内容显示为邮箱，启动器页面左上角显示邮箱应用图标");   
    await agent.aiAssert("启动器页面底部中间的搜索框内容显示为邮箱，启动器页面左上角显示邮箱应用图标"); 

   //验证搜索框右键功能：全选
    await agent.aiRightClick("启动器页面底部中间的搜索");
    await agent.aiTap("搜索右键菜单项中的全选");
    await agent.aiWaitFor("搜索框内的邮箱文字处于选中状态", { deepThink: true });   
    await agent.aiAssert("搜索框内的邮箱文字处于选中状态"); 

   //验证搜索框右键功能：剪切
    await agent.aiRightClick("搜索框内的邮箱字样");
    await agent.aiTap("搜索右键菜单项中的剪切"); 
    await agent.aiWaitFor("启动器页面底部中间的搜索框内容显示为空，启动器页面显示多款应用软件图标"); 
    await agent.aiAssert("启动器页面底部中间的搜索框内容显示为空，启动器页面显示多款应用软件图标"); 

    //验证搜索框右键功能：粘贴
    await agent.aiRightClick("启动器页面底部中间的搜索");
    await agent.aiTap("搜索右键菜单项中的粘贴"); 
    await agent.aiWaitFor("搜索框内显示邮箱，启动器页面左上角显示邮箱应用图标"); 
    await agent.aiAssert("搜索框内显示邮箱，启动器页面左上角显示邮箱应用图标");   

    //验证搜索框右键功能：复制
    await agent.aiRightClick("启动器页面底部中间的搜索");
    await agent.aiTap("搜索右键菜单项中的全选");
    await agent.aiWaitFor("搜索框内的邮箱文字处于选中状态", { deepThink: true });   
    await agent.aiRightClick("搜索框内的邮箱字样");
    await agent.aiTap("搜索右键菜单项中的复制"); 
    await device.pressKey('Delete');
    await agent.aiRightClick("启动器页面底部中间的搜索");
    await agent.aiTap("搜索右键菜单项中的粘贴"); 
    await agent.aiWaitFor("搜索框内显示邮箱，启动器页面左上角显示邮箱应用图标"); 
    await agent.aiAssert("搜索框内显示邮箱，启动器页面左上角显示邮箱应用图标"); 
  }, { timeout: 600000, tags: ['1832167', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复启动器窗口模式设置
    await agent.aiTap({
    prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
    images: [
      {
        name: '窗口模式小图标',
        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/windowed.png',
      },
      ],
    deepThink: true,
    });
    await agent.aiWaitFor("启动器页面已显示");
    await agent.aiAssert("启动器页面显示我的常用、最近安装");
    await uos.showDesktop();
  });
});
