/**
 * 用例 PMSID: 1806257
 * 用例标题: 最近使用添加数据-新增U盘目录文件
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

const testDir =`/media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}`;

describe('1806257-最近使用添加数据-新增U盘目录文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec(`touch ${testDir}/测试1.txt`);
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806257-最近使用添加数据-新增U盘目录文件', async ({ device, agent, uos , system}) => {

    // 步骤 1: 打开文件添加到最近使用目录
    await uos.openApp("文件管理器",{timeoutMS:500});
    await agent.aiTap(`文件管理器侧边栏的${process.env.USB_FLASH}磁盘`); 
    await agent.aiDoubleClick("测试1.txt");
    await agent.aiTap("文本编辑器窗口右上角关闭按钮:X");
    await agent.aiTap(`文件管理器侧边栏的最近使用目录`);
    await agent.aiAssert("目录内存在测试1.txt");

    // 步骤 2: 拔出U盘，记录消失
    await agent.aiRightClick(`文件管理器侧边栏的${process.env.USB_FLASH}磁盘`);
    await agent.aiTap("卸载");
    await agent.aiTap(`文件管理器侧边栏的最近使用目录`);
    await agent.aiAssert("目录内无测试1.txt");
    await agent.aiTap(`文件管理器侧边栏的${process.env.USB_FLASH}磁盘`); 


  }, { timeout: 600000, tags: ['1806257', 'level2', 'recently_used', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ${testDir}/测试*`);
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});