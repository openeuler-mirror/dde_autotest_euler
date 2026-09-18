/**
 * 用例 PMSID: 1816727
 * 用例标题:  【V25设计改版】文件属性-界面布局改版
 * 生成时间: 2026-3-26 13:21:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816727-【V25设计改版】文件属性-界面布局改版', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 前置条件1：测试目录下长文件名的文件和多个不同类型文件
      await system.exec('touch ~/Desktop/peicun1.png', 500);
      await system.exec('touch ~/Desktop/peicun2.mp3', 500);

      // 前置条件2：文件管理器已开启
      await system.exec('dde-file-manager ~/Desktop');
      await system.exec('sleep 2');

    });
  
    test('1816727-【V25设计改版】文件属性-界面布局改版', async ({ device, agent, uos, system, env }) => {

      //步骤1：鼠标选中一个文件/文件，右键单击“属性”-结果：属性界面所有字体显示正常，位置按设计图显示
      await agent.aiRightClick('文件peicun1.png');
      await agent.aiWaitFor('出现右键菜单');
      await agent.aiTap('右键菜单中的属性');
      await agent.aiAssert('展示peicun1.png的基本信息');
      await device.pressKey('Esc'); //退出属性弹框

      // 步骤2：查看长文字字段的显示-结果：所有字段值默认显示两行，超出一行的内容用“…”表示
      await system.exec('touch ~/Desktop/文件在这测试目录下有多种类型的文件测试目录下有多种类型的文件.txt', 500);
      await agent.aiAssert('新增一个文件，文件名称显示2行，文件名称中间部分包含…');

      // 步骤3：鼠标悬停在“…”上-结果：浮框显示完整的内容
      await agent.aiHover('文件名称为“文件在这测…文件.txt”的文件名称上');
       await system.exec('sleep 2');
      await agent.aiAssert('文件名下方出现一个小弹框');
      // await agent.aiAssert('弹框内展示文件名称的全部内容“文件在这测试目录下有多种类型的文件测试目录下有多种类型的文件.txt”');
      
    }, { timeout: 600000, tags: ["1816727", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 清楚新增的多个文件
      await system.exec('rm ~/Desktop/peicun1.png', 500);
      await system.exec('rm ~/Desktop/peicun2.mp3', 500);
      await system.exec('rm ~/Desktop/文件在这测试目录下有多种类型的文件测试目录下有多种类型的文件.txt', 500);

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
