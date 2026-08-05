
/**
 * 用例 PMSID: 1805831
 * 用例标题: 还原-原路径改为只读时不能还原
 * 生成时间: 2025-12-30 14:59:44
 * 用例编写人: UT000193（郑豪）
 */

describe('1805831-还原-原路径改为只读时不能还原', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 桌面新建文件夹A
    // 文件夹A中新建文件B和文件夹C
    await system.exec('mkdir -p ~/Desktop/文件夹A/文件夹C');
    await system.exec('touch ~/Desktop/文件夹A/文件B');
  });

  test('1805831-还原-原路径改为只读时不能还原', async ({ device, agent, uos, system }) => {
    // 步骤1：右键删除文件B和文件夹C
    await agent.aiDoubleClick('文件夹A');
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('文件B');
    await agent.aiTap('删除');

    // 步骤2： 选中文件夹A-右键属性-权限管理下权限改为只读
    await system.exec('killall dde-file-manager');
    await agent.aiRightClick('文件夹A');
    await agent.aiTap('属性');
    await agent.aiTap('权限管理');
    await agent.aiTap('所有者属性右边的下拉框');
    await agent.aiTap("下拉框中读写下面的'只读'选项");
    await system.exec('killall dde-file-manager');
    await device.pressKey('Esc');

    // 步骤3.1：打开回收站-选中文件/文件B右键-点击还原
    await agent.aiDoubleClick('回收站');
    await agent.aiRightClick('文件B');
    await agent.aiTap('还原');

    // 断言3.1：
    await agent.aiAssert("弹出窗口提示'操作失败！1个文件还原失败，目标文件夹不可写'或'操作失败！文件操作失败：权限不足'");
    await agent.aiTap('确定');

    // 步骤3.2：打开回收站-选中文件/文件夹C右键-点击还原
    await agent.aiRightClick('文件夹C');
    await agent.aiTap('还原');

    // 断言3.2：
    await agent.aiAssert("弹出窗口提示'操作失败！1个文件还原失败，目标文件夹不可写'或'操作失败！文件操作失败：权限不足'");
    await agent.aiTap('确定');
  }, { timeout: 600000, tags: ['1805831', 'level3', 'trash', 'zhenghao'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -rf ~/Desktop/文件夹A');
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
