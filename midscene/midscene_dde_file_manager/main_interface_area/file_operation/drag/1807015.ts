/**
 * 用例 PMSID: 1807015
 * 用例标题: 聚合拖拽-桌面和文件管理器拖拽文件到回收站_
 * 生成时间: 2026-03-02 16:57:45
 * 用例编写人: UT000244（李庆玲）
 */

describe('1807015-聚合拖拽-桌面和文件管理器拖拽文件到回收站_', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  
  test('1807015-聚合拖拽-桌面和文件管理器拖拽文件到回收站_', async ({ device, agent, uos, system }) => {
    // 步骤1：通过命令在桌面创建6个文件夹
    console.log('步骤1：在桌面创建6个文件夹');
    for (let i = 1; i <= 6; i++) {
      await system.exec(`mkdir -p ~/Desktop/1807015_${i}`);
      console.log(`创建文件夹1807015_${i}`);
    }

    await agent.aiTap("桌面空白处");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤2：在桌面鼠标框选多个文件拖拽至桌面回收站图标上
    console.log('步骤2：桌面拖拽多个文件到回收站');
    
    // 先将三个文件夹移动到桌面右上角
    await agent.aiAction("将1807015_1文件夹拖拽到桌面最右侧第一列第一行", 500);
    await agent.aiAction("将1807015_2文件夹拖拽到桌面最右侧第一列第二行", 500);
    await agent.aiAction("将1807015_3文件夹拖拽到桌面最右侧第一列第三行", 500);
    // await agent.aiAction("将回收站拖拽到桌面正中间", 500);
    await agent.aiTap('桌面空白处');
    
    // 使用拖拽选择方式 - 最可靠的选择方法
    await agent.aiAction("框选1807015_1、1807015_2、1807015_3文件夹");
      
    // 拖拽到桌面回收站图标
    await agent.aiAction("将选中的多个文件夹拖拽到桌面回收站图标上");
    // await agent.aiAssert('拖拽过程中显示图标聚合效果, 拖拽图标右下角显示红色3');
      
    // 验证文件已移动到回收站
    await agent.aiAssert("1807015_1文件夹不在桌面");
    await agent.aiAssert("1807015_2文件夹不在桌面");
    await agent.aiAssert("1807015_3文件夹不在桌面");
    console.log('桌面拖拽到回收站测试完成');
    
    // 等待桌面操作完全完成
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤3：打开文件管理器，在桌面鼠标框选多个文件拖拽至文管回收站目录
    console.log('步骤3：文件管理器拖拽多个文件到回收站');
    
    // 打开文件管理器 - 添加详细日志和错误处理
    await agent.aiDoubleClick('桌面计算机图标', 2000);
    await agent.aiTap("左侧导航栏的回收站目录");
      
    // 使用拖拽选择方式 - 最可靠的选择方法
    await agent.aiAction("框选桌面1807015_4、1807015_5、1807015_6文件夹");
    await agent.aiAction("将选中的多个文件拖拽到打开的文件管理器窗口左侧导航栏回收站目录右侧的空白区域");
      
    // 验证文件已移动到回收站
    await agent.aiAssert("1807015_4文件夹在回收站中");
    await agent.aiAssert("1807015_5文件夹在回收站中");
    await agent.aiAssert("1807015_6文件夹在回收站中"); 
    console.log('文件管理器拖拽到回收站测试完成');

  }, { timeout: 1800000, tags: ["1807015", "level3", "drag", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
    await system.cleanupFileManager();
    
    // 清空桌面测试文件
    await system.exec("rm -rf ~/Desktop/1807015*");
    
    // 清空回收站
    await system.exec("rm -rf ~/.local/share/Trash/files/*");
    await system.exec("rm -rf ~/.local/share/Trash/info/*");
    
    console.log('清理完成');
  });
});

