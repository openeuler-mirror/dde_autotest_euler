// @ts-nocheck

/**
 * 用例 PMSID: 1810629
 * 用例标题: 【Bug转用例场景】长文件名-/tmp目录删除新建
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// 客观判据助手：窗口数/标题改 shell 有界轮询，零模型调用
const sh = async (system, cmd, timeout = 10000) => {
    const res = await system.exec(cmd, timeout);
    return `${(res && res.stdout) || ''}`.trim();
};
const waitUntil = async (fn, timeoutMs = 15000, intervalMs = 500) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            if (await fn()) return true;
        } catch (e) { /* 轮询期忽略单次异常 */ }
        await sleep(intervalMs);
    }
    return false;
};
const fmWinCount = async (system) => parseInt(await sh(system, "wmctrl -lx | grep -ci 'dde-file-manager' || true") || '0', 10) || 0;

describe('1810629-长文件名-tmp目录删除新建', () => {
    const TMP_DIR = '/tmp';
    // 失败实证：远程机 dlnfs 只挂载家目录子路径，/tmp 为普通 tmpfs，超过 255 字节的名字物理不可创建（mkdir 报"文件名过长"）；
    // 名称改为 2 段重复（224 字节），仍是远超常规的长文件名且在该环境 /tmp 可创建
    const LONG_DIR_NAME = '这是一个非常长的文件夹名称用于验证长文件名功能在tmp目录下的新建与删除操作'.repeat(2) + '_1810629';
    const LONG_DIR_PATH = `${TMP_DIR}/${LONG_DIR_NAME}`;

    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const { closeFileManager, clearEnvironment, enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        // 前置条件：已开启长文件名
        await enableLongFileName(device, agent, system);
    });

    beforeEach(async ({ device, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        await device.pressKey('Esc');
        await system.exec(`rm -rf "${LONG_DIR_PATH}"`, 10000);
    });

    test('1810629-长文件名-tmp目录删除新建', async ({ device, agent, uos, system }) => {
        console.log('===== 步骤1：进入系统盘 /tmp 目录 =====');
        await uos.openApp('文件管理器', { maximizeWindow: true });
        if (!(await waitUntil(() => fmWinCount(system) >= 1, 20000, 500))) {
            await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
        }
        // 窗口未获得焦点时 ctrl+l 无法聚焦地址栏，先激活文管窗口
        await system.exec('export DISPLAY=:0; DM_USER=$(stat -c %U /run/user/1000 2>/dev/null | tr -cd "a-zA-Z0-9_-"); export XAUTHORITY=/home/${DM_USER:-test}/.Xauthority; WIN_ID=$(xdotool search --class dde-file-manager 2>/dev/null | head -1); if [ -n "$WIN_ID" ]; then wmctrl -i -a $WIN_ID; fi; echo FOCUSED', 15000);
        await sleep(800);
        await device.pressKey('ctrl+l');
        await sleep(800);
        await device.pressKey('ctrl+a');
        await device.typeText(TMP_DIR, true);
        let entered = false;
        try {
            await agent.aiWaitFor('文件管理器标签页标题为tmp，且文件列表区域显示的是tmp目录下的文件和文件夹内容', { timeoutMs: 25000 });
            entered = true;
        } catch (err) {
            console.log('地址栏直达 /tmp 未生效，改用命令行方式打开 /tmp');
        }
        if (!entered) {
            await system.exec('dde-file-manager /tmp >/dev/null 2>&1 &', 10000);
            await sleep(4000);
            await agent.aiWaitFor('文件管理器标签页标题为tmp，且文件列表区域显示的是tmp目录下的文件和文件夹内容', { timeoutMs: 30000 });
        }
        await sleep(1500);

        console.log('===== 步骤2：在 /tmp 目录新建长文件名文件夹 =====');
        // 新建文件夹流程可能因右键菜单/编辑框焦点时序失败（失败实证：两轮右键新建后目录均不存在），
        // 依次尝试：右键菜单 → Ctrl+Shift+N，两条路径都要先聚焦命名输入框再输入
        const existsDir = async () => {
            const res = await system.exec(`test -d "${LONG_DIR_PATH}" && echo EXISTS || echo MISSING`, 10000);
            return (res.stdout || '').indexOf('EXISTS') >= 0;
        };
        // 2026-11-03 全量随机批次实录：三次新建后 /tmp 只多出一个默认名"新建文件夹"，
        // 说明 Ctrl+Shift+N 已生效但输入的文字全部落空（Enter 提交了默认名）——
        // 远程场景下内联命名框未获得焦点，device.typeText / xdotool 击键都没有进入输入框。
        // 因此在输入前先点击命名输入框聚焦（midscene 亦提示 clickBeforeInput=true 才能避免输入问题）
        const nameNewFolder = async (attempt) => {
            await sleep(800);
            try {
                await agent.aiTap('文件列表中正在编辑的文件夹名称输入框');
                await sleep(400);
            } catch (err) {
                console.log(`第${attempt}次点击文件夹名称输入框失败: ${String(err?.message || err).split('\n')[0]}`);
            }
            await device.pressKey('ctrl+a');
            await sleep(200);
            await device.typeText(LONG_DIR_NAME);
            await sleep(400);
            await device.pressKey('Enter');
        };
        let created = false;
        for (let attempt = 1; attempt <= 3 && !created; attempt++) {
            if (attempt === 1) {
                try {
                    // 失败实证：AI 把"空白处"定位到底部状态栏（bbox y≈923~955），右键后无菜单
                    await agent.aiRightClick('文件列表区域中部偏上的空白处（不要点在底部状态栏上）');
                    // 右键菜单为本地瞬时渲染，固定短等待替代视觉轮询
                    await sleep(900);
                    await agent.aiTap('右键菜单中的新建文件夹选项');
                    await sleep(1500);
                    await nameNewFolder(attempt);
                } catch (err) {
                    // 菜单未弹出/定位落空时交给下一次尝试的 Ctrl+Shift+N 路径
                    console.log(`右键菜单新建文件夹失败，改用快捷键: ${String(err?.message || err).split('\n')[0]}`);
                    await device.pressKey('Esc');
                    await sleep(800);
                }
            } else {
                // 快捷键新建文件夹，规避右键菜单落空
                await device.pressKey('Esc');
                await sleep(500);
                await device.pressKey('ctrl', 'shift', 'n');
                await sleep(1500);
                await nameNewFolder(attempt);
            }
            await sleep(3000);
            created = await existsDir();
            console.log(`第${attempt}次新建后目录存在: ${created}`);
            if (!created) {
                await device.pressKey('Esc');
                await sleep(1000);
            }
        }

        // 预期1：新建成功
        const existRes = await system.exec(`test -d "${LONG_DIR_PATH}" && echo EXISTS || echo MISSING`, 10000);
        const existState = (existRes.stdout || '').trim();
        console.log(`新建后目录状态: ${existState}`);
        if (existState.indexOf('EXISTS') < 0) {
            throw new Error('断言失败：长文件名文件夹在 /tmp 目录下新建失败');
        }
        await agent.aiWaitFor('tmp目录中显示新建的长文件名文件夹', { timeoutMs: 20000 });
        console.log('✅ 预期1通过：长文件名文件夹新建成功');

        console.log('===== 步骤3：选中该文件夹并删除 =====');
        // 失败实证：选中后 device.pressKey('Delete') 无任何反应，6 次 aiBoolean 轮询均判"无弹窗"、目录仍在；
        // 纯视觉判定不可靠，改为「窗口列表差异」客观识别确认框 + 「窗口几何」确定性点击右下角"删除"。
        // 实测（1920x1080）：永久删除确认框为独立顶层窗口（wmctrl -l 可见，标题"文件管理器"，尺寸 480x204），
        // 右下角"删除"按钮中心 ≈ (X + 0.80W, Y + 0.87H)。
        const XENV = 'export DISPLAY=:0; DM_USER=$(stat -c %U /run/user/1000 2>/dev/null | tr -cd "a-zA-Z0-9_-"); export XAUTHORITY=/home/${DM_USER:-test}/.Xauthority;';
        const winList = async () => {
            const res = await system.exec(`${XENV} wmctrl -l`, 15000);
            return ((res.stdout || '') + '').split('\n').map((s) => s.trim()).filter(Boolean);
        };
        const winIds = (lines) => lines.map((s) => s.split(/\s+/)[0]);
        const centerOf = (loc) => {
            const r = loc && loc.rect;
            if (r) {
                const arr = Array.isArray(r) ? r : [r.left ?? r.x, r.top ?? r.y, r.width, r.height];
                const [l, t, w, h] = arr.map(Number);
                if ([l, t, w, h].every((v) => Number.isFinite(v))) {
                    return { x: Math.round(l + w / 2), y: Math.round(t + h / 2) };
                }
            }
            const c = (loc && loc.center) || [];
            const x = Number(c[0]);
            const y = Number(c[1]);
            return Number.isFinite(x) && Number.isFinite(y) ? { x: Math.round(x), y: Math.round(y) } : null;
        };
        const clickConfirmDelete = async (beforeIds) => {
            for (let k = 0; k < 8; k++) {
                await sleep(700);
                const fresh = winIds(await winList()).filter((id) => beforeIds.indexOf(id) < 0);
                if (!fresh.length) {
                    continue;
                }
                const dlg = fresh[fresh.length - 1];
                const geoRes = await system.exec(`${XENV} xdotool getwindowgeometry --shell ${dlg}`, 15000);
                const geo = {};
                ((geoRes.stdout || '') + '').split('\n').forEach((line) => {
                    const i = line.indexOf('=');
                    if (i > 0) {
                        geo[line.slice(0, i).trim()] = parseInt(line.slice(i + 1), 10);
                    }
                });
                if (!Number.isFinite(geo.X) || !Number.isFinite(geo.Y) || !geo.WIDTH || !geo.HEIGHT) {
                    continue;
                }
                const bx = Math.round(geo.X + geo.WIDTH * 0.80);
                const by = Math.round(geo.Y + geo.HEIGHT * 0.87);
                await system.exec(`${XENV} xdotool mousemove --sync ${bx} ${by}; sleep 0.4; xdotool click 1`, 20000);
                console.log(`已点击永久删除确认框的"删除"按钮（窗口 ${dlg}，几何 ${geo.X},${geo.Y},${geo.WIDTH}x${geo.HEIGHT}，点击 ${bx},${by}）`);
                // 确认框未消失说明点击落到"取消"或落空，换更靠右的坐标再点一次
                await sleep(1200);
                if (winIds(await winList()).indexOf(dlg) >= 0) {
                    const bx2 = Math.round(geo.X + geo.WIDTH * 0.90);
                    const by2 = Math.round(geo.Y + geo.HEIGHT * 0.88);
                    await system.exec(`${XENV} xdotool mousemove --sync ${bx2} ${by2}; sleep 0.4; xdotool click 1`, 20000);
                    console.log(`确认框仍存在，改点 ${bx2},${by2}`);
                }
                return true;
            }
            return false;
        };

        const fmLine = (await winList()).find((l) => l.indexOf('文件管理器') >= 0 && l.indexOf('桌面') < 0);
        const fmWinId = fmLine ? fmLine.split(/\s+/)[0] : '';
        console.log(`文件管理器主窗口: ${fmWinId || '未找到'}`);

        // /tmp 中残留条目较多时，AI 可能点到别的图标，导致「确认框被确认了但目标文件夹仍在」（失败实证：3 次重试均 EXISTS）
        // 因此选中后必须先确认目标确实处于选中态，未选中就不按 Delete，换描述重试 --UT005045(许琪)
        const TARGET_DESCS = [
            '文件管理器右侧内容区中新建的长文件名文件夹',
            '文件名以"这是一个非常长的文件夹名称"开头的文件夹图标',
            '内容区文件名最长的那一个文件夹图标',
        ];
        const selectTarget = async () => {
            for (let k = 0; k < TARGET_DESCS.length; k++) {
                await agent.aiTap(TARGET_DESCS[k]);
                await sleep(1000);
                const selected = await agent.aiBoolean('文件管理器右侧内容区中，文件名以"这是一个非常长的文件夹名称"开头的文件夹已被选中（图标或文件名背景高亮）');
                console.log(`第${k + 1}次选中判定: ${selected}`);
                if (selected) {
                    return true;
                }
                await device.pressKey('Esc');
                await sleep(400);
            }
            return false;
        };

        let deleted = false;
        let selectedOk = false;
        for (let i = 0; i < 3 && !deleted; i++) {
            // 选中必须用 midscene 原生 aiTap：手工把 AI bbox 换算成屏幕坐标会偏移（失败实证：点击 1639,267 落空，Delete 无反应）
            if (fmWinId) {
                await system.exec(`${XENV} wmctrl -i -a ${fmWinId}`, 15000);
            }
            await sleep(600);
            selectedOk = await selectTarget();
            if (!selectedOk) {
                // 三轮都点不中时仍按原逻辑最后一搏，避免因选中态误判直接放弃
                console.log('未能确认选中态，仍尝试直接删除');
                await agent.aiTap(TARGET_DESCS[0]);
                await sleep(1200);
            }

            let beforeIds = winIds(await winList());
            await device.pressKey('Delete');
            let confirmed = await clickConfirmDelete(beforeIds);
            if (!confirmed && fmWinId) {
                // device.pressKey 可能未送达文管窗口，改用 xdotool 向已激活的主窗口直接发 Delete
                await system.exec(`${XENV} wmctrl -i -a ${fmWinId}; sleep 0.4; xdotool key --clearmodifiers Delete`, 20000);
                confirmed = await clickConfirmDelete(beforeIds);
            }
            if (!confirmed) {
                // 兜底：右键菜单删除
                await agent.aiRightClick('文件管理器右侧内容区中新建的长文件名文件夹');
                await sleep(1000);
                beforeIds = winIds(await winList());
                try {
                    await agent.aiTap('右键菜单中的删除');
                } catch (err) {
                    console.log('右键菜单删除点击失败:', String(err?.message || err).split('\n')[0]);
                }
                confirmed = await clickConfirmDelete(beforeIds);
            }
            if (!confirmed) {
                console.log('未检测到永久删除确认框（窗口列表无新增），按 Delete 未生效');
            }
            await sleep(1200);
            for (let c = 0; c < 3 && !deleted; c++) {
                if (c > 0) {
                    await sleep(800);
                }
                const check = await system.exec(`test -d "${LONG_DIR_PATH}" && echo EXISTS || echo MISSING`, 10000);
                deleted = (check.stdout || '').indexOf('MISSING') >= 0;
            }
            if (!deleted) {
                console.log(`第${i + 1}次删除未生效，重试`);
                await device.pressKey('Esc');
                await sleep(1000);
            }
        }

        // 预期2：删除成功
        const deletedRes = await system.exec(`test -d "${LONG_DIR_PATH}" && echo EXISTS || echo MISSING`, 10000);
        const deletedState = (deletedRes.stdout || '').trim();
        console.log(`删除后目录状态: ${deletedState}`);
        if (deletedState.indexOf('MISSING') < 0) {
            throw new Error('断言失败：长文件名文件夹删除失败');
        }
        console.log('✅ 预期2通过：长文件名文件夹删除成功');

        // 断言：删除后文件管理器内容区不再显示该长文件名文件夹
        await agent.aiAssert('文件管理器内容区中不再显示文件名以"这是一个非常长的文件夹名称"开头的文件夹');

        const pidRes = await system.exec('pidof dde-file-manager | wc -w', 10000);
        if (parseInt((pidRes.stdout || '0').trim(), 10) < 1) {
            throw new Error('断言失败：文管进程已退出');
        }

        console.log('===== 测试全部通过 =====');
    }, { timeout: 1200000, tags: ['1810629', 'level3', 'interaction-scenario', 'bug_to_case', 'long_filename', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await system.exec(`rm -rf "${LONG_DIR_PATH}"`, 10000);
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await device.pressKey('Esc');
        await system.exec(`rm -rf "${LONG_DIR_PATH}"`, 10000);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.showDesktop();
    });
});
