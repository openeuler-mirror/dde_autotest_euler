/**
 * 用例 PMSID: 1813085
 * 用例标题: 连接服务器-通过【取消收藏】按键减少【我收藏的服务器】的收藏信息检查
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1813085-连接服务器-通过【取消收藏】按键减少【我收藏的服务器】的收藏信息检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813085-连接服务器-通过【取消收藏】按键减少【我收藏的服务器】的收藏信息检查', async ({ device, agent, uos , system}) => {

    // 步骤 1：打开“连接到服务器”
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器加载完成");
    await agent.aiTap("文件管理器主菜单按钮")
    await agent.aiWaitFor("主菜单加载完成");
    await agent.aiTap("连接到服务器");
    await agent.aiWaitFor("连接到服务器弹窗加载完成");
    
    // 步骤 2: 收藏smb、ftp、sftp服务器
    await agent.aiAssert("smb://旁边存在下拉箭头");
    await agent.aiTap("smb://");
    await agent.aiTap("smb://旁边地址输入框");
    await agent.aiTap("smb://旁边地址输入框");
    await device.typeText(`10.10.10.10`);
    await agent.aiTap("连接到服务器弹窗右侧五角星形状收藏按钮");

    await agent.aiTap("连接到服务器");
    await agent.aiTap("smb://旁边存在下拉箭头");
    await agent.aiTap("ftp://");
    await agent.aiTap("ftp://旁边地址输入框");
    await device.pressKey(`Ctrl+A`);
    await device.pressKey(`Delete`);
    await device.typeText(`20.20.20.20`);
    await agent.aiTap("连接到服务器弹窗右侧五角星形状收藏按钮");

    await agent.aiTap("连接到服务器");
    await agent.aiTap("ftp://旁边存在下拉箭头");
    await agent.aiTap("sftp://");
    await agent.aiTap("sftp://旁边地址输入框");
    await device.pressKey(`Ctrl+A`);
    await device.pressKey(`Delete`);
    await device.typeText(`30.30.30.30`);
    await agent.aiTap("连接到服务器弹窗右侧五角星形状收藏按钮");

    // 步骤 3: 悬停取消收藏smb服务器
    await agent.aiTap("我收藏的服务器下面的smb://10.10.10.10");
    await agent.aiHover('连接到服务器弹窗右侧五角星形状收藏按钮');
    await agent.aiAssert("Hover显示为取消收藏");

    // 步骤 4: 取消收藏smb服务器
    await agent.aiTap('连接到服务器弹窗右侧五角星形状收藏按钮');  
    await agent.aiHover('连接到服务器弹窗右侧五角星形状取消收藏按钮');
    await agent.aiAssert("Hover显示为收藏");
    await agent.aiAssert("我收藏的服务器列表无smb://10.10.10.10"); 

    // 步骤 5: 取消收藏ftp服务器
    await agent.aiTap("我收藏的服务器下面的ftp://20.20.20.20");
    await agent.aiTap("连接到服务器弹窗右侧五角星形状取消收藏按钮");  
    await agent.aiHover("连接到服务器弹窗右侧五角星形状收藏按钮");
    await agent.aiAssert("Hover显示为收藏");
    await agent.aiAssert("我收藏的服务器列表无ftp://20.20.20.20"); 

    // 步骤 6: 取消收藏sftp服务器
    await agent.aiTap("我收藏的服务器下面的sftp://30.30.30.30");
    await agent.aiTap("连接到服务器弹窗右侧五角星形状取消收藏按钮");  
    await agent.aiHover("连接到服务器弹窗右侧五角星形状收藏按钮");
    await agent.aiAssert("Hover显示为收藏");
    await agent.aiAssert("我收藏的服务器列表无sftp://30.30.30.30"); 

  }, { timeout: 600000, tags: ['1813085', 'level3', 'smb', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    await agent.aiTap("连接到服务器");
    await agent.aiTap("sftp://旁边存在下拉箭头");
    await agent.aiTap("smb://");
    await agent.aiTap("smb://旁边地址输入框");
    await device.pressKey(`Ctrl+A`);
    await device.pressKey(`Delete`);
    await agent.aiTap("连接到服务器弹窗右上角关闭按钮:X");
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});