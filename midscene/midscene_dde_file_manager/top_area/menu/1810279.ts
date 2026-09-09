/**
 * 用例 PMSID: 1810279
 * 用例标题:  不勾选【显示隐藏文件】和【显示文件扩展名】-在文管内重命名文件-删除文件名-自动恢复文件名，不弹窗提示
 * 生成时间: 2026-02-03 19:00:00
 * 用例编写人: UT001774(李炎)
 */

describe('1810279-不勾选【显示隐藏文件】和【显示文件扩展名】-在文管内重命名文件-删除文件名-自动恢复文件名，不弹窗提示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    //处理可能存在的弹框和右键菜单
    await device.pressKey('Esc');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager', 500);
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理创建的测试文件
    await system.exec('rm -rf ~/Desktop/1810279*', 500);
  });

  test('1810279-不勾选【显示隐藏文件】和【显示文件扩展名】-在文管内重命名文件-删除文件名-自动恢复文件名，不弹窗提示', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1810279-不勾选【显示隐藏文件】和【显示文件扩展名】-在文管内重命名文件-删除文件名-自动恢复文件名，不弹窗提示 ===');

    // 前置条件,创建测试文件,不勾选【显示隐藏文件】和【显示文件扩展名】
    await system.exec('touch ~/Desktop/1810279.txt', 500);
    await system.exec('mkdir ~/Desktop/1810279', 500);
    console.log('步骤1: 打开文件管理器');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角的菜单图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("基础设置", { deepThink: true });
    // 检查项，基础设置-文件和目录
    console.log('存在文件和目录');
    await agent.aiAssert("显示文件和目录");
    //设置项，"显示隐藏文件"，默认值：未勾选
    await agent.aiTap("文件和目录", { deepThink: true });
    await agent.aiAssert("显示隐藏文件左侧没有蓝色√");
    console.log('✅ 设置项："显示隐藏文件"默认未勾选');
    //取消勾选【显示文件扩展名】
    await agent.aiTap("取消勾选显示文件扩展名左侧方框的中心", { deepThink: true });
    await agent.aiAssert("显示文件扩展名左侧没有蓝色√");
    // 关闭设置窗口
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');

    //步骤1:在文管内重命名文件/文件夹，删除文件名
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiRightClick("1810279.txt");
    await agent.aiTap("重命名");
    await device.pressKey("Delete");
    await device.pressKey("Enter");
    //自动恢复文件名，不弹窗提示
    await agent.aiAssert("桌面显示1810279.txt文件");
    await agent.aiAssert("未显示弹框");

    //步骤2:在桌面重命名文件/文件夹，删除文件名
    await uos.showDesktop();
    await agent.aiRightClick("1810279");
    await agent.aiTap("重命名");
    await device.pressKey("Delete");
    await device.pressKey("Enter");
    //自动恢复文件名，不弹窗提示
    await agent.aiAssert("桌面显示1810279文件夹");
    await agent.aiAssert("未显示弹框");

    console.log('✅ 1810279用例测试完成');

  }, { timeout: 600000, tags: ["1810279", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件
    await system.exec('rm -rf ~/Desktop/1810279*', 500);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });






  
});







