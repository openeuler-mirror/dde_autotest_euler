/**
 * 用例 PMSID: 1814379
 * 用例标题: 【本地磁盘】盘符信息-多窗口盘符文件系统标签展示
 * 生成时间: 2026-07-07 10:00:00
 * 用例编写人： UT000649（黄甜）
 */

describe('1814379-本地磁盘-盘符信息-多窗口盘符文件系统标签展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        await system.exec('killall dde-file-manager', 500);
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        console.log('=== 恢复文件管理器默认设置 ===');
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap('右上角有3条横线的图标',{deepThink:true});
        await agent.aiTap('下拉菜单中的设置');
        await agent.aiScroll('基础设置', { direction: 'down', distance: 100 });
        await agent.aiTap('文件粉碎');
        await agent.aiTap('恢复默认'); 
        await agent.aiTap("文件管理器设置窗口右上角的关闭按钮:X"); 
    });

    test('1814379-本地磁盘-盘符信息-多窗口盘符文件系统标签展示', async ({ device, agent, uos, system }) => {
        console.log('=== 开始测试：1814379 ===');

        console.log('步骤1：打开多个文管，停留在计算机界面，勾选"在磁盘图标上显示文件系统标签"');
        await device.pressKey('super','e');
        await device.pressKey('super','e');

        await agent.aiTap('右上角有3条横线的图标',{deepThink:true});
        await agent.aiTap('下拉菜单中的设置');
        await agent.aiTap('计算机显示项目');
        await agent.aiTap('勾选在磁盘图标上显示文件系统标签');
        await agent.aiTap('设置窗口右上角的关闭按钮:x');
        await agent.aiTap('文件管理器窗口右上角的关闭按钮:x');
        await agent.aiAssert('计算机界面分区盘符的ext4文件系统标识展示');
        console.log('文件系统标识展示');

        console.log('步骤2：打开多个文管，停留在计算机界面，取消勾选"在磁盘图标上显示文件系统标签"');
        await agent.aiTap('右上角有3条横线的图标',{deepThink:true});
        await agent.aiTap('下拉菜单中的设置');
        await agent.aiTap('计算机显示项目');
        await agent.aiTap('取消勾选在磁盘图标上显示文件系统标签');
        await agent.aiTap('设置窗口右上角的关闭按钮:x');
        await agent.aiTap('文件管理器窗口右上角的关闭按钮:x');
        await agent.aiAssert('计算机界面分区盘符的ext4文件系统标识消失');
        console.log('文件系统标识消失');

        console.log('✅ 1814379用例测试完成');
    }, { timeout: 1200000, tags: ["1814379", 'level3', 'LocalDisk', 'DITT', 'huangtian'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await agent.aiTap('右上角有3条横线的图标',{deepThink:true});
        await agent.aiTap('下拉菜单中的设置');
        await agent.aiScroll('基础设置', { direction: 'down', distance: 100 });
        await agent.aiTap('文件粉碎');
        await agent.aiTap('恢复默认'); 
        await agent.aiTap("文件管理器设置窗口右上角的关闭按钮:X"); 
        await agent.aiTap("文件管理器窗口右上角的关闭按钮:X"); 
        await system.exec('killall dde-file-manager', 500);
        await uos.showDesktop();
    });
});