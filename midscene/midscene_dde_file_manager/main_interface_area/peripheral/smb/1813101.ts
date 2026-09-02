/**
 * 用例 PMSID: 1813101
 * 用例标题: [core]连接服务器-连接到服务器窗口，选择“协议”下拉窗检查
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1813101-[core]连接服务器-连接到服务器窗口，选择“协议”下拉窗检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813101-[core]连接服务器-连接到服务器窗口，选择“协议”下拉窗检查', async ({ device, agent, uos , system}) => {
    // 步骤 1：检查协议下拉窗
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器加载完成");
    await agent.aiTap("文件管理器主菜单按钮")
    await agent.aiWaitFor("主菜单加载完成");
    await agent.aiTap("连接到服务器");
    await agent.aiWaitFor("连接到服务器弹窗加载完成");
    await agent.aiTap("smb://旁边存在下拉箭头");
    await agent.aiAssert("协议下拉窗显示为smb:// ftp:// sftp:// dav:// davs:// nfs://");

    // 步骤 2: 检查smb协议
    await agent.aiTap("smb://");
    await agent.aiAssert("协议栏显示为smb://");

    // 步骤 3: 检查ftp协议
    await agent.aiTap("smb://旁边存在下拉箭头");
    await agent.aiTap("ftp://");
    await agent.aiAssert("协议栏显示为ftp://");

    // 步骤 4: 检查sftp协议
    await agent.aiTap("ftp://旁边存在下拉箭头");
    await agent.aiTap("sftp://");
    await agent.aiAssert("协议栏显示为sftp://");

    // 步骤 5: 检查默认smb地址为空
    await agent.aiTap("sftp://旁边存在下拉箭头");
    await device.typeText("test");
    await device.pressKey(`Delete`);
    await agent.aiAssert("协议下拉窗显示为smb:// ftp:// sftp:// dav:// davs:// nfs://");

  }, { timeout: 600000, tags: ['1813101', 'level2', 'smb', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("连接到服务器弹窗右上角关闭按钮:X");
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});