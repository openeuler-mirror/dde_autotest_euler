/**
 * 用例 PMSID: 1813087
 * 用例标题: [core]连接服务器-通过【收藏】按键添加收藏信息到【我收藏的服务器】检查
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1813087-[core]连接服务器-通过【收藏】按键添加收藏信息到【我收藏的服务器】检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813087-[core]连接服务器-通过【收藏】按键添加收藏信息到【我收藏的服务器】检查', async ({ device, agent, uos , system}) => {

    // 步骤 1：打开“连接到服务器”
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器加载完成");
    await agent.aiTap("文件管理器主菜单按钮")
    await agent.aiWaitFor("主菜单加载完成");
    await agent.aiTap("连接到服务器",{timeoutMS:200});
    await agent.aiTap("地址输入框存在下拉箭头");
    await agent.aiTap("清除最近使用的服务器");

    
    // 步骤 2: smb，鼠标悬停，显示“收藏”
    await agent.aiAssert("smb://旁边存在下拉箭头");
    await agent.aiTap("smb://");
    await agent.aiTap("smb://旁边地址输入框");
    await agent.aiTap("smb://旁边地址输入框");
    await device.typeText(`10.10.10.10`);
    await agent.aiHover('连接到服务器弹窗右侧五角星形状收藏按钮');
    await agent.aiAssert("Hover显示为收藏");

    // 步骤 3: 收藏smb服务器
    await agent.aiTap("连接到服务器弹窗右侧五角星形状收藏按钮");
    await agent.aiAssert(`我收藏的服务器增加一条smb://10.10.10.10`);
    await agent.aiHover('连接到服务器弹窗右侧五角星形状收藏按钮');
    await agent.aiAssert("Hover显示为取消收藏");

    // 步骤 4: 收藏ftp服务器
    await agent.aiTap("连接到服务器");
    await agent.aiTap("smb://旁边存在下拉箭头");
    await agent.aiTap("ftp://");
    await agent.aiTap("ftp://旁边地址输入框");
    await device.pressKey(`Ctrl+A`);
    await device.pressKey(`Delete`);
    await device.typeText(`20.20.20.20`);
    await agent.aiTap("连接到服务器弹窗右侧五角星形状收藏按钮");
    await agent.aiHover('连接到服务器弹窗右侧五角星形状收藏按钮');
    await agent.aiAssert("Hover显示为取消收藏");
    await agent.aiAssert(`我收藏的服务器增加一条ftp://20.20.20.20`);

    // 步骤 5: 收藏sftp服务器
    await agent.aiTap("连接到服务器");
    await agent.aiTap("ftp://旁边存在下拉箭头");
    await agent.aiTap("sftp://");
    await agent.aiTap("sftp://旁边地址输入框");
    await device.pressKey(`Ctrl+A`);
    await device.pressKey(`Delete`);
    await device.typeText(`30.30.30.30`);
    await agent.aiTap("连接到服务器弹窗右侧五角星形状收藏按钮");
    await agent.aiHover('连接到服务器弹窗右侧五角星形状收藏按钮');
    await agent.aiAssert("Hover显示为取消收藏");
    await agent.aiAssert(`我收藏的服务器增加一条sftp://30.30.30.30`);

    // 步骤 6: 收藏错误ip服务器
    await agent.aiTap("连接到服务器");
    await agent.aiTap("sftp://旁边存在下拉箭头");
    await agent.aiTap("smb://");
    await agent.aiTap("smb://旁边地址输入框");
    await device.pressKey(`Ctrl+A`);
    await device.pressKey(`Delete`);
    await device.typeText(`1234.1234.1234.1234`);
    await agent.aiTap("连接到服务器弹窗右侧五角星形状收藏按钮");
    await agent.aiHover('连接到服务器弹窗右侧五角星形状收藏按钮');
    await agent.aiAssert("Hover显示为取消收藏");
    await agent.aiAssert(`我收藏的服务器增加一条smb://1234.1234.1234.1234`);

  }, { timeout: 1000000, tags: ['1813087', 'level2', 'smb', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiHover('我收藏的服务器下面的smb://1234.1234.1234.1234');
    await agent.aiTap("smb://1234.1234.1234.1234旁边的关闭按钮:X");

    await agent.aiHover(`我收藏的服务器下面的sftp://30.30.30.30`);
    await agent.aiTap(`sftp://30.30.30.30旁边的关闭按钮:X`);

    await agent.aiHover(`我收藏的服务器下面的ftp://20.20.20.20`);
    await agent.aiTap(`ftp://20.20.20.20旁边的关闭按钮:X`);

    await agent.aiHover(`我收藏的服务器下面的smb://10.10.10.10`);
    await agent.aiTap(`smb://10.10.10.10边的关闭按钮:X`);

    await agent.aiTap("smb://旁边地址输入框");
    await device.pressKey(`Ctrl+A`);
    await device.pressKey(`Delete`);
    await agent.aiTap("连接到服务器弹窗右上角关闭按钮:X");
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});