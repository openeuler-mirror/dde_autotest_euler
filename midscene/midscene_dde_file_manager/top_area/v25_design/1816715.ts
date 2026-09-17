/**
 * 用例 PMSID: 1816715
 * 用例标题: 标签页-位置显示
 * 生成时间: 2026-3-5 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816715-标签页-位置显示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 前置条件1：文件管理器已开启
      await uos.openApp('文件管理器', { maximizeWindow: true });

      // 前置条件2：测试目录下有多种类型的文件
      await system.exec('touch ~/Desktop/1816715.txt', 500);
      await system.exec('touch ~/Desktop/1816715.xlsx', 500);
      await system.exec('touch ~/Desktop/1816715.doc', 500);
      await system.exec('touch ~/Desktop/1816715.png', 500);
      await system.exec('touch ~/Desktop/1816715.mp3', 500);
      await system.exec('touch ~/Desktop/1816715.mp4', 500);
      await system.exec('mkdir ~/Desktop/1816715', 500);
    });
  
    test('1816715-标签页-位置显示', async ({ device, agent, uos, system, env }) => {

      //步骤1：进入测试目录，查看标题栏-结果：“新建标签页”按钮位于标题右侧，显示一个“+”符号
      // 进入桌面目录
      await agent.aiTap('文件管理器左侧的桌面');
      // 排序方式选择名称
      await agent.aiWaitFor('1816715.mp4');
      // 断言结果正确性
      await agent.aiAssert('文件管理器窗口顶部第一行标签页“+”显示在标签“桌面”的右侧');
      await system.exec('killall dde-file-manager');
      await system.exec('sleep 2');

      // 步骤2：打开新的文件管理器窗口-结果：	首个标签页默认为当前打开的目录
      await system.exec('dde-file-manager ~/Desktop/1816715');
      await system.exec('sleep 2');
      await agent.aiAssert('文件管理器窗口顶部左侧第一行标签栏显示“1816715”');
      
    }, { timeout: 600000, tags: ["1816715", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 清楚新增的多个文件
      await system.exec('rm ~/Desktop/1816715.txt', 500);
      await system.exec('rm ~/Desktop/1816715.xlsx', 500);
      await system.exec('rm ~/Desktop/1816715.doc', 500);
      await system.exec('rm ~/Desktop/1816715.png', 500);
      await system.exec('rm ~/Desktop/1816715.mp3', 500);
      await system.exec('rm ~/Desktop/1816715.mp4', 500);
      await system.exec('rm -r ~/Desktop/1816715', 500);

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
