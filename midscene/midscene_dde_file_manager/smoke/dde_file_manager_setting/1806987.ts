/**
 * 用例 PMSID: 1806987
 * 用例标题: 【拖拽】聚合拖拽-多窗口互相拖拽
 * 生成时间: 2026-05-15 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1806987-【拖拽】聚合拖拽-多窗口互相拖拽', () => {
  const caseDir = process.env.TESTCASE_DIR;  
  const smbIp = process.env.SMB_IP;
  const smbTestDir = process.env.SMB_DIR; 
  const smbName = process.env.SMB_USERNAME;
  const smbPwd = process.env.SMB_PASSWORD;
  const userPwd = process.env.TEST_PASSWORD;
  const userName = process.env.TEST_USERNAME;
  const targetFolders = [20]; // 目标文件夹列表
  let smb_mount = false;

  // 前置条件：创建指定文件夹及对应数量的txt文件
  const createTestFiles = async (system) => {
    console.log('前置条件：创建桌面测试文件夹及对应txt文件');
    for (const folderNum of targetFolders) {
      // 创建桌面文件夹
      const folderPath = `/home/${userName}/Desktop/${folderNum}`;
      await system.exec(`mkdir -p ${folderPath}`);
      // 创建对应数量的txt文件
      for (let i = 1; i <= folderNum; i++) {
        const txtFile = `${folderPath}/${folderNum}-${i}.txt`;
        await system.exec(`touch ${txtFile}`);
      }
    }
  };

  // 拖拽文件通用方法
  const dragFilesToTarget = async (agent, leftWin, rightWin, folderNum, targetDesc, device) => {
    console.log(`处理文件夹${folderNum}：全选文件并拖拽至${targetDesc}`);
    // 进入左侧窗口对应文件夹
    await agent.aiDoubleClick(`左侧文件管理器窗口-桌面目录下的${folderNum}文件夹`);
    await agent.aiTap("左侧文件管理器窗口右上角同时有三个小正方形和三条横线的列表视图按钮");
    await agent.aiWaitFor(`进入${folderNum}文件夹成功`,{ timeoutMs:6000, checkIntervalMs:1000 });
    // Ctrl+A全选文件
    await agent.aiTap(`${folderNum}-1.txt文本文档的图标`);
    await device.pressKey('Ctrl', 'A');
    // 拖拽选中文件至右侧目标目录
    await agent.aiDrag("所有选中的文件", `右侧文件管理器窗口${targetDesc}目录内空白处`);
    //看到红色的数字，说明拖拽过程呈图标聚合状
    //await agent.aiAssert(`看到红色的数字：${folderNum}`);
    await agent.aiAssert(`右侧文件管理器窗口${targetDesc}目录内看到刚刚拖拽的文本文档`);
    
  };

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件，创建测试文件');
    await uos.showDesktop();
    // 创建测试文件
    await createTestFiles(system);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理环境（如存在旧的SMB挂载/文件管理器进程）
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
  });

  test('1806987-【拖拽】聚合拖拽-多窗口互相拖拽', async ({ device, system, agent, uos }) => {
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 步骤1：在窗口A框选20个文件拖拽至窗口B普通存储目录    
    console.log('打开第一个文件管理器窗口（桌面）并布局到左侧');
    // 打开第一个文件管理器窗口（左侧）
    const leftFileManager = await uos.openApp("文件管理器", 3000, 20000, true);
    // 点击左侧栏桌面
    await agent.aiTap('左侧文件管理器窗口左侧栏的桌面');
    
    // 判断预览窗口是否已打开
    await agent.aiTap('文件管理器右上角搜索框左侧第4个图标');
    const isOpen = await agent.aiBoolean("显示预览是否勾选");
    if (isOpen) {
        await agent.aiTap('显示预览');
        console.log('显示预览已成功关闭');
    } 
    await agent.aiTap('桌面目录内空白处');
    // Super+Left 布局到左侧
    await device.pressKey('Super', 'Left');
    await agent.aiWaitFor('左侧文件管理器窗口已布局到屏幕左侧');

    console.log('打开第二个文件管理器窗口（文档）并布局到右侧');
    // 打开第二个文件管理器窗口（右侧）
    const rightFileManager = await uos.openApp("文件管理器", 3000, 20000, true);
    // 点击左侧栏文档
    await agent.aiTap('右侧文件管理器窗口左侧栏的文档');
    // Super+Right 布局到右侧
    await device.pressKey('Super', 'Right');
    await agent.aiWaitFor('右侧文件管理器窗口已布局到屏幕右侧');
    await agent.aiTap('左侧文件管理器窗口');
    await device.pressKey('Super', 'Left');
    await agent.aiTap('左侧文件管理器窗口左侧栏的桌面');
    // 拖拽桌面文件夹文件至右侧文档目录
    console.log('拖拽桌面文件夹文件至右侧文档目录');
    for (const folderNum of targetFolders) {
      await dragFilesToTarget(agent, leftFileManager, rightFileManager, folderNum, '文档', device);
    }
    await device.pressKey('Ctrl', 'Z');
    // 在窗口A框选20个文件拖拽至窗口B挂载目录
    console.log('步骤2：挂载SMB并拖拽文件至smbtest目录');

    // 完全卸载已有SMB挂载
    console.log('===== 卸载已有SMB挂载 =====');
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    console.log('已有SMB挂载卸载完成');

    // 步骤2: 挂载smb-勾选记住密码
    console.log('===== 挂载smb-勾选记住密码 =====');
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`smb://${smbIp}/${smbTestDir}`, true);
    await agent.aiWaitFor("出现需要授权来访问文本");
    await device.typeText(`${smbName}`);
    await agent.aiInput( `${smbPwd}`,'密码输入框');
    await agent.aiTap("记住密码文本");
    await agent.aiTap("连接选项");
    await system.exec("sleep 2");
    const boolA = await agent.aiBoolean(`页面挂载文件系统需要认证文本`);
    if (boolA) {
        console.log('触发弹窗认证，输入密码');
        await device.typeText(`${userPwd}`, true);
    } else {
        console.log('未触发弹窗认证');
    }

    await agent.aiTap("左侧文件管理器窗口左侧栏的桌面");
    // 右侧窗口切换到SMB目录
    await agent.aiTap(`右侧文件管理器窗口左侧栏的${smbIp}地址`);
    await agent.aiDoubleClick(`SMB目录下的${smbTestDir}文件夹`);
    // 拖拽文件至SMB的smbtest目录
    for (const folderNum of targetFolders) {
      await dragFilesToTarget(agent, leftFileManager, rightFileManager, folderNum, smbTestDir, device);
      // 预期结果：拖拽过程图标聚合，释放后文件追加至目录末尾
      await agent.aiAssert(`拖拽${folderNum}文件夹文件至SMB-${smbTestDir}-文件追加至目录末尾`);
    }
    await agent.aiTap("右侧文件管理器窗口当前目录空白处");
    await device.pressKey('Ctrl', 'A');
    await device.pressKey('Delete');
    await agent.aiTap("删除按钮");
    await agent.aiTap("左侧文件管理器窗口左侧栏的桌面");
    // 步骤3：在窗口A框选20个文件拖拽至窗口B回收站
    console.log('步骤3：拖拽文件至回收站目录');
    // 右侧窗口切换到回收站
    await agent.aiTap('右侧文件管理器窗口左侧栏的回收站');
/*
    // 判断回收站是否为空
    const isEmpty = await agent.aiBoolean("回收站内是否有清空按钮");
    if (isEmpty) {
        await agent.aiTap('清空按钮');
        await agent.aiTap('清空按钮');
        console.log('已清空回收站');
    } 
*/
    // 拖拽文件至回收站
    for (const folderNum of targetFolders) {
      await dragFilesToTarget(agent, leftFileManager, rightFileManager, folderNum, '回收站', device);
      // 步骤3预期结果：拖拽过程图标聚合，释放后文件移动至回收站
      //await agent.aiAssert(`拖拽${folderNum}文件夹文件至回收站-过程呈图标聚合状`);
      await agent.aiAssert(`拖拽${folderNum}文件夹文件至回收站-文件已移动至回收站`);
    }
    await device.pressKey('Ctrl', 'Z');

  }, { timeout: 1800000, tags: ['1806987','level2','smoke','dde_file_manager_setting','DITT','lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { cleanSmbMounts, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 清理SMB挂载（如测试前未挂载）
    if (!smb_mount) {
      await cleanSmbMounts(agent, system);
    }
    // 关闭所有文件管理器窗口
    await system.exec(`killall dde-file-manager`);
  });

  afterAll(async ({ device, system, uos, agent }) => {
    console.log('5. afterAll: 清理测试套件，删除测试文件');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的桌面");
    await device.pressKey('Ctrl+1');
    await device.pressKey('Alt+F4');

    // 删除桌面创建的测试文件夹
    for (const folderNum of targetFolders) {
      await system.exec(`rm -rf ~/Desktop/${folderNum}`);
    }
  });
});