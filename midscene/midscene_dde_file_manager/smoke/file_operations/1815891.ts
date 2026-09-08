/**
 * 用例 PMSID: 1815891
 * 用例标题: 创建链接
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

const testDir =`/media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}`;

describe('1815891-创建链接', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815891-创建链接', async ({ device, agent, uos , system}) => {

    // 步骤 1: 创建链接
    await system.exec(`mkdir /home/$USER/Desktop/新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测` );
    await agent.aiRightClick("新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("发送到", { deepThink: true });
    await agent.aiTap("创建链接");
    await agent.aiWaitFor("文件管理器对话窗加载完成");
    await agent.aiTap("文件管理器对话窗的侧边栏文档");
    await agent.aiTap("文件管理器对话窗的保存");

    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器加载完成");
    await agent.aiTap("文件管理器侧边栏的文档");
    await agent.aiAssert("文档目录存在快捷方式文件夹");

     // 步骤 2:双击打开链接
    await agent.aiDoubleClick("新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测试文件夹新建测快捷方式");
    await agent.aiAssert("打开文件夹成功");
    
    // 步骤 3：U盘创建链接
     
    await system.exec(`rm -rf ${testDir}/181*` );
    await system.exec(`mkdir ${testDir}/1815891`);

    await agent.aiTap(`文件管理器侧边栏的${process.env.USB_FLASH}磁盘`);
    await agent.aiRightClick("1815891");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("发送到", { deepThink: true });
    await agent.aiTap("创建链接");
    await agent.aiWaitFor("文件管理器对话窗加载完成");
    await agent.aiTap("文件管理器对话窗的侧边栏文档");
    await agent.aiTap("文件管理器对话窗的保存");

    await agent.aiTap("文件管理器侧边栏的文档");
    await agent.aiAssert("文档目录存在1815891快捷方式");

  }, { timeout: 600000, tags: ['1815891', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ${testDir}/181*`);
    await system.exec(`rm -rf /home/$USER/Desktop/新建测试*`);
    await system.exec(`rm -rf /home/$USER/Documents/新建测试*`);
    await system.exec(`rm -rf /home/$USER/Documents/1815891*`);
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});