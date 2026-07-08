/**
 * 用例 PMSID: 1805557
 * 用例标题: dde-file-manager -p 显示文件属性对话框_
 * 生成时间: 2026-01-22 15:00:00
 * 用例编写人: UT000159（游伟）
 */


describe('1805557-dde-file-manager -p 显示文件属性对话框_', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805557-dde-file-manager -p 显示文件属性对话框_文件夹', async ({ device, agent, uos, system }) => {
    let test_dir = '/bin';
    // 步骤 1: 在终端执行：dde-file-manager -p ${test_dir}
    console.log(`步骤 1: dde-file-manager -p ${test_dir}`);
    await system.exec(`dde-file-manager -p ${test_dir}`);

    // 预期 1: ${test_dir}文件夹的属性对话框出现
    console.log(`预期 1: ${test_dir}文件夹的属性对话框出现`);
    await agent.aiWaitFor(`${test_dir}文件夹的属性对话框出现`, 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过
    // await agent.aiAssert(`有${test_dir}文件夹的属性对话框`);

  }, { timeout: 600000, tags: ['1805557', 'level3', 'command', 'DITT', 'youwei', 'property daialog', 'folder'] });

  test('1805557-dde-file-manager -p 显示文件属性对话框_文件夹', async ({ device, agent, uos, system }) => {
    let test_dir = '/bin';
    // 步骤 1: 在终端执行：dde-file-manager -p  ${test_dir}
    console.log(`步骤 1: dde-file-manager -p ${test_dir}`);
    await system.exec(`dde-file-manager -p ${test_dir}`);

    // 预期 1: ${test_dir}文件夹的属性对话框出现
    console.log(`预期 1: ${test_dir}文件夹的属性对话框出现`);
    await agent.aiWaitFor(`${test_dir}文件夹的属性对话框出现`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过
    // await agent.aiAssert(`有${test_dir}文件夹的属性对话框`);

  }, { timeout: 600000, tags: ['1805557', 'level3', 'command', 'DITT', 'youwei', 'property daialog', 'system disk'] });

  test('1805557-dde-file-manager -p 显示文件属性对话框_计算机属性', async ({ device, agent, uos, system }) => {
    let test_dir = 'computer:///';
    // 与开发确认是BUG, 已提单: https://pms.uniontech.com/bug-view-348227.html
    // 步骤 1: 在终端执行：dde-file-manager -p  ${test_dir}
    console.log(`步骤 1: dde-file-manager -p ${test_dir}`);
    await system.exec(`dde-file-manager -p ${test_dir}`);

    // 预期 1: 计算机属性对话框出现
    console.log(`预期 1: 计算机属性对话框出现`);
    await agent.aiWaitFor('计算机属性对话框出现',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过
    // await agent.aiAssert('有计算机属性对话框');

  }, { timeout: 600000, tags: ['1805557', 'level3', 'command', 'DITT', 'youwei', 'property daialog', 'computer property'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭属性对话框
    await agent.aiTap('属性对话框窗口右上角的关闭按钮X');
    await agent.aiWaitFor('属性对话框窗口已关闭');

    // 关闭文件管理器文件夹属性窗口
    await system.exec('killall -15 dde-file-manager');
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
