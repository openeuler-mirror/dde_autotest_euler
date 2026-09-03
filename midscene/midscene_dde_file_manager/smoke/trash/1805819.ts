// @ts-nocheck
/**
 * 用例 PMSID: 1805819
 * 用例标题: 【回收站】还原-ctrl+Z还原回收站内文件/文件夹
 * 生成时间: 2026-04-23
 * 用例编写人: UT000686(李双双)
 */

describe('1805819-【回收站】还原-ctrl+Z还原回收站内文件/文件夹', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const TEST_USERNAME = process.env.TEST_USERNAME;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf ~/.local/share/Trash/files/*');
    await system.exec('rm -rf ~/.local/share/Trash/info/*');
    // 清理可能存在的测试文件
    await system.exec(`rm -rf ~/Desktop/1805819`);
    await system.exec(`rm -f ~/Desktop/1805819.txt`);
    await system.exec(`rm -rf ~/Videos/1805819`);
    await system.exec(`rm -f ~/Videos/1805819.txt`);
    await system.exec(`rm -rf ~/Documents/.1805819`);
    await system.exec(`rm -f ~/Documents/.1805819.txt`);
    await uos.showDesktop();
    // 打开文件管理器并最大化
    await device.pressKey('Super+E');
    await system.exec('sleep 3');
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：在桌面、视频目录创建1805819和1805819.txt文件；文档目录创建.1805819和.1805819.txt隐藏文件
    await system.exec(`mkdir -p ~/Desktop/1805819`);
    await system.exec(`touch ~/Desktop/1805819.txt`);
    await system.exec(`mkdir -p ~/Videos/1805819`);
    await system.exec(`touch ~/Videos/1805819.txt`);
    await system.exec(`mkdir -p ~/Documents/.1805819`);
    await system.exec(`touch ~/Documents/.1805819.txt`);
    console.log('测试文件和文件夹已创建');
  });

  test('1805819-【回收站】还原-ctrl+Z还原回收站内文件/文件夹', async ({ device, agent, uos, system }) => {

    // 步骤1：桌面删除1805819和1805819.txt文件，点击Ctrl+Z快捷键，文件恢复到桌面
    console.log('步骤1: 桌面删除文件/文件夹，Ctrl+Z还原');
    await agent.aiTap('文件管理器左侧栏的桌面');
    await agent.aiWaitFor('桌面目录已加载');

    // 全选并删除
    await device.keyDown('Ctrl');
    await agent.aiTap('1805819');
    await agent.aiTap('1805819.txt');
    await device.keyUp('Ctrl');
    await device.pressKey('Delete');
    await agent.aiAssert('桌面不存在1805819和1805819.txt');

    // Ctrl+Z还原
    await device.pressKey('Ctrl+Z');
    await agent.aiWaitFor('文件已还原', { timeoutMs: 10000 });
    await agent.aiAssert('1805819和1805819.txt文件已恢复到桌面');
    console.log('✅ 步骤1验证通过：桌面文件Ctrl+Z还原成功');

    // 步骤2：视频目录删除1805819和1805819.txt文件，点击Ctrl+Z快捷键，文件恢复到视频目录
    console.log('步骤2: 视频目录删除文件/文件夹，Ctrl+Z还原');
    await agent.aiTap('文件管理器左侧栏的视频');
    await agent.aiWaitFor('视频目录已加载');

    // 全选并删除
    await device.pressKey('Ctrl+A');
    await device.pressKey('Delete');
    await agent.aiAssert('视频目录不存在1805819和1805819.txt');

    // Ctrl+Z还原
    await device.pressKey('Ctrl+Z');
    await agent.aiWaitFor('文件已还原', { timeoutMs: 10000 });
    await agent.aiAssert('1805819和1805819.txt文件已恢复到视频目录');
    console.log('✅ 步骤2验证通过：视频目录文件Ctrl+Z还原成功');

    // 步骤3：开启显示隐藏文件，删除.1805819和.1805819.txt文件，Ctrl+Z还原到文档目录
    console.log('步骤3: 文档目录删除隐藏文件/文件夹，Ctrl+Z还原');
    // 先开启显示隐藏文件
    console.log('开启显示隐藏文件');
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');
    await device.pressKey('Ctrl+H');
    await agent.aiWaitFor('隐藏文件已显示');
    await agent.aiAssert('隐藏文件可见');

    // 删除隐藏文件
    await device.pressKey('Ctrl+A');
    await agent.aiAssert('.1805819和.1805819.txt被选中');
    await device.pressKey('Delete');
    await agent.aiAssert('文档目录不存在.1805819和.1805819.txt');

    // Ctrl+Z还原
    await device.pressKey('Ctrl+Z');
    await agent.aiWaitFor('文件已还原', { timeoutMs: 10000 });
    await agent.aiAssert('文件已恢复到文档目录');
    console.log('✅ 步骤3验证通过：文档目录隐藏文件Ctrl+Z还原成功');

  }, { timeout: 1200000, tags: ['1805819', 'level2', 'smoke', 'trash', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理环境：删除文档目录.1805819和.1805819.txt隐藏文件
    await system.exec(`rm -rf ~/Documents/.1805819`);
    await system.exec(`rm -f ~/Documents/.1805819.txt`);

    // 关闭显示隐藏文件（Ctrl+H）
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');
    await device.pressKey('Ctrl+H');
    await agent.aiWaitFor('隐藏文件已隐藏');

    // 删除桌面、视频目录创建1805819和1805819.txt文件
    await system.exec(`rm -rf ~/Desktop/1805819`);
    await system.exec(`rm -f ~/Desktop/1805819.txt`);
    await system.exec(`rm -rf ~/Videos/1805819`);
    await system.exec(`rm -f ~/Videos/1805819.txt`);

    // 清理回收站
    await system.exec('rm -rf ~/.local/share/Trash/files/*');
    await system.exec('rm -rf ~/.local/share/Trash/info/*');
    console.log('测试环境已清理');

    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
