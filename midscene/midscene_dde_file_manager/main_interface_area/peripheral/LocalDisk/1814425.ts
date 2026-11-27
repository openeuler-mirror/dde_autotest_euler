// @ts-nocheck

/**
 * 用例 PMSID: 1814425
 * 用例标题: 【本地磁盘】第三方应用交互-打开分区编辑器后操作文管
 * 生成时间: 2026-08-07
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
const userName = process.env.TEST_USERNAME;

describe('1814425-本地磁盘-第三方应用交互-打开分区编辑器后操作文管', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.exec('killall deepin-diskmanager', 500);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await uos.maximizeWindow();

    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);

    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });

  test('1814425-本地磁盘-第三方应用交互-打开分区编辑器后操作文管', async ({ device, agent, uos, system, env }) => {
    console.log('=== 开始测试：1814425 ===');

    // 步骤1：已打开分区编辑器，等待弹出认证窗口，输入密码，确认磁盘管理器窗口被打开
    console.log('步骤1：打开分区编辑器，输入密码认证');
    await uos.openApp('磁盘管理器');
    await agent.aiWaitFor('读取磁盘信息需要认证弹窗');
    await agent.aiInput(`${TEST_PASSWORD}`, '密码输入框');
    await agent.aiTap('读取磁盘信息需要认证弹窗里的确定');
    await agent.aiWaitFor('桌面无读取磁盘信息需要认证弹窗');

    // 打开文管检查计算机页面盘符显示
    console.log('打开文件管理器检查计算机页面盘符显示');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await uos.maximizeWindow();

    // 预期1：计算机页面不展示系统盘符
    await agent.aiAssert('计算机页面不展示系统盘符');
    console.log('计算机页面不展示系统盘符');

    // 步骤2：挂载外设检查U盘的盘符显示
    console.log('步骤2：检查外设SMB共享的盘符显示');
    const ip = process.env.SMB_IP;
    await agent.aiAssert(`计算机页面正常展示外设SMB共享的盘符${ip}`);
    console.log(`计算机页面正常展示外设SMB共享的盘符${ip}`);

    console.log('✅ 1814425用例测试完成');
  }, { timeout: 1200000, tags: ['1814425', 'level3', 'LocalDisk', 'DITT', 'huangtian'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    
    await system.exec('killall deepin-diskmanager', 500);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await uos.showDesktop();
  });
});
