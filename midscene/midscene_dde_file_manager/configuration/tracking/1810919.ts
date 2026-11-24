/**
 * 用例 PMSID: 1810919
 * 用例标题:  埋点，侧边栏各目录去重后的点击分布-已挂载共享文件夹（多个）
 * 生成时间: 2026-08-11 21:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const caseDir = process.env.TESTCASE_DIR;
const smbIp = process.env.SMB_IP;
const smbDir = process.env.SMB_DIR;
const ftpIp = process.env.FTP_IP;
const sftpIp = process.env.SFTP_IP;
const smbName = process.env.SMB_USERNAME;
const smbPwd = process.env.SMB_PASSWORD;

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

// 辅助函数：带重试机制的日志断言
async function monitorAndAssert(agent, device, logKeyword) {
  console.log(`开始验证日志关键词: ${logKeyword}`);
  
  // 第一次尝试
  let isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含'${logKeyword}'关键词`);
  
  if (isKey) {
    console.log(`✅ 断言成功：终端新增一条日志，且内容包含'${logKeyword}'关键词`);
    return true;
  } else {
    console.log(`⚠️ 第 1 次断言失败：终端未检测到包含'${logKeyword}'关键词`);
    
    // 执行清理操作：停止日志监控并清空终端
    console.log('步骤1: 停止日志监控并清空终端');
    await agent.aiTap("终端窗口的标题栏");
    await device.pressKey("Ctrl+C");
    await device.typeText("clear");
    await device.pressKey("Enter");
    
    // 执行重新监控：重新打开日志监控
    console.log('步骤2: 重新打开日志监控');
    await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
    for (let j = 0; j < 3; j++) {
      await device.pressKey('Enter');
    }
    
    // 第二次尝试
    console.log(`第 2 次尝试验证...`);
    isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含'${logKeyword}'关键词`);
    
    if (isKey) {
      console.log(`✅ 断言成功：终端新增一条日志，且内容包含'${logKeyword}'关键词`);
      return true;
    } else {
      console.log(`❌ 断言失败：终端未检测到包含'${logKeyword}'关键词`);
      console.log(`❌ 日志关键词 "${logKeyword}" 验证失败`);
      return false;
    }
  }
}

describe('1810919- 埋点，侧边栏各目录去重后的点击分布-已挂载共享文件夹（多个）', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 清理环境
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");
    await system.exec("kill -TERM $(pidof dde-file-manager)");

    // 打开文件管理器
    await device.pressKey("Super+E");
    await device.pressKey("Super+Up");
 
    // 清理所有挂载
    const { cleanSmbMounts, cleanFtpMounts, cleanSftpMounts, SmbMount, FtpMount, SftpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    await cleanFtpMounts(agent, system);
    await cleanSftpMounts(agent, system);

    // 挂载smb
    console.log('挂载smb共享');  
    await SmbMount(agent, system, device, 1);

    // 挂载FTP
    console.log('挂载FTP共享');
    await FtpMount(agent, system, device, 1);    
    // 挂载SFTP
    console.log('挂载SFTP共享');
    await SftpMount(agent, system, device);   

  });

  test('1810919-埋点，侧边栏各目录去重后的点击分布-已挂载共享文件夹（多个）', async ({ device, agent, uos, system }) => {

    // 按 Super+Left 将文件管理器靠左
    console.log('按 Super+Left 将文件管理器靠左');
    await device.pressKey("Super+Left");

    // 通过 Ctrl+Alt+T 快捷键打开终端
    console.log('通过 Ctrl+Alt+T 快捷键打开终端');
    await device.pressKey("Ctrl+Alt+T");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 按 Super+Right 将终端窗口靠右
    console.log('按 Super+Right 将终端靠右');
    await device.pressKey("Super+Right");
    
    // 在终端中执行日志监控命令
    console.log('在终端中执行日志监控命令');
    await agent.aiTap("终端窗口的标题栏");
    await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
    for (let i = 0; i < 3; i++) {
      await device.pressKey('Enter');
    }  
    
    // ========== 步骤1: 点击SMB左侧边栏 ==========
    await agent.aiTap("文件管理器窗口的标题栏");
    console.log('步骤1: 点击左侧边栏 - SMB地址项');
    await agent.aiTap(`文件管理器左侧边栏从上往下数第一个${smbIp}IP地址`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 验证预期结果：触发上报事件
    console.log('验证预期结果: 触发上报事件 - SMB');
    const smbKeyword = `${smbIp}`;
    let smbSuccess = await monitorAndAssert(agent, device, smbKeyword);
    
    if (smbSuccess) {
      console.log(`✅ SMB埋点验证通过`);
    } else {
      console.error(`❌ SMB埋点验证失败，终止测试`);
      throw new Error(`SMB埋点日志验证失败：未检测到包含'${smbKeyword}'关键词的日志`);
    }

    for (let i = 0; i < 3; i++) {
      await device.pressKey('Enter');
    }
    
    // ========== 步骤2: 点击FTP左侧边栏 ==========
    console.log('步骤2: 点击左侧边栏 - FTP地址项');
    await agent.aiTap(`文件管理器左侧边栏从上往下数第二个${ftpIp}IP地址`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 验证预期结果：触发上报事件
    console.log('验证预期结果: 触发上报事件 - FTP');
    const ftpKeyword = "Sharing Folders";
    let ftpSuccess = await monitorAndAssert(agent, device, ftpKeyword);
    
    if (ftpSuccess) {
      console.log(`✅ FTP埋点验证通过`);
    } else {
      console.error(`❌ FTP埋点验证失败，终止测试`);
      throw new Error(`FTP埋点日志验证失败：未检测到包含'${ftpKeyword}'关键词的日志`);
    }

    for (let i = 0; i < 3; i++) {
      await device.pressKey('Enter');
    }
    
    // ========== 步骤3: 点击SFTP左侧边栏 ==========
    console.log('步骤3: 点击左侧边栏 - SFTP地址项');
    await agent.aiTap(`文件管理器左侧边栏的${sftpIp}地址`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 验证预期结果：触发上报事件
    console.log('验证预期结果: 触发上报事件 - SFTP');
    const sftpKeyword = "Sharing Folders";
    let sftpSuccess = await monitorAndAssert(agent, device, sftpKeyword);
    
    if (sftpSuccess) {
      console.log(`✅ SFTP埋点验证通过`);
    } else {
      console.error(`❌ SFTP埋点验证失败，终止测试`);
      throw new Error(`SFTP埋点日志验证失败：未检测到包含'${sftpKeyword}'关键词的日志`);
    }
    
    // 停止日志监控（Ctrl+C）并清空终端
    console.log('停止日志监控并清空终端');
    await agent.aiTap("终端窗口的标题栏");
    await device.pressKey("Ctrl+C");
    await device.typeText("clear");
    await device.pressKey("Enter");
    
    // 关闭终端
    console.log('关闭终端');
    await agent.aiTap("终端窗口右上角的x按钮");
    
    console.log('✅ 1810919用例测试完成 - SMB/FTP/SFTP埋点验证全部通过');
  }, { timeout: 1800000, tags: ['1810919', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 清理所有挂载
    const { cleanSmbMounts, cleanFtpMounts, cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    await cleanFtpMounts(agent, system);
    await cleanSftpMounts(agent, system);
    
    // 关闭所有可能残留的进程
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9");
    console.log('清理完成');
  });
});