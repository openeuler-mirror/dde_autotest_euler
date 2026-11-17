/**
 * 用例 PMSID: 2000317
 * 用例标题:【图片文本内容搜索】功能默认关闭
 * 生成时间: 2026-7-7 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('2000317-【图片文本内容搜索】功能默认关闭', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件，恢复文管默认设置');
        await uos.showDesktop();
    });

    beforeEach(async ({ uos, device, agent, system }) => {
        console.log('2. beforeEach: 每个测试用例执行前环境初始化');
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);

        //重置文件管理器配置
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("设置", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("默认目录");
        await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
        await agent.aiTap("恢复默认");
        await device.pressKey("Alt+F4");

    });

    test('2000317-【图片文本内容搜索】功能默认关闭', async ({ device, agent, uos }) => {
        await agent.aiWaitFor("桌面已显示");

        // 步骤1：打开文管设置->搜索，检查全文搜索下方的图片文本内容搜索选项默认状态
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("设置", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("高级设置");     
        // 预期1：默认不勾选图片文本内容搜索
        await agent.aiAssert("图片文本内容搜索复选框为未勾选状态");

        // 步骤2：勾选图片文本内容搜索
        await agent.aiTap("图片文本内容搜索左侧复选框的中心");
        await agent.aiAssert("图片文本内容搜索已勾选");
        // 预期2：索引更新完成提示出现

        // 循环轮询：每3s检查索引更新状态，出现完成提示则退出循环
        let indexLoop = true;
        while (indexLoop) {
            const isUpdateDone = await agent.aiBoolean("图片文本内容搜索复选框下方是否有索引更新完成提示文字");
            if (isUpdateDone) {
                console.log("索引更新完成");
                indexLoop = false; // 满足条件退出循环
            } else {
                console.log("图片文本内容搜索索引正在更新中");
                // 等待2秒后再次校验
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        await agent.aiAssert("图片文本内容搜索复选框下方有索引更新完成提示文字");

        // 步骤3：点击恢复默认按钮，校验选项变回不勾选
        await agent.aiTap("打开行为");
        await agent.aiTap("启动新窗口时显示");
        await agent.aiScroll('启动新窗口时显示', { direction: 'down', distance: 1000 });
        await agent.aiTap("恢复默认按钮");
        // 切回搜索分类重新校验状态
        await agent.aiTap("高级设置下方的搜索");
        // 预期3：恢复默认后图片文本内容搜索变回不勾选
        await agent.aiAssert("图片文本内容搜索为未勾选状态");

        // 关闭设置窗口
        await device.pressKey("Alt+F4");
        // 关闭文管窗口
        await device.pressKey("Alt+F4");

    }, { timeout: 1600000, tags: ["2000317", 'level3', '2500u1', 'image_content_search', 'DITT', 'lanyanling'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 单用例执行后临时清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 测试套件执行完毕，恢复环境、关闭进程');

        // 关闭文件管理器进程
        await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
});