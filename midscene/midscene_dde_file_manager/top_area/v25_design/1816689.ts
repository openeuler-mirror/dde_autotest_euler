/**
 * 用例 PMSID: 1816689
 * 用例标题: 工具栏-新增视图选项和排序方式按钮
 * 生成时间: 2026-2-3 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816689-工具栏-新增视图选项和排序方式按钮', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    test('1816689-工具栏-新增视图选项和排序方式按钮', async ({ device, agent, uos, system, env }) => {  
      // 打开文件管理器
      await uos.openApp('文件管理器', { maximizeWindow: true });

      // 进入主目录
      await agent.aiTap('文件管理器左侧的主目录');
      // 防止元素点错到左侧按钮
      await agent.aiTap('文件管理器左侧顶部的收起展开侧边栏按钮');
      
      // 步骤1：进入任意目录，查看标题栏下方工具栏的显示--结果：新增了视图选项、排序方式选项
      //设置图标定位:视图选项
      const caseDir = process.env.TESTCASE_DIR;
      const imgRelativePath = `${caseDir}midscene_dde_file_manager/picture/文件管理器预览图标.png`;
      const imgRelativePath1 = `${caseDir}midscene_dde_file_manager/picture/文件管理器图标视图.png`;
      // 检测到新增了视图选项、排序方式选项
      await agent.aiHover({
        prompt: '文件管理器-图标视图',
        images: [
          {
            name: '图标视图',
            url: imgRelativePath1,
          },
        ],
      });

      //  步骤2：鼠标悬浮在视图选项上--结果：弹出提示信息“视图选项”
      await agent.aiHover({
        prompt: '文件管理器-视图选项',
        images: [
          {
            name: '视图选项',
            url: imgRelativePath,
          },
        ],
      });
      await agent.aiAssert('视图选项');

      //  步骤3：鼠标悬浮在排序方式选项上--结果：弹出提示信息“视图选项”
      await agent.aiHover('文件管理器右上角的搜索出入框的左边第一个图标中包含向上箭头和向下的箭头');
      await agent.aiAssert('排序方式');

    }, { timeout: 1200000, tags: ["1816689", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
