/**
 * 用例 PMSID: 1806023
 * 用例标题:   同时隐藏侧边栏和计算机视图中系统盘、数据盘
 * 生成时间: 2026-4-30 11:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;


async function resetSettings(uos, agent, device){
  // 恢复文件管理器默认设置
  await uos.openApp("文件管理器", 3000, 20000, true);
  await agent.aiTap("文件管理器右上角主菜单");
  await agent.aiTap("设置");
  await agent.aiTap("默认目录");
  await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
  await agent.aiTap("恢复默认");
  }

describe('1806023-同时隐藏侧边栏和计算机视图中系统盘、数据盘', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件，配置文管隐藏内置磁盘');
        /*
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
        */
        await resetSettings(uos, agent, device);
        await agent.aiScroll('恢复默认', { direction: 'up', distance: 1000 });
        // 配置侧边栏显示项目-分区-内置磁盘勾选
        await agent.aiTap("侧边栏显示项目");
        await agent.aiTap("分区");
        await agent.aiScroll('分区', { direction: 'down', distance: 3 });
        await agent.aiTap("内置磁盘");
        await agent.aiAssert("内置磁盘处于未勾选状态");
        // 配置计算机显示项目-计算机工作区隐藏内置磁盘勾选
        await agent.aiTap("计算机显示项目");
        await agent.aiTap("计算机工作区隐藏内置磁盘");
        await agent.aiAssert("计算机工作区隐藏内置磁盘处于已勾选状态");
        // 关闭设置窗口
        await device.pressKey("Alt+F4");
        // 关闭文件管理器，准备用例执行
        await device.pressKey("Alt+F4");
    });

    beforeEach(async ({ uos, device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备，确保环境干净');
        await uos.showDesktop();
    });

    test('1806023-同时隐藏侧边栏和计算机视图中系统盘、数据盘', async ({ device, agent, uos, system }) => {
        // 步骤1：显示桌面，点击桌面上的计算机图标进入文件管理器，检查左侧栏系统盘和数据盘可见性
        await agent.aiDoubleClick("桌面上的计算机图标");
        await agent.aiAssert("文件管理器左侧栏看不到如下文字：系统盘、数据盘");

        // 步骤2：点击左侧栏计算机，查看计算机视图系统盘和数据盘可见性
        await agent.aiTap("文件管理器左侧栏计算机");
        await agent.aiAssert("计算机界面看不到如下文字：系统盘、数据盘");
        // 关闭当前文件管理器窗口
        await device.pressKey("Alt+F4");

        // 步骤3：从dock栏文管图标进入文管，查看侧边栏
        await agent.aiTap("任务栏上的文件管理器图标");
        await agent.aiAssert("文件管理器左侧栏看不到如下文字：系统盘、数据盘");

        // 步骤4：点击左侧栏计算机，查看计算机视图系统盘和数据盘可见性
        await agent.aiTap("文件管理器左侧栏计算机");
        await agent.aiAssert("计算机界面看不到如下文字：系统盘、数据盘");
        // 关闭当前文件管理器窗口
        await device.pressKey("Alt+F4");

        // 步骤5：启动器打开文件管理器，检查左侧栏系统盘和数据盘可见性
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiAssert("文件管理器左侧栏看不到如下文字：系统盘、数据盘");

        // 步骤6：点击左侧栏计算机，查看计算机视图系统盘和数据盘可见性
        await agent.aiTap("文件管理器左侧栏计算机");
        await agent.aiAssert("计算机界面看不到如下文字：系统盘、数据盘");
        // 关闭当前文件管理器窗口
        await device.pressKey("Alt+F4");

        // 步骤7：在文件选择对话框，查看侧边栏
        //await uos.showDesktop();
        await agent.aiRightClick("桌面空白处");
        await agent.aiTap("新建文档");
        await agent.aiTap("文本文档");
        await device.typeText("1806023");
        await agent.aiTap("桌面空白处");
        await agent.aiDoubleClick("桌面上的1806023.txt");
        await agent.aiTap("文本文档右上角主菜单");
        await agent.aiTap("打开文件");
        await agent.aiAssert("文件选择对话框左侧栏看不到如下文字：系统盘、数据盘");

        // 步骤8：文件选择对话框点击计算机，滚动后查看计算机视图
        await agent.aiTap("文件选择对话框左侧栏计算机");
        await agent.aiTap("我的目录");
        await agent.aiScroll('我的目录', { direction: 'down', distance: 1000 });
        await agent.aiAssert("看不到如下文字：系统盘、数据盘");

        // 关闭文件选择对话框和文本文档
        await device.pressKey("Alt+F4");
        await device.pressKey("Alt+F4");
    }, { timeout: 1800000, tags: ["1806023",'level2','smoke','dde_file_manager_setting','DITT','lanyanling'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件，恢复设置并删除测试文件');
	 await resetSettings(uos, agent, device);

        // 删除测试创建的文本文档
        await system.exec(`rm -f ~/Desktop/1806023.txt`);
        // 关闭文件管理器进程
        await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
});