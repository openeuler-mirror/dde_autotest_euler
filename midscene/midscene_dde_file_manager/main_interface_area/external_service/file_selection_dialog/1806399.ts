
/**
 * 用例 PMSID: 1806399
 * 用例标题: 文管选择窗-控制中心调用
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806399-文管选择窗-控制中心调用', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806399-文管选择窗-控制中心调用', async ({ device, agent, uos, system }) => {
    
    await uos.openApp("控制中心");
    await agent.aiTap('窗口左侧边栏账户', { deepThink: true });
    await agent.aiAssert("窗口右侧显示账户信息");
    
    const result = await agent.aiBoolean('左侧账户信息上方用户头像图片为向日葵');
    if (result) {
        console.log('图片为向日葵，跳过设置');
    } else {
        console.log('头像图片不为向日葵，设置为向日葵');
            // 头像切换为向日葵
        await agent.aiTap('左侧账户信息上方用户头像');
        await agent.aiTap('表情符号');
        await agent.aiTap('向日葵', { deepThink: true });
        await agent.aiTap('弹窗下方保存');
        await agent.aiAssert('用户头像改为向日葵”');
    }

    // 切换为自定义图片
    await agent.aiTap('点击左上角用户头像向日葵');
    await agent.aiTap('自定义图片');
    await agent.aiTap('弹窗中“+”按钮', { deepThink: true });
    await agent.aiAssert("打开文件选择弹窗");
    await agent.aiTap('文管选择弹窗左侧边栏图片模块');
    await agent.aiDoubleClick('Wallpapers上方文件夹图标');
    await agent.aiTap('desktop.jpg');
    await agent.aiTap('弹窗下方打开');
    await agent.aiAssert('用户头像变为带绿色风格图片');

  }, { timeout: 1200000, tags: ['1806399', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Documents/1806399* & rm -rf ~/Downloads/1806399* `, 500);
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-control-center & killall dde-file-dialog', 500);
  });
});
