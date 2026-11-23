/**
 * 用例 PMSID: 1964027
 * 用例标题: 【标签页支持右键固定】新开文管窗口显示所有固定标签页
 * 生成时间: 2026-07-10 11:22:23
 * 用例编写人: UT002899(胡诗敏)
 */


describe('1964027-【标签页支持右键固定】新开文管窗口显示所有固定标签页', () => {
  beforeAll(async ({ uos, system }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件 ：准备测试文件和环境
    await system.exec(`mkdir -p ~/文件夹A/P1 ~/文件夹A/P2 ~/文件夹A/P3 ~/文件夹A/P4 ~/文件夹A/P5 ~/文件夹B`)
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
  });

  test('1964027-新开文管窗口显示所有固定标签页', async ({ uos, agent, device, system }) => {
    // 前置条件 1：固定5个标签页，并勾选总在新窗口打开文件夹
    console.log("前置条件 1：固定5个标签页，并勾选总在新窗口打开文件夹")
    await uos.openApp("文件管理器")
    await agent.aiTap("文件管理器窗口左侧侧边栏的主目录")
    await agent.aiDoubleClick('文件夹A');
    await agent.aiDoubleClick('文件夹P1的中间位置');
    await agent.aiRightClick("标签P1，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的文件夹A", { deepThink: true })
    await agent.aiDoubleClick('文件夹P2的中间位置');
    await agent.aiRightClick("标签P2，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的文件夹A", { deepThink: true })
    await agent.aiDoubleClick('文件夹P3的中间位置');
    await agent.aiRightClick("标签P3，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的文件夹A", { deepThink: true })
    await agent.aiDoubleClick('文件夹P4的中间位置');
    await agent.aiRightClick("标签P4，左侧显示蓝色小点")
    await agent.aiTap("固定标签")


    await agent.aiTap("地址栏的文件夹A", { deepThink: true })
    await agent.aiDoubleClick('文件夹P5的中间位置');
    await agent.aiRightClick("标签P5，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    // 前置条件 2：打开文管设置-总是在新窗口打开文件夹
    console.log("前置条件 2：打开文管设置-总是在新窗口打开文件夹")
    await agent.aiTap("右上角主菜单")
    await agent.aiTap("设置")
    const isBoxCheck = await agent.aiBoolean("总是在新窗口打开文件夹复选框是否勾选");
    if (isBoxCheck) {
        console.log("不需要勾选复选框")
    } else {
        console.log("需要勾选复选框");
        await agent.aiTap("总是在新窗口打开文件夹前面的复选框");
    }
    await device.pressKey("ESC")
    await system.exec('killall dde-file-manager');

    // 前置条件 3：浏览器下载文件
    console.log("前置条件 3：浏览器下载文件")
    await uos.openApp("浏览器")
    await agent.aiRightClick("添加按钮右侧的空白处")
    await agent.aiTap("另存为")
    await agent.aiTap("文件管理器左侧边栏的下载")
    await agent.aiTap("保存")
    await agent.aiTap("右上角关闭按钮")

    // 步骤 1：打开文管，检查是否有5个固定标签页
    console.log("步骤 1：打开文管，检查是否有5个固定标签页")
    await uos.openApp("文件管理器")
    await agent.aiAssert('打开的文管窗口中存在5个固定标签页P1、P2、P3、P4、P5');

    // 步骤 2：选择文件夹B，在新窗口打开文件夹，存在5个固定标签页
    console.log('步骤 2：选择文件夹B，在新窗口打开文件夹，存在5个固定标签页');
    await agent.aiTap("窗口左侧侧边栏的主目录")
    await agent.aiRightClick('文件夹B');
    await agent.aiTap('在新窗口打开');
    await agent.aiAssert('文管窗口中存在5个固定标签页P1、P2、P3、P4、P5，和文件夹B');

    // 步骤 3：将任意固定标签页拖出，检查新窗口，存在5个固定标签页
    console.log('步骤 3：将任意固定标签页拖出，检查新窗口，存在5个固定标签页');
    await agent.aiDrag('文管窗口中的固定标签页P1', 'UOS桌面计算机位置', { deepThink: true });
    await agent.aiAssert('文管窗口中存在5个固定标签页P1、P2、P3、P4、P5');
    await system.exec('killall dde-file-manager')

    // 步骤 4：打开浏览器的下载的内容，点击在文件夹中显示，检查窗口存在5个固定标签页
    console.log("步骤 4：打开浏览器的下载的内容，点击在文件夹中显示，检查窗口存在5个固定标签页")
    await uos.openApp("浏览器")
    await agent.aiTap("右上角外观为3个横的图标")
    await agent.aiTap("下载内容")
    await agent.aiTap("新标签页.htm右侧竖着的三个点" ,{deepThink: true})
    await agent.aiTap("在文件夹中显示")
    await agent.aiAssert('文管窗口中存在5个固定标签页P1、P2、P3、P4、P5');
    await system.exec('killall dde-file-manager')

    // 清理浏览器下载记录
    await uos.openApp("浏览器")
    await agent.aiTap("右上角外观为3个横的图标")
    await agent.aiTap("下载内容")
    await agent.aiTap("新标签页.htm右侧竖着的三个点" ,{deepThink: true})
    await agent.aiTap("从历史记录中删除")
    await system.exec(`killall browser`)

  }, { timeout: 1200000, tags: ['1964027', 'level2', '2500u1','hushimin'] });

    afterEach(async ({ device, agent, uos, system }) => {
    console.log('7. afterEach: 每个测试后的清理');
    // 清理文管环境：取消勾选总在新窗口打开文件夹的复选框
    await uos.openApp('文件管理器')
    await agent.aiTap("右上角主菜单")
    await agent.aiTap("设置")
    const isBoxChecked = await agent.aiBoolean("总是在新窗口打开文件夹复选框是否勾选");
    if (isBoxChecked) {
        console.log("需要取消勾选复选框")
        await agent.aiTap("总是在新窗口打开文件夹前面的复选框");
    } else {
        console.log("不需要取消勾选复选框");
    }
    await device.pressKey("ESC")
  });

  afterAll(async ({ agent, system, device, uos }) => {
    // 恢复文管配置
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager');
    await system.exec('killall /usr/share/browser/browser');
    // 删除测试数据
    await system.exec('rm -rf ~/文件夹A ~/文件夹B');
    await system.exec('rm -rf ~/Downloads/*')
  });
});
