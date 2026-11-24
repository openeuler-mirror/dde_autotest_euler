// @ts-nocheck

/**
 * 用例 PMSID: 1809563
 * 用例标题: 【桌面自动整理】快捷键缩放图标大小
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 桌面图标缩放级别：0（最小）~ 4（最大），由 dde-desktop.conf 的 IconLevel 记录
const MIN_ICON_LEVEL = 0;

const organizerCmd = (value) =>
    `dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v ${value}`;

describe('1809563-【桌面自动整理】快捷键缩放图标大小', () => {

    // 最小化遮挡桌面的窗口：桌面被 Chrome/WPS 等窗口覆盖时，Ctrl+滚轮/组合键会被这些窗口截获，
    // 桌面图标级别不会发生任何变化（实测 dde-desktop.conf 里连 iconLevel 键都不会生成）--UT005045(许琪)
    async function minimizeOccluders(system) {
        const res = await system.exec('wmctrl -lx', 10000);
        const lines = String(res?.stdout || '').split('\n').filter((item) => item.trim());
        let minimized = 0;
        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const id = parts[0];
            const wmClass = `${parts[2] || ''} ${parts[3] || ''}`;
            const title = parts.slice(4).join(' ').trim();
            // 跳过桌面与任务栏，其余窗口一律最小化
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

    async function openDesktopSettings(agent) {
        await agent.aiRightClick('桌面空白处');
        await agent.aiWaitFor('右键菜单已显示', { timeoutMs: 20000 });
        await agent.aiTap('右键菜单中的桌面设置');
        await agent.aiWaitFor('桌面设置窗口已打开', { timeoutMs: 20000 });
        await sleep(800);
    }

    async function closeDesktopSettings(device) {
        await device.pressKey('Alt+F4');
        await sleep(800);
    }

    // 读取桌面图标缩放级别（0~4），作为快捷键是否生效的客观依据
    // gsettings com.deepin.dde.desktop icon-zoom-level 恒为 100，与真实缩放无关；
    // 真实级别由 ddplugin_canvas（libdd-canvas-plugin.so）以 iconLevel 键写入 dde-desktop.conf，
    // 该键只在实际发生过缩放后才会生成，键名首字母为小写，匹配需忽略大小写 --UT005045(许琪)
    async function readIconLevel(system) {
        const home = TEST_HOME;
        const res = await system.exec(`grep -i '^iconLevel' '${home}/.config/deepin/dde-desktop/dde-desktop.conf'`, 10000);
        const match = String(res?.stdout || '').match(/iconLevel\s*=\s*(-?\d+)/i);
        return match ? parseInt(match[1], 10) : null;
    }

    // 点击桌面空白处，确保桌面窗口获得键盘焦点（快捷键/组合键需要焦点落在桌面）
    async function focusDesktop(agent) {
        await agent.aiTap('桌面空白处');
        await sleep(500);
    }

    // 轮询等待图标大小级别发生变化，未变化返回最后一次读取值
    // 缩放动画结束后配置文件才会写入新值，改为高频短间隔轮询（原 6×800ms，最快也要 800ms 才出结果）
    async function waitLevelChanged(system, before) {
        let level = before;
        for (let i = 0; i < 12; i++) {
            await sleep(300);
            level = await readIconLevel(system);
            if (level !== null && level !== before) {
                return level;
            }
        }
        return level;
    }

    // Ctrl+滚轮缩放：必须使用真实 X11 滚轮事件，框架 aiScroll 不改变桌面图标级别
    async function wheelZoom(system, direction, clicks) {
        const button = direction === 'up' ? 4 : 5;
        await system.exec(
            `xdotool mousemove 900 600 keydown ctrl click --repeat ${clicks} --delay 100 ${button} keyup ctrl`,
            40000
        );
        await sleep(1500);
    }

    // Ctrl+组合键：实测 Ctrl+等号（放大）、Ctrl+减号（缩小）生效，Ctrl+plus 无效
    async function keyZoom(system, key) {
        await system.exec(`xdotool key ctrl+${key}`, 15000);
        await sleep(1200);
    }

    // 把图标级别缩到最小，为放大操作留出可观测的变化空间
    async function shrinkToMin(system) {
        for (let i = 0; i < 10; i++) {
            const level = await readIconLevel(system);
            if (level === null) {
                break;
            }
            if (level <= MIN_ICON_LEVEL) {
                return level;
            }
            await keyZoom(system, 'minus');
        }
        await wheelZoom(system, 'down', 8);
        return await readIconLevel(system);
    }

    async function organizeDesktop(agent) {
        await agent.aiRightClick('桌面空白处');
        await agent.aiWaitFor('右键菜单已显示', { timeoutMs: 20000 });
        await agent.aiTap('右键菜单中的整理桌面');
        await agent.aiWaitFor('桌面右侧出现文件集合框', { timeoutMs: 30000 });
        await sleep(1500);
    }

    // 执行缩放动作并以图标大小级别校验是否放大；首次无变化时换一种触发方式重试
    async function verifyZoomIn(agent, system, action, retryAction, sceneName) {
        // 每个场景操作前重新清理遮挡窗口，保证按键/滚轮事件真正落到桌面
        await minimizeOccluders(system);
        await focusDesktop(agent);
        const base = await shrinkToMin(system);
        if (base === null) {
            const home = TEST_HOME;
            const iconConf = `'${home}/.config/deepin/dde-desktop/dde-desktop.conf'`;
            const dump = await system.exec(`grep -inE 'iconLevel' ${iconConf}; wc -l ${iconConf}`, 10000);
            console.log('诊断点: 图标级别读取失败，配置文件内容 =>', String(dump?.stdout || '').trim());
            throw new Error(`断言失败：${sceneName} 无法读取图标大小级别`);
        }
        console.log(`${sceneName}: 起始级别=${base}`);
        await action();
        let after = await waitLevelChanged(system, base);
        console.log(`${sceneName}: 放大后级别=${after}`);

        if (after === base && retryAction) {
            console.log(`${sceneName}: 首次未检测到放大效果，尝试备用触发方式`);
            await retryAction();
            after = await waitLevelChanged(system, base);
            console.log(`${sceneName}: 重试后级别=${after}`);
        }

        if (after === null || base === null) {
            throw new Error(`断言失败：${sceneName} 无法读取图标大小级别`);
        }
        if (after <= base) {
            throw new Error(`断言失败：${sceneName} 快捷键未放大图标（缩放前级别 ${base}，缩放后级别 ${after}）`);
        }

        // 只校验本用例文件图标的完整性，避免 AI 把相邻集合或其它区域的图标误判为遮挡
        try {
            await agent.aiAssert(
                '桌面上能看到名称为 1809563-1.txt、1809563-2.txt、1809563-3.txt 的文件图标，且这些图标及其文件名文字完整显示，没有被裁切或遮挡'
            );
        } catch (err) {
            throw new Error(`断言失败：${sceneName} 快捷键操作后 1809563 系列图标显示异常（${String(err?.message || err).split('\n')[0]}）`);
        }
        console.log(`✅ ${sceneName}: 快捷键放大图标生效`);
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
        try {
            await closeAllWindows(device, agent);
        } catch (err) {
            console.log('关闭残留窗口失败，忽略:', String(err?.message || err).split('\n')[0]);
        }
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/1809563*`, 5000);
        await system.exec(
            `touch ${DESKTOP}/1809563-1.txt && touch ${DESKTOP}/1809563-2.txt && touch ${DESKTOP}/1809563-3.txt`,
            10000
        );
        await sleep(1000);
    });

    test('1809563-【桌面自动整理】快捷键缩放图标大小', async ({ device, agent, uos, system }) => {
        console.log('===== 场景1: 未开启桌面整理，Ctrl+鼠标滚轮缩放桌面图标 =====');
        await system.exec(organizerCmd(0), 5000);
        await sleep(1000);
        await verifyZoomIn(
            agent,
            system,
            () => wheelZoom(system, 'up', 2),
            () => wheelZoom(system, 'up', 4),
            '场景1（未开启桌面整理+Ctrl+滚轮）'
        );

        console.log('===== 场景2: 未开启桌面整理，Ctrl+"+/-"缩放桌面图标 =====');
        await verifyZoomIn(
            agent,
            system,
            () => keyZoom(system, 'equal'),
            () => keyZoom(system, 'KP_Add'),
            '场景2（未开启桌面整理+Ctrl+加号）'
        );

        console.log('===== 场景3: 开启桌面整理，Ctrl+鼠标滚轮缩放桌面图标 =====');
        await system.exec(organizerCmd(1), 5000);
        await sleep(1000);
        await organizeDesktop(agent);
        await verifyZoomIn(
            agent,
            system,
            () => wheelZoom(system, 'up', 2),
            () => wheelZoom(system, 'up', 4),
            '场景3（开启桌面整理+Ctrl+滚轮）'
        );

        console.log('===== 场景4: 开启桌面整理，Ctrl+"+/-"缩放桌面图标 =====');
        await verifyZoomIn(
            agent,
            system,
            () => keyZoom(system, 'equal'),
            () => keyZoom(system, 'KP_Add'),
            '场景4（开启桌面整理+Ctrl+加号）'
        );

        console.log('===== 场景4补充: 开启桌面整理，Ctrl+减号缩小桌面图标 =====');
        await focusDesktop(agent);
        await wheelZoom(system, 'up', 6);
        const beforeMinus = await readIconLevel(system);
        console.log(`Ctrl+减号: 缩小前级别=${beforeMinus}`);
        if (beforeMinus === null) {
            throw new Error('断言失败：无法读取图标大小级别');
        }
        if (beforeMinus <= MIN_ICON_LEVEL) {
            throw new Error(`断言失败：无法将图标放大到可缩小的级别（当前级别 ${beforeMinus}）`);
        }
        await keyZoom(system, 'minus');
        const afterMinus = await waitLevelChanged(system, beforeMinus);
        console.log(`Ctrl+减号: 缩小后级别=${afterMinus}`);
        if (afterMinus === null || afterMinus >= beforeMinus) {
            throw new Error(`断言失败：Ctrl+减号未缩小图标（缩小前级别 ${beforeMinus}，缩小后级别 ${afterMinus}）`);
        }
        console.log('✅ Ctrl+减号缩小图标生效');

        console.log('✅ 测试用例执行完成');
    }, { timeout: 1800000, tags: ['1809563', 'level3', 'desktop_organization', 'xuqi'] });

    afterEach(async ({ device, uos, system }) => {
        console.log('3. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await sleep(500);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/1809563*`, 5000);
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('4. afterAll: 清理测试套件');
        await device.pressKey('Esc');
        await system.exec(organizerCmd(0), 5000);
        await system.exec(organizerCmd(1), 5000);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/1809563*`, 5000);
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
        await closeFileManager(system);
        await activateDesktop(device, system);
    });
});
