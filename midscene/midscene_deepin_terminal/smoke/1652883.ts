/**
 
 * 用例 PMSID:1652883
 * 用例标题: 自定义主题中前景色、背景色、提示符PS1、提示符PS2组合设置功能
 * 生成时间: 2026-05-21
 * 用例编写人: UT000211(陈依)
 */

describe('1652883-自定义主题中前景色、背景色、提示符PS1、提示符PS2组合设置功能', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器1653057
    await system.exec('pkill -f deepin-terminal|| true');
    const TEST_USERNAME = process.env.TEST_USERNAME || 'uos';
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1652883-自定义主题中前景色、背景色、提示符PS1、提示符PS2组合设置功能', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，点击右上角三条线，点击主题，点击自定义主题，点击前景色，预期，弹出弹出的是弹出的窗口标题包含选择颜色 — 终端
    await uos.openApp("终端");
    await agent.aiWaitFor("终端窗口界面已显示");
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");
    await agent.aiTap("主题");
    await agent.aiWaitFor("主题设置界面已显示");
    await agent.aiTap("自定义主题", { deepThink: true });
    await agent.aiWaitFor("自定义主题弹出框界面已显示");
    await agent.aiTap("前景色控件");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiAssert("弹出的窗口标题包含选择颜色");

    // 步骤 2: 点击取消按钮，弹出的是弹出的窗口标题包含选择颜色 — 终端页面关闭，返回到自定义主题弹出框界面；预览效果前景色颜色未改变
    await agent.aiTap("点击选择颜色窗口取消按钮");
    await agent.aiAssert("返回到自定义主题弹出框界面");
    await agent.aiAssert("预览效果前景色颜色为绿色");

    // 步骤 3: 再次点击前景色控件，在弹出的是弹出的窗口标题包含选择颜色 — 终端中选择任意颜色，点击"确定"按钮，弹出的是弹出的窗口标题包含选择颜色 — 终端页面关闭，返回到自定义主题弹出框界面；预览效果前景色颜色显示与选择的一致
    await agent.aiTap("前景色后面的绿色方框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("弹出的窗口标题包含选择颜色");
    await agent.aiTap("选择颜色窗口基本颜色中的最后一行的粉色框");
    await agent.aiTap("点击选择颜色窗口确定按钮");
    await agent.aiAssert("返回到自定义主题弹出框界面");
    await agent.aiAssert("预览窗口中的sudo apt install deepin-terminal颜色为粉紫色");

    // 步骤 4: 点击背景色控件，在弹出的是弹出的窗口标题包含选择颜色 — 终端中选择任意颜色，点击"确定"按钮，弹出的是弹出的窗口标题包含选择颜色 — 终端页面关闭，返回到自定义主题弹出框界面；预览效果背景色颜色显示与选择的一致
    await agent.aiTap("背景色后面的方框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("弹出的窗口标题包含选择颜色");
    await agent.aiTap("选择颜色窗口基本颜色中的最后一行从右往左的第一个框");
    await agent.aiTap("点击选择颜色窗口确定按钮");
    await agent.aiAssert("返回到自定义主题弹出框界面");
    await agent.aiAssert("预览效果背景色颜色显示为白色");

    // 步骤 5: 点击提示符PS1控件，在弹出的窗口标题包含选择颜色中选择任意颜色，点击"确定"按钮，选择颜色窗口关闭，返回到自定义主题弹出框界面；预览效果提示符PS1颜色显示与选择的一致
    await agent.aiTap("提示符PS1后面的方框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("弹出的窗口标题包含选择颜色");
    await agent.aiTap("选择颜色窗口基本颜色中的最后一行的青蓝色框");
    await agent.aiTap("点击选择颜色窗口确定按钮");
    await agent.aiAssert("返回到自定义主题弹出框界面");
    await agent.aiAssert("预览效果中hyde@hyde-pc颜色为青蓝色");

    // 步骤 6: 点击提示符PS2控件，在弹出的窗口标题包含选择颜色中选择任意颜色，点击"确定"按钮，选择颜色窗口关闭，返回到自定义主题弹出框界面；预览效果提示符PS2颜色显示与选择的一致
    await agent.aiTap("提示符PS2后面的方框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("弹出的窗口标题包含选择颜色");
    await agent.aiTap("选择颜色窗口基本颜色中的最后一列的黄色框");
    await agent.aiTap("点击选择颜色窗口确定按钮");
    await agent.aiAssert("返回到自定义主题弹出框界面");
    await agent.aiAssert("预览效果中~/Desktop颜色为黄色");

    // 步骤 7: 点击自定义主题界面"确定"按钮，预期，保存自定义主题的更改设置；自定义主题弹出框关闭，自定义主题被激活
    await agent.aiTap("自定义主题界面确定按钮", { deepThink: true });
    await agent.aiWaitFor("自定义主题弹出框已关闭");
    await agent.aiAssert("终端输入栏的${TEST_USERNAME}@${TEST_USERNAME}-PC为青蓝色");
    await device.typeText("cd ~/Desktop");
    await device.pressKey("Enter");
    await agent.aiAssert("终端输入栏的~/Desktop为黄色");
    await agent.aiAssert("终端输入栏的cd ~/Desktop命令是粉紫色");
    await agent.aiAssert("终端背景为白色");

    // 步骤 8: 点击右上角三条线，点击主题，点击自定义主题，点击前景色，点击背景色控件，在弹出的是弹出的窗口标题包含选择颜色 — 终端中选择任意颜色，点击"确定"按钮，弹出的是弹出的窗口标题包含选择颜色 — 终端页面关闭，点击自定义主题界面"取消"按钮，取消本次自定义主题更改，自定义主题弹出框关闭
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");
    await agent.aiTap("主题");
    await agent.aiWaitFor("主题设置界面已显示");
    await agent.aiTap("自定义主题", { deepThink: true });
    await agent.aiWaitFor("自定义主题弹出框界面已显示");
    await agent.aiTap("背景色后面的方框");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiWaitFor("弹出的窗口标题包含选择颜色 — 终端");
    await agent.aiTap("弹出的窗口标题包含选择颜色 — 终端中任意颜色");
    await agent.aiTap("弹出的窗口的确定按钮")
    await agent.aiTap("自定义主题界面取消按钮");
    await agent.aiWaitFor("自定义主题弹出框已关闭");
    await agent.aiAssert("终端输入栏的${TEST_USERNAME}@${TEST_USERNAME}-PC为青蓝色");
    await agent.aiAssert("终端输入栏的~/Desktop为黄色");
    await agent.aiAssert("终端输入栏的cd ~/Desktop命令是粉紫色");
    await agent.aiAssert("终端背景为白色");
    await agent.aiTap("终端右上角三条横线", { deepThink: true });
    await agent.aiWaitFor("终端右上角的主菜单");
    await agent.aiTap("主题");
    await agent.aiWaitFor("主题设置界面已显示");
    await agent.aiTap("深色", { deepThink: true });
    await agent.aiAssert("终端背景色为深色")
    
  }, { timeout: 1500000, tags: ['1652883', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复环境：使用命令修改配置文件指定参数
    // 修改[Background]对应的Color=37,37,37
    await system.exec('sed -i "/^\\[Background\\]$/,/^\\[/s/^Color=.*/Color=37,37,37/" ~/.config/deepin/deepin-terminal/customTheme.colorscheme || true');
    // 修改[Color2Intense]对应的Color=133,153,0
    await system.exec('sed -i "/^\\[Color2Intense\\]$/,/^\\[/s/^Color=.*/Color=133,153,0/" ~/.config/deepin/deepin-terminal/customTheme.colorscheme || true');
    // 修改[Color4Intense]对应的Color=52,101,164
    await system.exec('sed -i "/^\\[Color4Intense\\]$/,/^\\[/s/^Color=.*/Color=52,101,164/" ~/.config/deepin/deepin-terminal/customTheme.colorscheme || true');
    // 修改[Foreground]对应的Color=0,255,0
    await system.exec('sed -i "/^\\[Foreground\\]$/,/^\\[/s/^Color=.*/Color=0,255,0/" ~/.config/deepin/deepin-terminal/customTheme.colorscheme || true');
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
