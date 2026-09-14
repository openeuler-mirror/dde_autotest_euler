
/**
 * 用例 PMSID: 1810585
 * 用例标题: 【搜索】长文件名功能 - 搜索结果，文件右键新窗口打开
 * 生成时间: 2026-03-18 09:17:04
 * 用例编写人: UT000193（郑豪）
 */

describe('1810585-【搜索】长文件名功能 - 搜索结果，文件右键新窗口打开', () => {
  // 测试资源文件变量
  const longFileNamePath = `/home/${process.env.TEST_USERNAME}/Desktop`;
  const longFileName = '这是一个非常长的文件名用于测试长文件名功能这是一个非常长的文件名用于测试长文件名功能这是一个非常长的文件名用于测试长文件名功能这是一个非常长的文件名用于测试长文件名功能这是一个非常长的文件名用于测试长文件名功能_1810585.txt';
  const longFolderName = '这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能_1810585';
  const searchKeyword = '长文件名功能';
  const usbPath = `/media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}`;
  // 普通简短文件，用于辅助断言
  const shortFile1 = 'test1.txt';
  const shortFile2 = 'test2.txt';
  const shortFile3 = 'image1.png';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await uos.showDesktop();
    await device.pressKey('Esc');
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件
    // 1. 已开启长文件名功能
    const caseDir = process.env.TESTCASE_DIR;
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    // 2. 库目录、U盘内部、桌面有多个长文件名的文件夹
    // 3. 已经搜索出长文件名的文件结果
    await system.exec(`touch ${longFileNamePath}/${longFileName}`);
    await system.exec(`mkdir ${longFileNamePath}/${longFolderName}`);
    // 在长文件夹内创建普通简短文件，用于辅助断言
    await system.exec(`touch ${longFileNamePath}/${longFolderName}/${shortFile1}`);
    await system.exec(`touch ${longFileNamePath}/${longFolderName}/${shortFile2}`);
    await system.exec(`touch ${longFileNamePath}/${longFolderName}/${shortFile3}`);
    
    // 在U盘创建长文件名和长文件夹名
    await system.exec(`touch ${usbPath}/${longFileName}`);
    await system.exec(`mkdir -p ${usbPath}/${longFolderName}`);
    // 在U盘的长文件夹内也创建普通简短文件
    await system.exec(`touch ${usbPath}/${longFolderName}/${shortFile1}`);
    await system.exec(`touch ${usbPath}/${longFolderName}/${shortFile2}`);
    await system.exec(`touch ${usbPath}/${longFolderName}/${shortFile3}`);
  });

  test('1810585-【搜索】长文件名功能 - 搜索结果，文件右键新窗口打开', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器并搜索长文件名
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await device.pressKey("win","up") 
    await agent.aiTap('右上角搜索框');
    await device.typeText(searchKeyword);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('搜索结果页面显示');
    await agent.aiRightClick(`搜索结果中的文件夹: ${longFolderName}`);
    await agent.aiWaitFor('弹出右键菜单');
    await agent.aiTap('右键菜单中的"在新窗口打开"选项');
    await agent.aiWaitFor('新文件管理器窗口已打开');
    
    // 断言1：新窗口打开文件夹所在目录
    await agent.aiAssert(`新窗口显示${longFolderName}文件夹目录，且包含${shortFile1}、${shortFile2}、${shortFile3}等文件`);
  }, { timeout: 600000, tags: ['1810585', 'level3', 'remote', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec(`rm -f ${longFileNamePath}/${longFileName}`);
    await system.exec(`rm -rf ${longFileNamePath}/${longFolderName}`);
    await system.exec(`rm -f ${usbPath}/${longFileName}`);
    await system.exec(`rm -rf ${usbPath}/${longFolderName}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await uos.showDesktop();
    await device.pressKey('Esc');
  });
});
