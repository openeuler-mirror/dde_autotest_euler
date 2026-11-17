/**
 * 用例 PMSID: 1994795
 * 用例标题:  【文件索引配置】搜索隐藏文件
 * 生成时间: 2026-7-7 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe('1994795-【文件索引配置】搜索隐藏文件', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件，显示桌面');
        await uos.showDesktop();
    });
    beforeEach(async ({ uos, device, agent, system }) => {
        console.log('2. beforeEach: 每个测试用例执行前环境初始化');
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9");        
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
        // 前置2：桌面上创建隐藏文件.1994795-hidden-file.txt
        await system.exec(`touch /home/${userName}/Desktop/.1994795-hidden-file.txt`);

    });
    test('1994795-【文件索引配置】搜索隐藏文件', async ({ device, agent, uos, system }) => {
        //重置文件管理器配置
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("设置");
        await agent.aiTap("默认目录");
        await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
        await agent.aiTap("恢复默认");

        // 前置1：打开文管设置->搜索，确保文件索引已勾选
        await agent.aiTap("高级设置下方的搜索");
        const fileIndexChecked = await agent.aiBoolean("文件索引复选框是否为勾选状态");
        if (!fileIndexChecked) {
            await agent.aiTap("文件索引左侧复选框的中心");
            console.log("前置1：已勾选文件索引");
        } else {
            console.log("前置1：文件索引已处于勾选状态");
            await agent.aiTap("文件索引左侧复选框的中心");
            await agent.aiTap("确认", { deepThink: true });
            await agent.aiTap("文件索引左侧复选框的中心");
        }
        // 前置3：文管设置勾选显示隐藏文件
        await agent.aiTap("侧边栏显示项目");
        await agent.aiScroll('侧边栏显示项目', { direction: 'up', distance: 10 });
        await agent.aiTap("文件和目录");
        const showHiddenChecked = await agent.aiBoolean("显示隐藏文件复选框是否为勾选状态");
        if (!showHiddenChecked) {
            await agent.aiTap("显示隐藏文件左侧复选框的中心");
            console.log("前置3：已勾选显示隐藏文件");
        } else {
            console.log("前置3：显示隐藏文件已处于勾选状态");
        }
        await device.pressKey("Alt+F4");

        // 步骤1：在文管搜索框输入.1994795-hidden-file
        await agent.aiTap("文件管理器左侧栏的桌面");
        await agent.aiTap("文件管理器右上角的搜索输入框");
        await device.typeText(".1994795-hidden-file");

        // 步骤2：查看搜索结果
        let searchLoop = true;
        let pollCount = 0;
        const maxPollTimes = 150; 
        while (searchLoop && pollCount < maxPollTimes) {
            pollCount++;
            const hasTargetFile = await agent.aiBoolean("搜索结果列表中是否存在.1994795-hidden-file.txt文件");
            if (hasTargetFile) {
                console.log(`搜索成功，找到目标隐藏文件，轮询次数：${pollCount}`);
                searchLoop = false;
            } else {
                console.log(`暂未检索到目标隐藏文件，第${pollCount}次轮询，2s后重试`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        // 超时抛出异常阻断用例
        if (pollCount >= maxPollTimes) {
            throw new Error(`搜索超时，已轮询${maxPollTimes}次共计300秒，未找到.1994795-hidden-file.txt`);
        }
        // 预期结果2：能搜索到.1994795-hidden-file隐藏文件
        await agent.aiAssert("搜索结果列表中存在.1994795-hidden-file.txt隐藏文件");

    }, { timeout: 1600000, tags: ["1994795", 'level3', '2500u1', 'file_index_configuration', 'DITT', 'lanyanling'] });
    afterEach(async ({ device }) => {
        console.log('4. afterEach: 单用例执行后临时清理');
    });
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 测试套件执行完毕，清理测试文件、关闭进程');

        //恢复默认设置
        await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("设置");
        await agent.aiTap("默认目录");
        await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
        await agent.aiTap("恢复默认");
        await device.pressKey("Alt+F4");
        await device.pressKey("Alt+F4");
        // 删除桌面创建的隐藏测试文件
        await system.exec(`rm -f /home/${userName}/Desktop/.1994795-hidden-file.txt`);
        // 关闭文件管理器进程
        await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
});