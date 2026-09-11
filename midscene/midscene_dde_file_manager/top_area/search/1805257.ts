
/**
 * 用例 PMSID: 1805257
 * 用例标题: 【搜索】搜索隐藏和加密文件
 * 生成时间: 2026-03-16 16:25:37
 * 用例编写人: UT000193（郑豪）
 */

describe('1805257-【搜索】搜索隐藏和加密文件', () => {
  // 测试资源文件变量
  const hiddenFileName = '.1805257.txt';
  const caseDir = process.env.TESTCASE_DIR;
  const sourceExcelFilePath = `${caseDir}midscene_dde_file_manager/resources/`;
  const encryptedFileName = '1805257.xls';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
    await system.exec('rm -rf ~/Desktop/.hidden');
    await system.exec(`rm -f ~/Desktop/${hiddenFileName}`);

  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件
    // 1、已存在隐藏文件（在文件属性勾选隐藏，或者以“.”开头命名文件）
    // 2、文管-设置，不勾选“显示隐藏文件”
    // 3、创建一个电子表格，输入任意内容后对文件进行加密
    await system.exec(`touch ~/Desktop/${hiddenFileName}`);
  });

  test('1805257-【搜索】搜索隐藏和加密文件', async ({ device, agent, uos, system }) => {
    // 步骤1：搜索隐藏文件名
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await device.pressKey("win","up") 
    await agent.aiTap('右上角搜索框');
    await device.typeText(hiddenFileName);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 预期1：不会搜索到相关的隐藏文件
    await agent.aiAssert(`搜索结果中不显示.${hiddenFileName}文件`);

    // 步骤2：在文管设置中勾选“显示隐藏文件”
    await agent.aiTap('文件管理器右上角主菜单按钮');
    await agent.aiWaitFor('主菜单加载完成');
    await agent.aiTap('设置');
    await agent.aiWaitFor('设置窗口加载完成');
    await agent.aiTap('文件和目录');
    await agent.aiWaitFor('文件和目录菜单显示');
    await agent.aiTap('显示隐藏文件');
    await agent.aiWaitFor('显示隐藏文件选项被勾选');
    await device.pressKey('Esc');
    await system.exec('killall -15 dde-file-manager');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 预期2：勾选成功
    await agent.aiAssert(`显示隐藏文件设置已生效,桌面显示.${hiddenFileName}文件`);

    // 步骤3：搜索隐藏文件名
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap('文件管理器右上角搜索框');
    await device.typeText(hiddenFileName);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 预期3：搜索到相关的隐藏文件
    await agent.aiAssert(`搜索结果中显示:.${hiddenFileName}文件`);

    // 步骤4：搜索加密的电子表格
    await system.exec(`cp ${sourceExcelFilePath}${encryptedFileName} ~/Desktop/`);
    await agent.aiTap('文件管理器右上角搜索框');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('ctrl+a');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText(encryptedFileName);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 预期4：能够搜索到加密的电子表格
    await agent.aiAssert(`搜索结果中显示${encryptedFileName}`);

  }, { timeout: 600000, tags: ['1805257', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除测试文件
    await system.exec(`rm -rf ~/Desktop/${hiddenFileName} ~/Desktop/${encryptedFileName}`);

    // 还原文管设置中勾选“显示隐藏文件”
    await agent.aiTap('文件管理器右上角主菜单按钮');
    await agent.aiWaitFor('主菜单加载完成');
    await agent.aiTap('设置');
    await agent.aiWaitFor('设置窗口加载完成');
    await agent.aiTap('文件和目录');
    await agent.aiWaitFor('文件和目录菜单显示');
    await agent.aiTap('显示隐藏文件');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiWaitFor('显示隐藏文件选项取消勾选');
    await device.pressKey('Esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理测试套件
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf ~/Desktop/.hidden');
  });
});
