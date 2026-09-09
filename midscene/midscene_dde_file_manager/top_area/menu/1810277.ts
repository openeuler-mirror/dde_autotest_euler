/**
 * 用例 PMSID: 1810277
 * 用例标题: 勾选【显示隐藏文件】-在U盘/硬盘/手机挂载目录内"."开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-01-29 19:49:39
 * 用例编写人：UT000686(李双双)
 */

describe('1810277-勾选【显示隐藏文件】-在U盘/硬盘/手机挂载目录内"."开头新建/重命名文件-不弹窗提示', () => {
    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        await system.exec('killall dde-file-manager', 500);
        // 前置条件：创建测试目录和文件
        const testDir = `/media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}`;
        // 创建181usbt和181usbf文件
        await system.exec(`rm -rf ${testDir}/181* ${testDir}/.up*`);
        await system.exec(`touch ${testDir}/181usb.txt`);
        await system.exec(`mkdir ${testDir}/181usbf`);
        
        // 启动DDE文件管理器应用
        
        await uos.openApp('文件管理器', 3000, 20000, true); 
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1810277-勾选【显示隐藏文件】-在U盘/硬盘/手机挂载目录内"."开头新建/重命名文件-不弹窗提示', async ({ device, agent, uos, system, env }) => {
        // 1. 启动器打开文件管理器，点击菜单设置显示隐藏文件
        await agent.aiTap('右上角主菜单')
        await agent.aiTap('设置', { deepThink: true })
        await agent.aiTap('文件和目录',{ deepThink: true })
        
        // 检查显示隐藏文件是否已经勾选，未勾选则点击
        let isChecked = false;
        try {
            await agent.aiAssert('显示隐藏文件前面的勾选框已勾选', { timeout: 1000 });
            isChecked = true;
            console.log('显示隐藏文件已勾选，跳过点击操作');
        } catch (error) {
            isChecked = false;
            console.log('显示隐藏文件未勾选，执行点击操作');
        }
        
        if (!isChecked) {
            await agent.aiTap('显示隐藏文件前面的勾选框')
        }
        
        await device.pressKey('esc')

        // 2. 点击名为"UOS"的磁盘
        await agent.aiDoubleClick(process.env.USB_FLASH);
        // 3. 右键181usbt，点击重命名为.update，断言重命名成功
        await agent.aiRightClick('181usb.txt', { deepThink: true });
        await agent.aiWaitFor('右键已弹出');
        await agent.aiTap('重命名', { deepThink: true });
        await device.typeText('.update');
        await device.pressKey('Enter');
        await agent.aiAssert('.update存在,无是否隐藏文件的弹框');

        // 4. 右键181usbf，点击重命名为.upf，断言重命名成功
        await agent.aiRightClick('181usbf', { deepThink: true });
         await agent.aiWaitFor('右键已弹出');
        await agent.aiTap('重命名', { deepThink: true });
        await device.typeText('.upf');
        await device.pressKey('Enter');
        await agent.aiAssert('.upf存在,无是否隐藏文件的弹框');
    }, { timeout: 600000, tags: ["1810277", "level3", "top_area", "menu", "DITT","lishuangshuang"] });
  
    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        
        // 恢复环境，点击"ctrl+h"
        // await device.pressKey('Ctrl+h');
        // 删除测试文件
        const testUsername = process.env.TEST_USERNAME;
        const testDir = `/media/${testUsername}/${process.env.USB_FLASH}`;
        await system.exec(`rm -rf ${testDir}/181* ${testDir}/.up*`);
        // 关闭文件管理器窗口
        await system.exec('killall dde-file-manager'); 
        await system.exec('rm -rf ~/.config/deepin/dde-file-manager.json')
    });
});



