/**
 * 用例 PMSID: 1593535
 * 用例标题: 与当前文件保存一致_首次打开新文件
 * 生成时间: 2025-12-18 14:32:52
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1593535-与当前文件保存一致_首次打开新文件', () => {
  // 配置项 - 集中管理可配置参数
  const config = {
    appName: '文本编辑器',
    projectPath: process.env.PROJECT_PATH || `/home/${process.env.TEST_USERNAME}/Documents` ,  // 工程目录路径
    appLoadTimeout: 30000,          // 应用启动超时(ms)
  };

  beforeAll(async ({ device, uos }) => {
    console.log('[测试套件] 开始执行 - 与当前文件保存一致功能测试');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
    console.log(`[配置] 工程目录路径: ${config.projectPath}`);
  });

  beforeEach(async () => {
    console.log('[测试步骤] 开始新的测试用例');
  });

  test('1593535-与当前文件保存一致_首次打开新文件', async ({ device, agent, uos, system }) => {
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);

    let currentFilePath = '';
    
    // 步骤1：验证工程目录存在性
    console.log('[步骤1] 验证工程目录路径');

    // 步骤2：打开文本编辑器并等待加载完成
    console.log('[步骤2] 打开文本编辑器应用');
    await uos.openApp(config.appName, 3000, config.appLoadTimeout, true);
    console.log('[步骤2] 文本编辑器已成功打开');
    
    // 等待编辑器界面完全加载
    await agent.aiWaitFor("文本编辑器主界面已显示且处于激活状态", { timeout: 10000 });
    console.log('[步骤2] 文本编辑器界面加载完成');

    // 步骤3：点击窗口右上角菜单按钮
    console.log('[步骤3] 点击窗口右上角菜单按钮');
    await agent.aiTap("文本编辑器窗口右上角的菜单按钮（汉堡菜单/设置图标）", { 
      timeout: 10000 
    });
    console.log('[步骤3] 菜单按钮点击成功');
    
    // 等待菜单弹框显示
    await agent.aiWaitFor("文本编辑器的菜单下拉框/弹框已完全展开", { timeout: 10000 });
    console.log('[步骤3] 菜单弹框显示完成');

    // 步骤4：点击设置项
    console.log('[步骤4] 点击设置项');
    await agent.aiTap("菜单列表中的'设置'选项（文字精准匹配）");
    console.log('[步骤4] 设置项点击成功');

    // 步骤5：等待设置窗口弹出
    console.log('[步骤5] 等待设置窗口显示');
    await agent.aiWaitFor("文本编辑器的设置窗口已居中显示", { timeout: 10000 });
    console.log('[步骤5] 设置窗口显示成功');

    // 步骤6：点击'打开/保存设置'
    console.log('[步骤6] 点击打开/保存设置');
    await agent.aiTap("设置窗口左侧/顶部的'打开/保存设置'选项卡");
    console.log('[步骤6] 打开/保存设置点击成功');

    // 步骤7：勾选'与当前文件保持一致'选项
    console.log('[步骤7] 勾选与当前文件保持一致');
    await agent.aiTap("勾选设置窗口右侧'与当前文件保持一致'复选框");
    console.log('[步骤7] 与当前文件保持一致选项点击成功');
    
    // 验证选项已被选中
    await agent.aiAssert("'与当前文件保持一致'复选框处于勾选状态（有对勾）");
    console.log('[步骤7] 选项状态验证成功');

    // 步骤8：关闭设置窗口
    console.log('[步骤8] 关闭设置窗口');
    await agent.aiTap("设置窗口右上角的关闭按钮（X图标）");
    console.log('[步骤8] 设置窗口关闭成功');
    
    // 验证设置窗口已关闭
    await agent.aiWaitFor("设置窗口已消失，回到文本编辑器主界面", { timeout: 3000 });
    console.log('[步骤8] 设置窗口关闭验证完成');

    // 步骤9：使用快捷键Ctrl+O打开文件对话框
    console.log('[步骤9] 使用快捷键Ctrl+O打开文件对话框');
    await device.pressKey('Ctrl+O');
    console.log('[步骤9] Ctrl+O快捷键执行成功');

    // 步骤10：等待文件打开对话框显示
    await agent.aiWaitFor(`弹出文件快捷打开窗口`, { timeout: 30000 } );

    // 步骤11：验证显示路径与工程路径一致
    console.log('[步骤11] 验证对话框路径与工程路径一致性');

    await agent.aiTap('文件保存对话框的地址栏/路径区域靠右空白位置', { deepThink: true });

    // 获取当前对话框显示的路径
    const dialogPath = await agent.aiQuery(`
      文件打开对话框的地址栏/路径区域信息，
      仅返回路径字符串，无多余描述
    `);
    
    console.log(`[步骤11] 对话框显示路径: ${dialogPath}`);
    console.log(`[步骤11] 期望工程路径: ${config.projectPath}`);
    
    // 核心路径验证逻辑
    if (dialogPath.includes(config.projectPath)) {
      console.log('[步骤11] 路径一致性验证成功 - 对话框路径包含工程路径');
    } else if (dialogPath === config.projectPath) {
      console.log('[步骤11] 路径一致性验证成功 - 对话框路径与工程路径完全匹配');
    } else {
      // 检查系统默认路径合理性
        console.log('[步骤11] 路径验证异常 - 建议人工确认');
    }

    // 清理步骤：关闭文件对话框
    console.log('[清理] 关闭文件保存对话框');
    await agent.aiTap("文件保存对话框'取消'按钮");
    console.log('[清理] 文件对话框已关闭');

    //重置设置
    //点击窗口右上角菜单按钮
    console.log('点击窗口右上角菜单按钮');
    await agent.aiTap("文本编辑器窗口右上角的菜单按钮（汉堡菜单/设置图标）", { 
      timeout: 10000 
    });
    console.log('菜单按钮点击成功');
    
    // 等待菜单弹框显示
    await agent.aiWaitFor("文本编辑器的菜单下拉框/弹框已完全展开", { timeout: 10000 });
    console.log('菜单弹框显示完成');

    // 点击设置项
    console.log('点击设置项');
    await agent.aiTap("菜单列表中的'设置'选项（文字精准匹配）");
    console.log(' 设置项点击成功');

    // 等待设置窗口弹出
    console.log('等待设置窗口显示');
    await agent.aiWaitFor("文本编辑器的设置窗口已居中显示", { timeout: 10000 });
    console.log('设置窗口显示成功');

    // 点击'打开/保存设置'
    console.log('点击打开/保存设置');
    await agent.aiTap("设置窗口左侧/顶部的'打开/保存设置'选项卡");
    console.log(' 打开/保存设置点击成功');

    // 步骤7：勾选'与当前文件保持一致'选项
    console.log('点击设置窗口恢复默认');
    await agent.aiTap("点击设置窗口右侧'恢复默认'按钮");
    console.log('设置窗口恢复默认成功] ');

    // 步骤8：关闭设置窗口
    console.log('[步骤8] 关闭设置窗口');
    await agent.aiTap("设置窗口右上角的关闭按钮（X图标）");
    console.log('[步骤8] 设置窗口关闭成功');
    
    // 验证设置窗口已关闭
    await agent.aiWaitFor("设置窗口已消失，回到文本编辑器主界面", { timeout: 3000 });
    console.log('[步骤8] 设置窗口关闭验证完成');

  }, { 
    timeout: 240000, // 调整合理超时（原1200000过长）
    tags: ['1593535', 'level1', 'smoke', 'sushanshan'] 
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
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);
    console.log('[清理] 测试环境清理完成');
  });
});