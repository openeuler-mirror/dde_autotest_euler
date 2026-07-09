/**
 * 用例 PMSID: 1939523
 * 用例标题: 【复制文件地址】复制桌面上的文件地址 
 * 生成时间: 2026-05-19 19:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1939523-【复制文件地址】复制smb上文件名有特殊字符的文件地址', () => {
  const caseDir = process.env.TESTCASE_DIR;  
  const smbIp = process.env.SMB_IP;
  const smbDir = process.env.SMB_DIR; 
  const smbName = process.env.SMB_USERNAME;
  const smbPwd = process.env.SMB_PASSWORD;
  const testPassword = process.env.TEST_PASSWORD;
  
  // 定义特殊文件名
  const specialFileName1 = '有特殊字符+—）（）&……%￥@！RC!@$%^&()_+}{L  （副本）.txt';

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，创建测试文件并配置环境');

  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理环境
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await uos.showDesktop();
  });

  test('1939523-【复制文件地址】复制smb上文件名有特殊字符的文件地址', async ({ device, system, agent, uos }) => {
    // 前置条件1：挂载SMB
    try {
      await uos.openApp("文件管理器", 3000, 20000, true);
      // 清理已有SMB挂载
      const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await cleanSmbMounts(agent, system);
      
      // 挂载SMB      
      await device.pressKey('Ctrl','l');
      await device.pressKey('Ctrl','a');
      await device.typeText(`smb://${smbIp}/${smbDir}`, true);
      await agent.aiWaitFor("出现需要授权来访问文本");
      await device.typeText(`${smbName}`);
      await agent.aiInput(`${smbPwd}`, '密码输入框');
      await agent.aiTap("记住密码文本");
      await agent.aiTap("连接选项");
      await system.exec("sleep 2");
      const boolA = await agent.aiBoolean(`页面挂载文件系统需要认证文本`);
      if (boolA) {
          console.log('触发弹窗认证，输入密码');
          await device.typeText(`${testPassword}`, true);
      } else {
          console.log('未触发弹窗认证');
      }
    } catch (error) {
      console.error('===== 挂载SMB失败 =====', error.message);
      throw error;
    }

    // 前置条件2：smb上有如下文件名的文本文件/文件夹：有特殊字符+——）（）&……%￥#@！RC!@#$%^&()_+}{L （副本）.txt、.a.b.c.d.txt、搜索专项！2#$%……{【“.,
    const result = await system.exec(`df -h | grep smbmounts | awk '{print $6}'`);
    const smbTmpDir = result.stdout.trim();
    // 创建SMB测试文件
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1939523 ${smbTmpDir}/`);

    // 写入测试内容用于验证读写
    await system.exec(`echo "测试文件内容：1939523" > "${smbTmpDir}/1939523/${specialFileName1}"`);
    // 打开文本编辑器
    await agent.aiTap("任务栏上的第一个图标，也就是启动器");
    await agent.aiTap("启动器里的搜索框");
    await device.typeText('文本编辑器');
   
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('Alt','Tab');

    // 步骤1：进入smb目录，选中指定特殊字符文件
    console.log('===== 步骤1：进入SMB目录并选中目标文件 =====');

    // 选中目标特殊字符文件
    await agent.aiDoubleClick(`SMB目录下的${smbDir}/1939523文件夹`);
    await agent.aiTap(`${specialFileName1}文件图标`);

    // 步骤2：按Ctrl+Shift+C复制地址，粘贴到文本文件中
    console.log('===== 步骤2：复制文件地址并粘贴验证 =====');
    await device.pressKey('Ctrl','Shift','c');    

    // 粘贴并验证
/*
    await agent.aiTap("任务栏上的第一个图标，也就是启动器");
    await agent.aiTap("启动器里的搜索框");
    await device.typeText('文本编辑器');
*/ 
    await device.pressKey('Alt','Tab');
    await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Enter');
    await device.pressKey('Ctrl','V');
    const expectedSmbPath = `smb://${smbIp}/${smbDir}/1939523/${specialFileName1}`;
    await agent.aiAssert(`文本编辑器里看到路径：${expectedSmbPath}`);
    // 关闭文本编辑器（不保存）
    await device.pressKey('Ctrl','W');
    await agent.aiTap("不保存按钮");

    // 步骤3：将复制的地址粘贴到文管地址栏中回车，检查是否可以打开文件
    console.log('===== 步骤3：地址栏粘贴路径并验证文件读写 =====');

    await device.pressKey('Ctrl','L');
    await device.pressKey('Ctrl','A');
    await device.pressKey('Delete');  
    await device.pressKey('Ctrl','v');
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // 验证文件正常打开
    await agent.aiAssert(`成功打开${specialFileName1}文件`);
    // 验证文件可正常读写
    await device.pressKey('End');
    await device.pressKey('Enter');
    await device.typeText('新增测试内容：验证文件可读写', true);
    await device.pressKey('Ctrl','S'); // 保存修改
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('Ctrl','W');
    await device.keyUp("Delete");
    // 重新打开验证内容已保存
    
    await device.pressKey('Ctrl','L');
    await device.pressKey('Ctrl','A');
    await device.pressKey('Delete');
    await device.typeText(expectedSmbPath, true);
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("看到文字：新增测试内容：验证文件可读写");
    
    // 关闭文件
    await device.pressKey('Ctrl','W');
    await agent.aiTap("不保存按钮");

  }, { timeout: 1800000, tags: ['1939523','level3','2500u1','copy_file_address','DITT','lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 清理测试环境');
    // 清理SMB测试文件
    const result = await system.exec(`df -h | grep smbmounts | awk '{print $6}'`);
    const smbTmpDir = result.stdout.trim();
    if (smbTmpDir) {
      await system.exec(`rm -rf ${smbTmpDir}/1939523`);
    }

    // 卸载SMB挂载
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    await system.exec(`ps aux |grep -E 'deepin-editor|dde-file-manager' | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null`);
  });
});