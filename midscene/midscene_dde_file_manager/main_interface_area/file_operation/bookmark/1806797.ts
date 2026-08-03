
/**
 * 用例 PMSID: 1806797
 * 用例标题: [044]快捷访问-smb目录下文件夹添加
 * 生成时间: 2026-03-04 16:36:01
 * 用例编写人: UT000193（郑豪）
 */

describe('1806797-[044]快捷访问-smb目录下文件夹添加', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
    // 判断是否已挂载测试smb，如果已挂载就先卸载
    await uos.openApp('文件管理器', { maximizeWindow: true }); 
    const result = await agent.aiBoolean(`左侧栏存在${process.env.SMB_IP}`); 
    if (result) {
        console.log('已挂载smb，开始卸载...');
        const caseDir = process.env.TESTCASE_DIR;
        const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanSmbMounts(agent, system, 1);
    } else {
        console.log('未挂载smb，测试继续');
    }
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 使用公共方法挂载smb
    const caseDir = process.env.TESTCASE_DIR;
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
  });

  test('1806797-[044]快捷访问-smb目录下文件夹添加', async ({ device, agent, uos, system }) => {
    // 步骤1：进入smb目录-选中单个文件夹-右键添加快捷访问
    // 检查并删除已存在的1806797文件夹
    try {
        await agent.aiRightClick("'1806797'文件夹图标");
        await agent.aiWaitFor("右键菜单加载完成");
        await agent.aiTap("删除");
        await agent.aiWaitFor("弹出确认删除的窗口");
        await agent.aiTap("删除");
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        console.log('1806797文件夹不存在或删除失败，继续执行');
    }
    
    await agent.aiRightClick("文件管理器空白位置");
    await agent.aiTap("新建文件夹");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('1806797');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await agent.aiRightClick("'1806797'文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("右键菜单中的'添加到快捷访问'");
    
    // 预期1：成功添加快捷访问，文件管理器侧边栏显示该快捷访问目录
    await agent.aiAssert(`侧边栏显示1806797文件夹的快捷访问目录`);

    // 步骤2：双击打开某个文件夹-选中该文件夹下的某个子文件夹-右键添加快捷访问
    await agent.aiDoubleClick("'1806797'文件夹图标");
    await agent.aiWaitFor("子目录加载完成");
    await agent.aiRightClick("文件管理器空白位置");
    await agent.aiTap("新建文件夹");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('testdir');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await agent.aiRightClick("'testdir'文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("右键菜单中的'添加到快捷访问'");
    
    // 预期2：成功添加快捷访问，文件管理器侧边栏显示该快捷访问目录
    await agent.aiAssert("侧边栏显示'testdir'文件夹快捷访问目录");

    // 步骤3：卸载smb后-重新打开文件管理器
    const caseDir = process.env.TESTCASE_DIR;
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    await system.exec('killall -15 dde-file-manager');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    
    // 预期3：成功打开，快捷访问依然存在
    await agent.aiAssert("侧边栏依然显示之前添加的快捷访问目录");
  }, { timeout: 600000, tags: ['1806797', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除创建的目录
    const caseDir = process.env.TESTCASE_DIR;
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    await agent.aiRightClick("'1806797'文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("删除");
    await agent.aiWaitFor("弹出确认删除的窗口");
    await agent.aiTap("删除");

    // 使用公共方法卸载smb
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
