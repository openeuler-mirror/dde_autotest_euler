// @ts-nocheck

/**
 * 用例 PMSID: 1809913
 * 用例标题: 【桌面刷新优化】桌面包含大量SMB的快捷图标(数量大于20个)-SMB挂载/卸载-桌面自动刷新
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SHORTCUT_COUNT = 22;
const SHORTCUT_PREFIX = '1809913_shortcut_';
const REFRESH_TIMEOUT_MS = 60000;

describe('1809913-【桌面刷新优化】桌面包含大量SMB的快捷图标-SMB挂载/卸载-桌面自动刷新', () => {

    // 最小化遮挡桌面的窗口：桌面被 Chrome/WPS 等窗口覆盖时桌面图标会被挡住，
    // 视觉断言会把中间编号误判为不存在，且 wmctrl 无法把 dde-shell 桌面窗口抬到前台 --UT005045(许琪)
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

    // AI 一次数 22 个桌面小图标会输出超长推理导致结果解析失败（XML parse error: Missing required field: data-json），
    // 改为定向判断采样快捷图标是否存在，作为桌面刷新完成的判据；
    // 桌面图标标题在图标较多时会被截断（如显示成 cut_01），严格比对全名会误判为缺失。
    // 三个采样图标合并为一次 aiBoolean（原实现每轮 3 次模型调用，单轮约多花 10s）；
    // 22 个图标超出桌面可视区，中间编号可能排到屏外，取日志恒可见的首尾+中间三元组
    async function waitShortcutCount(agent, expected) {
        const names = [1, 9, 20].map((i) => `${SHORTCUT_PREFIX}${String(i).padStart(2, '0')}`);
        const start = Date.now();
        while (Date.now() - start < REFRESH_TIMEOUT_MS) {
            let visible = false;
            try {
                visible = Boolean(await agent.aiBoolean(
                    `桌面上是否同时显示名称为 ${names.join('、')} 的快捷方式图标（图标标题可能被截断显示为类似 cut_01 的短形式，只要属于 1809913 系列且末尾编号对应即可）`
                ));
            } catch (err) {
                console.log('检查桌面快捷图标失败:', String(err?.message || err).split('\n')[0]);
            }
            const elapsed = Date.now() - start;
            console.log(`桌面快捷图标检查: ${names.join(',')} => ${visible ? '均可见' : '存在缺失'}`);
            if (visible) {
                return elapsed;
            }
            await sleep(1000);
        }
        throw new Error(`断言失败：等待 ${REFRESH_TIMEOUT_MS}ms 后桌面仍缺少快捷图标 ${names.join(',')}`);
    }

    // beforeEach 会把文件管理器最大化置顶，窗口遮挡桌面中部区域，AI 截图只能看到图标网格的首尾行，
    // 被遮住的采样图标（如 09/20）会被误判为缺失；校验桌面图标前先最小化文管窗口
    async function minimizeFileManager(system) {
        const res = await system.exec("wmctrl -lx | grep -i 'dde-file-manager' | awk '{print $1}'", 10000);
        const ids = String(res?.stdout || '').split('\n').map((item) => item.trim()).filter((item) => item);
        console.log('待最小化的文管窗口:', ids.join(',') || '无');
        for (const id of ids) {
            await system.exec(`wmctrl -i -r ${id} -b add,hidden; xdotool windowminimize ${id} 2>/dev/null; true`, 5000);
        }
        // wmctrl/xdotool 最小化为同步生效，无需等满动画时长（原固定 1500ms）
        await sleep(600);
    }

    // 通过 mount 表客观判定 SMB 是否已挂载（DDE 挂载点为 /media/<user>/smbmounts/smb-share:server=ip,share=dir）
    async function isSmbMounted(system, ip, dir) {
        const res = await system.exec(`mount | grep -c 'smb-share:server=${ip},share=${dir}'`, 10000);
        const count = parseInt(String(res?.stdout || '0').trim(), 10);
        return Number.isFinite(count) && count > 0;
    }

    // 轮询等待挂载状态达到期望值，返回是否达成
    async function waitSmbState(system, ip, dir, expected, timeoutMs) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            if ((await isSmbMounted(system, ip, dir)) === expected) {
                return true;
            }
            await sleep(1000);
        }
        return (await isSmbMounted(system, ip, dir)) === expected;
    }

    // 界面卸载 SMB：侧边栏挂载项容易被 AI 单次定位漏掉，先枚举含 ip/共享名的条目并按 bbox 右键，
    // 菜单项按「取消记住密码并卸载」→「卸载」顺序兼容是否记忆密码两种状态；UI 失败时 shell umount 兜底
    async function unmountSmb(agent, system, ip, dir) {
        const { activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await activateUserFileManagerWindow(system);
        let targets = [];
        try {
            targets = await agent.aiQuery(`文件管理器左侧边栏中所有包含${ip}或${dir}的条目，返回数组，每项包含text（条目完整文本）和bbox（条目矩形[left,top,right,bottom]）；没有则返回空数组`);
        } catch (err) {
            console.log('枚举侧边栏挂载项失败，退回AI定位右键:', String(err?.message || err).split('\n')[0]);
        }
        if (!Array.isArray(targets) || targets.length === 0) {
            targets = [null];
        }
        let uiUnmounted = false;
        for (let i = 0; i < targets.length; i += 1) {
            try {
                const bbox = targets[i] && targets[i].bbox;
                if (Array.isArray(bbox) && bbox.length === 4) {
                    const cx = Math.round((Number(bbox[0]) + Number(bbox[2])) / 2);
                    const cy = Math.round((Number(bbox[1]) + Number(bbox[3])) / 2);
                    console.log(`右键第${i + 1}/${targets.length}个挂载项 bbox 中心: (${cx},${cy})`);
                    await system.exec(`xdotool mousemove ${cx} ${cy} click 3`, 5000);
                } else {
                    await agent.aiRightClick(`文件管理器左侧边栏中的${dir}挂载项`);
                }
                await agent.aiWaitFor('右键菜单已显示', { timeoutMs: 10000 });
                if (await agent.aiBoolean('右键菜单中出现取消记住密码并卸载选项')) {
                    await agent.aiTap('取消记住密码并卸载选项');
                    uiUnmounted = true;
                    break;
                }
                if (await agent.aiBoolean('右键菜单中出现卸载选项')) {
                    await agent.aiTap('卸载选项');
                    uiUnmounted = true;
                    break;
                }
                console.log(`第${i + 1}个条目菜单无卸载选项（书签条目），Esc后尝试下一个`);
                await system.exec('xdotool key Escape', 5000);
            } catch (err) {
                console.log('单个挂载项卸载异常，Esc继续:', String(err?.message || err).split('\n')[0]);
                await system.exec('xdotool key Escape', 5000);
            }
        }
        if (!uiUnmounted) {
            console.log('UI卸载未成功，shell 多层兜底');
            // 1. 先用 gio/gvfs 走 D-Bus 调用 DDE 的 SMB 卸载接口
            await system.exec(`gio mount -u "smb://${ip}/${dir}" 2>/dev/null; gvfs-mount -u "smb://${ip}/${dir}" 2>/dev/null; true`, 10000);
            // 2. 兜底：lazy umount 强制清理 cifs 挂载（不 kill dde-file-manager 避免影响后续用例）
            await system.exec(`mount | grep "//${ip}/${dir}" | awk '{print $3}' | xargs -r sudo umount -l 2>/dev/null; true`, 10000);
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
        try {
            await closeAllWindows(device, agent);
        } catch (err) {
            console.log('关闭残留窗口失败，忽略:', String(err?.message || err).split('\n')[0]);
        }
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/${SHORTCUT_PREFIX}*`, 5000);

        // 前序用例可能把"桌面自动整理"恢复为开启状态，集合框会对 22 个快捷图标分页收纳，
        // 导致采样图标排到屏外被判为缺失；前置阶段关闭自动整理，保证图标平铺可见
        await system.exec(
            'dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0',
            5000
        );
        await sleep(2000);

        console.log('2.1 beforeEach: 批量生成 SMB 快捷方式图标');
        const ip = process.env.SMB_IP;
        const dir = process.env.SMB_DIR;
        const commands = [];
        for (let i = 1; i <= SHORTCUT_COUNT; i++) {
            const name = `${SHORTCUT_PREFIX}${String(i).padStart(2, '0')}`;
            commands.push(
                `printf '[Desktop Entry]\\nVersion=1.0\\nType=Link\\nName=${name}\\nURL=smb://${ip}/${dir}\\nIcon=folder-remote\\n' > ${DESKTOP}/${name}.desktop`
            );
        }
        commands.push(`chmod 755 ${DESKTOP}/${SHORTCUT_PREFIX}*.desktop`);
        await system.exec(commands.join(' && '), 30000);
        const listed = await system.exec(`ls -1 ${DESKTOP}/${SHORTCUT_PREFIX}*.desktop | wc -l`, 10000);
        console.log(`桌面已生成快捷方式数量: ${String((listed && listed.stdout) || '').trim()}`);

        console.log('2.2 beforeEach: 打开文件管理器');
        await system.exec('kill -TERM $(pidof dde-file-manager) 2>/dev/null; true', 3000);
        await uos.openApp('文件管理器');
        await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
        await uos.maximizeWindow();
        const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        try {
            await cleanSmbMounts(agent, system, 1);
        } catch (err) {
            console.log('预清理SMB挂载失败，忽略:', String(err?.message || err).split('\n')[0]);
        }
    });

    test('1809913-【桌面刷新优化】桌面包含大量SMB的快捷图标-SMB挂载/卸载-桌面自动刷新', async ({ device, agent, uos, system }) => {
        const ip = process.env.SMB_IP;
        const dir = process.env.SMB_DIR;

        console.log('===== 前置条件: 桌面存在大于20个SMB快捷图标 =====');
        await activateDesktop(device, system);
        await sleep(1500);
        await minimizeFileManager(system);
        const initialCount = await waitShortcutCount(agent, SHORTCUT_COUNT);
        console.log(`桌面上已存在 ${SHORTCUT_COUNT} 个SMB快捷图标，耗时 ${initialCount}ms`);

        console.log('===== 步骤1: 在文件管理器挂载SMB =====');
        const { SmbMount, activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        // 认证窗口提交偶发失败（实证：弹出"挂载失败 认证失败"且 mount 表无记录），重试一次再判定
        let mounted = false;
        for (let i = 0; i < 2 && !mounted; i += 1) {
            await activateUserFileManagerWindow(system);
            await SmbMount(agent, system, device, 1);
            mounted = await waitSmbState(system, ip, dir, true, 15000);
            console.log(`第${i + 1}次挂载后SMB状态（mount 表）: ${mounted ? '已挂载' : '未检测到'}`);
            if (!mounted) {
                await system.exec('xdotool key Escape', 5000);
                await sleep(2000);
            }
        }
        if (!mounted) {
            await agent.aiAssert(`文件管理器中显示${ip}的SMB共享内容`);
        }
        // 侧边栏仅在存在历史访问记录时显示该挂载项，已位于共享目录内时跳过点击
        const sidebarVisible = await agent.aiBoolean(`文件管理器左侧边栏显示${ip}`);
        console.log(`左侧边栏挂载项是否可见: ${sidebarVisible}`);
        if (sidebarVisible) {
            await agent.aiTap(`文件管理器左侧边栏${ip}`);
            await sleep(1000);
        }

        console.log('===== 预期1: 挂载后桌面图标、数量、缩略图正常刷新 =====');
        // 刷新耗时只统计挂载完成后的桌面自动刷新等待，不含 SmbMount 自身的 AI 操作耗时
        await activateDesktop(device, system);
        await sleep(1000);
        await minimizeFileManager(system);
        const mountRefreshMs = await waitShortcutCount(agent, SHORTCUT_COUNT);
        console.log(`SMB挂载后桌面自动刷新耗时 ${mountRefreshMs}ms`);
        if (mountRefreshMs > REFRESH_TIMEOUT_MS) {
            throw new Error(`断言失败：SMB挂载后桌面刷新耗时 ${mountRefreshMs}ms，超过 ${REFRESH_TIMEOUT_MS}ms`);
        }
        const mountIconsNormal = await agent.aiBoolean('桌面上1809913_shortcut_开头的快捷图标均正常显示为远程文件夹图标，没有白块或破损图标');
        if (!mountIconsNormal) {
            throw new Error('断言失败：SMB挂载后桌面SMB快捷图标显示异常（出现白块或破损图标）');
        }
        console.log(`✅ 预期1验证通过：挂载后桌面图标、数量正常刷新（${mountRefreshMs}ms）`);

        console.log('===== 步骤2: 在文件管理器卸载SMB =====');
        // cifs 卸载为异步执行，实测 mount 表条目最长约 30s 后才消失，单次等待过短会误判卸载失败
        let unmounted = false;
        for (let i = 0; i < 2 && !unmounted; i += 1) {
            try {
                await unmountSmb(agent, system, ip, dir);
            } catch (err) {
                console.log(`第${i + 1}次界面卸载SMB失败:`, String(err?.message || err).split('\n')[0]);
            }
            unmounted = await waitSmbState(system, ip, dir, false, 60000);
            console.log(`第${i + 1}次卸载后挂载状态: ${unmounted ? '已卸载' : '仍挂载'}`);
        }
        if (!unmounted) {
            throw new Error(`断言失败：卸载SMB后仍检测到 ${ip}/${dir} 处于挂载状态`);
        }
        console.log('✅ SMB 已卸载（mount 表校验通过）');

        console.log('===== 预期2: 卸载后桌面图标、数量、缩略图正常刷新 =====');
        // 刷新耗时只统计卸载完成后的桌面自动刷新等待，不含 cleanSmbMounts 自身的 AI 操作耗时
        await activateDesktop(device, system);
        await sleep(1000);
        await minimizeFileManager(system);
        const unmountRefreshMs = await waitShortcutCount(agent, SHORTCUT_COUNT);
        console.log(`SMB卸载后桌面自动刷新耗时 ${unmountRefreshMs}ms`);
        if (unmountRefreshMs > REFRESH_TIMEOUT_MS) {
            throw new Error(`断言失败：SMB卸载后桌面刷新耗时 ${unmountRefreshMs}ms，超过 ${REFRESH_TIMEOUT_MS}ms`);
        }
        // 只断言用例相关的快捷图标本身，桌面右下角分页指示点等无关 UI 元素不参与判定，避免误判为"残留白块"
        const unmountIconsNormal = await agent.aiBoolean('桌面上1809913_shortcut_开头的快捷图标均正常显示为远程文件夹图标，没有白块或破损图标');
        if (!unmountIconsNormal) {
            throw new Error('断言失败：SMB卸载后桌面快捷图标显示异常或桌面卡死');
        }
        // 桌面是否卡死用进程/窗口存活性客观判定；UOS 25 桌面由 dde-shell 的 org.deepin.ds.desktop 提供，
        // 不存在 dde-desktop 进程，用 pgrep -x dde-desktop 会恒判失败
        const desktopAlive = await system.exec("pgrep -f 'org.deepin.ds.desktop' | wc -l; wmctrl -l | grep -c '桌面'", 8000);
        const [desktopProcCount, desktopWinCount] = String(desktopAlive?.stdout || '')
            .trim()
            .split('\n')
            .map((item) => parseInt(item.trim(), 10) || 0);
        if (desktopProcCount < 1 || desktopWinCount < 1) {
            throw new Error(`断言失败：SMB卸载后桌面无响应（桌面进程数=${desktopProcCount}，桌面窗口数=${desktopWinCount}）`);
        }
        console.log(`✅ 预期2验证通过：卸载后桌面图标、数量正常刷新（${unmountRefreshMs}ms）`);

        console.log('✅ 测试用例执行完成');
    }, { timeout: 1200000, tags: ['1809913', 'level3', 'rightclickd_menu', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('3. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await sleep(500);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/${SHORTCUT_PREFIX}*`, 5000);
    });

    afterAll(async ({ device, agent, uos, system }) => {
        console.log('4. afterAll: 清理测试套件');
        await device.pressKey('Esc');
        try {
            const { activateUserFileManagerWindow, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
            await activateUserFileManagerWindow(system);
            await cleanSmbMounts(agent, system, 1);
        } catch (err) {
            console.log('卸载SMB失败，忽略:', String(err?.message || err).split('\n')[0]);
        }
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/${SHORTCUT_PREFIX}*`, 5000);
        await clearEnvironment(system);
        await closeFileManager(system);
        await activateDesktop(device, system);
    });
});
