
/**
 * 用例 PMSID: 1810557
 * 用例标题: 【搜索】长文件名功能 - 搜索结果，文件右键在终端中打开
 * 生成时间: 2026-03-19 10:09:53
 * 用例编写人: UT000193（郑豪）
 */

describe('1810557-【搜索】长文件名功能 - 搜索结果，文件右键在终端中打开', () => {
  // 测试资源文件变量
  const longFolderNamePath = `/home/${process.env.TEST_USERNAME}/Desktop`;
  const longFolderName = '这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能_1810557';
  const testFileName = '1810557.txt';
  const searchKeyword = '长文件名功能';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件
    // 1. 已开启长文件名功能
    const caseDir = process.env.TESTCASE_DIR;
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    // 2. 桌面有多个长文件名的文件夹
    await system.exec(`mkdir -p ${longFolderNamePath}/${longFolderName}`);
    await system.exec(`touch ${longFolderNamePath}/${longFolderName}/${testFileName}`);
  });

  test('1810557-【搜索】长文件名功能 - 搜索结果，文件右键在终端中打开', async ({ device, agent, uos, system }) => {
    // 步骤1：选择长文件名的文件夹，右键在终端中打开
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
    await agent.aiTap('右键菜单中的"在终端中打开"选项');
    
    // 预期1：打开终端，路径为当前长文件名的文件夹路径
    await agent.aiAssert('终端已打开，且路径为当前长文件名的文件夹路径');

  }, { timeout: 600000, tags: ['1810557', 'level3', 'remote', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除测试文件夹
    await system.exec(`rm -rf ${longFolderNamePath}/${longFolderName}`);
    await system.exec('killall -15 deepin-terminal');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await uos.showDesktop();
    await device.pressKey('Esc');
  });
});
