/**
 * 用例 PMSID: 1809301
 * 用例标题: 文件操作-拖拽文本文档aaa到文件夹B
 * 生成时间: 2025-12-18 14:45:38
 * 用例编写人：UT000244（李庆玲）
 */
describe('1809301-文件操作-拖拽文本文档aaa到文件夹B', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809301-在文档目录下拖拽文本文档aaa到文件夹B', async ({ device, agent, uos, system }) => {
    // 前置条件：在文档目录下，创建文本文档aaa和文件夹B
    await system.exec(`echo "This is a test file for drag and drop testing" > /home/uos/Documents/aaa.txt`);
    await system.exec(`mkdir -p /home/uos/Documents/B`);
    
    // 打开文件管理器
    await uos.openApp('文件管理器');
    
    // 进入文档目录
    await agent.aiDoubleClick('文件管理器文档目录');
    
    // 步骤一：拖拽文本文档aaa到文件夹B下
    await agent.aiAction('将文本文档aaa.txt拖拽到文件夹B中');
    
    // 预期结果：文件夹B目录下有文本文档aaa
    await agent.aiDoubleClick('文件夹B');
    await agent.aiAssert('文件夹B目录下有aaa.txt');
    
  }, { timeout: 1800000, tags: ['1809301', 'level1', 'drag', 'liqingling'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 清理创建的文件和文件夹
    await system.exec('rm -f /home/uos/Documents/aaa.txt');
    await system.exec('rm -rf /home/uos/Documents/B');
    
    await system.exec('killall dde-file-manager');
  });
});
