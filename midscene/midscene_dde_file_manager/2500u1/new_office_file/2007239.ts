/**
 * 用例 PMSID: 2007239
 * 用例标题: 【新建office文档默认格式修改】网络共享目录中新建office文档属性查看
 * 生成时间: 2026-07-06
 * 用例编写人: UT000211(陈依)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPwd = process.env.TEST_PASSWORD;

// SMB 环境变量
const smbIp = process.env.SMB_IP;
const smbDir = process.env.SMB_DIR;
const smbName = process.env.SMB_USERNAME;
const smbPwd = process.env.SMB_PASSWORD;

// FTP 环境变量
const ftpIp = process.env.FTP_IP;
const ftpUsername = process.env.FTP_USERNAME;
const ftpPassword = process.env.FTP_PASSWORD;
const ftpMountPath = `/run/user/1000/gvfs/ftp:host=${ftpIp}`;

// SFTP 环境变量
const sftpIp = process.env.SFTP_IP;
const sftppwd = process.env.SFTP_PASSWORD;
const sftpname = process.env.SFTP_USERNAME;
const sftpMountPath = `/run/user/1000/gvfs/sftp:host=${sftpIp}/sftp/upload`;

describe("2007239-【新建office文档默认格式修改】网络共享目录中新建office文档属性查看", () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log("1. beforeAll: 初始化测试套件");
    await uos.showDesktop();

    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');

    // 前置条件：确保WPS已安装
    const hasWPS = await system.exec(`dpkg -l | grep cn.wps.wps-office-pro | grep ii | wc -l`);
    if (parseInt(hasWPS.stdout.trim(), 10) === 0) {
      const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await installDeb(system, "cn.wps.wps-office-pro");
    } else {
      console.log("wps已安装，不需要再安装");
    }

    // 确保桌面有WPS文字图标（用于后续验证）
    const desktopHasWPS = await agent.aiBoolean("桌面上是否有WPS文字图标");
    if (!desktopHasWPS) {
      console.log("桌面上没有WPS文字图标，尝试添加");
      await agent.aiTap("任务栏上的第一个图标，也就是启动器");
      await agent.aiHover("影院");
      await agent.aiScroll("影院", { direction: 'down', distance: 2000 });
      await agent.aiRightClick("启动器里的WPS文字");
      await agent.aiTap("发送到桌面");
    } else {
      console.log("桌面上已有WPS文字图标");
      await agent.aiTap("任务栏空白处");
    }
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log("2. beforeEach: 每个测试前的环境清理");
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
  });

  test("2007239-【新建office文档默认格式修改】网络共享目录中新建office文档属性查看", async ({ device, system, agent, uos }) => {
    console.log("========== SMB网络共享目录中新建office文档属性查看 ==========");
    
    const { cleanSmbMounts, SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    
    // 挂载SMB
    try {
      // 完全卸载已有SMB挂载
      console.log('===== 卸载已有SMB挂载 =====');
      await uos.openApp("文件管理器", 3000, 20000, true);
      await cleanSmbMounts(agent, system);
      console.log('已有SMB挂载卸载完成');
      // 挂载smb-勾选记住密码
      console.log('===== 挂载smb-勾选记住密码 =====');
      await device.pressKey('Ctrl','l');
      await device.pressKey('Ctrl','a');
      await device.typeText(`smb://${smbIp}/${smbDir}`, true);
      await agent.aiWaitFor("出现需要授权来访问文本");
      await device.typeText(`${smbName}`);
      await agent.aiInput( `${smbPwd}`,'密码输入框');
      await agent.aiTap("记住密码文本");
      await agent.aiTap("连接选项");
      await system.exec("sleep 2");
      const boolA = await agent.aiBoolean(`页面挂载文件系统需要认证文本`);
      if (boolA) {
          console.log('触发弹窗认证，输入密码');
          await device.typeText(`${smbPwd}`, true);
      } else {
          console.log('未触发弹窗认证');
      }
    } catch (mainError) {
      // 统一错误日志格式，抛出错误确保测试框架感知失败
      console.error('===== 测试执行出错 =====', mainError.message);
      throw mainError;
    }

    
    // 进入SMB目录
    await agent.aiTap(`文件管理器窗口左侧栏的${smbIp}地址`);
    await agent.aiDoubleClick(`SMB目录下的${smbDir}文件夹`);
    
    // 定义需要测试的文档类型
    const docTypes = [
      { type: "办公文档", fileName: "新建Word文档.docx" },
      { type: "电子表格", fileName: "新建Excel文档.xlsx" },
      { type: "演示文档", fileName: "演示文档.pptx" }
    ];
    
    for (const doc of docTypes) {
      // 步骤1：右键新建文档
      console.log(`===== 在SMB目录右键新建${doc.type} =====`);
      await agent.aiTap("SMB目录空白处");
      await agent.aiRightClick("SMB目录空白处");
      await new Promise(resolve => setTimeout(resolve, 5000));
      await agent.aiTap("新建文档");
      await agent.aiTap(doc.type);
      await device.pressKey("Enter");
      await new Promise(resolve => setTimeout(resolve, 3000));
      await agent.aiAssert(`SMB目录中存在文件:${doc.fileName}`);
      
      // 步骤2：左键选中新建的文件，使用快捷键空格预览
      console.log(`===== 左键选中${doc.fileName}，使用空格预览 =====`);
      await agent.aiTap("SMB目录空白处");
      await agent.aiTap(`${doc.fileName}文件的图标`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey("Space");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 验证类型显示为文档
      await agent.aiAssert("预览窗口中显示类型为文档");
      
      // 步骤3：按ESC退出预览
      console.log("===== 按ESC退出预览 =====");
      await device.pressKey("Escape");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 步骤4：右键文件，点击属性
      console.log(`===== 右键${doc.fileName}查看属性 =====`);
      await agent.aiRightClick(`${doc.fileName}文件的图标`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiTap("属性");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 验证属性窗口中类型显示为文档
      await agent.aiAssert("属性窗口中类型显示为文档");
      
      // 关闭属性窗口
      await device.pressKey("Escape");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
        // 清理SMB测试文件
    if (smbIp && smbDir) {
      console.log('===== 清理SMB测试文件 =====');
      try {
        const result = await system.exec(`df -h | grep smbmounts | awk '{print $6}'`);
        const tmpDir = result.stdout.trim();
        if (tmpDir) {
          await system.exec(`rm -rf ${tmpDir}/*.docx ${tmpDir}/*.xlsx ${tmpDir}/*.pptx`);
        }
        const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanSmbMounts(agent, system, 1);
        console.log('SMB清理完成');
      } catch (e) {
        console.warn('SMB清理失败:', e.message);
      }
    }
    
  }, { timeout: 600000, tags: ['2007239', 'level3', 'smoke', 'DITT', 'chenyi','test'] });

  test("2007239-【新建office文档默认格式修改】网络共享目录中新建office文档属性查看", async ({ device, system, agent, uos }) => {
    console.log("========== FTP网络共享目录中新建office文档属性查看 ==========");
    
    const { FtpMount, cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    
    // 挂载FTP
    console.log(`===== 前置操作：检查FTP挂载状态: ftp://${ftpIp} =====`);
    await uos.openApp("文件管理器", 3000, 20000, true);
    const hasFtpMount = await agent.aiBoolean(`文件管理器左侧边栏存在${ftpIp}且${ftpIp}水平右侧有1个三角形和一条横岗图标`);
    if (hasFtpMount) {
      console.log('发现FTP挂载，开始卸载');
      try {
        await system.exec(`gio mount -u "ftp://${ftpIp}"`);
        console.log('FTP卸载成功');
      } catch (e) {
        console.warn(`FTP卸载处理完成（无挂载或已清理）: ${e.message}`);
      }
    } else {
      console.log('FTP未挂载，跳过卸载');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Alt+F4");

    console.log('===== 挂载FTP目录并进入目标路径 =====');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await FtpMount(agent, system, device, 1);
    await new Promise(resolve => setTimeout(resolve, 5000));


    // 定义需要测试的文档类型
    const docTypes = [
      { type: "办公文档", fileName: "新建Word文档.docx" },
      { type: "电子表格", fileName: "新建Excel文档.xlsx" },
      { type: "演示文档", fileName: "演示文档.pptx" }
    ];
    
    for (const doc of docTypes) {
      // 步骤1：右键新建文档
      console.log(`===== 在FTP目录右键新建${doc.type} =====`);
      await agent.aiTap("FTP共享目录空白处");
      await agent.aiRightClick("FTP共享目录空白处");
      await new Promise(resolve => setTimeout(resolve, 5000));
      await agent.aiTap("新建文档");
      await agent.aiTap(doc.type);
      await device.pressKey("Enter");
      await new Promise(resolve => setTimeout(resolve, 3000));
      await agent.aiAssert(`FTP共享目录中存在文件:${doc.fileName}`);
      
      // 步骤2：左键选中新建的文件，使用快捷键空格预览
      console.log(`===== 左键选中${doc.fileName}，使用空格预览 =====`);
      await agent.aiTap("FTP共享目录空白处");
      await agent.aiTap(`${doc.fileName}文件的图标`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey("Space");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 验证类型显示为文档
      await agent.aiAssert("预览窗口中显示类型为文档");
      
      // 步骤3：按ESC退出预览
      console.log("===== 按ESC退出预览 =====");
      await device.pressKey("Escape");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 步骤4：右键文件，点击属性
      console.log(`===== 右键${doc.fileName}查看属性 =====`);
      await agent.aiRightClick(`${doc.fileName}文件的图标`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiTap("属性");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 验证属性窗口中类型显示为文档
      await agent.aiAssert("属性窗口中类型显示为文档");
      
      // 关闭属性窗口
      await device.pressKey("Escape");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 清理桌面测试文件
    await system.exec(`rm -rf ${ftpMountPath}/*.docx ${ftpMountPath}/*.xlsx ${ftpMountPath}/*.pptx`);
    // 卸载FTP
    console.log('===== 卸载FTP =====');
    try {
      await system.exec(`gio mount -u "ftp://${ftpIp}"`);
      console.log('FTP卸载完成');
    } catch (unmountErr) {
      console.warn('FTP卸载失败:', unmountErr.message);
    }  
  }, { timeout: 600000, tags: ['2007239', 'level3', 'smoke', 'DITT', 'chenyi','test1'] });

  test("2007239-【新建office文档默认格式修改】网络共享目录中新建office文档属性查看", async ({ device, system, agent, uos }) => {
    console.log("========== SFTP网络共享目录中新建office文档属性查看 ==========");
    await uos.openApp("文件管理器", 3000, 20000, true);
    const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent, system);
    console.log('挂载sftp-地址栏-用户名');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`sftp://${sftpIp}`, true);
    const boolB = await agent.aiBoolean(`页面出现标识验证失败文本`);
    if (boolB) {
      console.log('触发弹窗，点击仍然登陆');
      await agent.aiTap("仍然登陆文本");
    } else {
      console.log('未触发弹窗认证');
    }
    await agent.aiWaitFor("需要认证文本");
    await device.typeText(`${sftpname}`);
    await agent.aiInput( `${sftppwd}`,'密码输入框');
    await agent.aiTap("连接选项");
    await system.exec("sleep 5");
    const boolA = await agent.aiBoolean(`页面出现卸载文件系统需要认证文本`);
    if (boolA) {
      console.log('触发弹窗认证，输入密码');
      await device.typeText(`${userPwd}`, true);
    } else {
      console.log('未触发弹窗认证');
    }
    await agent.aiDoubleClick("stfp");
    await agent.aiDoubleClick("upload");
    await agent.aiAssert("进入到upload目录");
    
    // 定义需要测试的文档类型
    const docTypes = [
      { type: "办公文档", fileName: "新建Word文档.docx" },
      { type: "电子表格", fileName: "新建Excel文档.xlsx" },
      { type: "演示文档", fileName: "演示文档.pptx" }
    ];
    
    for (const doc of docTypes) {
      // 步骤1：右键新建文档
      console.log(`===== 在SFTP目录右键新建${doc.type} =====`);
      await agent.aiTap("SFTP共享目录空白处");
      await agent.aiRightClick("SFTP共享目录空白处");
      await new Promise(resolve => setTimeout(resolve, 5000));
      await agent.aiTap("新建文档");
      await agent.aiTap(doc.type);
      await device.pressKey("Enter");
      await new Promise(resolve => setTimeout(resolve, 3000));
      await agent.aiAssert(`SFTP共享目录中存在文件:${doc.fileName}`);
      
      // 步骤2：左键选中新建的文件，使用快捷键空格预览
      console.log(`===== 左键选中${doc.fileName}，使用空格预览 =====`);
      await agent.aiTap("SFTP共享目录空白处");
      await agent.aiTap(`${doc.fileName}文件的图标`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey("Space");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 验证类型显示为文档
      await agent.aiAssert("预览窗口中显示类型为文档");
      
      // 步骤3：按ESC退出预览
      console.log("===== 按ESC退出预览 =====");
      await device.pressKey("Escape");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 步骤4：右键文件，点击属性
      console.log(`===== 右键${doc.fileName}查看属性 =====`);
      await agent.aiRightClick(`${doc.fileName}文件的图标`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiTap("属性");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 验证属性窗口中类型显示为文档
      await agent.aiAssert("属性窗口中类型显示为文档");
      
      // 关闭属性窗口
      await device.pressKey("Escape");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 清理桌面测试文件
    await system.exec(`rm -rf ${sftpMountPath}/*.docx ${sftpMountPath}/*.xlsx ${sftpMountPath}/*.pptx`);
    // 卸载SFTP
    await uos.openApp("文件管理器", 3000, 20000, true);
    console.log('===== 卸载SFTP =====');
    try {
      const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await cleanSftpMounts(agent, system);
      console.log('SFTP服务卸载完成');
    } catch (unmountErr) {
      console.warn('SFTP服务卸载失败:', unmountErr.message);
    }  
  

  }, { timeout: 600000, tags: ['2007239', 'level3', 'smoke', 'DITT', 'chenyi','test2'] });

  afterEach(async ({ device, agent, system }) => {
    console.log("4. afterEach: 清理文管进程");
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });

  afterAll(async ({ device, system, agent, uos }) => {
    console.log("5. afterAll: 清理SMB、FTP、SFTP测试文件");
    // 关闭所有文件管理器窗口
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });

});

