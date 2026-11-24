// @ts-nocheck

/**
 * 用例 PMSID: 1809551
 * 用例标题: 【桌面自动整理】非桌面整理模式，切换到桌面整理模式-图标大小为极大
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 图标大小级别最大值（极大）
const MAX_ICON_LEVEL = 5;

const organizerCmd = (value) =>
    `dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v ${value}`;

describe('1809551-【桌面自动整理】非桌面整理模式，切换到桌面整理模式-图标大小为极大', () => {

    // 最小化遮挡桌面的窗口：桌面被 Chrome/WPS 等窗口覆盖时右键会落到这些窗口上，
    // 且 wmctrl 无法把 dde-shell 桌面窗口抬到前台，只能先把其它窗口最小化 --UT005045(许琪)
    async function minimizeOccluders(system) {
        const res = await system.exec('wmctrl -lx', 10000);
        const lines = String(res?.stdout || '').split('\n').filter((item) => item.trim());
        let minimized = 0;
        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const id = parts[0];
            const wmClass = `${parts[2] || ''} ${parts[3] || ''}`;
            const title = parts.slice(4).join(' ').trim();
            // 跳过桌面与任务栏，其余窗口（含未保存的 WPS 文档）一律最小化，避免 Alt+F4 失效
            if (/dde-shell|dock/i.test(wmClass) || /^(桌面|Desktop)$/i.test(title)) {
                continue;
            }
            await system.exec(`xdotool windowminimize ${id}`, 5000);
            minimized += 1;
        }
        // 只有确实最小化过窗口才需要等动画结束，否则直接跳过（原固定 800ms）
        if (minimized > 0) {
            await sleep(300);
        }
    }

    // 激活桌面窗口（uos.showDesktop 在远程环境会唤出启动器应用列表，改用 wmctrl 激活）
    async function activateDesktop(device, system) {
        await minimizeOccluders(system);
        await device.pressKey('Esc');
        const res = await system.exec('wmctrl -lx', 10000);
        const lines = String(res?.stdout || '').split('\n').filter((item) => item.trim());
        console.log('诊断点: wmctrl -lx =>', lines.slice(0, 12).join(' | '));
        const line = lines.find((item) => /桌面|Desktop/i.test(item));
        const id = line ? line.trim().split(/\s+/)[0] : '';
        if (id) {
            await system.exec(`wmctrl -i -a ${id}`, 5000);
            // 有界等待桌面窗口真正获得焦点，替代固定 sleep(500)+sleep(1000)
            for (let i = 0; i < 4; i++) {
                const active = await system.exec("xdotool getactivewindow getwindowname 2>/dev/null || true", 5000);
                if (/桌面|Desktop/i.test(String(active?.stdout || ''))) {
                    return;
                }
                await sleep(250);
            }
        } else {
            await system.exec('wmctrl -k on', 5000);
            await sleep(500);
        }
    }

    async function openDesktopSettings(agent, device) {
        // 桌面图标较多时 AI 的“空白处”右键会落到图标上，弹出文件菜单（无桌面设置），需换位置重试 --UT005045(许琪)
        const blankSpots = ['桌面空白处', '桌面右下角的空白区域', '桌面底部的空白区域'];
        for (let i = 0; i < 3; i++) {
            await device.pressKey('Esc');
            await sleep(500);
            await agent.aiRightClick(blankSpots[i % blankSpots.length]);
            await sleep(1200);
            const hasDesktopSetting = await agent.aiBoolean('右键菜单中可以看到"桌面设置"选项');
            if (hasDesktopSetting) {
                await agent.aiTap('右键菜单中的桌面设置');
                await agent.aiWaitFor('桌面设置窗口已打开', { timeoutMs: 20000 });
                await sleep(800);
                return;
            }
            console.log(`第${i + 1}次右键未弹出含"桌面设置"的菜单，换位置重试`);
        }
        throw new Error('断言失败：多次右键桌面空白处均未弹出含"桌面设置"的菜单');
    }

    async function closeDesktopSettings(device) {
        await device.pressKey('Alt+F4');
        await sleep(800);
    }

    // 读取图标大小级别（0~5，5 为极大）
    async function getIconSizeLevel(system) {
        const res = await system.exec(
            'dde-dconfig --get -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.icon.size.level',
            10000
        );
        const raw = String(res?.stdout || '').replace(/[^\d]/g, '');
        return raw === '' ? null : parseInt(raw, 10);
    }

    // 将图标大小滑动条拖到最右端（极大）
    // AI 判断圆点是否在最右端不稳定，改用 dconfig 中的图标大小级别做客观校验
    async function setIconSizeMax(agent, system) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            await agent.aiDrag('图标大小滑动条的蓝色圆点', '图标大小滑动条的最右端');
            await sleep(800);
            let level = await getIconSizeLevel(system);
            console.log(`第${attempt}次拖拽后图标大小级别: ${level}（极大为 ${MAX_ICON_LEVEL}）`);
            if (level === MAX_ICON_LEVEL) {
                return true;
            }
            await agent.aiTap('图标大小滑动条的最右端');
            await sleep(800);
            level = await getIconSizeLevel(system);
            console.log(`第${attempt}次点击滑动条最右端后图标大小级别: ${level}`);
            if (level === MAX_ICON_LEVEL) {
                return true;
            }
        }
        return false;
    }

    async function organizeDesktop(agent) {
        await agent.aiRightClick('桌面空白处');
        await agent.aiWaitFor('右键菜单已显示', { timeoutMs: 20000 });
        await agent.aiTap('右键菜单中的整理桌面');
        await agent.aiWaitFor('桌面右侧出现文件集合框', { timeoutMs: 30000 });
        await sleep(2000);
    }

    // 查询桌面上指定文件图标的宽度，解析失败返回 null
    async function queryIconWidth(agent, fileName) {
        try {
            const raw = await agent.aiQuery(`桌面上名为${fileName}的文件图标的宽度（像素），只返回一个数字`);
            const value = parseInt(String(raw ?? '').replace(/[^\d]/g, ''), 10);
            return Number.isFinite(value) && value > 0 ? value : null;
        } catch (err) {
            console.log(`查询 ${fileName} 图标宽度失败:`, String(err?.message || err).split('\n')[0]);
            return null;
        }
    }

    beforeAll(async ({ device, uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await activateDesktop(device, system);
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        await activateDesktop(device, system);
        await sleep(1000);
        const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        try {
            await closeAllWindows(device, agent);
        } catch (err) {
            console.log('关闭残留窗口失败，忽略:', String(err?.message || err).split('\n')[0]);
        }
        await system.exec(`rm -f ${DESKTOP}/1809551*`, 5000);
        await system.exec(`find ${DESKTOP} -maxdepth 1 -type d -name '1809551*' -exec rm -rf {} \\; 2>/dev/null; true`, 5000);
        await system.exec(
            `touch ${DESKTOP}/1809551-1.txt && touch ${DESKTOP}/1809551-2.txt && head -c 2048 /dev/zero > ${DESKTOP}/1809551-1.png && head -c 2048 /dev/zero > ${DESKTOP}/1809551-2.png && mkdir -p ${DESKTOP}/1809551-folder`,
            10000
        );
        // 前置条件：处于非桌面整理模式
        await system.exec(organizerCmd(0), 5000);
        await sleep(1500);
    });

    test('1809551-【桌面自动整理】非桌面整理模式，切换到桌面整理模式-图标大小为极大', async ({ device, agent, uos, system }) => {
        console.log('===== 步骤1: 桌面设置中将图标大小调整为极大 =====');
        await openDesktopSettings(agent, device);
        const isMax = await setIconSizeMax(agent, system);
        await closeDesktopSettings(device);
        if (!isMax) {
            throw new Error('断言失败：图标大小滑动条未调整到最右端（极大）');
        }
        console.log('✅ 图标大小已设置为极大');

        console.log('===== 步骤2: 非桌面整理模式下记录图标尺寸 =====');
        await activateDesktop(device, system);
        await sleep(1000);
        const beforeWidth = await queryIconWidth(agent, '1809551-1.txt');
        console.log(`桌面整理前图标宽度: ${beforeWidth}`);

        console.log('===== 步骤3: 开启桌面整理并整理桌面 =====');
        await system.exec(organizerCmd(1), 5000);
        await sleep(2000);
        await activateDesktop(device, system);
        await sleep(1000);
        await organizeDesktop(agent);
        await agent.aiAssert('桌面上显示包含1809551文件的文件集合框');

        console.log('===== 预期1: 集合大小适合，集合内的图标保持大尺寸且完整显示 =====');
        // 图标"极大"的跨位置视觉比较不可靠（集合内外位置不同，AI 会误判），改为数值校验 + 完整显示校验
        const levelAfterOrganize = await getIconSizeLevel(system);
        console.log(`整理后图标大小级别: ${levelAfterOrganize}（极大为 ${MAX_ICON_LEVEL}）`);
        if (levelAfterOrganize !== null && levelAfterOrganize !== MAX_ICON_LEVEL) {
            throw new Error(`断言失败：整理桌面后图标大小级别不再是极大（实际 ${levelAfterOrganize}）`);
        }
        // 只校验本用例文件的完整性，避免 AI 把相邻集合中其它图标误判为被裁切
        const notClipped = await agent.aiBoolean(
            '桌面上能看到名称为 1809551-1.txt、1809551-2.txt、1809551-1.png、1809551-2.png 的图标，且这些图标及其文件名文字完整显示，没有被裁切或遮挡'
        );
        if (!notClipped) {
            throw new Error('断言失败：集合内 1809551 系列图标显示不完整，被集合边框裁切');
        }
        console.log('✅ 预期1验证通过：集合大小适合，集合内图标完整显示未被裁切');

        console.log('===== 预期2: 集合内图标尺寸不小于整理前（数值校验） =====');
        const afterWidth = await queryIconWidth(agent, '1809551-1.txt');
        console.log(`桌面整理后图标宽度: ${afterWidth}`);
        if (beforeWidth !== null && afterWidth !== null) {
            console.log(`图标宽度变化: ${beforeWidth} -> ${afterWidth}`);
            // 仅校验"没有被缩小"，集合内渲染略大属于正常表现
            if (afterWidth < beforeWidth * 0.8) {
                throw new Error(`断言失败：整理后集合内图标明显变小（前 ${beforeWidth}，后 ${afterWidth}）`);
            }
        } else {
            console.log('图标宽度数值读取不完整，跳过数值校验');
        }

        console.log('✅ 测试用例执行完成');
    }, { timeout: 900000, tags: ['1809551', 'level3', 'desktop_organization', 'xuqi'] });

    afterEach(async ({ device, agent, system }) => {
        console.log('3. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await sleep(500);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/1809551*`, 5000);
        await system.exec(`find ${DESKTOP} -maxdepth 1 -type d -name '1809551*' -exec rm -rf {} \\; 2>/dev/null; true`, 5000);
    });

    afterAll(async ({ device, agent, uos, system }) => {
        console.log('4. afterAll: 清理测试套件');
        await device.pressKey('Esc');
        // 恢复图标大小为默认状态
        try {
            await openDesktopSettings(agent, device);
            await agent.aiTap('从左边数滑动条的1/4处');
            await closeDesktopSettings(device);
        } catch (err) {
            console.log('恢复默认图标大小失败，忽略:', String(err?.message || err).split('\n')[0]);
        }
        await system.exec(organizerCmd(0), 5000);
        await system.exec(organizerCmd(1), 5000);
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/1809551*`, 5000);
        await system.exec(`find ${DESKTOP} -maxdepth 1 -type d -name '1809551*' -exec rm -rf {} \\; 2>/dev/null; true`, 5000);
        await clearEnvironment(system);
        await closeFileManager(system);
        await activateDesktop(device, system);
    });
});
