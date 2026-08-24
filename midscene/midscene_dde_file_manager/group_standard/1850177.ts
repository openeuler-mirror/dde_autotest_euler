/**
 * 用例 PMSID: 1850177
 * 用例标题: 手动上锁文件保险箱、自动上锁文件保险箱
 * 生成时间: 2026-04-22 16:30:00
 * 用例编写人: UT000159（游伟）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1850177-手动上锁文件保险箱、自动上锁文件保险箱', () => {
  const encryption_key = 'Uos123!!';
  const lock_time = 5; // 5分钟, 选项有5分钟、10分钟、20分钟

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, env, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 恢复部分文管设置到默认值
    console.log('准备步骤: 恢复部分文管设置到默认值');
    await clearEnvironment(system);

    // 准备步骤: 删除保险箱
    console.log('准备步骤: 删除保险箱');
    await rmVault(system);
  });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  
  afterAll(async ({ uos, agent, device, env, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 按Esc关闭可能未关闭的右击菜单
    console.log('清理步骤: 按Esc关闭可能未关闭的右击菜单');
    await device.pressKey('Esc');

    // 清理步骤: 删除保险箱
    console.log('清理步骤: 删除保险箱');
    const { rmVault, closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 删除保险箱
    await rmVault(system);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  test('1850177-手动上锁文件保险箱、自动上锁文件保险箱', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 创建密钥加密保险箱
    console.log('准备步骤: 创建密钥加密保险箱');
    await createPasswordVault(uos, env, agent, device, system);
    await system.exec('killall dde-file-manager');

    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await system.exec(`dde-file-manager`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor("文件管理器窗口已打开");
   
    // 步骤 2: 右击侧边栏保险箱
    console.log('步骤 2: 右击侧边栏保险箱');
    await agent.aiRightClick('侧边栏保险箱');
    await agent.aiWaitFor("出现右击菜单");

    // 预期 2: 右击菜单中有"立即上锁"选项
    console.log('预期 2: 右击菜单中有"立即上锁"选项');
    await agent.aiAssert('右击菜单中有立即上锁选项');

    // 步骤 3: 点击"立即上锁"
    console.log('步骤 3: 点击"立即上锁"');
    await agent.aiTap('立即上锁');

    // 步骤 4: 点击侧边栏保险箱
    console.log('步骤 4: 点击侧边栏保险箱');
    await agent.aiTap('侧边栏保险箱');

    // 预期 4: 弹出解锁保险箱对话框
    console.log('预期 4: 弹出解锁保险箱对话框');
    await agent.aiAssert('弹出解锁保险箱对话框');

    // 步骤 5: 输入密码
    console.log('步骤 5: 输入密码');
    await agent.aiTap('解锁保险箱对话框中的密码字符');
    await device.typeText(encryption_key, false);
    await agent.aiWaitFor("解锁保险箱对话框中的解锁按钮可用");

    // 步骤 6: 点击解锁按钮
    console.log('步骤 6: 点击解锁按钮');
    await agent.aiTap('解锁保险箱对话框中的解锁按钮');
    await agent.aiWaitFor("跳转到保险箱目录",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 7: 右击侧边栏保险箱
    console.log('步骤 7: 右击侧边栏保险箱');
    await agent.aiRightClick('侧边栏保险箱');
    await agent.aiWaitFor("出现右击菜单");
    await agent.aiWaitFor("右击菜单中有自动上锁选项");

    // 步骤 8: 设置${lock_time}自动上锁
    console.log(`步骤 8: 设置${lock_time}分钟自动上锁`);
    await agent.aiHover('自动上锁');
    await agent.aiWaitFor("自动上锁子菜单已展开");
    await agent.aiTap(`自动上锁子菜单中的${lock_time}分钟`);
    await agent.aiWaitFor("右键菜单消失");

    // 预期 8: 当前目录是保险箱目录
    console.log('预期 8: 当前目录是保险箱目录');
    await agent.aiAssert('当前目录是保险箱目录');

    // 步骤 9: 等待${lock_time}分钟
    console.log(`等待${lock_time}分钟`);
    await new Promise(resolve => setTimeout(resolve, 1000 * 60 * lock_time));

    // 预期 9: 保险箱自动上锁
    console.log('预期 9: 保险箱自动上锁');
    await agent.aiWaitFor('文管界面跳转到计算机页面',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

  }, { timeout: 1200000, tags: ['1850177','level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'vault', 'lock', 'auto-lock'] });
});