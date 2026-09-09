/**
 * 用例 PMSID: 1804905
 * 用例标题: 不勾选【显示隐藏文件】-在sftp共享目录内“.”开头新建/重命名文件-弹窗提示-点击【隐藏】
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

describe('1804905-不勾选【显示隐藏文件】-在sftp共享目录内“.”开头新建/重命名文件-弹窗提示-点击【隐藏】', () => {
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
    const ip = process.env.SFTP_IP;

    // 前置完全卸载sftp
    const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent, system);
    // 用户名挂载sftp
    const { SftpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SftpMount(agent, system, device);
    await system.exec(`mkdir -p /run/user/1000/gvfs/sftp:host=${ip}/sftp/upload/1804905_test`);
    await agent.aiRightClick('文件管理器窗口空白处');
    await agent.aiTap('刷新');
  });

  test('1804905-不勾选【显示隐藏文件】-在sftp共享目录内“.”开头新建/重命名文件-弹窗提示-点击【隐藏】', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1804905 ===');
    
    const ip = process.env.SFTP_IP;
    const sftpPath = `/run/user/1000/gvfs/sftp:host=${ip}/sftp/upload`;
    
    console.log('步骤1: 在sftp共享目录内以“.”开头新建文件，弹窗后点击【隐藏】');

    await agent.aiTap('侧边栏的SFTP目录');
    await agent.aiTap('upload目录');
    await agent.aiDoubleClick('1804905_test目录');    
    await agent.aiRightClick('文件管理器窗口空白处');
    await agent.aiTap('新建文档');
    await agent.aiTap('文本文档');
    await device.typeText('.test1');
    await device.pressKey('Enter');
    await agent.aiTap('隐藏');
    await agent.aiAssert("SFTP目录无.test1.txt文件");
    await device.pressKey(`Ctrl+H`)
    await agent.aiAssert("SFTP目录有.test1.txt文件");

    const result1a = await safeExec(system, `ls -al ${sftpPath}/1804905_test/`);
    const expectedFile1 = '.test1.txt';
    if (result1a.stdout && result1a.stdout.includes(expectedFile1)) {
      console.log(`✅ 验证成功：SFTP目录已找到包含 "${expectedFile1}" 的文件（显示隐藏文件后可见）`);
    } else {
      console.error(`❌ 验证失败：SFTP目录未找到 "${expectedFile1}"`);
      throw new Error(`新建文件失败：未在SFTP目录找到 ${expectedFile1}`);
    }

    console.log('步骤2: 在sftp共享目录内以“.”开头新建文件夹，弹窗后点击【隐藏】');
    await device.pressKey(`Ctrl+H`)
    await agent.aiRightClick('文件管理器窗口空白处');
    await agent.aiTap('新建文件夹');
    await device.typeText('.test2');
    await device.pressKey('Enter');
    await agent.aiTap('隐藏');
    await agent.aiAssert("SFTP目录无.test2文件夹");
    await device.pressKey(`Ctrl+H`)
    await agent.aiAssert("SFTP目录有.test2文件夹");
    
    const result2a = await safeExec(system, `ls -al ${sftpPath}/1804905_test/`);
    const expectedFolder1 = '.test2';
    if (result2a.stdout && result2a.stdout.includes(expectedFolder1)) {
      console.log(`✅ 验证成功：SFTP目录已找到包含 "${expectedFolder1}" 的文件夹（显示隐藏文件后可见）`);
    } else {
      console.error(`❌ 验证失败：SFTP目录未找到 "${expectedFolder1}"`);
      throw new Error(`新建文件夹失败：未在SFTP目录找到 ${expectedFolder1}`);
    }

    console.log('步骤3: 在sftp共享目录内以“.”开头重命名文件，弹窗后点击【隐藏】');
    await device.pressKey(`Ctrl+H`)
    await system.exec(`echo "test" > ${sftpPath}/1804905_test/test3.txt`);
    await agent.aiRightClick('文件管理器窗口空白处');
    await agent.aiTap('刷新');
    await agent.aiRightClick('test3.txt');
    await agent.aiTap('重命名');
    await device.typeText('.retest3');
    await device.pressKey('Enter');
    await agent.aiTap('隐藏');
    await agent.aiAssert("SFTP目录无.retest3.txt文件");
    await device.pressKey(`Ctrl+H`)
    await agent.aiAssert("SFTP目录有.retest3.txt文件");
    
    const result3 = await safeExec(system, `ls -al ${sftpPath}/1804905_test/`);
    const expectedFile2 = '.retest3.txt';
    if (result3.stdout && result3.stdout.includes(expectedFile2)) {
      console.log(`✅ 验证成功：SFTP目录已找到包含 "${expectedFile2}" 的文件（显示隐藏文件后可见）`);
    } else {
      console.error(`❌ 验证失败：SFTP目录未找到 "${expectedFile2}"`);
      throw new Error(`重命名文件失败：未在SFTP目录找到 ${expectedFile2}`);
    }

    console.log('步骤4: 在sftp共享目录内以“.”开头重命名文件夹，弹窗后点击【隐藏】');
    await device.pressKey(`Ctrl+H`)
    await system.exec(`mkdir -p ${sftpPath}/1804905_test/test4`);
    await agent.aiRightClick('文件管理器窗口空白处');
    await agent.aiTap('刷新');
    await agent.aiRightClick('test4');
    await agent.aiTap('重命名');
    await device.typeText('.retest4');
    await device.pressKey('Enter');
    await agent.aiTap('隐藏');
    await agent.aiAssert("SFTP目录无.retest4文件夹");
    await device.pressKey(`Ctrl+H`)
    await agent.aiAssert("SFTP目录有.retest4文件夹");
    
    const result4 = await safeExec(system, `ls -al ${sftpPath}/1804905_test/`);
    const expectedFolder2 = '.retest4';
    if (result4.stdout && result4.stdout.includes(expectedFolder2)) {
      console.log(`✅ 验证成功：SFTP目录已找到包含 "${expectedFolder2}" 的文件夹（显示隐藏文件后可见）`);
    } else {
      console.error(`❌ 验证失败：SFTP目录未找到 "${expectedFolder2}"`);
      throw new Error(`重命名文件夹失败：未在SFTP目录找到 ${expectedFolder2}`);
    }

    console.log('✅ 1804905用例测试完成');
  }, { timeout: 1200000, tags: ['1804905', 'level3', 'menu', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    const caseDir = process.env.TESTCASE_DIR;
    const ip = process.env.SFTP_IP;
    
    await system.exec(`rm -rf /run/user/1000/gvfs/sftp:host=${ip}/sftp/upload/1804905_test`);
    await device.pressKey(`Ctrl+H`)    
    const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent, system);
    
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});