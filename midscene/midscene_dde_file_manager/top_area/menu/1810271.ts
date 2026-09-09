/**
 * 用例 PMSID: 1810271
 * 用例标题: 勾选【显示隐藏文件】-在smb共享目录内“.”开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-05-26
 * 用例编写人: UT000649（黄甜）
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function safeExec(system, cmd) {
  console.log('[LOG] shell ->', cmd);
  try {
    const res = await system.exec(cmd);
    if (res && res.stdout) console.log('[LOG] shell stdout ->', res.stdout.trim());
    return res;
  } catch (e) {
    console.error('[ERROR] shell failed ->', cmd, e);
    throw e;
  }
}

describe('1810271-勾选【显示隐藏文件】-在smb共享目录内“.”开头新建/重命名文件-不弹窗提示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await uos.maximizeWindow();
    const caseDir = process.env.TESTCASE_DIR;
    const ip = process.env.SMB_IP;
    const dir = process.env.SMB_DIR;
    
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    
    await system.exec(`rm -rf /media/$USER/smbmounts/smb-share\:server\=${ip}\,share\=${dir}/1810271_test`);
    
    await agent.aiTap("右上角有3条横线的图标");
    await agent.aiTap("下拉菜单中的设置");
    await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
    await agent.aiTap("文件粉碎");
    await agent.aiTap("恢复默认");
    await agent.aiTap("设置窗口右上角的关闭按钮:x");
  });

  test('1810271-勾选【显示隐藏文件】-在smb共享目录内“.”开头新建/重命名文件-不弹窗提示', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1810271 ===');
    
    const ip = process.env.SMB_IP;
    const dir = process.env.SMB_DIR;
    const smbPath = `/media/$USER/smbmounts/smb-share\:server\=${ip}\,share\=${dir}`;
    
    console.log('步骤1: 在smb共享目录内以“.”开头新建文件');

    
    await safeExec(system, `mkdir -p /media/$USER/smbmounts/smb-share\:server\=${ip}\,share\=${dir}/1810271_test`);
    await agent.aiWaitFor("1810271_test创建完成");
    await agent.aiTap('文件管理器窗口空白处');
    await device.pressKey(`Ctrl+H`)
    
    await agent.aiDoubleClick('1810271_test');    
    await agent.aiRightClick('文件管理器窗口空白处');
    await agent.aiTap('新建文档');
    await agent.aiTap('文本文档');
    await device.typeText('.test1');
    await device.pressKey('Enter');
    
    const result1 = await safeExec(system, `ls -al ${smbPath}/1810271_test/`);
    console.log(result1.stdout);
    const expectedFile1 = '.test1.txt';
    if (result1.stdout && result1.stdout.includes(expectedFile1)) {
      console.log(`✅ 验证成功：SMB目录已找到包含 "${expectedFile1}" 的文件`);
    } else {
      console.error(`❌ 验证失败：SMB目录未找到 "${expectedFile1}"`);
      throw new Error(`新建文件失败：未在SMB目录找到 ${expectedFile1}`);
    }

    console.log('步骤2: 在smb共享目录内以“.”开头新建文件夹');
    await agent.aiRightClick('文件管理器窗口空白处');
    await agent.aiTap('新建文件夹');
    await device.typeText('.test2');
    await device.pressKey('Enter');
    
    const result2 = await safeExec(system, `ls -al ${smbPath}/1810271_test/`);
    const expectedFolder1 = '.test2';
    if (result2.stdout && result2.stdout.includes(expectedFolder1)) {
      console.log(`✅ 验证成功：SMB目录已找到包含 "${expectedFolder1}" 的文件夹`);
    } else {
      console.error(`❌ 验证失败：SMB目录未找到 "${expectedFolder1}"`);
      throw new Error(`新建文件夹失败：未在SMB目录找到 ${expectedFolder1}`);
    }

    console.log('步骤3: 在smb共享目录内以“.”开头重命名文件');
    await agent.aiRightClick('.test1.txt');
    await agent.aiTap('重命名');
    await device.typeText('.retest1');
    await device.pressKey('Enter');
    
    const result3 = await safeExec(system, `ls -al ${smbPath}/1810271_test/`);
    const expectedFile2 = '.retest1.txt';
    if (result3.stdout && result3.stdout.includes(expectedFile2)) {
      console.log(`✅ 验证成功：SMB目录已找到包含 "${expectedFile2}" 的文件`);
    } else {
      console.error(`❌ 验证失败：SMB目录未找到 "${expectedFile2}"`);
      throw new Error(`重命名文件失败：未在SMB目录找到 ${expectedFile2}`);
    }

    console.log('步骤4: 在smb共享目录内以“.”开头重命名文件夹');
    await agent.aiRightClick('.test2');
    await agent.aiTap('重命名');
    await device.typeText('.retest2');
    await device.pressKey('Enter');
    
    const result4 = await safeExec(system, `ls -al ${smbPath}/1810271_test/`);
    const expectedFolder2 = '.retest2';
    if (result4.stdout && result4.stdout.includes(expectedFolder2)) {
      console.log(`✅ 验证成功：SMB目录已找到包含 "${expectedFolder2}" 的文件夹`);
    } else {
      console.error(`❌ 验证失败：SMB目录未找到 "${expectedFolder2}"`);
      throw new Error(`重命名文件夹失败：未在SMB目录找到 ${expectedFolder2}`);
    }

    console.log('✅ 1810271用例测试完成');
  }, { timeout: 1200000, tags: ['1810271', 'level3', 'menu', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const ip = process.env.SMB_IP;
    const dir = process.env.SMB_DIR;
    
    await system.exec(`rm -rf /media/$USER/smbmounts/smb-share\:server\=${ip}\,share\=${dir}/1810271_test`);
    
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    await agent.aiTap("右上角有3条横线的图标");
    await agent.aiTap("下拉菜单中的设置");
    await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
    await agent.aiTap("文件粉碎");
    await agent.aiTap("恢复默认");
    await agent.aiTap("设置窗口右上角的关闭按钮:x")
    await system.exec('killall dde-file-manager', 500);
  });
});