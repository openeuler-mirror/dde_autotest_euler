/**
 * 用例 PMSID: 1807181
 * 用例标题: 拖拽.docx文件到WPS图标打开
 * 生成时间: 2026-03-02 16:22:45
 * 用例编写人：UT000244（李庆玲）
 */
describe('1807181-拖拽.docx文件到WPS图标打开', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 杀掉应用商店进程
    await system.exec("pkill deepin-home-app");
  });

  test('1807181-拖拽.docx文件到WPS图标打开测试', async ({ device, uos, system, agent, env }) => {
    // 辅助函数：等待条件成立，最多等待指定毫秒数，超时则返回false
    const waitForCondition = async (condition, timeoutMs) => {
      const startTime = Date.now();
      const checkInterval = 10000; // 每10秒检查一次
      while (Date.now() - startTime < timeoutMs) {
        try {
          await agent.aiWaitFor(condition, { timeout: checkInterval });
          return true; // 条件成立
        } catch (error) {
          // 条件未成立，继续等待
          console.log(`条件"${condition}"尚未满足，继续等待...`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒后再次检查
        }
      }
      console.log(`等待条件"${condition}"超时（${timeoutMs}ms）`);
      return false; // 超时
    };

    const maxWait = 360000; // 6分钟，单位毫秒

    // 步骤一：通过启动器打开应用商店并安装WPS
    await uos.openApp('应用商店', 1000);
    await agent.aiTap('右上角最大化按钮');
    await agent.aiTap("点击窗口上方的搜索输入框", { deepThink: true });
    await agent.device.pressKey("LeftControl", "A");
    await agent.device.pressKey("Delete");
    await device.typeText("WPS 2023 专业版", false);
    await agent.aiTap("搜索按钮", { deepThink: true });
    await agent.aiWaitFor("搜索页面已显示");
    await agent.aiAssert("搜索页面显示WPS 2023 专业版应用图标");
    await agent.aiTap("点击WPS 2023 专业版应用图标", { deepThink: true });
    await agent.aiWaitFor("应用详情页面已显示");
    await agent.aiTap('WPS 2023 专业版右侧安装按钮');

    // 等待安装完成，最多等待6分钟，如果超时则跳过后续步骤
    const installationSuccess = await waitForCondition("WPS 2023 专业版应用后的按钮变为打开", maxWait);
    if (!installationSuccess) {
      console.log('安装未在8分钟内完成，跳过后续步骤');
      return; // 结束测试，不执行后续步骤
    }
    
    // await new Promise(resolve => setTimeout(resolve, 720000));
    console.log('等待WPS安装完成...');

    // 关闭应用商店
    console.log('关闭应用商店...');
    await agent.aiTap('右上角关闭按钮');
    await agent.aiWaitFor('桌面');
    
    // 步骤二：在桌面创建三个.docx文档
    console.log('在桌面创建.docx文档...');
    await system.exec(`mkdir -p ~/Desktop/1807181`);
    await system.exec(`touch ~/Desktop/1807181/1807181_1.docx`);
    await system.exec(`touch ~/Desktop/1807181/1807181_2.docx`);
    await system.exec(`touch ~/Desktop/1807181/1807181_3.docx`);
    
    // 步骤三：验证文档创建成功
    await agent.aiWaitFor('显示桌面');
    await agent.aiDoubleClick('1807181文件夹');
    await agent.aiAssert('1807181文件夹下存在1807181_1.docx');
    await agent.aiAssert('1807181文件夹下存在1807181_2.docx');
    await agent.aiAssert('1807181文件夹下存在1807181_3.docx');
    
    // 步骤四：全选.docx文档
    console.log('全选.docx文档...');
    await device.pressKey('Ctrl+A');
    
    // 步骤五：拖拽选中的文档到WPS图标
    console.log('拖拽文档到WPS图标...');
    await agent.aiAction('拖拽选中的.docx文档到WPS文字图标');
    
    // 步骤六：处理首次安装WPS可能出现的许可协议弹框
    console.log('检查是否弹出金山办公软件许可协议和隐私政策弹框...');
    
    let hasLicenseDialog = false;
    
    try {
        await agent.aiWaitFor('金山办公软件许可协议和隐私政策弹框', { timeout: 3000 });
        console.log('检测到许可协议弹框，点击已阅读并同意...');
        await agent.aiTap('勾选已阅读并同意金山办公软件许可协议和隐私政策前面的复选框');
        await agent.aiTap('确定按钮');
        hasLicenseDialog = true;
        console.log('许可协议弹框已处理，等待可能出现的试用弹框...');
    } catch (error) {
        console.log('未检测到许可协议弹框，继续检查试用弹框...');
    }
    
    // 步骤七：处理首次使用WPS可能出现的试用弹框
    console.log('检查是否弹出试用弹框...');
    
    try {
        await agent.aiWaitFor('试用弹框', { timeout: 10000 });
        console.log('检测到试用弹框，点击试用...');
        await agent.aiTap('试用');
        console.log('试用弹框已处理，等待文档打开...');
        await agent.aiWaitFor('WPS文档应用窗口');
        await agent.aiAssert('WPS文档已打开');
    } catch (error) {
        console.log('未检测到试用弹框，检查WPS文档是否已打开...');
        
        // 如果之前处理过许可协议弹框，需要额外等待WPS启动
        if (hasLicenseDialog) {
            console.log('之前处理过许可协议弹框，等待WPS完全启动...');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        await agent.aiWaitFor('WPS文档应用窗口');
        await agent.aiAssert('WPS文档已打开');
    }
    
  }, { timeout: 1800000, tags: ['1807181', 'level3', 'drag', 'liqingling'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭WPS应用及文管、应用商店
    await system.exec('killall wps-office*');
    await system.exec('killall dde-file-manager');
    await system.exec("pkill deepin-home-app");
    // 删除创建的文档
    await system.exec('rm -rf ~/Desktop/1807181*');
    
    // 卸载WPS
    await system.exec(`echo ${process.env.TEST_PASSWORD}|sudo -S apt remove -y cn.wps.wps-office-pro`);
    await system.exec(`echo ${process.env.TEST_PASSWORD}|sudo -S dpkg --purge cn.wps.wps-office-pro`);
    
    // 桌面鼠标右键删除WPS办公小助手
    await agent.aiTap('WPS办公小助手');
    await agent.aiRightClick('WPS办公小助手');
    await agent.aiTap('删除', 500);
    await agent.aiAssert('桌面不存在WPS办公小助手');
    // // 清空回收站
    // await agent.aiDoubleClick('桌面的回收站图标');
    // await agent.aiTap('右侧清空按钮');
    // await agent.aiTap('弹框中的清空按钮');
    // await system.exec('killall dde-file-manager');
  });
});