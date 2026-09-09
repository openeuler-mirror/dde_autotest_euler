/**
 * 用例 PMSID: 1503367
 * 用例标题:【任务栏】【托盘区域】【亮度】主题为深色模式，检查亮度面板调节条
 * 生成时间: 2025-1-21 16:16:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1503367-【任务栏】【托盘区域】【亮度】主题为深色模式，检查亮度面板调节条', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1503367-【任务栏】【托盘区域】【亮度】主题为深色模式，检查亮度面板调节条', async ({ device, agent, uos, system }) => {
      // 步骤 1: 打开控制中心-个性化，设置深色模式
      await uos.openApp("控制中心", 2000, 20000, true);
      await agent.aiTap("个性化", { deepThink: true });
      await agent.aiTap("外观一行右侧的﹀", { deepThink: true });
      await agent.aiTap("深色", { deepThink: true });

      // 步骤 2: 点击托盘区域亮度图标 - 使用多层兜底方案确保成功
      system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'dde-brightness' 1");
      
      // 兜底方案：尝试多种方式点击亮度图标
      let maxAttempts = 5;
      let success = false;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`尝试第${attempt}次点击亮度图标...`);
          
          if (attempt === 1) {
            // 第1次：原始方式 - 详细描述
            await agent.aiTap("任务栏右下角亮度图标中心(类型太阳形状)", { deepThink: true });
          } else if (attempt === 2) {
            // 第2次：简化描述 - 强调太阳形状
            await agent.aiTap("任务栏右下角托盘区域中太阳形状的亮度图标", { deepThink: true });
          } else if (attempt === 3) {
            // 第3次：相对位置描述 - 基于周围图标定位
            await agent.aiTap("任务栏右下角，时间显示左侧、WiFi图标左侧的亮度图标", { deepThink: true });
          } else if (attempt === 4) {
            // 第4次：迂回策略 - 先点击声音图标打开快捷面板
            await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
            await agent.aiWaitFor("快捷设置面板已显示");
            await agent.aiTap("快捷面板中的亮度图标", { deepThink: true });
          } else {
            // 第5次：终极方案 - 使用系统命令直接打开亮度面板
            system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 ShowQuickPanel");
            await new Promise(resolve => setTimeout(resolve, 1000));
            await agent.aiTap("快捷面板中的亮度图标或亮度调节条", { deepThink: true });
          }
          
          // 验证亮度面板是否显示
          await agent.aiWaitFor("亮度面板已显示", { timeout: 5000 });
          console.log(`第${attempt}次点击成功`);
          success = true;
          break;
        } catch (error) {
          console.log(`第${attempt}次点击失败: ${error.message}`);
          // 等待1秒后重试
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!success) {
        throw new Error('所有尝试均失败，无法打开亮度面板');
      }

      // 检查： 快捷面板中亮度条清晰可见
      await agent.aiAssert("快捷面板中亮度条清晰可见");
  
    }, { timeout: 1200000, tags: ["1503367", "level3"] });
  
    afterEach(async ({ agent, device, system }) => {
      console.log('3. afterEach: 每个测试后的清理');
      system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'dde-brightness' 0");
      await agent.aiTap("外观一行右侧的﹀", { deepThink: true });
      await agent.aiTap("浅色", { deepThink: true });      
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });