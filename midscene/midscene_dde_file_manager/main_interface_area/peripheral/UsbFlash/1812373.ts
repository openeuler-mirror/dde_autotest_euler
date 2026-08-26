
/**
 * 用例 PMSID: 1812373
 * 用例标题: 【外设】外设和网络路径彻底删除文件
 * 生成时间: 2026-03-17 19:25:42
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

describe('1812373-【外设】外设和网络路径彻底删除文件', () => {
  beforeAll(async ({ device, uos, agent,system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    await uos.showDesktop();
    // 打开文管并全屏显示
    await device.pressKey('Super+E');
    await sleep(3000);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
    //前置完全卸载smb
    const {cleanSmbMounts}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent,system);
  });

  beforeEach(async ({ device, agent,system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1812373-【外设】外设和网络路径彻底删除文件', async ({ device, agent, uos, system}) => {
    console.log('3. 进行外设和网络路径彻底删除文件');
     //在U盘中创建测试文件
    const USB=process.env.USB_FLASH
    const UserName=process.env.TEST_USERNAME
    await safeExec(system, `touch /media/${UserName}/${USB}/1812373.txt`);
    //挂载SMB并在其中创建测试文件
    const caseDir = process.env.TESTCASE_DIR;
    const ip = process.env.SMB_IP;
    const smbdir = process.env.SMB_DIR;
    const lowsmbdir = (process.env.SMB_DIR || '').toLowerCase();
    const id=await safeExec(system, `id -u`);
    const uid=id.stdout.trim();
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device,1);
    await sleep(3000);
    await safeExec(system, `touch /media/${UserName}/smbmounts/smb-share:server=${ip},share=${lowsmbdir}/1812373.txt`);
    await device.pressKey('F5');
    // 1. 删除U盘中的文件并验证
    //快捷键进入U盘目录
    await device.pressKey('Ctrl+L');
    await device.pressKey('Ctrl+A');
    await device.typeText(`/media/${UserName}/${USB}`,true);
    await agent.aiWaitFor('1812373.txt');
    //删除U盘中的文件
    await agent.aiTap('1812373');
    await device.pressKey('Delete');
    await agent.aiWaitFor('彻底删除');
    await agent.aiTap('删除');
    //验证U盘中的文件被彻底删除
    const result1 = await safeExec(system, `ls /home/${UserName}/.local/share/Trash/files/`);
    console.log(result1 && result1.stdout ? result1.stdout : '无输出');
    const expectedFileName1 = "1812373"; 
    //若ls结果包含被删除的文件名，说明文件未被彻底删除，验证失败；若不包含被删除的文件名，说明文件被彻底删除，验证成功
    if (result1.stdout && result1.stdout.includes(expectedFileName1)) {
      console.error(`❌ 验证失败：回收站已找到包含 "${expectedFileName1}" 的文件,文件未被彻底删除`);
      throw new Error(`U盘失败：在回收站找到文件 ${expectedFileName1}`);
    } else {
      console.log(`✅ 验证成功：回收站未找到 "${expectedFileName1}"`);
    }
    // 2. 删除SMB中的文件并验证
    //快捷键进入SMB目录
    await device.pressKey('Ctrl+L');
    await device.pressKey('Ctrl+A');
    await device.typeText(`smb://${ip}/${smbdir}`,true);
    await agent.aiWaitFor('1812373.txt');
    //删除SMB中的文件
    await agent.aiTap('1812373');
    await device.pressKey('Delete');
    await agent.aiWaitFor('彻底删除');
    await agent.aiTap('删除');
    //验证SMB中的文件被彻底删除
    const result2 = await safeExec(system, `ls /home/${UserName}/.local/share/Trash/files/`);
    console.log(result2 && result2.stdout ? result2.stdout : '无输出');
    const expectedFileName2 = "1812373"; 
    if (result2.stdout && result2.stdout.includes(expectedFileName2)) {
      console.error(`❌ 验证失败：回收站已找到包含 "${expectedFileName2}" 的文件,文件未被彻底删除`);
      throw new Error(`SMB失败：在回收站找到文件 ${expectedFileName2}`);
    } else {
      console.log(`✅ 验证成功：回收站未找到 "${expectedFileName2}"`);
    }
  }, { timeout: 600000, tags: ['1812373', 'level2','UsbFlash','DITT','yangtong'] });
  test('1812373-【外设】外设和网络路径彻底删除文件', async ({ device, agent, uos, system}) => {
    console.log('3. 进行本地存储路径删除文件');
    const UserName=process.env.TEST_USERNAME
    //在主目录创建测试文件夹并创建测试文件
    await safeExec(system, `mkdir -p /home/${UserName}/1812373目录`);
    await safeExec(system, `touch /home/${UserName}/1812373目录/1812373.txt`);
    //在桌面创建测试文件
    await safeExec(system, `touch /home/${UserName}/Desktop/1812373.txt`);
    //3. 删除主目录中的文件并验证
    //快捷键进入本地存储路径
    await device.pressKey('Ctrl+L');
    await device.pressKey('Ctrl+A');
    await device.typeText(`/home/${UserName}/1812373目录`,true);
    await agent.aiWaitFor('1812373.txt');
    //删除本地存储路径中的文件
    await agent.aiTap('1812373.txt');
    await device.pressKey('Delete');
    //验证本地存储路径中的文件被删除后进入回收站
    //如果回收站的ls结果包含被删除的文件名，说明文件被删除后进入回收站，验证成功；若不包含被删除的文件名，说明文件未被删除或未进入回收站，验证失败
    const result1 = await safeExec(system, `ls /home/${UserName}/.local/share/Trash/files/`);
    console.log(result1 && result1.stdout ? result1.stdout : '无输出');
    const expectedFileName = "1812373"; 
    if (result1.stdout && result1.stdout.includes(expectedFileName)) {
      console.log(`✅ 验证成功：回收站已找到包含 "${expectedFileName}" 的文件,文件被删除后进入回收站`);
    } else {
      console.error(`❌ 验证失败：回收站未找到 "${expectedFileName}"`);
      throw new Error(`本地存储路径失败：在回收站未找到文件 ${expectedFileName}`);
    } 
      //清空回收站
    await safeExec(system, `rm -rf /home/${UserName}/.local/share/Trash/files/*`);
    // 4. 删除桌面文件并验证
    //返回桌面
    await device.pressKey('Super+D');
    await agent.aiWaitFor('1812373.txt');
    //删除桌面文件
    await agent.aiTap('1812373.txt');
    await device.pressKey('Delete');
    //验证桌面文件被删除后进入回收站
    const result2 = await safeExec(system, `ls /home/${UserName}/.local/share/Trash/files/`);
    console.log(result2 && result2.stdout ? result2.stdout : '无输出');
    const expectedFileName2 = "1812373"; 
    if (result2.stdout && result2.stdout.includes(expectedFileName2)) {
      console.log(`✅ 验证成功：回收站已找到包含 "${expectedFileName2}" 的文件,文件被删除后进入回收站`);
    } else {
      console.error(`❌ 验证失败：回收站未找到 "${expectedFileName2}"`);
      throw new Error(`桌面文件失败：在回收站未找到文件 ${expectedFileName2}`);
    } 
    //清空回收站
    await safeExec(system, `rm -rf /home/${UserName}/.local/share/Trash/files/*`);
   
  }, { timeout: 600000, tags: ['1812373', 'level2','UsbFlash','DITT','yangtong'] });

  afterEach(async ({ device ,agent,system}) => {
    console.log('4. afterEach: 每个测试后的清理');
    console.log('卸载smb');
    const USB=process.env.USB_FLASH
    const UserName=process.env.TEST_USERNAME
    const ip = process.env.SMB_IP;
    const smbdir = process.env.SMB_DIR;
    const caseDir = process.env.TESTCASE_DIR;
    await safeExec(system, `rm -f /run/user/$(id -u)/gvfs/smb-share:server=${ip},share=${smbdir}/1812373.txt`);
    const {cleanSmbMounts}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent,system);
    //双重保险，删除所有测试文件
    await safeExec(system, `rm -f /media/${UserName}/${USB}/1812373.txt`);
    await safeExec(system, `rm -f /run/user/$(id -u)/gvfs/smb-share:server=${ip},share=${smbdir}/1812373.txt`);
    await safeExec(system, `rm -rf /home/${UserName}/1812373目录`);
    await safeExec(system, `rm -f /home/${UserName}/Desktop/1812373.txt`);
    //清空回收站
    await safeExec(system, `rm -rf /home/${UserName}/.local/share/Trash/files/*`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器环境
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
