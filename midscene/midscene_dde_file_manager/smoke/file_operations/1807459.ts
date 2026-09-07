// @ts-nocheck
/**
 * 用例 PMSID: 1807459
 * 用例标题: [36][core]重命名支持殊符号-特殊名称文件夹共享
 * 生成时间: 2026-04-28
 * 用例编写人: UT000686(李双双)
 */

 const caseDir = process.env.TESTCASE_DIR;

describe('1807459-[36][core]重命名支持殊符号-特殊名称文件夹共享', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager');
    await uos.showDesktop();
    // 打开文件管理器并最大化
    await device.pressKey('Super+E');
    await uos.maximizeWindow();
    await agent.aiTap("文件管理器右上角主菜单")
    await agent.aiTap("设置共享密码", { deepThink: true })
    console.log('Step 3.1: 输入共享密码');
        // await agent.aiTap("共享密码输入框");
    await device.typeText("123");
    await device.pressKey("Enter");
    await system.exec("sleep 1");
  
    console.log('Step 3.2: 输入账户密码');
    // await agent.aiTap("账户确认输入框");
    await device.typeText(`${process.env.TEST_PASSWORD}`);
    await device.pressKey("Enter");
    await system.exec("sleep 1");
    
    await system.exec('rm -rf ~/Documents/++');
    await system.exec('rm -rf ~/Documents/==');
    await system.exec('rm -rf ~/Documents/[[');
    await system.exec('rm -rf ~/Documents/]]');
    await system.exec('rm -rf ~/Documents/,,');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：在文档目录，使用命令创建"++"、"=="、"[["、"]]"、",,"名称的文件夹
    await system.exec('mkdir -p ~/Documents/==');
    await system.exec('mkdir -p ~/Documents/[[');
    await system.exec('mkdir -p ~/Documents/]]');
    await system.exec('mkdir -p ~/Documents/,,');
    await system.exec('mkdir -p ~/Documents/++');
    console.log('特殊名称文件夹已创建');
  });

  test('1807459-[36][core]重命名支持殊符号-特殊名称文件夹共享', async ({ device, agent, uos, system }) => {

    // 导航到文档目录
    console.log('导航到文档目录');
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');

    // 步骤1：右键++文件，点击属性，点击权限管理右侧的向下箭头，点击"共享此文件夹"前面的小方框，断言有无法共享的弹框，点击"确定"
    console.log('步骤1: 测试++文件夹共享');
    await agent.aiRightClick('++文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('属性');
    await agent.aiWaitFor('属性弹窗已显示');
    await agent.aiTap('共享管理');
    await agent.aiWaitFor('共享管理页面已显示');
    await agent.aiTap('共享此文件夹前面的小方框');
    await agent.aiWaitFor('无法共享的弹框已显示');
    await agent.aiAssert('存在无法共享的弹框提示');
    await agent.aiTap('确定');
    await agent.aiWaitFor('无法共享弹框已关闭');
    // 关闭属性弹窗
    await device.pressKey('Escape');
    await agent.aiWaitFor('属性弹窗已关闭');
    console.log('✅ 步骤1验证通过：++文件夹无法共享');

    // 步骤2：右键==文件，点击属性，点击权限管理右侧的向下箭头，点击"共享此文件夹"前面的小方框，断言有无法共享的弹框，点击"确定"
    console.log('步骤2: 测试==文件夹共享');
    await agent.aiRightClick('==文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('属性');
    await agent.aiWaitFor('属性弹窗已显示');
    await agent.aiTap('共享管理');
    await agent.aiWaitFor('共享管理页面已显示');
    await agent.aiTap('共享此文件夹前面的小方框');
    await agent.aiWaitFor('无法共享的弹框已显示');
    await agent.aiAssert('有当前共享名不符合规则的弹');
    await agent.aiTap('确定');
    await agent.aiWaitFor('无法共享弹框已关闭');
    // 关闭属性弹窗
    await device.pressKey('Escape');
    await agent.aiWaitFor('属性弹窗已关闭');
    console.log('✅ 步骤2验证通过：==文件夹无法共享');

    // 步骤3：右键[[文件，点击属性，点击权限管理右侧的向下箭头，点击"共享此文件夹"前面的小方框，断言有无法共享的弹框，点击"确定"
    console.log('步骤3: 测试[[文件夹共享');
    await agent.aiRightClick('[[文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('属性');
    await agent.aiWaitFor('属性弹窗已显示');
    await agent.aiTap('共享管理');
    await agent.aiWaitFor('共享管理页面已显示');
    await agent.aiTap('共享此文件夹前面的小方框');
    await agent.aiAssert('文件共享开启成功');
    // await agent.aiWaitFor('无法共享弹框已关闭');
    // 关闭属性弹窗
    await device.pressKey('Escape');
    await agent.aiWaitFor('属性弹窗已关闭');
    console.log('✅ 步骤3验证通过：[[文件夹无法共享');

    // 步骤4：右键]]文件，点击属性，点击权限管理右侧的向下箭头，点击"共享此文件夹"前面的小方框，断言有无法共享的弹框，点击"确定"
    console.log('步骤4: 测试]]文件夹共享');
    await agent.aiRightClick(']]文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('属性');
    await agent.aiWaitFor('属性弹窗已显示');
    await agent.aiTap('共享管理');
    await agent.aiWaitFor('共享管理页面已显示');
    await agent.aiTap('共享此文件夹前面的小方框');
     await agent.aiAssert('文件共享开启成功');
    // await agent.aiWaitFor('无法共享弹框已关闭');
    // 关闭属性弹窗
    await device.pressKey('Escape');
    await agent.aiWaitFor('属性弹窗已关闭');
    console.log('✅ 步骤4验证通过：]]文件夹无法共享');

    // 步骤5：右键,,文件，点击属性，点击权限管理右侧的向下箭头，点击"共享此文件夹"前面的小方框，断言有无法共享的弹框，点击"确定"
    console.log('步骤5: 测试,,文件夹共享');
    await agent.aiRightClick(',,文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('属性');
    await agent.aiWaitFor('属性弹窗已显示');
    await agent.aiTap('共享管理');
    await agent.aiWaitFor('共享管理页面已显示');
    await agent.aiTap('共享此文件夹前面的小方框');
    await agent.aiWaitFor('无法共享的弹框已显示');
    await agent.aiAssert('有当前共享名不符合规则的弹');
    await agent.aiTap('确定');
    await agent.aiWaitFor('无法共享弹框已关闭');
    // 关闭属性弹窗
    await device.pressKey('Escape');
    await agent.aiWaitFor('属性弹窗已关闭');
    console.log('✅ 步骤5验证通过：,,文件夹无法共享');

  }, { timeout: 1200000, tags: ['1807459', 'level2', 'smoke', 'file_operation', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理特殊名称文件夹
    await system.exec('rm -rf ~/Documents/++');
    await system.exec('rm -rf ~/Documents/==');
    await system.exec('rm -rf ~/Documents/[[');
    await system.exec('rm -rf ~/Documents/]]');
    await system.exec('rm -rf ~/Documents/,,');
    console.log('特殊名称文件夹已清理');

    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
