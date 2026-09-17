/**
 * 用例 PMSID: 1808603
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-快捷访问
 * 生成时间: 2026-04-27
 * 用例编写人: UT000649（黄甜）
 */

describe('1808603-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-快捷访问', () => {
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

    test('1808603-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-快捷访问', async ({ device, agent, uos, env }) => {
        console.log('=== 开始测试：1808603-侧边栏显示项目-快捷访问 ===');

        // 步骤1: 打开文件管理器并进入设置，验证侧边栏显示项目默认值
        console.log('步骤1: 打开文件管理器并进入设置');
        await uos.openApp("文件管理器", 3000, 20000, true);
        console.log('✅ 文件管理器已打开');
        
        // 打开设置菜单
        console.log('步骤1-2: 打开设置菜单');
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        console.log('✅ 设置窗口已打开');
        
        // 进入侧边栏显示项目设置
        console.log('步骤1-3: 进入侧边栏显示项目设置');
        await agent.aiTap("侧边栏显示项目");
        
        // 验证默认值：全部为勾选
        await agent.aiAssert("最近使用文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("主目录文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("桌面文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("视频文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("音乐文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("图片文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("文档文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("下载文字左侧有蓝色√（默认勾选）");

        await agent.aiAssert("回收站文字左侧有蓝色√（默认勾选）");
        console.log('✅ 侧边栏显示项目默认值验证通过：全部勾选');
        
        // 步骤2: 取消勾选"最近使用"后，检查文管侧边栏是否显示
        console.log('步骤2: 取消勾选"最近使用"');
        await agent.aiTap("最近使用文字左侧方框");
        await agent.aiAssert("最近使用文字左侧没有蓝色√");
        await agent.aiAssert("文件管理器窗口侧边栏不显示最近使用");
        console.log('✅ 侧边栏"最近使用"已隐藏');
        
        
        // 步骤3: 取消勾选"主目录"后，检查文管侧边栏是否显示
        console.log('步骤3: 取消勾选"主目录"');
        await agent.aiTap("主目录文字左侧方框");
        await agent.aiAssert("主目录文字左侧没有蓝色√");
        await agent.aiAssert("文件管理器窗口侧边栏不显示主目录");
        console.log('✅ 侧边栏"主目录"已隐藏');
        
        // 步骤4: 取消勾选"桌面"后，检查文管侧边栏是否显示
        console.log('步骤4: 取消勾选"桌面"');
        await agent.aiTap("桌面文字左侧方框");
        await agent.aiAssert("桌面文字左侧没有蓝色√");
        await agent.aiAssert("文件管理器窗口侧边栏不显示桌面");
        console.log('✅ 侧边栏"桌面"已隐藏');
        
        // 步骤5: 取消勾选"视频"后，检查文管侧边栏是否显示
        console.log('步骤5: 取消勾选"视频"');
        await agent.aiTap("视频文字左侧方框");
        await agent.aiAssert("视频文字左侧没有蓝色√");
        await agent.aiAssert("文件管理器窗口侧边栏不显示视频");
        console.log('✅ 侧边栏"视频"已隐藏');
        
        // 步骤6: 取消勾选"音乐"后，检查文管侧边栏是否显示
        console.log('步骤6: 取消勾选"音乐"');
        await agent.aiTap("音乐文字左侧方框");
        await agent.aiAssert("音乐文字左侧没有蓝色√");
        await agent.aiAssert("文件管理器窗口侧边栏不显示音乐");
        console.log('✅ 侧边栏"音乐"已隐藏');

        // 步骤7: 取消勾选"图片"后，检查文管侧边栏是否显示
        console.log('步骤7: 取消勾选"图片"');
        await agent.aiTap("图片文字左侧方框");
        await agent.aiAssert("图片文字左侧没有蓝色√");
        await agent.aiAssert("文件管理器窗口侧边栏不显示图片");
        console.log('✅ 侧边栏"图片"已隐藏');
        
        // 步骤8: 取消勾选"文档"后，检查文管侧边栏是否显示
        console.log('步骤8: 取消勾选"文档"');
        await agent.aiTap("文档文字左侧方框");
        await agent.aiAssert("文档文字左侧没有蓝色√");
        await agent.aiAssert("文件管理器窗口侧边栏不显示文档");
        console.log('✅ 侧边栏"文档"已隐藏');
        
        // 步骤9: 取消勾选"下载"后，检查文管侧边栏是否显示
        console.log('步骤9: 取消勾选"下载"');
        await agent.aiTap("下载文字左侧方框");
        await agent.aiAssert("下载文字左侧没有蓝色√");
        await agent.aiAssert("文件管理器窗口侧边栏不显示下载");
        console.log('✅ 侧边栏"下载"已隐藏');
        
        // 步骤10: 取消勾选"回收站"后，检查文管侧边栏是否显示
        console.log('步骤10: 取消勾选"回收站"');
        await agent.aiTap("回收站文字左侧方框");
        await agent.aiAssert("回收站文字左侧没有蓝色√");
        await agent.aiAssert("侧边栏不显示回收站");
        console.log('✅ 侧边栏"回收站"已隐藏');
        
        console.log('✅ 1808603用例测试完成');

    }, { timeout: 600000, tags: ["1808603", "level3", "menu", "DITT", "huangtian"] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
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
