/**
 * 用例 PMSID: 1808595
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，基础设置-新窗口和新标签-从新标签打开
 * 生成时间: 2026-04-27
 * 用例编写人: UT000649（黄甜）
 */

describe('1808595-【工作区视图插件显示隐藏】文管设置，基础设置-新窗口和新标签-从新标签打开', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        await device.pressKey('Esc');
        await system.exec('killall dde-file-manager', 500);
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1808595-【工作区视图插件显示隐藏】文管设置，基础设置-新窗口和新标签-从新标签打开', async ({ device, agent, uos, env }) => {
        console.log('=== 开始测试：1808595-从新标签打开 ===');

        // 步骤1: 打开文件管理器并进入设置，验证"从新标签打开"默认值
        console.log('步骤1: 打开文件管理器并进入设置');
        await uos.openApp("文件管理器", 3000, 20000, true);
        console.log('✅ 文件管理器已打开');
        
        // 打开设置菜单
        console.log('步骤1-2: 打开设置菜单');
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        console.log('✅ 设置窗口已打开');
        
        // 进入新标签设置，验证默认值
        console.log('步骤1-3: 验证"从新标签打开"默认值');
        await agent.aiTap("新标签");
        await agent.aiAssert("从新标签打开右侧显示默认值：当前目录");
        console.log('✅ "从新标签打开"默认值验证通过：当前目录');
        
        // 步骤2: 随意打开一个目录后，鼠标左键单击标签右方的"+"按钮，验证新标签页面显示为已打开的目录
        console.log('步骤2: 测试新标签打开当前目录');
        await agent.aiTap("当前窗口关闭按钮:x");
        
        // 进入桌面目录
        await agent.aiTap("文件管理器左侧导航栏的桌面");
        await agent.aiWaitFor("桌面目录加载完成");
        
        // 点击+按钮打开新标签
        await agent.aiTap("左上角+号");
        await agent.aiAssert("新标签页面显示为桌面目录");
        console.log('✅ 新标签页面显示为已打开的目录');
        
        // 关闭新标签，重新打开设置修改为计算机
        await agent.aiHover("当前标签页")
        await agent.aiTap("当前标签页的关闭按钮:x");
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        await agent.aiTap("新标签");
        
        // 步骤3: 下拉菜单选择"计算机"后，鼠标左键单击标签右方的"+"按钮
        console.log('步骤3: 测试新标签打开计算机');
        await agent.aiTap("从新标签打开右侧的下拉框");
        await agent.aiTap("下拉菜单中的计算机");
        await agent.aiAssert("从新标签打开右侧显示为：计算机");
        
        await agent.aiTap("当前窗口关闭按钮:x");
        await agent.aiTap("左上角+号");
        await agent.aiAssert("新标签页面显示为计算机");
        console.log('✅ 新标签页面显示为"计算机"');
        
        // 关闭新标签，重新打开设置修改为主目录
        await agent.aiHover("当前标签页")
        await agent.aiTap("当前标签页的关闭按钮:x");
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        await agent.aiTap("新标签");
        
        // 步骤4: 下拉菜单选择"主目录"后，鼠标左键单击标签右方的"+"按钮
        console.log('步骤4: 测试新标签打开主目录');
        await agent.aiTap("从新标签打开右侧的下拉框");
        await agent.aiTap("下拉菜单中的主目录");
        await agent.aiAssert("从新标签打开右侧显示为：主目录");
        
        await agent.aiTap("当前窗口关闭按钮:x");
        await agent.aiTap("左上角+号");
        await agent.aiAssert("新标签页面显示为主目录");
        console.log('✅ 新标签页面显示为"主目录"');
        
        // 关闭新标签，重新打开设置修改为桌面
        await agent.aiHover("当前标签页")
        await agent.aiTap("当前标签页的关闭按钮:x");
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        await agent.aiTap("新标签");
        
        // 步骤5: 下拉菜单选择"桌面"后，鼠标左键单击标签右方的"+"按钮
        console.log('步骤5: 测试新标签打开桌面');
        await agent.aiTap("从新标签打开右侧的下拉框");
        await agent.aiTap("下拉菜单中的桌面");
        await agent.aiAssert("从新标签打开右侧显示为：桌面");
        
        await agent.aiTap("当前窗口关闭按钮:x");
        await agent.aiTap("左上角+号");
        await agent.aiAssert("新标签页面显示为桌面");
        console.log('✅ 新标签页面显示为"桌面"');
        
        // 关闭新标签，重新打开设置修改为视频
        await agent.aiHover("当前标签页")
        await agent.aiTap("当前标签页的关闭按钮:x");
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        await agent.aiTap("新标签");
        
        // 步骤6: 下拉菜单选择"视频"后，鼠标左键单击标签右方的"+"按钮
        console.log('步骤6: 测试新标签打开视频');
        await agent.aiTap("从新标签打开右侧的下拉框");
        await agent.aiTap("下拉菜单中的视频");
        await agent.aiAssert("从新标签打开右侧显示为：视频");
        
        await agent.aiTap("当前窗口关闭按钮:x");
        await agent.aiTap("左上角+号");
        await agent.aiAssert("新标签页面显示为视频");
        console.log('✅ 新标签页面显示为"视频"');
        
        // 关闭新标签，重新打开设置修改为音乐
        await agent.aiHover("当前标签页")
        await agent.aiTap("当前标签页的关闭按钮:x");
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        await agent.aiTap("新标签");
        
        // 步骤7: 下拉菜单选择"音乐"后，鼠标左键单击标签右方的"+"按钮
        console.log('步骤7: 测试新标签打开音乐');
        await agent.aiTap("从新标签打开右侧的下拉框");
        await agent.aiTap("下拉菜单中的音乐");
        await agent.aiAssert("从新标签打开右侧显示为：音乐");
        
        await agent.aiTap("当前窗口关闭按钮:x");
        await agent.aiTap("左上角+号");
        await agent.aiAssert("新标签页面显示为音乐");
        console.log('✅ 新标签页面显示为"音乐"');
        
        // 关闭新标签，重新打开设置修改为图片
        await agent.aiHover("当前标签页")
        await agent.aiTap("当前标签页的关闭按钮:x");
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        await agent.aiTap("新标签");
        
        // 步骤8: 下拉菜单选择"图片"后，鼠标左键单击标签右方的"+"按钮
        console.log('步骤8: 测试新标签打开图片');
        await agent.aiTap("从新标签打开右侧的下拉框");
        await agent.aiTap("下拉菜单中的图片");
        await agent.aiAssert("从新标签打开右侧显示为：图片");
        
        await agent.aiTap("当前窗口关闭按钮:x");
        await agent.aiTap("左上角+号");
        await agent.aiAssert("新标签页面显示为图片");
        console.log('✅ 新标签页面显示为"图片"');
        
        // 关闭新标签，重新打开设置修改为文档
        await agent.aiHover("当前标签页")
        await agent.aiTap("当前标签页的关闭按钮:x");
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        await agent.aiTap("新标签");
        
        // 步骤9: 下拉菜单选择"文档"后，鼠标左键单击标签右方的"+"按钮
        console.log('步骤9: 测试新标签打开文档');
        await agent.aiTap("从新标签打开右侧的下拉框");
        await agent.aiTap("下拉菜单中的文档");
        await agent.aiAssert("从新标签打开右侧显示为：文档");
        
        await agent.aiTap("当前窗口关闭按钮:x");
        await agent.aiTap("左上角+号");
        await agent.aiAssert("新标签页面显示为文档");
        console.log('✅ 新标签页面显示为"文档"');
        
        // 关闭新标签，重新打开设置修改为下载
        await agent.aiHover("当前标签页")
        await agent.aiTap("当前标签页的关闭按钮:x");
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        await agent.aiTap("新标签");
        
        // 步骤10: 下拉菜单选择"下载"后，鼠标左键单击标签右方的"+"按钮
        console.log('步骤10: 测试新标签打开下载');
        await agent.aiTap("从新标签打开右侧的下拉框");
        await agent.aiTap("下拉菜单中的下载");
        await agent.aiAssert("从新标签打开右侧显示为：下载");
        
        await agent.aiTap("当前窗口关闭按钮:x");
        await agent.aiTap("左上角+号");
        await agent.aiAssert("新标签页面显示为下载");
        console.log('✅ 新标签页面显示为"下载"');
        
        console.log('✅ 1808595用例测试完成');

    }, { timeout: 1300000, tags: ["1808595", "level3", "menu", "DITT", "huangtian"] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');  
        await agent.aiTap("文件管理器窗口的主菜单");
        await agent.aiTap("设置");
        await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
        await agent.aiTap("文件粉碎");
        await agent.aiTap("恢复默认");
        await system.cleanupFileManager();
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await system.exec('killall dde-file-manager', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();
    });
});
