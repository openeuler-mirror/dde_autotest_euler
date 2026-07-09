
/**
 * 用例 PMSID: 1813461
 * 用例标题: 右键菜单-挂载smb目录下右键创建链接
 * 生成时间: 2026-03-02 10:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

const caseDir = process.env.TESTCASE_DIR;

describe('1813461-右键菜单-挂载smb目录下右键创建链接', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
     // 卸载smb服务器
     console.log('等待3s');
    await system.exec("sleep 3");
    await uos.openApp('文件管理器', { maximizeWindow: true });

    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813461-右键菜单-挂载smb目录下右键创建链接', async ({ device, agent, uos, system,env }) => {
    //用户名挂载smb
    await uos.openApp('文件管理器');
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    // 进入服务器目录，验证是否需要认证
    console.log('smb挂载成功！');
    await system.exec(`mkdir /media/$USER/smbmounts/smb-share:server=${process.env.SMB_IP},share=smbtest/h181 & touch /media/$USER/smbmounts/smb-share:server=${process.env.SMB_IP},share=smbtest/h181.txt`, 500);
    await agent.aiRightClick('文管窗口内空白处', 300);
    await agent.aiTap('右键菜单中刷新');
    await agent.aiWaitFor("文管窗口内显示h181和h181.txt")
    await agent.aiRightClick('h181', 300);
    await agent.aiTap('右键菜单中发送到');
    await agent.aiTap('二级菜单中创建链接');
    await agent.aiTap('最上层文管弹窗左侧边栏“桌面”模块', { deepThink: true });
    await agent.aiTap('保存');

    await agent.aiRightClick('h181.txt', 300);
    await agent.aiTap('右键菜单中发送到');
    await agent.aiTap('二级菜单中创建链接');
    await agent.aiTap('最上层文管弹窗左侧边栏“桌面”模块', { deepThink: true });
    await agent.aiTap('保存');
    await agent.aiTap('文管左侧边栏桌面');

    await agent.aiRightClick('文管窗口内空白处', 300);
    await agent.aiTap('右键菜单中显示方式');
    await agent.aiTap('二级菜单中列表视图');
    await agent.aiAssert('存在h181快捷方式和h181快捷方式.txt');
    
  }, { timeout: 1200000, tags: ['1813461', 'level3', 'smb', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.cleanupFileManager();
    await system.exec(`rm -rf /media/$USER/smbmounts/smb-share:server=${process.env.SMB_IP},share=smbtest/h181*`, 500);
    await system.exec(`rm -rf ~/Desktop/h181*`, 500);

     // 卸载smb服务器
    console.log('卸载smb');
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
