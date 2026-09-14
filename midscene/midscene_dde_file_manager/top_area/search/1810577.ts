
/**
 * 用例 PMSID: 1810577
 * 用例标题: 【搜索】长文件名功能 - 搜索结果，文件右键剪切粘贴
 * 生成时间: 2026-03-18 10:26:18
 * 用例编写人: UT000193（郑豪）
 */

describe('1810577-【搜索】长文件名功能 - 搜索结果，文件右键剪切粘贴', () => {
  // 测试资源文件变量
  const longFileNamePath = `/home/${process.env.TEST_USERNAME}/Desktop`;
  const longFileName = '这是一个非常长的文件名用于测试长文件名功能这是一个非常长的文件名用于测试长文件名功能这是一个非常长的文件名用于测试长文件名功能这是一个非常长的文件名用于测试长文件名功能这是一个非常长的文件名用于测试长文件名功能_1810577.txt';
  const longFolderName = '这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能这是一个非常长的文件夹名用于测试长文件名功能_1810577';
  const searchKeyword = '长文件名功能';
  const usbPath = `/media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}`;
  // 目标目录变量
  const targetDir = `/home/${process.env.TEST_USERNAME}/Documents`;

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
    // 2. 桌面有多个长文件名的文件夹
    // 3. 已经搜索出长文件名的文件结果
    await system.exec(`touch ${longFileNamePath}/${longFileName}`);
    await system.exec(`mkdir -p ${longFileNamePath}/${longFolderName}`);
    
    // 在U盘创建长文件名和长文件夹名
    await system.exec(`touch ${usbPath}/${longFileName}`);
    await system.exec(`mkdir -p ${usbPath}/${longFolderName}`);
  });

  test('1810577-【搜索】长文件名功能 - 搜索结果，文件右键剪切粘贴', async ({ device, agent, uos, system }) => {
    // 步骤1：选择长文件名的文件，右键剪切，粘贴到其他库目录
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await device.pressKey("win","up") 
    await agent.aiTap('右上角搜索框');
    await device.typeText(searchKeyword);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('搜索结果页面显示');
    
    // 步骤2：选择长文件名的文件，右键剪切
    await agent.aiRightClick(`搜索结果中的txt文件: ${longFileName}`);
    await agent.aiWaitFor('弹出右键菜单');
    await agent.aiTap('右键菜单中的"剪切"选项');
    
    // 导航到其他库目录（如文档）
    await agent.aiTap('左侧导航栏中的"文档"目录');
    await agent.aiWaitFor('文档目录已打开');
    
    // 在目标目录右键粘贴
    await agent.aiRightClick('文档目录空白区域');
    await agent.aiWaitFor('弹出右键菜单');
    await agent.aiTap('右键菜单中的"粘贴"选项');
    
    // 预期1：粘贴成功
    await agent.aiAssert(`文档目录中显示${longFileName}文件`);

    // 验证文件是否被移动（原位置应不存在）
    // 先清理桌面文件夹，以免影响判断
    await system.exec(`rm -rf ${longFileNamePath}/${longFolderName}`);
    await agent.aiTap('左侧导航栏中的"桌面"目录');
    await agent.aiWaitFor('桌面目录已打开');
    await agent.aiAssert(`桌面目录中不再显示${longFileName}的txt文件`);
  }, { timeout: 600000, tags: ['1810577', 'level3', 'remote', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec(`rm -f ${longFileNamePath}/${longFileName}`);
    await system.exec(`rm -rf ${longFileNamePath}/${longFolderName}`);
    await system.exec(`rm -f ${usbPath}/${longFileName}`);
    await system.exec(`rm -rf ${usbPath}/${longFolderName}`);
    // 清理目标目录
    await system.exec(`rm -f ${targetDir}/${longFileName}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await uos.showDesktop();
    await device.pressKey('Esc');
  });
});
