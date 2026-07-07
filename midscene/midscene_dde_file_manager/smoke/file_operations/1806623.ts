// @ts-nocheck
/**
 * 用例 PMSID: 1806623
 * 用例标题: 右键菜单-选中文件/文件夹右键-标记信息，颜色标记
 * 生成时间: 2026-04-28
 * 用例编写人: UT000686(李双双)
 */

describe('1806623-右键菜单-选中文件/文件夹右键-标记信息，颜色标记', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const TEST_USERNAME = process.env.TEST_USERNAME;
  const usbPath = `/media/${TEST_USERNAME}/${process.env.USB_FLASH}`;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager');
    await uos.showDesktop();
    // 打开文件管理器并最大化
    await device.pressKey('Super+E');
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：在U盘中创建1806623文件
    await system.exec(`rm -rf ${usbPath}/1806623*`);
    await system.exec(`touch ${usbPath}/1806623.txt`);
    console.log('U盘中1806623文件已创建');

    // 判断文件管理器左侧边栏是否有红色标记，若有，选中红色标记右键"移除"，在移除标记确认框中，点击"删除"
    const result = await agent.aiBoolean('文件管理器左侧栏存在红色标记')
    if (result){
      await agent.aiTap('文件管理器左侧栏的红色标记');
      await agent.aiRightClick('文件管理器左侧栏的红色标记');
      await agent.aiTap('移除');
      await agent.aiTap('移除标记确认框中的删除按钮');
      console.log('侧边栏红色标记已清理');
    }else{
      console.log('侧边栏无红色标记，无需清理');
    }
  });

  test('1806623-右键菜单-选中文件/文件夹右键-标记信息，颜色标记', async ({ device, agent, uos, system }) => {

    // 步骤1：访问U盘，右键1806623文件，点击标记信息下面的红色点点，断言文件管理器左侧栏有一个红色的标记
    console.log('步骤1: 访问U盘，右键1806623文件，点击标记信息下面的红色点点，断言左侧栏有红色标记');

    // 访问U盘
    await agent.aiTap(`文件管理器侧边栏的${process.env.USB_FLASH}磁盘`);
    await agent.aiWaitFor('U盘目录已加载');
    await agent.aiAssert('U盘中存在1806623文件');

    // 右键1806623文件
    await agent.aiRightClick('1806623文件');
    await agent.aiWaitFor('右键菜单已显示');

    // 点击标记信息下面的红色点点
    await agent.aiTap('标记信息文案下方的红色点点');

    // 点击空白处关闭标记面板
    await agent.aiTap('U盘目录空白区域');

    // 断言文件管理器左侧栏有一个红色的标记
    await agent.aiAssert('文件管理器左侧边栏有一个红色的标记');
    console.log('✅ 步骤1验证通过：红色标记添加成功');

  }, { timeout: 1200000, tags: ['1806623', 'level2', 'smoke', 'file_operations', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    device.pressKey('Super+E');
    await uos.maximizeWindow();
    await agent.aiTap(`文件管理器侧边栏的${process.env.USB_FLASH}磁盘`);
    await agent.aiWaitFor('U盘目录已加载');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Delete');
    await agent.aiWaitFor('弹出确认删除弹框');
    await agent.aiTap('删除');
    // 清理标记文件
    const result = await agent.aiBoolean('文件管理器左侧栏存在红色标记')
    if (result){
      await agent.aiTap('文件管理器左侧栏的红色标记');
      await agent.aiRightClick('文件管理器左侧栏的红色标记');
      await agent.aiTap('移除');
      await agent.aiTap('移除标记确认框中的删除按钮');
      console.log('侧边栏红色标记已清理');
    }else{
      console.log('侧边栏无红色标记，无需清理');
    }
    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
