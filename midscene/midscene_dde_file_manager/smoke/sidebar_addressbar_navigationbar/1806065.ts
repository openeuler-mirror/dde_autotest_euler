/**
 * 用例 PMSID: 1806065
 * 用例标题: 固定侧边栏右键菜单
 * 生成时间: 2026-02-12
 * 用例编写人: UT000211（陈依）
 */

describe('1806065-固定侧边栏右键菜单', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await device.pressKey('Esc');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面已出现');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806065-固定侧边栏右键菜单', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，点击侧边栏的主目录按钮，点击右键菜单，查看右键菜单选项
    console.log("=== 步骤1：验证主目录右键菜单选项 ===");
    await uos.openApp('文件管理器');
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiRightClick("文件管理器侧边栏的主目录");
    await agent.aiAssert("右键菜单已打开并存在在新窗口中打开、在新标签中打开和属性选项");
    await device.pressKey('Esc');
    console.log("✅ 主目录右键菜单存在所有必需选项");

    // 步骤 2: 点击侧边栏的桌面按钮，点击右键菜单，查看右键菜单选项
    console.log("=== 步骤2：验证桌面右键菜单选项 ===");
    await agent.aiRightClick("文件管理器侧边栏的桌面");
    await agent.aiAssert("右键菜单已打开并存在在新窗口中打开、在新标签中打开和属性选项");
    await device.pressKey('Esc');
    console.log("✅ 桌面右键菜单存在所有必需选项");

    // 步骤 3: 点击侧边栏的视频按钮，点击右键菜单，查看右键菜单选项
    console.log("=== 步骤3：验证视频右键菜单选项 ===");
    await agent.aiRightClick("文件管理器侧边栏的视频");
    await agent.aiAssert("右键菜单已打开并存在在新窗口中打开、在新标签中打开和属性选项");
    await device.pressKey('Esc');
    console.log("✅ 视频右键菜单存在所有必需选项");

    // 步骤 4: 点击侧边栏的图片按钮，点击右键菜单，查看右键菜单选项
    console.log("=== 步骤4：验证图片右键菜单选项 ===");
    await agent.aiRightClick("文件管理器侧边栏的图片");
    await agent.aiAssert("右键菜单已打开并存在在新窗口中打开、在新标签中打开和属性选项");
    await device.pressKey('Esc');
    console.log("✅ 图片右键菜单存在所有必需选项");

    // 步骤 5: 点击侧边栏的文档按钮，点击右键菜单，查看右键菜单选项
    console.log("=== 步骤5：验证文档右键菜单选项 ===");
    await agent.aiRightClick("文件管理器侧边栏的文档");
    await agent.aiAssert("右键菜单已打开并存在在新窗口中打开、在新标签中打开和属性选项");
    await device.pressKey('Esc');
    console.log("✅ 文档右键菜单存在所有必需选项");

    // 步骤 6: 点击侧边栏的下载按钮，点击右键菜单，查看右键菜单选项
    console.log("=== 步骤6：验证下载右键菜单选项 ===");
    await agent.aiRightClick("文件管理器侧边栏的下载");
    await agent.aiAssert("右键菜单已打开并存在在新窗口中打开、在新标签中打开和属性选项");
    await device.pressKey('Esc');
    console.log("✅ 下载右键菜单存在所有必需选项");

    // 步骤 7: 点击侧边栏的音乐按钮，点击右键菜单，查看右键菜单选项
    console.log("=== 步骤7：验证音乐右键菜单选项 ===");
    await agent.aiRightClick("文件管理器侧边栏的音乐");
    await agent.aiAssert("右键菜单已打开并存在在新窗口中打开、在新标签中打开和属性选项");
    await device.pressKey('Esc');
    console.log("✅ 音乐右键菜单存在所有必需选项");

    console.log("===1806065-固定侧边栏右键菜单，执行成功===");

  }, { timeout: 1800000, tags: ["1806065", "level2", "smoke", "DITT", "chenyi"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('8. afterEach: 每个测试后的清理');
  });
 
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('9. afterAll: 清理测试套件');
    // 关闭文件管理器窗口
    await agent.aiTap("窗口右上角关闭按钮");
    await device.pressKey('Esc');
    // 显示桌面
    await uos.showDesktop();
  });
});
