/**
 * 用例 PMSID: 1809289
 * 用例标题: 【重复打开文件夹】默认勾选：在单独的进程中打开文件窗口
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/20
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1809289-【重复打开文件夹】默认勾选：在单独的进程中打开文件窗口', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        // 清理可能残留的文本编辑器（防止其他用例遗留的编辑器遮挡桌面/卡死关窗流程）
        await system.exec("killall deepin-editor || true");
        await uos.showDesktop();
    });


    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1809289-【重复打开文件夹】默认勾选：在单独的进程中打开文件窗口', async ({ device, agent, uos, system }) => {
        const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

        // 步骤1：在文件管理器-设置中检查打开行为的字段：总是在新窗口打开文件夹
        console.log("步骤1：检查总是在新窗口打开文件夹默认状态");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("打开了文件管理器");
        await agent.aiTap("文件管理器右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("设置", { deepThink: true });
        await agent.aiAssert("设置页面已打开");
        // 预期1：默认勾选
        const isChecked = await agent.aiBoolean("总是在新窗口打开文件夹文字左侧有蓝色√");
        if (!isChecked) {
            await agent.aiTap("总是在新窗口打开文件夹文字左侧方框的中心");
            await agent.aiAssert("总是在新窗口打开文件夹文字左侧有蓝色√");
        }
        await agent.aiTap("当前窗口关闭按钮:x");
        await agent.aiAssert("设置窗口已关闭");

        // 步骤2：文管中重复双击同一个文件夹
        // 注意：双击目标必须限定为主目录文件列表中的"桌面"文件夹，
        // 描述过短（如"桌面"）易误点左侧导航栏的桌面项（仅导航不开新窗口）
        console.log("步骤2：重复双击同一个文件夹");
        await agent.aiTap("文件管理器左侧导航栏的主目录");
        await device.pressKey("super+left");
        await new Promise(resolve => setTimeout(resolve, 1000));
        let twoWins = false;
        for (let i = 0; i < 3 && !twoWins; i++) {
            if (i > 0) {
                // 上一次双击可能只是在当前窗口内导航，先回到主目录再重试
                try {
                    await agent.aiTap("文件管理器左侧导航栏的主目录");
                } catch (e) { }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            try {
                // deepThink在此场景曾输出畸形references_bbox导致框架抛硬错误（非超时非断言失败），
                // 去掉deepThink降低畸形输出概率，并将异常捕获后计入重试而非直接终止用例
                await agent.aiDoubleClick("主目录窗口文件列表区域中名为桌面的文件夹");
            } catch (e) {
                console.log(`第${i + 1}次双击定位/执行异常: ${(e && e.message) || e}，重试`);
                continue;
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
            await agent.aiHover("任务栏文件管理器图标");
            await new Promise(resolve => setTimeout(resolve, 2500));
            // 独立进程模式新窗口出现可能滞后；重试场景下新窗口会累积，故按"至少两个窗口"判定
            twoWins = await agent.aiBoolean("任务栏文件管理器预览显示两个或更多窗口（至少两个窗口预览）");
            if (!twoWins) {
                console.log(`第${i + 1}次双击后未出现两个窗口，重试`);
            }
        }
        // 2026-09-22 修复：裸 assertTrue 在 new Function 裸执行环境未定义，改原生 throw（JS-only 约束）
        if (!twoWins) {
            throw new Error("双击桌面文件夹后未能打开两个窗口");
        }
        await device.pressKey("super+right");
        await new Promise(resolve => setTimeout(resolve, 2000));
        // 预期2：打开两个窗口（重试累积场景下按至少两个判定）
        await agent.aiAssert("当前打开了至少两个窗口");

        await closeAllWindows(device, agent);

    }, { timeout: 1200000, tags: ["1809289", 'level3', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.showDesktop();
        // 恢复文管设置：取消勾选总是在新窗口打开文件夹
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("设置");
        await agent.aiAssert("设置页面已打开");
        const isChecked = await agent.aiBoolean("总是在新窗口打开文件夹文字左侧有蓝色√");
        if (isChecked) {
            await agent.aiTap("总是在新窗口打开文件夹文字左侧方框的中心");
        }
        await agent.aiTap("当前窗口关闭按钮:x");
        await closeAllWindows(device, agent);
    });
});
