/**
 * 用例 PMSID: 1816699
 * 用例标题:  视图选项-列表视图不显示网格密度
 * 生成时间: 2026-2-3 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816699-视图选项-列表视图不显示网格密度', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 打开文件管理器
      await uos.openApp('文件管理器', { maximizeWindow: true });

      // 进入主目录
      await agent.aiTap('文件管理器左侧的主目录');

    });
  
    test('1816699-视图选项-列表视图不显示网格密度', async ({ device, agent, uos, system, env }) => {  
      // 图标视图下，有“网格密度”选项
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
      // //设置图标定位:视图选项
      // const imgRelativePath = `${caseDir}midscene_dde_file_manager/picture/文件管理器预览图标.png`;
      // 点击视图选项图标
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
      await agent.aiTap('文件管理器窗口右侧顶部第二行从左往右第4个小图标');
      // 检测视图选项显示正确性
      await agent.aiWaitFor('视图选项弹框');
      await agent.aiAssert('存在"网格密度"');
      // 收起视图选项弹框：点击下拉框以外的空白
      await agent.aiTap('视图选项弹框以外窗口右下角的空白区');
      await agent.aiAssert('视图选项弹框收起');

      // 列表视图下，无“网格密度”选项
      // 切换列表视图
      const imgRelativePath2 = `${caseDir}midscene_dde_file_manager/picture/文件管理器列表视图图标.png`;
      await agent.aiTap({
        prompt: '文件管理器-列表视图',
        images: [
          {
            name: '列表视图',
            url: imgRelativePath2,
          },
        ],
      });
      // // 切换列表视图
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
      await agent.aiTap('文件管理器窗口右侧顶部第二行从左往右第4个小图标');
      // 检测视图选项显示正确性
      await agent.aiWaitFor('视图选项弹框');
      await agent.aiAssert('不存在网格密度');
      // 收起视图选项弹框：点击下拉框以外的空白
      await agent.aiTap('视图选项弹框以外窗口右下角的空白区');
      await agent.aiAssert('视图选项弹框收起');

     // 树状视图下，无“网格密度”选项
      // 切换树状视图
      const imgRelativePath3 = `${caseDir}midscene_dde_file_manager/picture/文件管理器树形视图图标.png`;
      await agent.aiTap({
        prompt: '文件管理器-树形视图',
        images: [
          {
            name: '树形视图',
            url: imgRelativePath3,
          },
        ],
      });
      // // 换气视图选项
      // await agent.aiTap({
      //   prompt: '文件管理器-视图选项',
      //   images: [
      //     {
      //       name: '视图选项',
      //       url: imgRelativePath,
      //     },
      //   ],
      // });
      // 唤起视图选项
      await agent.aiTap('文件管理器窗口右侧顶部第二行从左往右第4个小图标');
      // 检测视图选项显示正确性
      await agent.aiWaitFor('视图选项弹框');
      await agent.aiAssert('不存在网格密度');
      // 收起视图选项弹框：点击下拉框以外的空白
      await agent.aiTap('视图选项弹框以外窗口右下角的空白区');
      await agent.aiAssert('视图选项弹框收起');

    }, { timeout: 1200000, tags: ["1816699", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
