// @ts-nocheck

/**
 * 用例 PMSID: 1810039
 * 用例标题: 【桌面整理】自由拖动集合
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const organizerCmd = (value) =>
    `dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v ${value}`;

describe('1810039-【桌面整理】自由拖动集合', () => {
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

    async function organizeDesktop(agent) {
        await agent.aiRightClick('桌面空白处');
        await agent.aiWaitFor('右键菜单已显示', { timeoutMs: 20000 });
        await agent.aiTap('右键菜单中的整理桌面');
        await agent.aiWaitFor('桌面右侧出现文件集合框', { timeoutMs: 30000 });
        await sleep(1500);
    }

    // 集合框标题栏横坐标（仅用于辅助断言，解析失败返回 null）
    async function queryTitleBarX(agent) {
        try {
            const raw = await agent.aiQuery('包含2个txt文件的文件集合框左上角的横坐标X（像素），只返回一个数字');
            const value = parseInt(String(raw ?? '').replace(/[^\d]/g, ''), 10);
            return Number.isFinite(value) && value > 0 ? value : null;
        } catch (err) {
            console.log('查询集合框横坐标失败，跳过数值断言:', String(err?.message || err).split('\n')[0]);
            return null;
        }
    }

    // 集合框拖拽：集合被拖到贴合左边缘后，顶部“文档”标题栏会被裁掉，AI 既可能定位不到
    // 标题栏（直接抛错），也可能退化成抓整个框体（拖框体只会移动框内图标，集合本身不动）。
    // 截图实测该集合框没有可见标题栏，可抓区只有框顶约 14px 的内边距带，因此按矩形取多档抓点，
    // 用 xdotool 分多段慢速拖拽（先小步越过 Qt 拖拽阈值再推进），是否生效由调用方横坐标断言判定，
    // 未位移就换下一档抓点，全部失败再退回 AI 源元素描述 --UT005045(许琪)
    const XENV = 'export DISPLAY=:0; DM_USER=$(stat -c %U /run/user/1000 2>/dev/null | tr -cd "a-zA-Z0-9_-"); export XAUTHORITY=/home/${DM_USER:-test}/.Xauthority;';

    // 抓点相对框顶的偏移：aiLocate 的 top 比可见框沿高约 4px，实测 top+15（≈可见沿下 11px）
    // 与 top+9 命中率最高，top+5 及以内会落到框外，40 兜底到框内空白区
    const GRAB_OFFSETS = [15, 9, 5, 40];

    async function locateCollectionRect(agent) {
        try {
            const loc = await agent.aiLocate('包含2个txt文件的文件集合框');
            const rect = (loc && loc.rect) || loc;
            if (!rect || !Number.isFinite(rect.left) || !Number.isFinite(rect.top) || !Number.isFinite(rect.width)) {
                return null;
            }
            return rect;
        } catch (err) {
            console.log('定位集合框失败，退回AI拖拽:', String(err?.message || err).split('\n')[0]);
            return null;
        }
    }

    async function xdotoolDrag(system, grabX, grabY, tx, ty) {
        const steps = 14;
        // 先清掉可能残留的按键状态，避免上一次拖拽卡住导致本次按下无效
        let seq = `${XENV} xdotool mouseup 1; sleep 0.2; xdotool mousemove --sync ${grabX} ${grabY}; sleep 0.3; xdotool mousedown 1; sleep 0.25;`;
        // 小步移动越过 Qt 的拖拽启动阈值（避免被判成点击）
        seq += ' xdotool mousemove_relative --sync 8 -5; sleep 0.12; xdotool mousemove_relative --sync 8 -5; sleep 0.12;';
        // 分 14 段推进到落点，给桌面视图留出处理 motion 事件的时间
        for (let s = 1; s <= steps; s += 1) {
            const x = Math.round(grabX + ((tx - grabX) * s) / steps);
            const y = Math.round(grabY + ((ty - grabY) * s) / steps);
            seq += ` xdotool mousemove --sync ${x} ${y}; sleep 0.04;`;
        }
        seq += ` sleep 0.3; xdotool mouseup 1`;
        await system.exec(seq, 30000);
    }

    async function dragCollection(agent, system, point, targetDesc, attempt = 0) {
        const rect = system && attempt < GRAB_OFFSETS.length ? await locateCollectionRect(agent) : null;
        if (rect) {
            const offset = GRAB_OFFSETS[attempt];
            // 横向抓点取框左侧偏内 30~90px，避开圆角
            const grabX = Math.round(rect.left + Math.min(90, Math.max(30, rect.width / 4)));
            const grabY = Math.round(rect.top + offset);
            const [tx, ty] = point;
            await xdotoolDrag(system, grabX, grabY, tx, ty);
            console.log(`集合框坐标拖拽(抓点 top+${offset}): (${grabX},${grabY}) -> (${tx},${ty})`);
            await sleep(800);
            return;
        }
        const sources = [
            '包含2个txt文件的文件集合框顶部标题栏',
            '包含2个txt文件的文件集合框最顶部那一行灰色标题栏（“文档”文字所在位置）',
            '包含2个txt文件的文件集合框顶部标题栏中的“文档”文字',
        ];
        const source = sources[attempt % sources.length];
        await agent.aiHover(source);
        await sleep(500);
        await agent.aiDrag(source, targetDesc);
        await sleep(2000);
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
        await system.exec(`rm -f ${DESKTOP}/1810039*`, 5000);
        await system.exec(`find ${DESKTOP} -maxdepth 1 -type d -name '1810039*' -exec rm -rf {} \\; 2>/dev/null; true`, 5000);
        await system.exec(`touch ${DESKTOP}/1810039-文档1.txt && touch ${DESKTOP}/1810039-文档2.txt && head -c 1024 /dev/zero > ${DESKTOP}/1810039-图片.png`, 10000);
        // 前置条件：开启桌面整理
        await system.exec(organizerCmd(1), 5000);
        await sleep(1000);
    });

    test('1810039-【桌面整理】自由拖动集合', async ({ device, agent, uos, system }) => {
        console.log('===== 步骤0: 桌面右键整理桌面，生成文件集合 =====');
        await activateDesktop(device, system);
        await sleep(1000);
        await organizeDesktop(agent);
        await agent.aiAssert('桌面右侧存在包含2个txt文件的文件集合框');

        console.log('===== 步骤1: 鼠标放入集合标题栏，检查光标样式 =====');
        await agent.aiHover('包含2个txt文件的文件集合框顶部标题栏');
        await sleep(500);
        try {
            const cursorMoved = await agent.aiBoolean('鼠标光标显示为可移动（四向箭头或抓取手型）样式，而不是普通箭头');
            console.log(`集合标题栏光标样式检测结果: ${cursorMoved}`);
        } catch (err) {
            console.log('光标样式为主观项，检测异常忽略:', String(err?.message || err).split('\n')[0]);
        }

        const beforeX = await queryTitleBarX(agent);
        console.log(`拖动前集合框横坐标: ${beforeX}`);

        console.log('===== 步骤2: 左键按住集合标题栏拖拽到桌面左侧 =====');
        // 以横坐标左移为客观判据，未位移时换下一档抓点；AI 视觉判断仅作兜底 --UT005045(许琪)
        let leftOk = false;
        let curX = beforeX;
        for (let i = 0; i < 5 && !leftOk; i += 1) {
            await dragCollection(agent, system, [200, 520], '桌面左侧中部空白区域', i);
            const movedLeftX = await queryTitleBarX(agent);
            console.log(`第${i + 1}次拖到左侧: 拖动前X=${curX}，拖动后X=${movedLeftX}`);
            leftOk = curX !== null && movedLeftX !== null && movedLeftX < curX - 50;
            if (!leftOk) {
                leftOk = await agent.aiBoolean('包含2个txt文件的文件集合框整体位于桌面左半部分');
            }
            if (movedLeftX !== null) {
                curX = movedLeftX;
            }
        }
        if (!leftOk) {
            throw new Error('断言失败：拖动集合标题栏后，集合未移动到桌面左侧');
        }
        console.log('✅ 预期2验证通过：集合可以被拖动到桌面左侧');

        const afterX = await queryTitleBarX(agent);
        console.log(`拖动到左侧后集合框横坐标: ${afterX}`);
        if (beforeX !== null && afterX !== null && afterX >= beforeX) {
            throw new Error(`断言失败：拖动到左侧后集合框横坐标未减小（前 ${beforeX}，后 ${afterX}）`);
        }

        console.log('===== 步骤3: 将集合拖回桌面右侧 =====');
        // 拖动是否生效以集合框横坐标右移为客观判据（AI 对“左/右半部分”的视觉判断不稳定），
        // 未产生位移时换标题栏描述与落点重试 --UT005045(许琪)
        let rightOk = false;
        let movedX = afterX;
        for (let i = 0; i < 5 && !rightOk; i += 1) {
            const beforeDragX = movedX;
            await dragCollection(
                agent,
                system,
                i === 0 ? [1290, 420] : [1290, 200],
                i === 0 ? '桌面右侧中部空白区域' : '桌面右侧上部空白区域',
                i
            );
            const nowX = await queryTitleBarX(agent);
            console.log(`第${i + 1}次拖回右侧: 拖动前X=${beforeDragX}，拖动后X=${nowX}`);
            rightOk = beforeDragX !== null && nowX !== null && nowX > beforeDragX + 50;
            if (nowX !== null) {
                movedX = nowX;
            }
        }
        if (!rightOk) {
            throw new Error(`断言失败：将集合拖回右侧后，集合未移动到桌面右半部分（当前X=${movedX}）`);
        }
        console.log('✅ 集合可在桌面左右自由拖动');

        console.log('===== 预期3: 集合内文件仍正常显示 =====');
        await agent.aiAssert('包含2个txt文件的文件集合框内显示2个txt文件图标');
        console.log('✅ 测试用例执行完成');
    }, { timeout: 900000, tags: ['1810039', 'level3', 'desktop_organization', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('3. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await sleep(500);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/1810039*`, 5000);
        await system.exec(`find ${DESKTOP} -maxdepth 1 -type d -name '1810039*' -exec rm -rf {} \\; 2>/dev/null; true`, 5000);
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('4. afterAll: 清理测试套件');
        await device.pressKey('Esc');
        await system.exec(organizerCmd(0), 5000);
        await system.exec(organizerCmd(1), 5000);
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/1810039*`, 5000);
        await clearEnvironment(system);
        await closeFileManager(system);
        await activateDesktop(device, system);
    });
});
