/**
 * 用例 PMSID: 1940083
 * 用例标题:  【复制文件地址】复制smb上的文件地址 
 * 生成时间: 2026-05-15 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1940083- 【复制文件地址】复制smb上的文件地址 ', () => {
  const caseDir = process.env.TESTCASE_DIR;  
  const smbIp = process.env.SMB_IP;
  const smbDir = process.env.SMB_DIR; 
  const smbName = process.env.SMB_USERNAME;
  const smbPwd = process.env.SMB_PASSWORD;
  const userPwd = process.env.TEST_PASSWORD;
  const userName = process.env.TEST_USERNAME;
  let smb_mount = false;

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件，创建测试文件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理环境（如存在旧的SMB挂载/文件管理器进程）
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
  });

  test('1940083- 【复制文件地址】复制smb上的文件地址 ', async ({ device, system, agent, uos }) => {
    const { SmbMount, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await uos.openApp("文件管理器", 3000, 20000, true);
    // 前置条件1：已挂载smb
    try {
      // 完全卸载已有SMB挂载
      console.log('===== 卸载已有SMB挂载 =====');
      await cleanSmbMounts(agent, system);
      console.log('已有SMB挂载卸载完成');
      await uos.openApp("文件管理器", 3000, 20000, true);
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
          await device.typeText(`${TEST_PASSWORD}`, true);
      } else {
          console.log('未触发弹窗认证');
      }
    } catch (mainError) {
      // 统一错误日志格式，抛出错误确保测试框架感知失败
      console.error('===== 测试执行出错 =====', mainError.message);
      throw mainError;
    }
    // 前置条件2：smb目录中有图片，视频，音乐，文本文件，文件夹等各种类型文件
    const result = await system.exec(`df -h | grep smbmounts | awk '{print $6}'`);
    const tmpDir = result.stdout
    await system.exec(`cp -r "${caseDir}"/midscene_dde_file_manager/resources/1940083 ${tmpDir}`);
    await new Promise(resolve => setTimeout(resolve, 4000));
    // 步骤1：进入smb
    await agent.aiTap(`右侧文件管理器窗口左侧栏的${smbIp}地址`);
    await agent.aiDoubleClick(`SMB目录下的${smbDir}文件夹`);
    await agent.aiDoubleClick("1940083文件夹的图标");

    // 步骤2：选中任意一个文件，按Ctrl+Shift+c复制文件地址，粘贴到文本文件中
    // 打开文本编辑器
    await agent.aiTap("任务栏上的第一个图标，也就是启动器");
    await agent.aiTap("点击启动器里的搜索框");
    await device.typeText('文本编辑器');
    await device.pressKey('Enter');
    await device.pressKey("Alt+Tab");

    await agent.aiTap("1940083.txt文件图标");
    await device.pressKey('Ctrl','Shift','c');    
    //await agent.aiTap("任务栏上的文本编辑器");
    await device.pressKey("Alt+Tab");    
    await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Enter');
    await device.pressKey('Ctrl','V');
    await agent.aiAssert(`文本编辑器里看到路径：smb://${smbIp}/${smbDir}/1940083/1940083.txt`);
    await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Ctrl','W');
    await agent.aiTap("不保存按钮");

    // 步骤3：将复制的文件地址粘贴到文管地址栏中，检查是否可打开文件
    await device.pressKey('Ctrl','L');
    await device.pressKey('Ctrl','A');
    await device.pressKey('Delete');
    await device.pressKey('Ctrl','v');
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await agent.aiAssert("成功打开1940083.txt");
    await agent.aiTap("1940083.txt文件内空白处");
    await device.pressKey('Ctrl','W');

    // 步骤4：选中多个不同类型文件，按Ctrl+Shift+c复制文件地址，粘贴到文档中
    await agent.aiTap("任务栏上的第一个图标，也就是启动器");
    await agent.aiTap("点击启动器里的搜索框");
    await device.typeText('文本编辑器');
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 4000));

    await device.pressKey('Alt','Tab');
    await device.pressKey('Ctrl','A');
    await device.pressKey('Ctrl','Shift','C');
    await device.pressKey('Alt','Tab');
    //await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Ctrl','V');
    await agent.aiAssert(`文本编辑器里看到路径：smb://${smbIp}/${smbDir}/1940083/1940083.mp4、smb://${smbIp}/${smbDir}/1940083/1940083.png、smb://${smbIp}/${smbDir}/1940083/1940083.sh、smb://${smbIp}/${smbDir}/1940083/1940083.txt、smb://${smbIp}/${smbDir}/1940083/情非得已.mid`);
    await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Ctrl','W');
    await agent.aiTap("不保存");

    // 删除smb创建的测试文件夹
    await system.exec(`rm -rf ${tmpDir}/1940083`);
   

  }, { timeout: 1800000, tags: ['1940083','level2','smoke','2500u1','DITT','lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 清理测试套件，删除测试文件');
      const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await cleanSmbMounts(agent, system, 1);
      // 关闭所有文件管理器窗口
      await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
      await system.exec(`ps aux |grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });
});