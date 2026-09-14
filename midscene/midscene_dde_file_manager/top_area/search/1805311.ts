/**
 * 用例 PMSID: 1805311
 * 用例标题: 【搜索】搜索地址前缀补全-访问共享地址后重启文管检查最近访问标签显示
 * 生成时间: 2026-03-05 20:07:49
 * 用例编写人: UT000193（郑豪）
 */

describe('1805311-【搜索】搜索地址前缀补全-访问共享地址后重启文管检查最近访问标签显示', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const dir=process.env.SMB_DIR;
  const ip=process.env.SMB_IP;
  const smbpwd = process.env.SMB_PASSWORD;
  const smbname = process.env.SMB_USERNAME;
  const TEST_PASSWORD = process.env.TEST_PASSWORD;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
    // 判断是否已挂载测试smb，如果已挂载就先卸载
    await device.pressKey('Super+E');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Super+Up');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = await agent.aiBoolean(`左侧栏存在${process.env.SMB_IP}`); 
    if (result) {
        console.log('已挂载smb，开始卸载...');
        const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanSmbMounts(agent, system, 1);
    } else {
        console.log('未挂载smb，测试继续');
    }
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805311-【搜索】搜索地址前缀补全-访问共享地址后重启文管检查最近访问标签显示', async ({ device, agent, uos, system }) => {
    // 步骤1：挂载一个共享服务
    console.log('步骤1：挂载一个共享服务');
    console.log('挂载smb-地址栏-用户名');
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`smb://${ip}`, true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiDoubleClick(dir);
    await agent.aiWaitFor("出现需要授权来访问文本");
    await device.typeText(`${smbname}`);
    await agent.aiInput( `${smbpwd}`,'密码输入框');
    await agent.aiTap("记住密码文本");
    await agent.aiTap("连接选项");
    await system.exec("sleep 2");
    const boolA = await agent.aiBoolean(`页面出现卸载文件系统需要认证文本`);
    if (boolA) {
        console.log('触发弹窗认证，输入密码');
        await device.typeText(`${TEST_PASSWORD}`, true);
    } else {
        console.log('未触发弹窗认证')
      }

    // 断言1：共享服务挂载成功
    await agent.aiAssert("左侧栏存在"+ip);

    // 步骤2：关闭文管再重新打开
    console.log('步骤2：关闭文管再重新打开');
    await agent.aiTap("文件管理器右上角'X'关闭按钮");
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    // 断言2：文管正常打开
    await agent.aiAssert("文管正常打开，存在我的目录、磁盘列表、保险箱等分类");

    // 步骤3：在地址栏输入共享ip地址
    await device.pressKey('Ctrl+L');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText(ip);
    
    // 断言：下拉框显示最近访问的共享地址标签
    await agent.aiAssert(`下拉框其中一条显示：圆形图标+smb：//+${ip}`);

  }, { timeout: 600000, tags: ['1805311', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 卸载SMB
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
