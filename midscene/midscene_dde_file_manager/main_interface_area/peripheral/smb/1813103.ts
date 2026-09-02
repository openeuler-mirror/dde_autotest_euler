/**
 * 用例 PMSID: 1813103
 * 用例标题: [core]连接服务器-“连接到服务器”连接地址显示
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1813103-[core]连接服务器-“连接到服务器”连接地址显示', () => {
  beforeAll(async ({ device, uos, agent,system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813103-[core]连接服务器-“连接到服务器”连接地址显示', async ({ device, agent, uos , system}) => {

    // 步骤 1：打开“连接到服务器”
    await uos.openApp("文件管理器",{timeoutMS:200});
    await agent.aiTap("文件管理器主菜单按钮",{timeoutMS:200})
    await agent.aiTap("连接到服务器");
    
    // 步骤 2: 检查【协议】、【地址】、【收藏】按键
    await agent.aiAssert("smb://旁边存在下拉箭头");
    await agent.aiAssert("地址输入框存在下拉箭头");
    await agent.aiAssert("连接到服务器弹窗右侧存在五角星形状收藏按钮");

    // 步骤 3: 检查smb地址为空
    await agent.aiTap("地址输入框存在下拉箭头");
    await agent.aiTap("清除最近使用的服务器");
    await agent.aiAssert("地址输入框显示为空");

  }, { timeout: 600000, tags: ['1813103', 'level2', 'smb', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("连接到服务器弹窗右上角关闭按钮:X");
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});



