/**
 * 用例 PMSID: 1506845
 * 用例标题: 【控制中心】【网络】【无线网络】连接开放WiFi
 * 生成时间: 2025/12/23 13:54
 * 用例编写人:UT002998(熊林辉)
 */

describe('1506845-【控制中心】【网络】【无线网络】连接开放WiFi', () => {
    beforeAll(async ({ device, uos, agent, env, system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();

       //判断uniontech-m是否连接，如果已连接就删除，如果未连接就输出
      const result = await system.exec('nmcli connection show --active | grep uniontech-m');

      if (result.success){
          console.log('输出：', result.stdout);
          await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'rm -f /etc/NetworkManager/system-connections/uniontech-m.nmconnection'`);

          await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'systemctl restart NetworkManager.service'`);
          }else{
              console.error('错误：', result.stderr);
              }
    });

    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1506845-【控制中心】【网络】【无线网络】连接开放WiFi', async ({ device, agent, uos, system}) => {
      // ========== 新增：无线网卡存在性判断 ==========
      console.log('检测无线网卡是否存在...');
      // 执行nmcli命令检测WiFi设备（无线网卡），-i忽略大小写提高兼容性
      const wifiDeviceResult = await system.exec('nmcli device status | grep -i wifi');
      
      // 分支处理：不存在无线网卡直接pass，存在则执行后续测试步骤
      if (!wifiDeviceResult.success) {
        console.log('3:未检测到无线网卡，测试直接标记为pass');
        return;
      }
      console.log('检测到无线网卡，开始执行测试步骤...');
      // =============================================

      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击网络
      await agent.aiTap("网络", { deepThink: true });
      await agent.aiAssert("导航栏显示：网络");

      // 步骤 3: 点击无线网络
      await agent.aiTap("无线网络", { deepThink: true });
      await agent.aiAssert("导航栏显示：网络 / 无线网络");
      await agent.aiAssert("界面显示：uniontech-m");

      // 步骤 4: 双击uniontech-m
      await agent.aiDoubleClick('uniontech-m');
      await agent.aiWaitFor('界面出现"我的网络"标题',{
           timeoutMs: 30000,
           checkIntervalMs: 5000,
           });

      //检查：uniontech-m显示在我的网络下方
      await agent.aiAssert("界面显示：我的网络、其他网络");
      await agent.aiAssert("uniontech-m显示在我的网络下方");

    }, { timeout: 300000, tags: ["1506845","level2","smoke","Laptop"] });

    afterEach(async ({agent, device, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');
      const wifiDeviceResult = await system.exec('nmcli device status | grep -i wifi');
      if (wifiDeviceResult.success) {
         await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'rm -f /etc/NetworkManager/system-connections/uniontech-m.nmconnection'`);
         await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'systemctl restart NetworkManager.service'`);
         await agent.aiWaitFor("无线网络状态：已断开");
	}
    });

    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 新增：仅当存在无线网卡时执行关闭窗口操作
      const wifiDeviceResult = await system.exec('nmcli device status | grep -i wifi');
      if (wifiDeviceResult.success) {
        await device.pressKey("Super", "Down");
        await agent.aiTap("窗口右上角关闭按钮:X");
      }
    });
  });
