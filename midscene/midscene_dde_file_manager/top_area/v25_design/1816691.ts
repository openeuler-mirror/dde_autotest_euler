/**
 * 用例 PMSID: 1816691
 * 用例标题: 视图选项-单击弹出视图选项面板
 * 生成时间: 2026-2-3 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816691-视图选项-单击弹出视图选项面板', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    test('1816691-视图选项-单击弹出视图选项面板', async ({ device, agent, uos, system, env }) => {  
      // 打开文件管理器
      await uos.openApp('文件管理器', { maximizeWindow: true });

      // 进入主目录
      await agent.aiTap('文件管理器左侧的主目录');
      // 防止元素点错到左侧按钮
      await agent.aiTap('文件管理器左侧顶部的收起展开侧边栏按钮');

      // 点击图标视图图标
      const caseDir = process.env.TESTCASE_DIR;
      const imgRelativePath =`${caseDir}midscene_dde_file_manager/picture/文件管理器图标视图.png`;
      await agent.aiTap({
        prompt: '文件管理器-图标视图',
        images: [
          {
            name: '图标视图',
            url: imgRelativePath,
          },
        ],
      });

      //设置图标定位:视图选项
      // const imgRelativePath1 =`${caseDir}midscene_dde_file_manager/picture/文件管理器预览图标.png`;
      // await agent.aiTap({
      //   prompt: '文件管理器-视图选项',
      //   images: [
      //     {
      //       name: '视图选项',
      //       url: imgRelativePath1,
      //     },
      //   ],
      // });
      await agent.aiTap('文件管理器窗口右侧顶部第二行从左往右第4个小图标')

      // 检测视图选项显示正确性
      await agent.aiWaitFor('图标大小');
      await agent.aiAssert('弹框选项由上到下排列一次为：图标大小、网格密度、显示预览');

      // 再次单击“视图选项”,收起视图选项面板
      // await agent.aiTap({
      //   prompt: '文件管理器-视图选项',
      //   images: [
      //     {
      //       name: '视图选项',
      //       url: imgRelativePath1,
      //     },
      //   ],
      // });
      // await agent.aiAssert('视图选项弹框收起');
      await agent.aiTap('文件管理器窗口右侧顶部第二行从左往右第4个小图标')

      // 再次单击“视图选项”,再次开启视图选项面板
      // await agent.aiTap({
      //   prompt: '文件管理器-视图选项',
      //   images: [
      //     {
      //       name: '视图选项',
      //       url: imgRelativePath1,
      //     },
      //   ],
      // });
      // await agent.aiAssert('视图选项弹框打开');
      await agent.aiTap('文件管理器窗口右侧顶部第二行从左往右第4个小图标')

      // 点击下拉框以外的空白
      await agent.aiTap('视图选项弹框外窗口右下角的空白区');
      await agent.aiAssert('视图选项弹框收起');

    }, { timeout: 1200000, tags: ["1816691", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
