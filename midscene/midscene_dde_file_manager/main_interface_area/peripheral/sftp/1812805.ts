/**
 * 用例 PMSID: 1812805
 * 用例标题: sftp-右键菜单发送到桌面
 * 生成时间: 2026-02-26 15:52:30
 * 用例编写人：UT006252(杨通)
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

describe('1812805-sftp-右键菜单发送到桌面', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    let result = await safeExec(system, `id -u`);
    const uid = result.stdout.trim();
    
    await uos.showDesktop();
    // 打开文管并全屏显示
    await device.pressKey('Super+E');
    await sleep(3000);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
    
    // 卸载 sftp
    const caseDir = process.env.TESTCASE_DIR;
    const ip = process.env.SFTP_IP;
    const sftpname = process.env.SFTP_USERNAME;
    
    const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent, system);
    
    // 挂载 SFTP
    const { SftpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SftpMount(agent, system, device);
    await sleep(3000);
    await safeExec(system, `rm /run/user/${uid}/gvfs/sftp:host=${ip}//sftp/upload/* -rf`);
    
    // 在 sftp 挂载点创建测试目录与文件
    // 注意：确保路径中的变量已正确替换
    await safeExec(system, `mkdir -p /run/user/${uid}/gvfs/sftp:host=${ip}/sftp/upload/18目录`);
    await safeExec(system, `mkdir -p /run/user/${uid}/gvfs/sftp:host=${ip}/sftp/upload/19目录`);

    await safeExec(system, `touch /run/user/${uid}/gvfs/sftp:host=${ip}/sftp/upload/1812805.txt`);
    await safeExec(system, `touch /run/user/${uid}/gvfs/sftp:host=${ip}/sftp/upload/1912805.txt`);
    
    await sleep(1000);
    await device.pressKey('F5');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  // [修复 2] 第一个测试：文件夹测试
  test('1812805-sftp-右键菜单发送到桌面-文件夹', async ({ device, agent, uos, system }) => {
    // 右键单个文件夹发送到桌面
    await agent.aiRightClick(`18 目录上面的图标`);
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");
    await sleep(1000);
    
    console.log('[LOG] 检查桌面文件（单个文件夹结果）');
    const result1 = await safeExec(system, `ls ~/Desktop/`);
    console.log(result1 && result1.stdout ? result1.stdout : '无输出');
    
    const expectedFileName1 = "18目录 快捷方式"; 
    if (result1.stdout && result1.stdout.includes(expectedFileName1)) {
      console.log(`✅ 验证成功：桌面已找到包含 "${expectedFileName1}" 的文件`);
    } else {
      console.error(`❌ 验证失败：桌面未找到 "${expectedFileName1}"`);
      console.error("当前桌面文件列表:", result1.stdout);
      throw new Error(`发送桌面失败：未在桌面找到文件 ${expectedFileName1}`);
    }
    
    // 删除桌面快捷方式
    await safeExec(system, `rm -f ~/Desktop/*目录*`);
    await agent.aiTap(`页面空白处`); 

    // 选择多个文件夹发送到桌面
    await device.keyDown("Ctrl");
    await agent.aiTap(`18目录上面的图标`);
    await agent.aiTap(`19目录上面的图标`);
    await device.keyUp("Ctrl");
    
    await agent.aiRightClick(`18目录上面的图标`);
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");
    await sleep(1000);
    
    // 验证桌面是否出现多个快捷方式
    console.log('[LOG] 检查桌面文件（多个文件夹结果）');
    const result2 = await safeExec(system, `ls ~/Desktop/`);
    const targetFiles = ["18目录 快捷方式", "19目录 快捷方式"];
    let allPassed = true;
    const missingFiles = [];
    
    for (const fileName of targetFiles) {
      if (!result2.stdout || !result2.stdout.includes(fileName)) {
        console.error(`❌ 未找到：${fileName}`);
        missingFiles.push(fileName);
        allPassed = false;
      } else {
        console.log(`✅ 已找到：${fileName}`);
      }
    }
    
    // [修复 3] 将判断逻辑移出循环
    if (!allPassed) {
      throw new Error(`验证失败：以下文件未成功发送到桌面:\n - ${missingFiles.join('\n - ')}`);
    } else {
      console.log(`🎉 成功：所有 ${targetFiles.length} 个文件均已验证存在。`);
    }
    
    await safeExec(system, `rm -f ~/Desktop/*目录*`);
  }, { timeout: 1200000, tags: ['1812805', 'level3', 'sftp', 'DITT', 'yangtong'] });

  test('1812805-sftp-右键菜单发送到桌面-文档及混合', async ({ device, agent, uos, system }) => {
    // 右键单个文本文档发送到桌面
    await agent.aiRightClick(`1812805 上面的图标`);
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");
    await sleep(1000);
    
    console.log('[LOG] 检查桌面文件（单个文本文档结果）');
    const result3 = await safeExec(system, `ls ~/Desktop/`);
    console.log(result3 && result3.stdout ? result3.stdout : '无输出');
    
    const expectedFileName2 = "1812805 快捷方式.txt"; 
    if (result3.stdout && result3.stdout.includes(expectedFileName2)) {
      console.log(`✅ 验证成功：桌面已找到包含 "${expectedFileName2}" 的文件`);
    } else {
      console.error(`❌ 验证失败：桌面未找到 "${expectedFileName2}"`);
      console.error("当前桌面文件列表:", result3.stdout);
      throw new Error(`发送桌面失败：未在桌面找到文件 ${expectedFileName2}`);
    }
    
    // 删除桌面快捷方式（文本）
    await safeExec(system, `rm -f ~/Desktop/*txt*`);
    await agent.aiTap(`页面空白处`); 

    // 选择多个文本文档发送到桌面
    await device.keyDown("Ctrl");
    await agent.aiTap(`1912805 上面的图标`);
    await agent.aiTap(`1812805 上面的图标`);
    await device.keyUp("Ctrl");
    
    await agent.aiRightClick(`1912805 上面的图标`);
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");
    await sleep(1000);
    
    // 验证桌面是否出现多个快捷方式（文本）
    console.log('[LOG] 检查桌面文件（多个文本文档结果）');
    const result4 = await safeExec(system, `ls ~/Desktop/`);
    const targetFiles2 = ["1812805 快捷方式.txt", "1912805 快捷方式.txt"];
    let allPassed2 = true;
    const missingFiles2 = [];
    
    for (const fileName of targetFiles2) {
      if (!result4.stdout || !result4.stdout.includes(fileName)) {
        console.error(`❌ 未找到：${fileName}`);
        missingFiles2.push(fileName);
        allPassed2 = false;
      } else {
        console.log(`✅ 已找到：${fileName}`);
      }
    }
    
    if (!allPassed2) {
      throw new Error(`验证失败：以下文件未成功发送到桌面:\n - ${missingFiles2.join('\n - ')}`);
    } else {
      console.log(`🎉 成功：所有 ${targetFiles2.length} 个文件均已验证存在。`);
    }

    await safeExec(system, `rm -f ~/Desktop/*txt*`);
    await agent.aiTap(`页面空白处`); 

    // 选中文件夹和文本文档一起发送到桌面
    await device.keyDown("Ctrl");
    await agent.aiTap(`18目录上面的图标`);
    await agent.aiTap(`1812805 上面的图标`);
    await device.keyUp("Ctrl");
    
    await agent.aiRightClick(`18目录上面的图标`);
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");
    await sleep(1000);
    
    // 验证桌面是否出现快捷方式（混合选择）
    console.log('[LOG] 检查桌面文件（混合选择结果）');
    const result5 = await safeExec(system, `ls ~/Desktop/`);
    const expectedFiles3 = ["18目录 快捷方式", "1812805 快捷方式.txt"];
    let allPassed3 = true;
    const missingFiles3 = [];
    
    for (const fileName of expectedFiles3) {
      if (!result5.stdout || !result5.stdout.includes(fileName)) {
        console.error(`❌ 未找到：${fileName}`);
        missingFiles3.push(fileName);
        allPassed3 = false;
      } else {
        console.log(`✅ 已找到：${fileName}`);
      }
    }
    
    if (!allPassed3) {
      throw new Error(`验证失败：以下文件未成功发送到桌面:\n - ${missingFiles3.join('\n - ')}`);
    } else {
      console.log(`🎉 成功：所有 ${expectedFiles3.length} 个文件均已验证存在。`);
    }

    // 清理
    await safeExec(system, `rm -f ~/Desktop/*目录*`);
    await safeExec(system, `rm -f ~/Desktop/*txt*`);
  }, { timeout: 1200000, tags: ['1812805', 'level3', 'sftp', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await safeExec(system, `rm -f ~/Desktop/*目录*`);
    await safeExec(system, `rm -f ~/Desktop/*txt*`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const sftpname = process.env.SFTP_USERNAME;
    const ip = process.env.SFTP_IP;
    
    let result = await safeExec(system, `id -u`);
    const uid = result.stdout.trim();
    
    await safeExec(system, `rm -rf /run/user/${uid}/gvfs/sftp:host=${ip}/sftp/upload/18目录`);
    await safeExec(system, `rm -rf /run/user/${uid}/gvfs/sftp:host=${ip}/sftp/upload/19目录`);
    await safeExec(system, `rm -f /run/user/${uid}/gvfs/sftp:host=${ip}/sftp/upload/1812805.txt`);
    await safeExec(system, `rm -f /run/user/${uid}/gvfs/sftp:host=${ip}/sftp/upload/1912805.txt`);
    
    const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent, system);
    
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});