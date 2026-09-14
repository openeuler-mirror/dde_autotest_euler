
/**
 * 用例 PMSID: 1810559
 * 用例标题: 【搜索】长文件名功能 - 搜索结果，文件右键快捷访问
 * 生成时间: 2026-03-18 19:51:01
 * 用例编写人: UT000193（郑豪）
 */

describe('1810559-【搜索】长文件名功能 - 搜索结果，文件右键快捷访问', () => {
  // 测试资源文件变量
  const longFolderNamePath = `/home/${process.env.TEST_USERNAME}/Desktop`;
  const longFolderName = '这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能_1810559';
  const testFileName = '1810559.txt';
  const searchKeyword = '长文件名功能';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await uos.showDesktop();
    await device.pressKey('Esc');
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：在主目录新建1个长文件名的文件夹
    // 1. 已开启长文件名功能
    const caseDir = process.env.TESTCASE_DIR;
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    // 2. 桌面有长文件名的文件夹，并在文件夹内创建测试文件
    await system.exec(`mkdir -p ${longFolderNamePath}/${longFolderName}`);
    await system.exec(`touch ${longFolderNamePath}/${longFolderName}/${testFileName}`);
  });

  test('1810559-【搜索】长文件名功能 - 搜索结果，文件右键快捷访问', async ({ device, agent, uos, system }) => {
    // 步骤1：选择长文件名的文件夹，右键添加快捷访问
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("win","up");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('右上角搜索框');
    await device.typeText(searchKeyword);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('搜索结果页面显示');
    
    await agent.aiRightClick(`搜索结果中的文件夹: ${longFolderName}`);
    await agent.aiWaitFor('弹出右键菜单');
    await agent.aiTap('右键菜单中的"添加快捷访问"选项');
    
    // 预期1：快捷访问添加成功
    await agent.aiAssert('快捷访问添加成功，侧边栏显示该文件夹');

    // 步骤2：文管侧边栏单击快捷访问
    await agent.aiTap('左侧导航栏中的"快捷访问"区域');
    await agent.aiWaitFor('快捷访问列表展开');
    await agent.aiTap(`快捷访问中的"${longFolderName}"文件夹`);
    
    // 预期2：访问到正确的文件
    await agent.aiAssert(`文件管理器显示${longFolderName}文件夹内容，且包含测试文件${testFileName}`);

    // 步骤3：搜索结果，右键移除快捷访问    
    await agent.aiRightClick(`左侧栏的${longFolderName}`);
    await agent.aiWaitFor('弹出右键菜单');
    await agent.aiTap('右键菜单中的"移除快捷访问"选项');
    
    // 预期3：快捷访问被移除
    await agent.aiAssert(`侧边栏不再显示${longFolderName}`);
  }, { timeout: 600000, tags: ['1810559', 'level3', 'remote', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除测试文件夹
    await system.exec(`rm -rf ${longFolderNamePath}/${longFolderName}`);
    try {
      await agent.aiRightClick(`快捷访问中的"${longFolderName}"文件夹`);
      await agent.aiWaitFor('弹出右键菜单');
      await agent.aiTap('右键菜单中的"移除快捷访问"选项');
    } catch (e) {
      // 忽略错误，可能已经移除
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
