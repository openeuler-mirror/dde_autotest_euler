/**
 * 用例 PMSID: 1850145
 * 用例标题: 访问SMB
 * 生成时间: 2026-04-22 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850145-访问SMB', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const ip = process.env.SMB_IP;
  const smbdir = process.env.SMB_DIR;

  let smb_mount = false;

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { cleanSmbMounts, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 清理步骤: 测试前没有挂载smb, 清理smb挂载
    console.log('清理步骤: 测试前没有挂载smb, 清理smb挂载');
    if (!smb_mount) {
      await cleanSmbMounts(agent, system);
    }

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await device.pressKey('Super', 'Down');
    await system.exec(`killall dde-file-manager`);
    await agent.aiWaitFor('没有打开的文件管理器窗口');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850145-访问SMB', async ({ device, system, agent, uos }) => {
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器打开成功');

    // 步骤 2: 判断有没有挂载smb，如果没有使用通用方法挂载SMB, 如果有跳过
    console.log('步骤 2: 判断有没有挂载smb，如果没有使用通用方法挂载SMB, 如果有跳过');
    let result = await system.exec(`mount -l | grep smb | grep ${ip}`);
    if (result.sccess) {
      console.log('测试前已挂载smb');
      smb_mount = true;
    } else {
      console.log('测试前未挂载smb');
      smb_mount = false;
      await SmbMount(agent, system, device, 1);
    }

    // 预期 2: SMB挂载成功, 已打开${smbdir}文件夹
    console.log(`预期 2: SMB挂载成功, 已打开${smbdir}文件夹`);
    await agent.aiAssert(`已打开${smbdir}文件夹`);

  }, { timeout: 600000, tags: ['1850145', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'smb'] });

});
