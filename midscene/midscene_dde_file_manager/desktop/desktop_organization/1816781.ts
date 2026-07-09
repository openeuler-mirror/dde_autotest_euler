/**
 * 用例 PMSID: 1816781
 * 用例标题: 桌面右键菜单开启桌面整理
 * 生成时间: 2026-2-2 14:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816781-桌面右键菜单开启桌面整理 ', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 前置条件
      // 1.确保桌面整理功能已开启
      await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
      await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);
  
      // 2.桌面新增多个文件
        await system.exec('touch ~/Desktop/1816781.txt', 500);
        await system.exec('touch ~/Desktop/1816781.xlsx', 500);
        await system.exec('touch ~/Desktop/1816781.doc', 500);

    });
  
    test('1816781-桌面右键菜单开启桌面整理 ', async ({ device, agent, uos, system, env }) => {
        // 刷新桌面
        await device.pressKey('F5', 500);

        // 开启整理桌面功能
        await agent.aiRightClick('面右侧无内容区');
        await agent.aiWaitFor('右键菜单');
        await agent.aiTap('整理桌面');
        await agent.aiHover('1816781.txt');
        await agent.aiAssert('文档');

        // 桌面右键菜单-桌面设置-关闭桌面整理
        await agent.aiRightClick('面右侧无内容区');
        await agent.aiWaitFor('右键菜单');
        await agent.aiTap('桌面设置');
        await agent.aiWaitFor('启用桌面整理');
        await agent.aiTap('启用桌面整理右侧的按钮', 1000);
        await agent.aiWaitFor('桌面集合方式隐藏');
        console.log('桌面整理功能已关闭成功');

        // 再次点击查看桌面右键菜单-右键菜单隐藏"整理桌面"选项，显示"开启桌面整理"选项
        await device.pressKey('ESC');
        await agent.aiWaitFor('弹框消失');
        await agent.aiRightClick('面右侧无内容区');
        await agent.aiAssert('不存在桌面整理');

        // 重新打开开启桌面整理功能开关
        // await agent.aiRightClick('面右侧无内容区');
        await agent.aiWaitFor('桌面设置');
        await agent.aiTap('桌面设置');
        await agent.aiWaitFor('"启用桌面整理"文字出现');
        await agent.aiTap('启用桌面整理右侧按钮', 1000);
        await agent.aiWaitFor('集合方式')
        console.log('开启桌面整理功能开启打开成功');
        await device.pressKey('ESC');

        // 重新右键-桌面整理打开
        await agent.aiRightClick('面右侧无内容区');
        await agent.aiWaitFor('右键菜单');
        await agent.aiTap('整理桌面');
        await agent.aiHover('1816781.txt');
        await agent.aiAssert('文档');
        console.log('桌面整理功能开启成功');

    }, { timeout: 1200000, tags: ["1816781", "level3", "desktop_organization", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');
        // 防止弹框未退出
        await device.pressKey('ESC');

        // 恢复桌面整理功能已开启状态
      await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
      await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);

        // 清理测试文件
        await system.exec('rm -f ~/Desktop/1816781.txt', 500);
        await system.exec('rm -f ~/Desktop/1816781.xlsx', 500);
        await system.exec('rm -f ~/Desktop/1816781.doc', 500);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 初始化文管配置和进程
      await system.cleanupFileManager();
      await uos.showDesktop();
    });
  });
