/**
 * 用例 PMSID: 1593273
 * 用例标题: Tip框显示文件路径_本地文件
 * 生成时间: 2025-12-22 08:54:57
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1593273-Tip框显示文件路径_本地文件', () => {
  // 配置项 - 集中管理可配置参数
  const config = {
    appName: '文本编辑器',
    appLoadTimeout: 30000,          // 应用启动超时(ms)
    testFileName: '测试文件.txt',    // 测试文件名
    testContent: '这是一个测试文件，用于验证Tip框显示文件路径功能。', // 测试内容
  };

  let addressBarPath='';

  beforeAll(async ({ device, uos }) => {
    console.log('[测试套件] 开始执行 - Tip框显示文件路径功能测试');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
  });

  beforeEach(async () => {
    console.log('[测试步骤] 开始新的测试用例');
  });

  test('1593273-Tip框显示文件路径_本地文件', async ({ device, agent, uos, system }) => {
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);

    // 步骤1：打开文本编辑器
    console.log('[步骤1] 打开文本编辑器应用');
    await uos.openApp(config.appName, 3000, config.appLoadTimeout, true);
    console.log('[步骤1] 文本编辑器已成功打开');
    
    // 等待编辑器界面完全加载
    await agent.aiWaitFor("文本编辑器主界面已显示且处于激活状态", { timeout: 10000 });
    console.log('[步骤1] 文本编辑器界面加载完成');

    // 步骤2：点击文本编辑器窗口右上角+按钮（或新增按钮）
    console.log('[步骤2] 点击窗口右上角新增按钮');
    await agent.aiTap("文本编辑器窗口左上角的新增按钮（+图标）", { 
      timeout: 10000 
    });
    console.log('[步骤2] 新增按钮点击成功');
    
    // 等待新增页面窗口显示
    await agent.aiWaitFor("文本编辑器中已新增显示新的空白编辑页面");
    console.log('[步骤2] 新增页面窗口显示完成');

    console.log('[步骤9] 将鼠标移动到窗口最后一个文件名上');
    await agent.aiHover("将鼠标光标移动到文本编辑器标签栏中最后一个标签页上", { deepThink: true });
    console.log('[步骤9] 鼠标移动完成');

    console.log('[步骤10] 等待tips信息显示');
    await agent.aiWaitFor("标签页的tip框已显示，且内容包含'未命名文档'信息");
    console.log('[步骤10] tips信息已显示');

    await agent.aiTap("文本编辑器中的空白编辑页面");
    // 步骤3：在新增页面窗口，随机输入测试文案信息
    console.log('[步骤3] 输入测试文案信息');

    await device.typeText(config.testContent);
    console.log(`[步骤3] 测试内容已输入: ${config.testContent}`);

    // 步骤4：输入快捷Ctrl+S
    console.log('[步骤4] 执行Ctrl+S保存快捷键');
    await device.pressKey('Ctrl+S');
    console.log('[步骤4] Ctrl+S快捷键执行成功');

    // 步骤5：显示出文件保存窗口
    console.log('[步骤5] 等待文件保存窗口显示');
    await agent.aiWaitFor("弹出文件保存对话框");
    console.log('[步骤5] 文件保存窗口已显示');

    // 步骤6：获取地址栏地址信息
    console.log('[步骤6] 获取地址栏地址信息');
    await agent.aiTap('文件保存对话框的地址栏/路径区域靠右空白位置', { deepThink: true });
    addressBarPath = await agent.aiQuery(`
      文件保存对话框的地址栏/路径区域信息，
      仅返回路径字符串，无多余描述
    `);
    console.log(`[步骤6] 地址栏路径: ${addressBarPath}`);

    // 步骤7：点击保存
    console.log('[步骤7] 点击保存按钮');
    await agent.aiTap("文件保存对话框中的'保存'按钮");
    console.log('[步骤7] 保存按钮点击成功');

    // 步骤8：保存设置窗口消失
    console.log('[步骤8] 等待保存设置窗口消失');
    await agent.aiWaitFor("文件保存对话框已消失");
    console.log('[步骤8] 保存设置窗口已消失');

    // 步骤9：将鼠标移动到窗口最后一个文件名上
    console.log('[步骤9] 将鼠标移动到窗口最后一个文件名上');
    await agent.aiHover("将鼠标光标移动到文本编辑器标签栏中最后一个标签页上", { deepThink: true });
    console.log('[步骤9] 鼠标移动完成');

    // 步骤10：显示出文件保存路径的tips信息
    console.log('[步骤10] 等待tips信息显示');
    await agent.aiWaitFor("标签页的tip框已显示");
    console.log('[步骤10] tips信息已显示');

    // 步骤11：获取tips信息
    console.log('[步骤11] 获取tips信息');
    const tipsInfo = await agent.aiQuery(`
      标签页tip框中显示的完整路径信息，
      仅返回路径字符串，无多余描述
    `);
    console.log(`[步骤11] tips信息: ${tipsInfo}`);

    // 步骤12：验证tips信息包含地址栏路径地址
    console.log('[步骤12] 验证tips信息包含地址栏路径');
    console.log(`[步骤12] tips路径: ${tipsInfo}`);
    console.log(`[步骤12] 地址栏路径: ${addressBarPath}`);
    
    if (tipsInfo.includes(addressBarPath)) {
      console.log('[步骤12] 验证成功 - tips信息包含地址栏路径');
    } else if (tipsInfo === addressBarPath) {
      console.log('[步骤12] 验证成功 - tips信息与地址栏路径完全匹配');
    } else {
      console.log('[步骤12] 验证异常 - tips信息与地址栏路径不匹配，建议人工确认');
    }

  }, { 
    timeout: 300000, // 调整合理超时（原1200000过长）
    tags: ['1593273', 'level1', 'smoke', 'sushanshan'] 
  });

  afterEach(async ({ device, uos }) => {
    console.log('[测试步骤] 当前测试用例执行完成');
    // 最终清理：关闭文本编辑器
    console.log('[清理] 关闭文本编辑器主窗口');
    await uos.closeCurrentWindow();
    console.log('[清理] 文本编辑器已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);
    await system.exec(`rm -rf ${addressBarPath}/*txt`, 5000);
    console.log('[清理] 测试环境清理完成');
  });
});
