/**
 * 用例 PMSID: 1804909
 * 用例标题: 不勾选【显示隐藏文件】-在smb共享目录内“.”开头新建/重命名文件-弹窗提示-点击【隐藏】
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

describe('1804909-不勾选【显示隐藏文件】-在smb共享目录内“.”开头新建/重命名文件-弹窗提示-点击【隐藏】', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await uos.maximizeWindow();
    const caseDir = process.env.TESTCASE_DIR;
    const ip = process.env.SMB_IP;
    const dir = process.env.SMB_DIR;
    
    await safeExec(system, `rm -rf /media/$USER/smbmounts/smb-share\:server\=${ip}\,share\=${dir}/1804909_test`);
    
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    
    await safeExec(system, `mkdir -p /media/$USER/smbmounts/smb-share\:server\=${ip}\,share\=${dir}/1804909_test`);
    await agent.aiWaitFor("1804909_test创建完成");
  });

  test('1804909-不勾选【显示隐藏文件】-在smb共享目录内“.”开头新建/重命名文件-弹窗提示-点击【隐藏】', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1804909 ===');
    
    const ip = process.env.SMB_IP;
    const dir = process.env.SMB_DIR;
    const smbPath = `/media/$USER/smbmounts/smb-share\:server\=${ip}\,share\=${dir}`;
    
    console.log('步骤1: 在smb共享目录内以“.”开头新建文件，弹窗后点击【隐藏】');
    
    await agent.aiDoubleClick('1804909_test');    
    await agent.aiRightClick('文件管理器窗口空白处');
    await agent.aiTap('新建文档');
    await agent.aiTap('文本文档');
    await device.typeText('.test1');
    await device.pressKey('Enter');
    await agent.aiTap('隐藏');
    await agent.aiAssert("SMB目录无.test1.txt文件");
    await device.pressKey(`Ctrl+H`)
    await agent.aiAssert("SMB目录有.test1.txt文件");
    
    const result1a = await safeExec(system, `ls -al ${smbPath}/1804909_test/`);
    console.log(result1a.stdout);
    const expectedFile1 = '.test1.txt';
    if (result1a.stdout && result1a.stdout.includes(expectedFile1)) {
      console.log(`✅ 验证成功：SMB目录已找到包含 "${expectedFile1}" 的文件（显示隐藏文件后可见）`);
    } else {
      console.error(`❌ 验证失败：SMB目录未找到 "${expectedFile1}"`);
      throw new Error(`新建文件失败：未在SMB目录找到 ${expectedFile1}`);
    }

    console.log('步骤2: 在smb共享目录内以“.”开头新建文件夹，弹窗后点击【隐藏】');
    await device.pressKey(`Ctrl+H`)
    await agent.aiRightClick('文件管理器窗口空白处');
    await agent.aiTap('新建文件夹');
    await device.typeText('.test2');
    await device.pressKey('Enter');
    await agent.aiTap('隐藏');
    await agent.aiAssert("SMB目录无.test2文件夹");
    await device.pressKey(`Ctrl+H`)
    await agent.aiAssert("SMB目录有.test2文件夹");
    
    const result2a = await safeExec(system, `ls -al ${smbPath}/1804909_test/`);
    const expectedFolder1 = '.test2';
    if (result2a.stdout && result2a.stdout.includes(expectedFolder1)) {
      console.log(`✅ 验证成功：SMB目录已找到包含 "${expectedFolder1}" 的文件夹（显示隐藏文件后可见）`);
    } else {
      console.error(`❌ 验证失败：SMB目录未找到 "${expectedFolder1}"`);
      throw new Error(`新建文件夹失败：未在SMB目录找到 ${expectedFolder1}`);
    }

    console.log('步骤3: 在smb共享目录内以“.”开头重命名文件，弹窗后点击【隐藏】');
    await device.pressKey(`Ctrl+H`)
    await system.exec(`echo "test" > ${smbPath}/1804909_test/test3.txt`);
    await agent.aiWaitFor("test3.txt创建完成");
    await agent.aiRightClick('test3.txt');
    await agent.aiTap('重命名');
    await device.typeText('.retest3');
    await device.pressKey('Enter');
    await agent.aiTap('隐藏');
    await agent.aiAssert("SMB目录无.retest3.txt文件");
    await device.pressKey(`Ctrl+H`)
    await agent.aiAssert("SMB目录有.retest3.txt文件");
    
    const result3 = await safeExec(system, `ls -al ${smbPath}/1804909_test/`);
    const expectedFile2 = '.retest3.txt';
    if (result3.stdout && result3.stdout.includes(expectedFile2)) {
      console.log(`✅ 验证成功：SMB目录已找到包含 "${expectedFile2}" 的文件（显示隐藏文件后可见）`);
    } else {
      console.error(`❌ 验证失败：SMB目录未找到 "${expectedFile2}"`);
      throw new Error(`重命名文件失败：未在SMB目录找到 ${expectedFile2}`);
    }

    console.log('步骤4: 在smb共享目录内以“.”开头重命名文件夹，弹窗后点击【隐藏】');
    await device.pressKey(`Ctrl+H`)
    await system.exec(`mkdir -p ${smbPath}/1804909_test/test4`);
    await agent.aiWaitFor("test4文件夹创建完成");
    await agent.aiRightClick('test4');
    await agent.aiTap('重命名');
    await device.typeText('.retest4');
    await device.pressKey('Enter');
    await agent.aiTap('隐藏');
    await agent.aiAssert("SMB目录无.retest4文件夹");
    await device.pressKey(`Ctrl+H`)
    await agent.aiAssert("SMB目录有.retest4文件夹");
    
    const result4 = await safeExec(system, `ls -al ${smbPath}/1804909_test/`);
    const expectedFolder2 = '.retest4';
    if (result4.stdout && result4.stdout.includes(expectedFolder2)) {
      console.log(`✅ 验证成功：SMB目录已找到包含 "${expectedFolder2}" 的文件夹（显示隐藏文件后可见）`);
    } else {
      console.error(`❌ 验证失败：SMB目录未找到 "${expectedFolder2}"`);
      throw new Error(`重命名文件夹失败：未在SMB目录找到 ${expectedFolder2}`);
    }

    console.log('✅ 1804909用例测试完成');
  }, { timeout: 1200000, tags: ['1804909', 'level3', 'menu', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    const caseDir = process.env.TESTCASE_DIR;
    const ip = process.env.SMB_IP;
    const dir = process.env.SMB_DIR;
    
    await system.exec(`rm -rf /media/$USER/smbmounts/smb-share\:server\=${ip}\,share\=${dir}/1804909_test`);
    await device.pressKey(`Ctrl+H`)    
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});