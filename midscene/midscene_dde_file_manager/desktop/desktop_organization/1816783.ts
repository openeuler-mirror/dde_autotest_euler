/**
 * 用例 PMSID: 1816783
 * 用例标题:  桌面右键菜单隐藏所有集合
 * 生成时间: 2026-2-2 15:35:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816783- 桌面右键菜单隐藏所有集合 ', () => {
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
        await system.exec('touch ~/Desktop/1816783.txt', 500);
        await system.exec('touch ~/Desktop/1816783.xlsx', 500);
        await system.exec('touch ~/Desktop/1816783.doc', 500);

    });
  
    test('1816783- 桌面右键菜单隐藏所有集合 ', async ({ device, agent, uos, system, env }) => {
        
        // 刷新桌面
        await device.pressKey('F5');

        // 开启整理桌面功能
        await agent.aiRightClick('桌面居中部位空白处');
        await agent.aiWaitFor('右键菜单');
        await agent.aiTap('整理桌面');
        await agent.aiHover('1816783.txt');
        await agent.aiAssert('文档');

        // 桌面右键菜单-桌面设置-关闭桌面整理
        await agent.aiRightClick('桌面居中位置空白处');
        await agent.aiWaitFor('右键菜单');
        await agent.aiTap('桌面设置');
        await agent.aiWaitFor('启用桌面整理');
        
        // 确保集合方式下所有被勾选的选项都取消勾选
        // 检查应用程序是否被勾选
        try {
            await agent.aiAssert('应用程序被勾选', 500);
            await agent.aiTap('应用程序')
            await agent.aiAssert('应用程序未被勾选', 500);
            console.log('合集方式-应用程序取消勾选成功');
        } catch (error) {
            console.log('合集方式-应用程序未被勾选');
        }
        // 检查应用程序是否被勾选
        try {
            await agent.aiAssert('文档被勾选', 500);
            await agent.aiTap('文档')
            await agent.aiAssert('文档未被勾选', 500);
            console.log('合集方式-文档取消勾选成功');
        } catch (error) {
            console.log('合集方式-文档未被勾选');
        }
        // 检查图片是否被勾选
        try {
            await agent.aiAssert('图片被勾选', 500);
            await agent.aiTap('图片')
            await agent.aiAssert('图片未被勾选', 500);
            console.log('合集方式-图片取消勾选成功');
        } catch (error) {
            console.log('合集方式-图片未被勾选');
        }
        // 检查视频是否被勾选
        try {
            await agent.aiAssert('视频被勾选', 500);
            await agent.aiTap('视频')
            await agent.aiAssert('视频未被勾选', 500);
            console.log('合集方式-视频取消勾选成功');
        } catch (error) {
            console.log('合集方式-视频未被勾选');
        }
        // 检查音乐是否被勾选
        try {
            await agent.aiAssert('音乐被勾选', 500);
            await agent.aiTap('音乐')
            await agent.aiAssert('音乐未被勾选', 500);
            console.log('合集方式-音乐取消勾选成功');
        } catch (error) {
            console.log('合集方式-音乐未被勾选');
        }
        // 检查文件夹是否被勾选
        try {
            await agent.aiAssert('文件夹被勾选', 500);
            await agent.aiTap('文件夹')
            await agent.aiAssert('文件夹未被勾选', 500);
            console.log('合集方式-文件夹取消勾选成功');
        } catch (error) {
            console.log('合集方式-文件夹未被勾选');
        }
        // 检查其他是否被勾选
        try {
            await agent.aiAssert('其他被勾选', 500);
            await agent.aiTap('其他')
            await agent.aiAssert('其他未被勾选', 500);
            console.log('合集方式-其他取消勾选成功');
        } catch (error) {
            console.log('合集方式-其未被勾选');
        }
        console.log('所有合集方式均被未勾选');

        // 检查整理的文件分类是否均分散
        await agent.aiAssert('桌面整理好的所有合集被隐藏');
        console.log('桌面所有合集被隐藏');

        // 取消所有合集方式
        await agent.aiTap('应用程序');
        await agent.aiTap('文档');
        await agent.aiTap('图片');
        await agent.aiTap('视频');
        await agent.aiTap('音乐');
        await agent.aiTap('文件夹');
        await agent.aiTap('其他');
        await agent.aiWaitFor('所有用例均被勾选');
        console.log('所有合集方式均被成功勾选');

        // 再次点击查看桌面右键菜单-"整理桌面"选项，桌面整理重新被开启
        await device.pressKey('ESC');
        await agent.aiWaitFor('弹框消失');
        await agent.aiRightClick('桌面居中位置空白处');
        await agent.aiWaitFor('右键菜单');
        await agent.aiTap('整理桌面');
        
        // 校验桌面合集是否重新整理
        await agent.aiHover('1816783.txt');
        await agent.aiAssert('文档');

    }, { timeout: 1200000, tags: ["1816783", "level3", "desktop_organization", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');
        // 防止弹框未退出
        await device.pressKey('ESC');

        // 恢复桌面整理功能已开启状态
        await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0', 500);
        await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1', 500);

        // 清理测试文件
        await system.exec('rm -f ~/Desktop/1816783.txt', 500);
        await system.exec('rm -f ~/Desktop/1816783.xlsx', 500);
        await system.exec('rm -f ~/Desktop/1816783.doc', 500);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 初始化文管配置和进程
      await system.cleanupFileManager();
      await uos.showDesktop();
    });
  });
