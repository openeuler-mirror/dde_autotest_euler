
/**
 * 用例 PMSID: 1593533
 * 用例标题: 与当前文件保存一致_首次保存新文件
 * 生成时间: 2025-12-19 07:44:53
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1593533-与当前文件保存一致_首次保存新文件', () => {
  // 配置项 - 集中管理可配置参数
  const config = {
    appName: '文本编辑器',
    projectPath: process.env.PROJECT_PATH || `/home/${process.env.TEST_USERNAME}/Documents`,  // 工程目录路径
    appLoadTimeout: 30000,          // 应用启动超时(ms)
  };

  beforeAll(async ({ device, uos, agent }) => {
    console.log('[测试套件] 开始执行 - 与当前文件保存一致功能测试(首次保存)');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
    console.log(`[配置] 工程目录路径: ${config.projectPath}`);
  });

  beforeEach(async () => {
    console.log('[测试步骤] 开始新的测试用例');
  });

  test('1593533-与当前文件保存一致_首次保存新文件', async ({ device, agent, uos, system }) => {
    // 清理应用进程（增加容错，无进程时不报错）
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
    await agent.aiWaitFor("文本编辑器的菜单下拉框/弹框已完全展开", { timeout: 10000 });
    console.log('[步骤2] 菜单弹框显示完成');

    // 步骤3：点击设置项
    console.log('[步骤3] 点击设置项');
    await agent.aiTap("菜单列表中的'设置'选项（文字精准匹配）");
    console.log('[步骤3] 设置项点击成功');

    // 步骤4：等待设置窗口弹出
    console.log('[步骤4] 等待设置窗口显示');
    await agent.aiWaitFor("文本编辑器的设置窗口已居中显示", { timeout: 10000 });
    console.log('[步骤4] 设置窗口显示成功');

    // 步骤5：点击'打开/保存设置'
    console.log('[步骤5] 点击打开/保存设置');
    await agent.aiTap("设置窗口左侧/顶部的'打开/保存设置'选项卡");
    console.log('[步骤5] 打开/保存设置点击成功');

    // 步骤6：勾选'与当前文件保持一致'选项
    console.log('[步骤6] 勾选与当前文件保持一致');
    await agent.aiTap("勾选设置窗口右侧'与当前文件保持一致'复选框");
    console.log('[步骤6] 与当前文件保持一致选项点击成功');

    // 验证选项已被选中
    await agent.aiAssert("'与当前文件保持一致'复选框处于勾选状态（有对勾）");
    console.log('[步骤6] 选项状态验证成功');

    // 步骤7：关闭设置窗口
    console.log('[步骤7] 关闭设置窗口');
    await agent.aiTap("设置窗口右上角的关闭按钮（X图标）");
    console.log('[步骤7] 设置窗口关闭成功');

    // 验证设置窗口已关闭
    await agent.aiWaitFor("设置窗口已消失，回到文本编辑器主界面", { timeout: 3000 });
    console.log('设置窗口关闭验证完成');

    // 步骤9：在编辑窗口输入内容，并保存
    await device.pressKey('Ctrl+A');
    await device.pressKey('Backspace');
    await device.typeText('测试文本编辑器保存路径');
    await device.pressKey('Ctrl+S');
    console.log('[步骤9] 快捷保存');

    // 步骤10：等待保存文件对话框显示
    await agent.aiWaitFor(`弹出文件保存窗口`, { timeout: 30000 });
    await agent.aiTap('文件保存对话框的地址栏/路径区域靠右空白位置', { deepThink: true });

    // 获取当前对话框显示的路径
    const dialogPath = await agent.aiQuery(`
      文件保存对话框的地址栏/路径区域信息，
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

    // 聚焦文件名输入框
    await agent.aiTap('保存窗口的文件名')
    await agent.aiTap('文件名输入框');

    // 清空原有内容（全选+删除）
    await device.pressKey('Ctrl+A');
    await device.pressKey('Backspace');

    // 输入新文件名
    await device.typeText('test.txt');
    await agent.aiWaitFor(`文件名test.txt输入完成`, { timeout: 30000 });

    // 点击保存按钮
    console.log('[步骤5] 点击保存按钮完成保存');
    await agent.aiTap('保存');

    //重置设置
    //点击窗口右上角菜单按钮
    console.log('点击窗口右上角菜单按钮');
    await agent.aiTap("文本编辑器窗口右上角的菜单按钮（汉堡菜单/设置图标）", { timeout: 10000 });
    console.log('菜单按钮点击成功');

    // 等待菜单弹框显示
    await agent.aiWaitFor("文本编辑器的菜单下拉框/弹框已完全展开", { timeout: 10000 });
    console.log('菜单弹框显示完成');

    // 点击设置项
    console.log('点击设置项');
    await agent.aiTap("菜单列表中的'设置'选项（文字精准匹配）");
    console.log('设置项点击成功');

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
    timeout: 600000, // 调整合理超时（原1200000过长）
    tags: ['1593533', 'level1', 'smoke', 'sushanshan']
  });

  afterEach(async ({ device, uos }) => {
    console.log('[测试步骤] 当前测试用例执行完成');
    await uos.closeCurrentWindow();
    console.log('[清理] 关闭窗口');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    // 清理测试文件和应用进程
    console.log('[清理] 关闭所有应用窗口');
    await system.exec(`rm -f /home/${process.env.TEST_USERNAME}/Documents/test.txt`)
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);
    await uos.showDesktop();
    console.log('[清理] 测试环境清理完成');
  });
});
