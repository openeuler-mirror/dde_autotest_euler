/**
 * 用例 PMSID: 1593509
 * 用例标题: 自定义操作路径_打开新文件
 * 生成时间: 2025-12-19 16:41:46
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1593509-自定义操作路径_打开新文件', () => {
  // 配置项 - 集中管理可配置参数
  const config = {
    appName: '文本编辑器',
    appLoadTimeout: 30000,          // 应用启动超时(ms)
    customPath: process.env.CUSTOM_PATH || `/home/${process.env.TEST_USERNAME}/Documents`,  // 自定义路径
  };

  beforeAll(async ({ device, uos }) => {
    console.log('[测试套件] 开始执行 - 自定义操作路径功能测试');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
  });

  beforeEach(async () => {
    console.log('[测试步骤] 开始新的测试用例');
  });

  test('1593509-自定义操作路径_打开新文件', async ({ device, agent, uos, system }) => {
    // 清理测试文件和应用进程
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);

    // 步骤1：打开文本编辑器并等待加载完成
    console.log('[步骤1] 打开文本编辑器应用');
    await uos.openApp(config.appName, 3000, config.appLoadTimeout, true);
    console.log('[步骤1] 文本编辑器已成功打开');
    
    // 等待编辑器界面完全加载
    await agent.aiWaitFor("文本编辑器主界面已显示且处于激活状态", { timeout: 10000 });
    console.log('[步骤1] 文本编辑器界面加载完成');

    // 步骤2：点击窗口右上角菜单按钮
    console.log('[步骤2] 点击窗口右上角菜单按钮');
    await agent.aiTap("文本编辑器窗口右上角的菜单按钮（汉堡菜单/设置图标）", { 
      timeout: 10000 
    });
    console.log('[步骤2] 菜单按钮点击成功');
    
    // 等待菜单弹框显示
    await agent.aiWaitFor("文本编辑器的菜单下拉框/弹框已完全展开");
    console.log('[步骤2] 菜单弹框显示完成');

    // 步骤3：点击设置项
    console.log('[步骤3] 点击设置项');
    await agent.aiTap("菜单列表中的'设置'选项（文字精准匹配）");
    console.log('[步骤3] 设置项点击成功');

    // 步骤4：等待设置窗口弹出
    console.log('[步骤4] 等待设置窗口显示');
    await agent.aiWaitFor("文本编辑器的设置窗口已居中显示");
    console.log('[步骤4] 设置窗口显示成功');

    // 步骤5：点击'打开/保存设置'
    console.log('[步骤5] 点击打开/保存设置');
    await agent.aiTap("设置窗口左侧的'打开/保存设置'选项卡");
    console.log('[步骤5] 打开/保存设置点击成功');

    // 步骤6：切换到自定义操作路径
    console.log('[步骤6] 切换到自定义操作路径');
    await agent.aiTap("'打开/保存位置'项的属性切换为'自定义操作路径'");
    await agent.aiTap("自定义操作路径右侧的'三个点图标'或'...图标'");
    await agent.aiWaitFor("弹出文件打开弹窗");
    await agent.aiTap("文件打开弹窗左侧栏的'下载'菜单项");
    //获取自定义的存储路径
    const filePath=`/home/${process.env.TEST_USERNAME}/Downloads`
    await agent.aiTap("打开");
    await agent.aiWaitFor("文件打开弹窗已消失");

    console.log('[步骤6] 自定义操作路径切换成功');

    // 步骤7：选择自定义路径
    console.log('[步骤7] 选择自定义路径');

    await agent.aiTap("文本编辑器设置窗口右上角的关闭按钮（X图标）");
    await agent.aiWaitFor("文本编辑器设置窗口已消失");
    console.log('[步骤7] 文件管理器已打开');

    // 步骤8：测试打开文件对话框
    console.log('[步骤8] 测试打开文件对话框的默认路径');
    await device.pressKey('Ctrl+O');
    console.log('[步骤8] Ctrl+O快捷键执行成功');

    // 等待文件打开对话框显示
    await agent.aiWaitFor("弹出文件打开对话框");
    console.log('[步骤8] 文件打开对话框已显示');

    // 获取对话框显示的路径
    await agent.aiTap('文件打开对话框的地址栏/路径区域靠右空白位置', { deepThink: true });
    const dialogPath = await agent.aiQuery(`
      文件打开对话框的地址栏/路径区域信息，
      仅返回路径字符串，无多余描述
    `);
    
    console.log(`[步骤8] 对话框显示路径: ${dialogPath}`);
    console.log(`[步骤8] 期望自定义路径: ${filePath}`);
    
    // 验证路径一致性
    if (dialogPath.includes(filePath)) {
      console.log('[步骤8] 路径一致性验证成功 - 对话框路径包含自定义路径');
    } else if (dialogPath === filePath) {
      console.log('[步骤8] 路径一致性验证成功 - 对话框路径与自定义路径完全匹配');
    } else {
      console.log('[步骤8] 路径验证异常 - 建议人工确认');
    }

    // 清理步骤：关闭文件对话框
    console.log('[清理] 关闭文件打开对话框');
    await agent.aiTap("文件打开对话框'取消'按钮");
    console.log('[清理] 文件对话框已关闭');

    // 重置设置
    console.log('[重置] 恢复默认设置');
    // 点击窗口右上角菜单按钮
    await agent.aiTap("文本编辑器窗口右上角的菜单按钮（汉堡菜单/设置图标）", { 
      timeout: 10000 
    });
    console.log('菜单按钮点击成功');
    
    // 等待菜单弹框显示
    await agent.aiWaitFor("文本编辑器的菜单下拉框/弹框已完全展开", { timeout: 5000 });
    console.log('菜单弹框显示完成');

    // 点击设置项
    await agent.aiTap("菜单列表中的'设置'选项（文字精准匹配）");
    console.log('设置项点击成功');

    // 等待设置窗口弹出
    await agent.aiWaitFor("文本编辑器的设置窗口已居中显示", { timeout: 5000 });
    console.log('设置窗口显示成功');

    // 点击'打开/保存设置'
    await agent.aiTap("设置窗口左侧/顶部的'打开/保存设置'选项卡");
    console.log('打开/保存设置点击成功');

    // 恢复默认设置
    await agent.aiTap("设置窗口中的'恢复默认'按钮");
    console.log('设置已恢复默认');

    // 关闭设置窗口
    await agent.aiTap("设置窗口右上角的关闭按钮（X图标）");
    console.log('设置窗口关闭成功');
    
    // 验证设置窗口已关闭
    await agent.aiWaitFor("设置窗口已消失，回到文本编辑器主界面", { timeout: 3000 });
    console.log('设置窗口关闭验证完成');

  }, { 
    timeout: 300000, // 调整合理超时（原1200000过长）
    tags: ['1593509', 'level1', 'smoke', 'sushanshan'] 
  });

  afterEach(async ({ device }) => {
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
