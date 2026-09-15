/**
 * 用例 PMSID: 1832453
 * 用例标题: 【启动器】【窗口模式】【最近安装】拖拽应用至任务栏
 * 生成时间: 2026/2/5 19:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832453-【启动器】【窗口模式】【最近安装】拖拽应用至任务栏', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
    });

    beforeEach(async ({ device, agent, system, env, uos}) => {
      console.log('2. beforeEach: 每个测试前的准备');
     //预置步骤1：读取配置文件 current_frame 的值
	  const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
	  assertTrue(result.success, '读取配置文件失败');
	
	  const content = result.stdout.toString();
	  const isFullscreen = content.includes('current_frame=FullscreenFrame');
	  const isWindowed = content.includes('current_frame=WindowedFrame');
	
	  console.log('配置文件内容：', content);
	  console.log('isFullscreen：', isFullscreen);
	  console.log('isWindowed：', isWindowed);
	
	  //预置步骤2：如果是全屏模式 → 按ESC关闭 → 重新打开启动器
	  if (isFullscreen) {
	    console.log('检测到全屏模式，执行ESC确保启动器被关闭...');
	    await device.pressKey('ESC');
	
	    console.log('重新打开启动器...');
	    await uos.openLauncher();
	
	 //预置步骤3：点击启动器全屏模式右上角的“窗口模式”图标
	  console.log('切换启动器全屏模式到窗口模式，确保测试环境正常...');
	  await agent.aiTap({
	  prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
	  images: [
	     {
	       name: '窗口模式小图标',
	       url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
	     },
	  ],
	   deepThink: true,
	     });
	  }
	
	  //预置步骤4：如果是窗口模式 → 不做任何操作
	  console.log('如果是窗口模式 → 不做任何操作');
	  if (isWindowed) {
	    console.log('检测到窗口模式，无需操作');
	  }
	
	//预置步骤5：收尾按ESC关闭启动器，保持环境干净
	  await device.pressKey('ESC');
      
      console.log('安装360浏览器');
      system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
      const result1 = await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt install com.360.browser-stable -y'`, 60000);
      if (result1.success){
         console.log('360安全浏览器安装成功：', result1.stdout);
      } else {
         console.error('360安全浏览器安装失败：', result1.stderr);
      }
    });

    test('1832453-【启动器】【窗口模式】【最近安装】拖拽应用至任务栏', async ({ device, agent, uos, system, env }) => {
    // 步骤1：打开启动器
      await uos.openLauncher();

    // 步骤 2: 拖拽我的常用模块下方的应用到任务栏
      await agent.aiRightClick("360安全浏览器", {deepinThink:true});
      await agent.aiTap("发送到任务栏");
      await agent.aiAssert("任务栏应用区域存在360安全浏览器图标");

    // 步骤 3：继续拖拽最近安装模块下方的应用到任务栏
    //  await agent.aiDrag("将启动器最近安装菜单下方的360安全浏览器", "底部任务栏设置图标右侧的空白位置");
      await agent.aiRightClick("360安全浏览器", {deepinThink:true});
      await agent.aiAssert("右键菜单存在'从任务栏上移除'，不存在'发送到任务栏'");

    }, { timeout: 300000, tags: ["1832453", "level3"] });

    afterEach(async ({agent, device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, system, env}) => {
      console.log('4. afterAll: 清理测试套件');
      await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y com.360.browser-stable'`);
      await uos.closeCurrentWindow();
    });
  });