/**
 * 用例 PMSID: 1816721
 * 用例标题:  标签页-关闭标签页
 * 生成时间: 2026-3-5 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816721- 标签页-关闭标签页', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 前置条件1：文件管理器已开启
      await uos.openApp('文件管理器', { maximizeWindow: false });

      // 前置条件2：测试目录下有多种类型的文件
      await system.exec('touch ~/Desktop/1816721.txt', 500);
      await system.exec('touch ~/Desktop/1816721.xlsx', 500);
      await system.exec('touch ~/Desktop/1816721.doc', 500);
      await system.exec('touch ~/Desktop/1816721.png', 500);
      await system.exec('touch ~/Desktop/1816721.mp3', 500);
      await system.exec('touch ~/Desktop/1816721.mp4', 500);
      await system.exec('mkdir ~/Desktop/1816721', 500);
    });
  
    test('1816721-标签页-关闭标签页', async ({ device, agent, uos, system, env }) => {

      //步骤1：进入测试目录，不新建标签页-结果：首个标签页默认为当前打开的目录
      await system.exec('dde-file-manager ~/Desktop/1816721');
      await system.exec('sleep 2');
      await agent.aiAssert('文件管理器窗口顶部左侧第一行标签栏显示“1816721”');

      // 步骤2：鼠标悬停标签页上方-结果：显示关闭按钮
      await agent.aiHover('文件管理器窗口顶部左侧第一行标签栏显示“1816721”');
      await agent.aiAssert('文件管理器窗口顶部左侧第一行标签栏显示“1816721”右侧会新增“X”按钮');

      // 步骤3：新建多个标签页，鼠标悬停标签页上方-结果：显示关闭按钮
      await agent.aiTap('文件管理器窗口顶部左侧第一行标签栏的+');
      await agent.aiAssert('文件管理器窗口顶部左侧第一行标签栏新增一个“1816721”标签');
      await agent.aiHover('文件管理器窗口顶部左侧第一行标签栏第二个“1816721”标签');
      await agent.aiAssert('文件管理器窗口顶部左侧第一行标签栏第二个“1816721”标签右侧会新增“X”按钮');

      // 步骤4：单击标签页“关闭”按钮-结果：关闭对应标签页
      await agent.aiTap('文件管理器窗口顶部左侧第一行标签栏第二个“1816721”标签右侧会新增“X”按钮');
      await agent.aiAssert('文件管理器窗口顶部左侧第一行标签栏只有1个“1816721”标签');
      
    }, { timeout: 600000, tags: ["1816721", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 清楚新增的多个文件
      await system.exec('rm ~/Desktop/1816721.txt', 500);
      await system.exec('rm ~/Desktop/1816721.xlsx', 500);
      await system.exec('rm ~/Desktop/1816721.doc', 500);
      await system.exec('rm ~/Desktop/1816721.png', 500);
      await system.exec('rm ~/Desktop/1816721.mp3', 500);
      await system.exec('rm ~/Desktop/1816721.mp4', 500);
      await system.exec('rm -r ~/Desktop/1816721', 500);

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
