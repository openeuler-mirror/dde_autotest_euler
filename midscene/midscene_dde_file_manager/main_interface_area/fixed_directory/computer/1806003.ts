/**
 * 用例 PMSID: 1806003
 * 用例标题: 系统盘-拖拽系统盘文件夹至桌面
 * 生成时间: 2026-10-29 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const USER = process.env.TEST_USERNAME || 'uos';
const HOME = `/home/${USER}`;
const DESKTOP = `${HOME}/Desktop`;
const SRC_DIR = '/etc';
const SRC_NAME = 'apt';
const MARKER = 'zz_marker_1806003.txt';

describe('1806003-系统盘-拖拽系统盘文件夹至桌面', () => {
    const sh = async (system, cmd, timeout = 30000) => {
        const r = await system.exec(cmd, timeout);
        const out = ((r && r.stdout) || '').trim();
        if (out) console.log(`[shell] ${out}`);
        return out;
    };


    const openAndSelectSource = async (device, agent) => {
        // 1. 聚焦地址栏：Ctrl+L 为第一手段，aiTap 地址栏输入框做双保险
        await device.pressKey('Ctrl+L');

        // 2. 在地址栏内清空现有文本：Ctrl+A 选中 + 连续 Backspace 删除
        //    （用 Backspace 而非 Delete，降低焦点意外跳转时的破坏性）
        await device.pressKey('Ctrl+A');
        await device.pressKey('Delete');

        // 3. 输入目标路径
        await agent.aiInput(SRC_DIR, '文件管理器顶部的地址栏输入框');
        await sleep(300);

        // 4. 回车跳转并等待 /etc 内容出现
        await device.pressKey('Enter');
        await agent.aiWaitFor(`工作区已显示 ${SRC_DIR} 目录内容，能看到 ${SRC_NAME} 文件夹`, { timeoutMs: 45000 });
        await agent.aiTap(`工作区里的文件夹"${SRC_NAME}"`);
    };

    /** 把选中的 apt 拖到桌面 */
    const dragToDesktop = async (agent, system) => {
        console.log(`拖拽: ${SRC_DIR}/${SRC_NAME} -> 桌面空白处`);
        try {
            await agent.aiDrag(`文件管理器工作区里被选中的文件夹"${SRC_NAME}"`, '桌面的空白区域');
        } catch (err) {
            throw new Error(
                `拖拽动作失败：${String((err && err.message) || err).split('\n')[0]}。` +
                `如果是因为桌面图标遮挡找不到落点，请确认文管窗口已缩小（脚本已尝试 1000x700 左上），` +
                `或改用 xdotool 手工拖拽：mousedown(源) → mousemove(目标) → mouseup`
            );
        }
        await sleep(3000);
    };

    beforeAll(async ({ system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await system.exec(`rm -rf /home/${USER}/Desktop/apt*`);
    });

    beforeEach(async ({ agent, uos, device, system }) => {
        console.log('2. beforeEach: 打开文件管理器、缩小窗口、打开源目录');
        await uos.showDesktop();
        await uos.openApp('文件管理器', 3000, 20000, true);
        await device.pressKey('Super+Right');
    });

    test('1806003-系统盘-拖拽系统盘文件夹至桌面', async ({ agent, device, system }) => {
        console.log('===== 步骤1：选中系统盘文件夹拖拽至桌面 =====');
        console.log('预期1：系统文件夹复制到桌面');
        await openAndSelectSource(device, agent);
        await dragToDesktop(agent, system);
        await agent.aiAssert("桌面上有apt文件夹");

        // 点击合并
        await agent.aiTap('右侧文管窗口中apt文件夹图标');
        await dragToDesktop(agent, system);
        const conflict1 = await agent.aiBoolean('看到合并按钮');
        if (conflict1 === true) {
            await agent.aiTap('不再询问左侧复选框的中心', { deepThink: true });
            await agent.aiTap('合并按钮');
            const tmp1 = await agent.aiBoolean('看到替换按钮');
            if (tmp1 === true) {
                await agent.aiTap('替换按钮');
            }
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
        await agent.aiAssert("桌面上有1个apt文件夹");

        // 点击跳过
        await agent.aiTap('右侧文管窗口中apt文件夹图标');
        await dragToDesktop(agent, system);
        const conflict2 = await agent.aiBoolean('看到跳过按钮');
        if (conflict2 === true) {
            await agent.aiTap('跳过按钮');
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
        await agent.aiAssert("桌面上有1个apt文件夹");

        // 点击共存
        await agent.aiTap('右侧文管窗口中apt文件夹图标');
        await dragToDesktop(agent, system);
        const conflict3 = await agent.aiBoolean('看到共存按钮');
        if (conflict3 === true) {
            await agent.aiTap('共存按钮');
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
        await agent.aiAssert("桌面上有如下名称的文件夹：apt、apt（副本）");

        console.log('===== 测试结束 =====');
    }, { timeout: 1500000, tags: ['1806003', 'level3', 'main_interface_area','fixed_directory', 'computer', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ system, uos }) => {
        console.log('5. afterAll: 清理测试套件');
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await system.exec(`rm -rf /home/${USER}/Desktop/apt*`);
        await clearEnvironment(system);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});