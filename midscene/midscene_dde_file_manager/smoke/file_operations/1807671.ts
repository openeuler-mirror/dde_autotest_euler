// @ts-nocheck
/**
 * 用例 PMSID: 1807671
 * 用例标题: 文件/文件夹-右键-标签栏路径文件编辑标记
 * 生成时间: 2026-04-21
 * 用例编写人: UT000686(李双双)
 */

describe('1807671-文件/文件夹-右键-标签栏路径文件编辑标记', () => {
  const TEST_USERNAME = process.env.TEST_USERNAME;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager');
    await system.exec(`rm -rf ~/Documents/1807671`);
    await uos.showDesktop();
    // 打开文件管理器并最大化
    await device.pressKey('Super+E');
    await system.exec('sleep 3');
    await uos.maximizeWindow();
    // 前置条件：在文档目录创建1807671文件夹
    await system.exec(`mkdir -p ~/Documents/1807671`);
    console.log('前置条件：1807671文件夹已创建');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('Escape');
  });

  test('1807671-文件/文件夹-右键-标签栏路径文件编辑标记', async ({ device, agent, uos, system }) => {

    // 导航到文档目录
    console.log('导航到文档目录');
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');
    await agent.aiTap('1807671文件夹');
    await agent.aiWaitFor('1807671文件夹被选中');

    // 步骤1：1807671右键点击"标记信息"下面的红色圆圈，断言标记红色
    console.log('步骤1: 右键点击"标记信息"下面的红色点点，断言标记红色');
    await agent.aiRightClick('1807671文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息文案下方的红色点点');
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('1807671文件夹名称左侧显示标记');
    console.log('✅ 步骤1验证通过：标记添加成功');

    // 步骤2：右键1807671文件夹右键点击"标记信息"下面的红色点点，断言标记已删除
    console.log('步骤2: 右键点击"标记信息"下面的红色点点，断言标记已删除');
    await agent.aiRightClick('1807671文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息文案下方的红色点点');
    await agent.aiTap('桌面空白区域');
    // await agent.aiWaitFor('标记信息面板已关闭');
    await agent.aiAssert('1807671文件夹名称左侧的无标记');
    console.log('✅ 步骤2验证通过：标记删除成功');

    // 步骤3：重复步骤1操作
    console.log('步骤3: 重复步骤1操作，重新添加标记');
    await agent.aiRightClick('1807671文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息文案下方的红色点点');
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('1807671文件夹名称左侧显示标记');
    console.log('✅ 步骤3验证通过：标记重新添加成功');

    // 步骤4：右键1807671文件夹点击"标记信息"输入绿色，点击"enter"，新增一个绿色的标记
    console.log('步骤4: 输入绿色，点击enter新增绿色标记');
    await agent.aiRightClick('1807671文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息');
    await agent.aiWaitFor('标记信息面板已显示');
    await agent.aiTap('标记信息输入框');
    await device.typeText('绿色');
    await device.pressKey('Enter');
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('1807671文件夹名称左侧新增一个标记');
    console.log('✅ 步骤4验证通过：绿色标记添加成功');

    // 步骤5：右键1807671文件夹点击"标记信息"下面的红色点点，断言标记已删除
    console.log('步骤5: 点击"标记信息"下面的红色点点，断言红色标记已删除');
    await agent.aiRightClick('1807671文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息下方的红色点点');
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('1807671文件夹名称左侧的只有一个标记');
    console.log('✅ 步骤5验证通过：红色标记删除成功，绿色标记保留');

    // 步骤6：右键1807671文件夹，点击"标记信息"，点击次"delete"，点击"enter"，断言标记已删除
    console.log('步骤6: 点击"标记信息"，点击backspace删除标记，点击enter，断言所有标记已删除');
    await agent.aiRightClick('1807671文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息');
    console.log('点击快捷键删除标记');
    await device.pressKey('backspace');
    await device.pressKey('Enter');
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('1807671文件夹名称左侧所有标记已删除');
    console.log('✅ 步骤6验证通过：所有标记删除成功');

  }, { timeout: 1200000, tags: ['1807671', 'level2', 'smoke', 'file_operations', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理测试文件夹
     await device.pressKey('Super+E');
    await system.exec('sleep 3');
    await uos.maximizeWindow();
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');
    await device.pressKey('Ctrl+A')
    await device.pressKey("delete")
    console.log('测试文件夹已清理');
    // 清理标记文件
    const result = await agent.aiBoolean('文件管理器文档目录存在文件')
    if (result){
      await system.exec(`rm -rf ~/Documents/1807671*`);
    }else{
      console.log('文档目录已清空');
    }
    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
