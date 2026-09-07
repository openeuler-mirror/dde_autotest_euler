/**
 * 用例 PMSID: 1804863
 * 用例标题: [189]设置-默认高级设置
 * 生成时间: 2026-04-27
 * 用例编写人: UT000649（黄甜）
 */

describe('1804863-[189]设置-默认高级设置', () => {
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

    test('1804863-[189]设置-默认高级设置', async ({ device, agent, uos, env }) => {
        console.log('=== 开始测试：1804863-设置-默认高级设置 ===');

        // 步骤1: 打开文件管理器，进入设置，选择"恢复默认设置"
        console.log('步骤1: 打开文件管理器并进入设置');
        await uos.openApp("文件管理器", 3000, 20000, true);
        console.log('✅ 文件管理器已打开');
        
        // 打开设置菜单并恢复默认设置
        console.log('步骤1-2: 打开设置并恢复默认设置');
        await agent.aiTap("右上角有3条横线的图标");
        await agent.aiTap("下拉菜单中的设置");
        console.log('✅ 设置窗口已打开');
        
        // 恢复默认设置(需要滚动到页面底部)
        await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
        await agent.aiTap("文件粉碎");
        await agent.aiTap("恢复默认");
        console.log('✅ 已恢复默认设置');
        
        // 步骤2: 查看"预览"默认设置
        console.log('步骤3: 验证"预览"默认设置');
        await agent.aiTap("缩略图预览");
        
        // 验证预览默认值
        await agent.aiAssert("压缩文件预览文字左侧没有蓝色√（默认未勾选）");
        await agent.aiAssert("文本预览文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("文档预览文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("图片预览文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("视频预览文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("音乐预览文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("加载网络、手机、光盘目录的缩略图文字左侧没有蓝色√（默认未勾选）");
        console.log('✅ "预览"默认设置验证通过');
        
        // 步骤3: 查看"挂载"默认设置
        console.log('步骤4: 验证"挂载"默认设置');
        await agent.aiTap("挂载");
        
        // 验证挂载默认值
        await agent.aiAssert("自动挂载文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("自动挂载后打开文字左侧没有蓝色√（默认未勾选）");
        await agent.aiAssert("Samba共享端常驻显示挂载入口文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("合并显示Samba共享目录入口文字左侧有蓝色√（默认勾选）");
        console.log('✅ "挂载"默认设置验证通过');
        
        // 步骤4: 查看"对话框"默认设置
        console.log('步骤5: 验证"对话框"默认设置');
        await agent.aiTap("对话框");
        
        // 验证对话框默认值
        await agent.aiAssert("使用文件管理器的文件选择对话框文字左侧有蓝色√（默认勾选）");
        console.log('✅ "对话框"默认设置验证通过');
        
        // 步骤5: 查看"计算机显示项目"默认设置
        console.log('步骤6: 验证"计算机显示项目"默认设置');
        await agent.aiTap("计算机显示项目");
        
        // 验证其他默认值(计算机工作区隐藏内置磁盘)
        await agent.aiAssert("计算机工作区隐藏我的目录文字左侧没有蓝色√（默认未勾选）");
        await agent.aiAssert("计算机工作区隐藏内置磁盘文字左侧没有蓝色√（默认未勾选）");
        await agent.aiAssert("计算机工作区隐藏回环分区文字左侧有蓝色√（默认勾选）");
        await agent.aiAssert("计算机工作区隐藏第三方项文字左侧没有蓝色√（默认未勾选）");
        await agent.aiAssert("在磁盘图标上显示文件系统标签文字左侧没有蓝色√（默认未勾选）");
        console.log('✅ "其他"默认设置验证通过');
        
        console.log('✅ 1804863用例测试完成');

    }, { timeout: 600000, tags: ["1804863", "level3", "menu", "DITT","huangtian"] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await system.cleanupFileManager();
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await system.exec('killall dde-file-manager', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();
    });
});
