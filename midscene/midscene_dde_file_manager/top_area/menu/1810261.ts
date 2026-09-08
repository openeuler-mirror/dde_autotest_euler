/**
 * 用例 PMSID: 1810261
 * 用例标题: 【菜单】勾选【显示隐藏文件】-在桌面/普通目录以"."开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-01-29 20:41:42
 * 用例编写人：UT000686(李双双)
 */

describe('1810261-【菜单】勾选【显示隐藏文件】-在桌面/普通目录以"."开头新建/重命名文件-不弹窗提示', () => {
    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        await system.exec(`rm -rf ~/Desktop/181* ~/Desktop/.261*`);
        
        // 创建181des.txt文件和181desf目录
        await system.exec(`touch ~/Desktop/181des.txt`);
        await system.exec(`mkdir ~/Desktop/181desf`);
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1810261-【菜单】勾选【显示隐藏文件】-在桌面/普通目录以"."开头新建/重命名文件-不弹窗提示', async ({ device, agent, uos, system, env }) => {
        await system.exec('killall dde-file-manager'); 
        await uos.openApp('文件管理器', 3000, 20000, true); 
        // 1. 启动器打开文件管理器，点击菜单设置显示隐藏文件
        await agent.aiTap('右上角主菜单')
        await agent.aiTap('设置', { deepThink: true })
        await agent.aiTap('文件和目录',{ deepThink: true })
        
        // 检查显示隐藏文件是否已经勾选，未勾选则点击
        let isChecked = false;
        try {
            // await agent.aiAssert('显示隐藏文件前面的勾选框已勾选', { timeout: 1000 });
            // isChecked = true;
            console.log('显示隐藏文件已勾选，跳过点击操作');
        } catch (error) {
            isChecked = false;
            console.log('显示隐藏文件未勾选，执行点击操作');
        }
        
        if (!isChecked) {
            await agent.aiTap('显示隐藏文件前面的勾选框')
        }
        await system.exec('killall dde-file-manager'); 
        await uos.showDesktop();

        // 2. 右键181des.txt，点击重命名为.261des，断言重命名成功
        await agent.aiRightClick('181des.txt', { deepThink: true });
        await agent.aiWaitFor('右键已弹出');
        await agent.aiTap('重命名', { deepThink: true });
        await device.typeText('.261des');
        await device.pressKey('Enter');
        await agent.aiAssert('.261des存在,无隐藏文件的弹框');

        // 3. 右键181desf，点击重命名为.261file，断言重命名成功
        await agent.aiRightClick('181desf', { deepThink: true });
        await agent.aiWaitFor('右键已弹出');
        await agent.aiTap('重命名', { deepThink: true });
        await device.typeText('.261file');
        await device.pressKey('Enter');
        await agent.aiAssert('.261file存在,无隐藏文件的弹框');
    }, { timeout: 600000, tags: ["1810261", "level3","top_area", "menu", "DITT", "lishuangshuang"] });
  
    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        
        // 删除测试文件
        await system.exec(`rm -rf ~/Desktop/181* ~/Desktop/.261*`);
        await system.exec('rm -rf ~/.config/deepin/dde-file-manager.json')
    });
});