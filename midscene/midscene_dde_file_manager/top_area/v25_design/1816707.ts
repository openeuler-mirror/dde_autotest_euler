/**
 * 用例 PMSID: 1816707
 * 用例标题: 视图选项-显示预览开启和关闭
 * 生成时间: 2026-2-3 21:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816707-视图选项-显示预览开启和关闭', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 桌面新增多个不同类型文件
      await system.exec('touch ~/Desktop/1816707.txt', 500);
      await system.exec('touch ~/Desktop/1816707.xlsx', 500);
      await system.exec('touch ~/Desktop/1816707.doc', 500);
      
      // 打开文件管理器
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });
  
    test('1816707-视图选项-显示预览开启和关闭', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：进入用户桌面，点击视图选项按钮--结果：默认不勾选“显示预览”
      // 进入桌面
      await agent.aiTap('文件管理器左侧的桌面', 500);
      // 防止元素点错到左侧按钮
      await agent.aiTap('文件管理器左侧顶部的收起展开侧边栏按钮');
      // 选中文件
      await agent.aiTap('1816707.txt');
      // 点击图标视图图标
      const caseDir = process.env.TESTCASE_DIR;
      const imgRelativePath1 =`${caseDir}midscene_dde_file_manager/picture/文件管理器图标视图.png`;
      await agent.aiTap({
        prompt: '文件管理器-图标视图',
        images: [
          {
            name: '图标视图',
            url: imgRelativePath1,
          },
        ],
      });
      // 点击视图选项
      await agent.aiTap('文件管理器窗口右侧顶部上下箭头左边最后一个图标'); //代替下方注释的图标点不到的描述
      //  //设置图标定位:视图选项
      // const imgRelativePath = `${caseDir}midscene_dde_file_manager/picture/文件管理器预览图标.png`;
      // // 检测到新增了视图选项、排序方式选项
      // await agent.aiTap({
      //   prompt: '文件管理器-视图选项',
      //   images: [
      //     {
      //       name: '视图选项',
      //       url: imgRelativePath,
      //     },
      //   ],
      // });
      // 点击视图选项图标
      // await agent.aiTap('文件管理器窗口右侧顶部第二行从左往右第4个小图标');

      // 检验视图选项默认不勾选“显示预览”
      await agent.aiWaitFor('视图选项');
      await agent.aiAssert('显示预览前面的复选框没有勾选');
      
      // 步骤2：勾选“显示预览”，鼠标选中一个文件/文件夹--结果：工作区窗口右侧展开显示详细视图窗格
      // 勾选“显示预览”
      await agent.aiTap('显示预览前面的复选框');
      await agent.aiAssert('显示预览前面的复选框勾选成功');
      // 鼠标选中一个文件/文件夹--结果：工作区窗口右侧展开显示详细视图窗格
      await agent.aiAssert('文件管理器右侧展示对应文件的名称、大小、类型、访问时间、修改时间');

      // 步骤3：不勾选“显示预览”，鼠标选中一个文件/文件夹--结果：折叠隐藏详细视图窗格
      await agent.aiTap('显示预览前面的复选框');
      await agent.aiAssert('显示预览前面的复选框没有勾选');
      // 鼠标选中一个文件/文件夹--结果：折叠隐藏详细视图窗格
      await agent.aiAssert('右侧不显示1816707.doc的详细信息');

    }, { timeout: 1200000, tags: ["1816707", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');        
      // 清理测试文件
      await system.exec('rm -f ~/Desktop/1816707.txt', 500);
      await system.exec('rm -f ~/Desktop/1816707.xlsx', 500);
      await system.exec('rm -f ~/Desktop/1816707.doc', 500);

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
