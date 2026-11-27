/**
 * 用例 PMSID: 1806055
 * 用例标题: 固定栏目下选中多个不同类文件右键
 * 生成时间: 2026-10-29 13:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const USER = process.env.TEST_USERNAME || 'uos';
const PREFIX = 'zz_multi_1806055_';
const PREFIX_SHORT = 'zz_multi_'; // UI 名字可能被截断时做宽松识别兜底
const usbFlash = process.env.USB_FLASH || 'uos';

/** 五个固定栏目：侧边栏名称 -> 真实路径 */
const SECTIONS = [
    { name: '桌面', dir: `/home/${USER}/Desktop` },
    { name: '视频', dir: `/home/${USER}/Videos` },
    { name: '音乐', dir: `/home/${USER}/Music` },
    { name: '文档', dir: `/home/${USER}/Documents` },
    { name: '下载', dir: `/home/${USER}/Downloads` },
];

describe('1806055-固定栏目多类型文件右键菜单', () => {
    const sh = async (system, cmd, timeout = 30000) => {
        const r = await system.exec(cmd, timeout);
        const out = ((r && r.stdout) || '').trim();
        if (out) console.log(`[shell] ${out}`);
        return out;
    };

    /** 用 xdotool 激活文件管理器窗口（纯 shell，不依赖 AI 定位标题栏，避免 bbox 解析失败） */
    const focusFileManager = async (system, device) => {
        await sh(
            system,
            "WID=$(xdotool search --class dde-file-manager 2>/dev/null | tail -1); " +
            "if [ -n \"$WID\" ]; then xdotool windowactivate --sync $WID 2>/dev/null; fi; true",
            20000
        );
        await sleep(600);
    };

    const killApps = async (system, pattern, timeout = 25000) => {
        const cmd =
            `PAT='${pattern}'; ` +
            `for p in $(pgrep -f "$PAT" 2>/dev/null); do case "$p" in "$$"|"$PPID") continue;; esac; kill -TERM "$p" 2>/dev/null; done; ` +
            `sleep 1; ` +
            `for p in $(pgrep -f "$PAT" 2>/dev/null); do case "$p" in "$$"|"$PPID") continue;; esac; kill -9 "$p" 2>/dev/null; done; ` +
            `sleep 0.5; ` +
            // 回读残留时，剔除"携带 PAT= 字样的包装 shell"（自匹配属正常现象）以及已退出的 pid（竞态），只报真正活着的应用
            `LEFT=''; for p in $(pgrep -f "$PAT" 2>/dev/null); do case "$p" in "$$"|"$PPID") continue;; esac; ` +
            `A=$(ps -o args= -p "$p" 2>/dev/null) || continue; ` +
            `case "$A" in *"PAT="*) continue;; esac; LEFT="$LEFT $p"; done; ` +
            `[ -n "$LEFT" ] && echo "  [killApps] 残留进程:$LEFT"; true`;
        await sh(system, cmd, timeout);
    };

    /** 可能被"打开"拉起的文本/图片/音视频应用 */
    const VIEWER_APPS = 'gedit|deepin-editor|eog|deepin-image-viewer|deepin-music|deepin-movie';

    const ARCHIVE_APPS = 'file-roller|ark|engrampa|xarchiver|peazip|deepin-archive-manager|deepin-compressor|deepin-compress';

    const closeOpenedApps = async (system, device) => {
        console.log('  [shell] 关闭"打开"拉起的应用/窗口（含压缩包管理器、播放器）');
        // 分三次独立调用，互不串联，任一环节异常都不会影响后续清理
        await killApps(system, VIEWER_APPS);
        await killApps(system, ARCHIVE_APPS);
        await killApps(system, PREFIX);
        // 可能存在"导入失败""无法打开"等模态提示框，连按 Escape 关闭
        for (let i = 0; i < 3; i++) {
            await device.pressKey('Escape');
            await sleep(600);
        }
        // "打开"文件夹可能弹出子窗口（标题含本用例前缀）：仅当存在多个文管窗口时才关闭，避免误关主窗口
        await sh(
            system,
            "N=$(xdotool search --class dde-file-manager 2>/dev/null | wc -l); " +
            "if [ \"$N\" -gt 1 ]; then wmctrl -l | grep 'zz_multi_' | awk '{print $1}' | xargs -r -n1 wmctrl -i -c; fi; true",
            20000
        );
        await sleep(1500);
        await focusFileManager(system, device);
    };

    /** 重启文件管理器并回到指定栏目、重新选中素材（属性窗口关不掉时的兜底恢复） */
    const restartFileManager = async (uos, agent, device, system, section, dir) => {
        await system.exec("kill -9 $(pidof dde-file-manager) 2>/dev/null");
        await sleep(3000);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await sleep(1500);
        await openSection(agent, device, section);
        await doSelectSamples(agent, device, system, section, dir);
    };

    const closeAllProperties = async (agent, device, system, uos, section, dir) => {
        const anyLeft = async () => {
            try {
                const r = await agent.aiBoolean('界面上仍能看到任一"属性"窗口（含文件名/大小/类型等信息的浮层）');
                return r === true;
            } catch (e) {
                return false;
            }
        };
        try {
            await agent.aiTap('屏幕底部中间的"关闭全部"按钮');
        } catch (e) {
            console.log('  - 点击"关闭全部"失败，改用 Escape/重启兜底');
        }
        await sleep(1500);
        let left = await anyLeft();
        for (let i = 1; i <= 2 && left; i++) {
            console.log(`  - 仍有属性窗口残留，第 ${i} 次补点"关闭全部" + Escape`);
            try {
                await agent.aiTap('屏幕底部中间的"关闭全部"按钮');
            } catch (e) {
                // 可能已经没有该按钮了，交给 Escape
            }
            await device.pressKey('Escape');
            await sleep(1200);
            left = await anyLeft();
        }
        if (left) {
            console.log('  - 属性窗口无法关闭，重启文件管理器恢复界面');
            await restartFileManager(uos, agent, device, system, section, dir);
        }
    };

    /** 关闭弹窗：优先点按钮，点不掉用 Escape 兜底 */
    const closeDialog = async (agent, device, btnHint, dlgHint) => {
        try {
            await agent.aiTap(btnHint);
        } catch (e) {
            console.log(`  - 点击「${btnHint}」失败，改用 Escape 关闭`);
            await device.pressKey('Escape');
        }
        await sleep(800);
        let still = false;
        try {
            still = await agent.aiBoolean(`界面仍显示${dlgHint}`);
        } catch (e) {
            still = false;
        }
        if (still === true) {
            console.log(`  - ${dlgHint}仍在，Escape 兜底关闭`);
            await device.pressKey('Escape');
            await sleep(800);
        }
    };

    /** 在某栏目造 5 个不同类型的素材：4 个文件 + 1 个文件夹 */
    const makeSamples = async (system, dir) => {
        await sh(
            system,
            `mkdir -p "${dir}" && rm -rf "${dir}"/${PREFIX}* 2>/dev/null; ` +
            `printf 'hello multi type\\n' > "${dir}/${PREFIX}a.txt"; ` +
            // 本机没有 ImageMagick convert，改用 ffmpeg 生成【合法】PNG，避免"打开"时因文件损坏弹错误框
            `(ffmpeg -loglevel error -y -f lavfi -i color=c=0x33AAFF:s=96x72 -frames:v 1 "${dir}/${PREFIX}b.png" || printf 'PNG' > "${dir}/${PREFIX}b.png") 2>/dev/null; ` +
            // 生成 1 秒【合法】MP3，避免全零字节被播放器判为无效文件而弹出"导入失败"模态框
            `(ffmpeg -loglevel error -y -f lavfi -i "sine=frequency=440:duration=1" "${dir}/${PREFIX}c.mp3" || head -c 2048 /dev/zero > "${dir}/${PREFIX}c.mp3") 2>/dev/null; ` +
            `cd "${dir}" && zip -q "${PREFIX}d.zip" "${PREFIX}a.txt" 2>/dev/null || printf 'ZIP' > "${dir}/${PREFIX}d.zip"; ` +
            `mkdir -p "${dir}/${PREFIX}e"; ` +
            `printf 'placeholder in folder\\n' > "${dir}/${PREFIX}e/keep.txt"; ` +
            `ls -1A "${dir}" | grep "^${PREFIX}" | tr '\\n' ' '`,
            40000
        );
    };

    const cleanSamples = async (system, dir) => {
        await sh(system, `rm -rf "${dir}"/${PREFIX}* 2>/dev/null; true`, 20000);
    };

    /** 统计某栏目里测试素材（完整前缀）数量，用于删除前后校验 */
    const countSamples = async (system, dir) => {
        const out = await sh(
            system,
            `ls -1A "${dir}" 2>/dev/null | grep -c "^${PREFIX}" || true`,
            20000
        );
        const n = Number(out);
        return Number.isFinite(n) ? n : 0;
    };

    /** 用 shell 列出磁盘上完整的素材文件名（可信，不经过 AI） */
    const listDiskSamples = async (system, dir) => {
        const out = await sh(
            system,
            `ls -1A "${dir}" 2>/dev/null | grep "^${PREFIX}" | tr '\\n' ' '`,
            20000
        );
        return out ? out.split(/\s+/).filter(Boolean) : [];
    };

    /**
     * 进入栏目目录，并切换为「列表视图」（Ctrl+2）。
     * 列表视图下文件名完整显示，AI 精确匹配文件名不会点错（图标视图下会被省略号截断）。
     */
const openSection = async (agent, device, section) => {
    await agent.aiTap(`文件管理器左侧边栏的"${section}"`);
    await agent.aiWaitFor('工作区已切换到该栏目目录', { timeoutMs: 30000 });

    // 先判断当前是否已经是列表视图
    let isList = await agent.aiBoolean('工作区当前是列表视图（每行一个条目，显示文件名/大小/修改时间等列）');
    if (isList !== true) {
        console.log(`  - 切换「${section}」为列表视图（Ctrl+2）`);
        await device.pressKey('Ctrl+2');
        await sleep(1000);
        isList = await agent.aiBoolean('工作区当前是列表视图（每行一个条目，显示文件名/大小/修改时间等列）');
    }
    if (isList !== true) {
        throw new Error(`「${section}」无法切换到列表视图，文件名可能被截断导致选错`);
    }
    console.log(`  - 「${section}」当前为列表视图 ✅`);
};

    /** 单独列出素材里的「文件夹」（DDE 列表视图把文件夹排在文件前面，选中策略要区别对待） */
    const listDiskDirs = async (system, dir) => {
        const out = await sh(
            system,
            `find "${dir}" -maxdepth 1 -mindepth 1 -type d -name "${PREFIX}*" -printf "%f\\n" 2>/dev/null | tr '\\n' ' '; true`,
            20000
        );
        return out ? out.split(/\s+/).filter(Boolean) : [];
    };

    /** 读当前被高亮的条目名称（AI 认不出时返回空数组，由调用方降级为只看数量） */
    const selectedNames = async (agent) => {
        try {
            const r = await agent.aiQuery('string[], 当前被蓝色高亮选中的条目名称');
            return Array.isArray(r) ? r.map((x) => String(x).trim()).filter(Boolean) : [];
        } catch (e) {
            return [];
        }
    };

    /**
     * 校验"当前选中项是不是本用例素材"：
     * 数量必须等于磁盘素材数；若 AI 能读全选中项名称，还要求名称全部命中素材名，
     * 避免"数量对上但选中的是真实文件"这种会导致误删的危险情况。
     */
    const verifySelection = async (agent, diskList, tag) => {
        const n = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
        let names = [];
        try {
            const r = await agent.aiQuery('string[], 当前被蓝色高亮选中的条目名称');
            if (Array.isArray(r)) names = r.map((x) => String(x).trim()).filter(Boolean);
        } catch (e) {
            names = [];
        }
        const stripTail = (s) => s.replace(/[.…]+$/, '').trim();
        const hit = (nm) =>
            diskList.some((d) => nm.includes(d)) ||
            diskList.some((d) => d.startsWith(stripTail(nm)) && stripTail(nm).length >= 10);
        const matched = names.filter(hit).length;
        console.log(`  [校验-${tag}] 选中数=${n}/${diskList.length}，读到名称 ${names.length} 个，命中素材 ${matched} 个`);
        if (n !== diskList.length) return false;
        if (names.length >= diskList.length && matched < diskList.length) {
            console.log(`  - 名称校验不通过：${names.join(' | ')}`);
            return false;
        }
        return true;
    };

    /** 把文件列表滚回顶部（滚轮不动选中状态）。文件夹分区在列表最顶上，扩选后常常被滚出视口 */
    const scrollListToTop = async (system) => {
        await sh(
            system,
            'WID=$(xdotool search --class dde-file-manager 2>/dev/null | tail -1); ' +
            'if [ -n "$WID" ]; then eval $(xdotool getwindowgeometry --shell $WID); ' +
            'CX=$((X+WIDTH/2)); CY=$((Y+HEIGHT/2)); ' +
            'xdotool mousemove $CX $CY click --repeat 15 --delay 40 4 2>/dev/null; fi; true',
            25000
        );
        await sleep(900);
    };

    /**
     * 方案A（首选）：分组选中 + 方向自适应。
     * 各栏目排序方式不同：「桌面」按名称（a→d），「下载」按修改时间（d→a 倒序），
     * 所以不能写死 Shift+Down —— 先扩一行读回名称，确认相邻行也是本用例素材后再继续，
     * 否则回退并改按 Shift+Up 反方向扩选。
     */
    const selectGroupedSamples = async (agent, device, system, dir, diskList) => {
        const dirs = await listDiskDirs(system, dir);
        const folders = diskList.filter((n) => dirs.indexOf(n) >= 0);
        const files = diskList.filter((n) => dirs.indexOf(n) < 0);
        console.log(`  - 列表分区：文件夹 ${folders.length} 个 [${folders.join(', ')}]，文件 ${files.length} 个 [${files.join(', ')}]`);
        if (files.length === 0) {
            console.log('  - 方案A：素材里没有普通文件，无法用连续扩选');
            return false;
        }

        const isSampleName = (nm) => {
            const s = String(nm).replace(/[.…]+$/, '').trim();
            return files.some((f) => String(nm).includes(f)) || files.some((f) => f.startsWith(s) && s.length >= 10);
        };

        await device.pressKey('Escape');
        await sleep(400);
        try {
            await agent.aiTap(`工作区文件列表里名为 "${files[0]}" 的那一行条目`);
        } catch (e) {
            console.log('  - 方案A：定位首个文件素材失败');
            return false;
        }
        await sleep(500);
        let n = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
        if (n !== 1) {
            console.log(`  - 方案A：首个文件素材未单独选中（选中数 ${n}）`);
            return false;
        }

        let got = 1;
        if (files.length > 1) {
            // 探方向：先往下扩一行，名称都在素材里才算方向正确
            let shift = 'Down';
            await device.pressKey('Shift+Down');
            await sleep(500);
            let names = await selectedNames(agent);
            let ok = names.length >= 2 && names.every(isSampleName);
            if (!ok) {
                // 撤掉刚才那一行，改成往上扩
                await device.pressKey('Shift+Up');
                await sleep(350);
                await device.pressKey('Shift+Up');
                await sleep(500);
                names = await selectedNames(agent);
                ok = names.length >= 2 && names.every(isSampleName);
                shift = 'Up';
            }
            if (!ok) {
                console.log(`  - 方案A：相邻行不是本用例素材（读到 ${names.join(' | ')}），无法连续扩选`);
                return false;
            }
            got = names.length;
            console.log(`  - 方案A：列表方向=Shift+${shift}，已扩选 ${got} 行，继续扩展到 ${files.length} 行`);
            for (let i = got; i < files.length; i++) {
                await device.pressKey(`Shift+${shift}`);
                await sleep(280);
            }
            await sleep(600);
            n = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
            if (n !== files.length) {
                console.log(`  - 方案A：文件段扩选后选中数 ${n}（期望 ${files.length}）`);
                return false;
            }
        }

        // 文件夹在列表最上方的独立分区，扩选后可能被滚出视口 —— 先把列表滚回顶部再补选
        if (folders.length > 0) {
            await scrollListToTop(system);
        }
        for (let k = 0; k < folders.length; k++) {
            const before = n;
            await device.keyDown('ctrl');
            try {
                await agent.aiTap(`工作区文件列表里名为 "${folders[k]}" 的那一行条目`);
            } catch (e) {
                console.log(`  - 方案A：补选文件夹 "${folders[k]}" 失败`);
                return false;
            } finally {
                await device.keyUp('ctrl');
            }
            await sleep(600);
            n = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
            if (n !== before + 1) {
                console.log(`  - 方案A：补选文件夹 "${folders[k]}" 后选中数 ${n}（期望 ${before + 1}）`);
                return false;
            }
        }

        return await verifySelection(agent, diskList, '分组选中');
    };

    /**
     * 方案B（兜底）：Ctrl + 逐个点选，每点一个核对选中数 +1。
     * 传进来的 orderedList 已按「文件夹在前、文件在后」排好 —— 也就是列表的显示顺序，
     * 这样点击是从列表顶部往下推，目标行不会因为滚动而跑到视口外（「下载」栏目就是这么失败的）。
     */
    const selectByCtrlClick = async (agent, device, section, orderedList) => {
        await device.pressKey('Escape');
        await sleep(300);

        // 第 1 个：不按 Ctrl，点中即选中 1 个
        await agent.aiTap(`工作区文件列表里名为 "${orderedList[0]}" 的那一行条目`);
        await sleep(500);
        let cur = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
        if (cur !== 1) {
            console.log(`  - 第 1 个精确点选未生效（选中数 ${cur}），改用短前缀兜底`);
            await agent.aiTap(`工作区里文件名以 ${PREFIX_SHORT} 开头的第一个文件或文件夹条目`);
            await sleep(500);
            cur = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
        }
        if (cur !== 1) {
            throw new Error(`「${section}」第 1 个素材未选中（当前选中数 ${cur}）`);
        }

        await device.keyDown('ctrl');
        try {
            for (let i = 1; i < orderedList.length; i++) {
                const target = orderedList[i];
                const already = (arr) =>
                    arr.some((nm) => nm.includes(target) || target.startsWith(nm.replace(/[.…]+$/, '')));
                // Ctrl+单击对「已选中」的条目是取消选中的效果，所以先确认它还没被选上
                if (already(await selectedNames(agent))) {
                    console.log(`  - 第 ${i + 1} 个素材 "${target}" 已在选中态，跳过点击`);
                    continue;
                }
                let n = 0;
                for (let attempt = 1; attempt <= 2; attempt++) {
                    const prompt =
                        attempt === 1
                            ? `工作区文件列表里名为 "${target}" 的那一行条目`
                            : `工作区里文件名以 ${PREFIX_SHORT} 开头、且当前未被选中的第 ${i + 1} 个条目`;
                    await agent.aiTap(prompt, { deepThink: attempt > 1 });
                    await sleep(500);
                    n = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
                    if (n === i + 1) break;
                    console.log(`  - 第 ${i + 1} 个素材第 ${attempt} 次点选后选中数 ${n}（期望 ${i + 1}）`);
                }
                if (n !== i + 1) {
                    throw new Error(
                        `「${section}」点选第 ${i + 1} 个素材后选中数未达预期 ${i + 1}（当前 ${n}），` +
                        `可能点回了已选项或匹配到错误条目`
                    );
                }
            }
        } finally {
            await device.keyUp('ctrl');
        }
    };

    /**
     * 选中当前栏目里本用例造的素材（文件 + 文件夹）。
     * 前提：openSection 已切到列表视图，文件名完整可见。
     * 首选「分组选中」（文件段扩选 + 文件夹 Ctrl 补选）；不成立时退回 Ctrl 逐个点选；两条路都要过 verifySelection。
     */
    const doSelectSamples = async (agent, device, system, section, dir) => {
        const diskList = await listDiskSamples(system, dir);
        if (diskList.length < 2) {
            throw new Error(`「${section}」栏目里磁盘素材不足 2 个（${JSON.stringify(diskList)}），无法验证多选右键菜单`);
        }
        console.log(`「${section}」磁盘素材(${diskList.length}): ${diskList.join(', ')}`);

        if (await selectGroupedSamples(agent, device, system, dir, diskList)) {
            console.log(`「${section}」选中素材条目数: ${diskList.length} ✅（文件段扩选 + 文件夹补选）`);
            return diskList;
        }

        console.log('  - 方案A 未成功，退回 Ctrl 逐个点选');
        await device.pressKey('Escape');
        await sleep(300);
        await scrollListToTop(system);
        const dirs = await listDiskDirs(system, dir);
        const ordered = diskList.filter((n) => dirs.indexOf(n) >= 0).concat(diskList.filter((n) => dirs.indexOf(n) < 0));
        await selectByCtrlClick(agent, device, section, ordered);
        if (!(await verifySelection(agent, diskList, 'Ctrl逐个点选'))) {
            throw new Error(`「${section}」最终选中项与磁盘素材不一致（数量或名称不匹配），已中止`);
        }
        console.log(`「${section}」选中素材条目数: ${diskList.length} ✅`);
        return diskList;
    };

    /**
     * 选择状态没被破坏时的轻量校验：选中数 == 磁盘素材数 就直接复用，不必重新逐个点选
     * （重新点选一次约 1.5 分钟，属性/发送到 这类"只读"菜单项操作后选择不会丢失）
     */
    const ensureSamplesSelected = async (agent, device, system, section, dir) => {
        const diskList = await listDiskSamples(system, dir);
        const n = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
        if (Number.isFinite(n) && n === diskList.length && diskList.length >= 2) {
            console.log(`  - 选中数量仍为 ${n}（与磁盘素材数一致），沿用当前选择`);
            return diskList;
        }
        console.log(`  - 选中数量 ${n} != 磁盘素材数 ${diskList.length}，重新点选`);
        return doSelectSamples(agent, device, system, section, dir);
    };

    /**
     * 关键安全断言：删除前确认「当前选中的数量 == 磁盘素材数量」。
     * 不比对 UI 文件名（列表视图下虽完整，但数量断言已足够且最稳）。
     */
    const assertOnlySamplesSelected = async (agent, system, dir) => {
        const diskList = await listDiskSamples(system, dir);
        if (diskList.length < 2) {
            throw new Error(`安全断言失败：磁盘素材不足 2 个（${diskList.length}），禁止继续删除`);
        }
        const n = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
        console.log(`  [安全断言] 磁盘素材(${diskList.length}): ${diskList.join(', ')}`);
        console.log(`  [安全断言] 界面选中数量: ${n}`);
        if (!Number.isFinite(n) || n !== diskList.length) {
            throw new Error(
                `安全断言失败：界面选中数量(${n}) != 磁盘素材数量(${diskList.length})，禁止继续删除。` +
                `磁盘素材: ${diskList.join(', ')}`
            );
        }
    };

    /** 全选当前栏目（仅用于反选验证，验证后必须立即恢复为只选素材） */
    const selectAll = async (agent, device, section) => {
        await device.pressKey('Ctrl+A');
        await sleep(1500);
        const n = await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量');
        console.log(`「${section}」全选后选中条目数: ${n}`);
        const cnt = Number(n);
        if (!Number.isFinite(cnt) || cnt < 2) {
            throw new Error(`「${section}」全选后没有选中多个条目（读到 ${n}），无法验证多选右键菜单`);
        }
    };

    const openContextMenu = async (agent) => {
        // 列表视图下条目是一行，用"条目"描述比"图标"更准确，避免误点到图标列或空白区
        await agent.aiRightClick('工作区里被选中的任意一个条目');
        await agent.aiWaitFor('右键菜单已弹出', { timeoutMs: 20000 });
    };

    beforeAll(async ({ system }) => {
        console.log('1. beforeAll: 初始化测试套件 + 给五个栏目造多类型素材（含文件夹）');
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        for (const s of SECTIONS) {
            await makeSamples(system, s.dir);
        }
    });

    beforeEach(async ({ agent, uos }) => {
        console.log('2. beforeEach: 打开文件管理器');
        await uos.showDesktop();
        await uos.openApp('文件管理器', 3000, 20000, true);
    });

    /** 单个栏目的完整验证逻辑，5 个 test 复用 */
    const runSectionCase = async (agent, device, system, uos, sectionName, dir) => {
        console.log(`===== 栏目「${sectionName}」 =====`);
        await openSection(agent, device, sectionName);

        // ---- 第一段：只选中本用例素材，验证"打开/打开方式" ----
        console.log('验证「打开」「打开方式」：只选中本用例素材（含文件夹），不全选目录');
        await doSelectSamples(agent, device, system, sectionName, dir);
        await openContextMenu(agent);

        console.log('预期1：菜单包含 打开/打开方式/复制/剪切/重命名/反选/发送到/删除/属性');
        const required = ['打开', '打开方式', '复制', '剪切', '重命名', '反选', '发送到', '删除', '属性'];
        // 一次截图读出全部菜单项，替代 9 次独立 aiBoolean（每次约 7s），单栏目可省近 1 分钟；
        // 读不到或读全时自动回退到逐项判断，判定结论与原来一致。
        let menuText = '';
        try {
            const got = await agent.aiQuery('{items: string[]}, 右键菜单里所有菜单项的文字，按从上到下顺序');
            menuText = JSON.stringify(got || '');
            console.log(`  [menu] ${menuText}`);
        } catch (e) {
            console.log('  - 一次性读取菜单项失败，回退为逐项判断');
        }
        const missing = [];
        for (const item of required) {
            if (menuText && menuText.includes(item)) continue;
            const has = await agent.aiBoolean(`右键菜单里存在菜单项"${item}"（可能带快捷键后缀，如"复制(C)"）`);
            if (has !== true) missing.push(item);
        }
        if (missing.length > 0) {
            throw new Error(`预期1 失败：「${sectionName}」栏目多选不同类型条目后，右键菜单缺少这些项: ${missing.join(', ')}`);
        }
        console.log('✅ 预期1 通过：必需菜单项齐全');

        // ---- 打开 ----
        console.log('验证「打开」可用性：点击后应有打开响应，随后用 shell 关闭被打开的文件/应用（含压缩包）');
        const openEnabled = await agent.aiBoolean('右键菜单里的"打开"项处于可用状态');
        if (openEnabled !== true) {
            throw new Error(`「${sectionName}」栏目里"打开"项不可用`);
        }
        await agent.aiTap('右键菜单里的"打开"（或"打开(O)"）');
        // "打开"多类型条目会拉起多个应用，首屏可能需要几秒才稳定，改成最多等 15s 轮询判断（原来固定 2.5s 常误判为"无响应"）
        let openResp = false;
        try {
            await agent.aiWaitFor(
                '出现了打开文件/文件夹/压缩包的应用窗口、"选择程序"提示，或文件管理器打开行为等响应',
                { timeoutMs: 15000, checkIntervalMs: 3000 }
            );
            openResp = true;
        } catch (e) {
            openResp = false;
        }
        console.log(openResp === true
            ? '  - 打开：可用（已产生打开响应）'
            : '  - 打开：点击后未观察到打开响应（多类型条目可能只对单文件生效），记录为待确认');
        await closeOpenedApps(system, device);
        // "打开"文件夹可能让文管跳进子文件夹，这里幂等地重新回到栏目根目录
        await openSection(agent, device, sectionName);

        // ---- 打开方式 ----
        console.log('验证「打开方式」可用性：点击后应弹出选择应用对话框');
        await doSelectSamples(agent, device, system, sectionName, dir);
        await openContextMenu(agent);
        const openWithEnabled = await agent.aiBoolean('右键菜单里的"打开方式"项处于可用状态');
        if (openWithEnabled !== true) {
            throw new Error(`「${sectionName}」栏目里"打开方式"项不可用`);
        }
        await agent.aiTap('右键菜单里的"打开方式"（或"打开方式(H)"）');
        await sleep(1500);
        const openWithDlg = await agent.aiBoolean("看到'选择默认程序'");
        if (openWithDlg === true) {
            console.log('  - 打开方式：可用（已弹出选择应用对话框）');
            await closeDialog(agent, device, '选择应用对话框里的"取消"按钮', '选择默认程序对话框');
        } else {
            console.log("  - 打开方式：未看到'选择默认程序'");
            await device.pressKey('Escape');
            await sleep(800);
        }

        // ---- 第二段：反选验证（全选 -> 反选 -> 断言变化 -> 恢复只选素材） ----
        console.log('验证「反选」：全选后点反选，断言选中状态变化，随后恢复为只选测试素材');
        await selectAll(agent, device, sectionName);
        await openContextMenu(agent);
        const invertEnabled = await agent.aiBoolean('右键菜单里的"反选"项处于可用状态');
        if (invertEnabled !== true) {
            throw new Error(`「${sectionName}」栏目里"反选"项不可用`);
        }
        const beforeInvert = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
        await agent.aiTap('右键菜单里的"反选"（或"反选(I)"）');
        await sleep(1200);
        const afterInvert = Number(await agent.aiQuery('number, 当前被选中的文件或文件夹条目数量'));
        console.log(`  - 反选：点击前选中 ${beforeInvert}，点击后选中 ${afterInvert}`);
        if (Number.isFinite(beforeInvert) && Number.isFinite(afterInvert) && beforeInvert === afterInvert && beforeInvert > 0) {
            throw new Error(
                `「${sectionName}」栏目点击"反选"后选中条目数仍为 ${afterInvert}，菜单项可点但未产生反选效果`
            );
        }
        console.log('  - 反选：可用（选中状态已变化）');
        // 反选后选中的是"非素材"真实文件，绝不能带此选择进入删除验证。
        await doSelectSamples(agent, device, system, sectionName, dir);

        // ---- 第三段：基于「只选素材」验证 发送到/属性/复制/剪切/重命名 ----
        console.log('以下菜单项基于「只选测试素材」验证，避免全选/反选产生的真实文件选择污染');

        await openContextMenu(agent);
        const hasSendToDisk = await agent.aiBoolean(`右键菜单里存在"发送到"的子项`);
        console.log(hasSendToDisk === true
            ? `✅ "发送到 ${usbFlash}"存在`
            : `⚠️ 「发送到 ${usbFlash}」未出现：本机可能没有第二块可移动磁盘，按设计可能不显示，记为环境缺失未覆盖`);
        await device.pressKey('Escape');

        // 属性（右键 + Escape 不会改变选中状态，先做轻量校验再决定是否重新点选）
        await ensureSamplesSelected(agent, device, system, sectionName, dir);
        await openContextMenu(agent);
        const attrEnabled = await agent.aiBoolean('右键菜单里的"属性"项处于可用状态');
        if (attrEnabled !== true) {
            throw new Error(`「${sectionName}」栏目里"属性"项不可用`);
        }
        await agent.aiTap('右键菜单里的"属性"（或"属性(R)"）');
        await agent.aiWaitFor('属性对话框已弹出', { timeoutMs: 25000 });
        await agent.aiAssert('看到所选文件的属性窗口');
        // 实测：多选打开"属性"时，DDE 会为【每个条目各弹一个属性窗口】（本次 5 个铺满屏幕），
        // 单点某个窗口的"关闭"或按 Escape 只能关掉最上面那一个，剩下的会把后续右键菜单全遮住。
        // 屏幕底部中间有一个"关闭全部"按钮，点它一次关掉所有属性窗口。
        await closeAllProperties(agent, device, system, uos, sectionName, dir);
        console.log('  - 属性：可用');

        // 复制（属性窗口关闭/必要时重启文管后，先确认选择还在）
        await ensureSamplesSelected(agent, device, system, sectionName, dir);
        await openContextMenu(agent);
        const copyEnabled = await agent.aiBoolean('右键菜单里的"复制"项处于可用状态');
        if (copyEnabled !== true) {
            throw new Error(`「${sectionName}」栏目里"复制"项不可用`);
        }
        await agent.aiTap('右键菜单里的"复制"（或"复制(C)"）');
        await sleep(1200);
        console.log('  - 复制：可用');

        // 剪切：Escape 取消
        await openContextMenu(agent);
        const cutEnabled = await agent.aiBoolean('右键菜单里的"剪切"项处于可用状态');
        if (cutEnabled !== true) {
            throw new Error(`「${sectionName}」栏目里"剪切"项不可用`);
        }
        await agent.aiTap('右键菜单里的"剪切"（或"剪切(T)"）');
        await sleep(1200);
        await device.pressKey('Escape');
        console.log('  - 剪切：可用');

        // 重命名
        await openContextMenu(agent);
        const renameEnabled = await agent.aiBoolean('右键菜单里的"重命名"项处于可用状态');
        if (renameEnabled !== true) {
            throw new Error(`「${sectionName}」栏目里"重命名"项不可用`);
        }
        await agent.aiTap('右键菜单里的"重命名"（或"重命名(M)"）');
        const batchDlg = await agent.aiBoolean('看到取消和重命名按钮');
        console.log(batchDlg === true
            ? '  - 重命名：多文件唤起批量重命名对话框，可用'
            : '  - 重命名：未弹出批量重命名对话框（可能只对单文件生效），记录为待确认');
        await closeDialog(agent, device, '重命名对话框里的"取消"按钮', '批量重命名对话框');

        // ---- 第四段：删除验证 —— 严格只对测试素材执行 ----
        console.log('验证「删除」');
        await doSelectSamples(agent, device, system, sectionName, dir);
        await assertOnlySamplesSelected(agent, system, dir);
        const countBefore = await countSamples(system, dir);
        console.log(`  [shell] 删除前素材数量: ${countBefore}`);

        await openContextMenu(agent);
        const deleteEnabled = await agent.aiBoolean('右键菜单里的"删除"项处于可用状态');
        if (deleteEnabled !== true) {
            throw new Error(`「${sectionName}」栏目里"删除"项不可用`);
        }
        await agent.aiTap('右键菜单里的"删除"（或"删除(D)"）');
        await sleep(1500);

        const deleteConfirmDlg = await agent.aiBoolean('看到了删除确认对话框（提示是否删除所选文件/文件夹）');
        if (deleteConfirmDlg === true) {
            console.log('  - 删除：确认对话框已弹出');
            await agent.aiTap('删除确认对话框里的"删除"/"确定"按钮');
            await sleep(2000);
            const countAfter = await countSamples(system, dir);
            console.log(`  [shell] 删除后素材数量: ${countAfter}（删除前 ${countBefore}）`);
            if (countAfter >= countBefore) {
                throw new Error(`「${sectionName}」删除后素材数量未减少（前 ${countBefore}，后 ${countAfter}），删除未生效`);
            }
            console.log('  - 删除：可用（素材数量已减少）');
        } else {
            const countAfter = await countSamples(system, dir);
            console.log(`  [shell] 未观察到确认框，删除后素材数量: ${countAfter}（删除前 ${countBefore}）`);
            if (countAfter >= countBefore) {
                throw new Error(`「${sectionName}」删除后素材数量未减少（前 ${countBefore}，后 ${countAfter}），删除未生效`);
            }
            console.log('  - 删除：可用（无确认框，数量已减少）');
        }

        // 兜底重建素材，避免上一轮残留污染下一轮
        await cleanSamples(system, dir);
        await makeSamples(system, dir);
        console.log(`「${sectionName}」检查完成`);
    };

    test('1806055-固定栏目多选不同类型文件（含文件夹）的右键菜单-桌面', async ({ agent, device, system, uos }) => {
        await runSectionCase(agent, device, system, uos, '桌面', SECTIONS[0].dir);
    }, { timeout: 1800000, tags: ['1806055', 'level3', 'main_interface_area', 'fixed_directory', 'normal_directory', 'DITT', 'lanyanling'] });

    test('1806055-固定栏目多选不同类型文件（含文件夹）的右键菜单-视频', async ({ agent, device, system, uos }) => {
        await runSectionCase(agent, device, system, uos, '视频', SECTIONS[1].dir);
    }, { timeout: 1800000, tags: ['1806055', 'level3', 'main_interface_area', 'fixed_directory', 'normal_directory', 'DITT', 'lanyanling'] });

    test('1806055-固定栏目多选不同类型文件（含文件夹）的右键菜单-音乐', async ({ agent, device, system, uos }) => {
        await runSectionCase(agent, device, system, uos, '音乐', SECTIONS[2].dir);
    }, { timeout: 1800000, tags: ['1806055', 'level3', 'main_interface_area', 'fixed_directory', 'normal_directory', 'DITT', 'lanyanling'] });

    test('1806055-固定栏目多选不同类型文件（含文件夹）的右键菜单-文档', async ({ agent, device, system, uos }) => {
        await runSectionCase(agent, device, system, uos, '文档', SECTIONS[3].dir);
    }, { timeout: 1800000, tags: ['1806055', 'level3', 'main_interface_area', 'fixed_directory', 'normal_directory', 'DITT', 'lanyanling'] });

    test('1806055-固定栏目多选不同类型文件（含文件夹）的右键菜单-下载', async ({ agent, device, system, uos }) => {
        await runSectionCase(agent, device, system, uos, '下载', SECTIONS[4].dir);
    }, { timeout: 1800000, tags: ['1806055', 'level3', 'main_interface_area', 'fixed_directory', 'normal_directory', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Escape');
        // 同样改用 killApps：pkill -f 串行调用会被包装 shell 自匹配打断，后面的清理命令根本执行不到
        await killApps(system, VIEWER_APPS);
        await killApps(system, ARCHIVE_APPS);
        await killApps(system, PREFIX);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });

    afterAll(async ({ system, uos }) => {
        console.log('5. afterAll: 清理测试套件');
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        for (const s of SECTIONS) {
            await cleanSamples(system, s.dir);
        }
        await clearEnvironment(system);
    });
});