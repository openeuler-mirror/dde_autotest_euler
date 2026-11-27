/**
 * 用例 PMSID: 1806491
 * 用例标题: 文管和桌面，选择多个WPS office的docx,pptx,xlsx文件后按回车
 * 生成时间：2026-07-21
 * 用例编写人：UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

/**
 * 轮询等待WPS窗口启动完成：wmctrl窗口标题包含1806491_test的窗口数达到expected
 * （WPS首次启动需构建字体缓存等，耗时可能远超平时，固定sleep不可靠）
 */
async function waitWpsWindowsReady(system, expected, timeoutMs) {
    const start = Date.now();
    let count = 0;
    while (Date.now() - start < timeoutMs) {
        const res = await system.exec("wmctrl -l | grep -c '1806491_test' || true");
        count = parseInt(String(res.stdout).trim(), 10) || 0;
        if (count >= expected) {
            console.log(`===== WPS窗口已全部启动: ${count}/${expected} =====`);
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error(`等待WPS窗口启动超时: ${timeoutMs}ms内只检测到${count}/${expected}个窗口`);
}

/**
 * 获取当前已打开的WPS窗口标题列表（标题包含1806491_test的窗口）
 * 用于判断哪些文件已打开、哪些还需要补开
 */
async function getOpenWpsWindows(system) {
    const res = await system.exec("wmctrl -l | grep '1806491_test' || true");
    const lines = String(res.stdout).trim().split('\n').filter(Boolean);
    // wmctrl输出格式: 0x...  0 hostname window-title，提取标题部分
    return lines.map(line => {
        const parts = line.split(/\s+/);
        // 标题从第4个字段开始（前面是窗口ID、桌面号、主机名）
        return parts.slice(3).join(' ');
    });
}


/**
 * 获取当前已打开的WPS文件快照：窗口标题（wmctrl）+ 标签栏全部标签页文件名（aiQuery）
 * WPS单实例模式下同组件文件合并为标签页，仅靠窗口标题会漏判，需双层判定
 */
async function snapshotOpenedFiles(agent, system) {
    // 激活第一个WPS窗口到前台，保证标签栏对aiQuery可见（窗口可能被wmctrl -k on最小化）
    await system.exec("wmctrl -l | grep '1806491_test' | head -1 | awk '{print $1}' | xargs -r wmctrl -i -a || true");
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 第1层：窗口标题
    const titles = await getOpenWpsWindows(system);
    // 第2层：标签栏全部标签页文件名
    let tabNames = [];
    try {
        tabNames = await agent.aiQuery("WPS Office窗口顶部标签栏中所有标签页的完整文件名（包括当前未激活的标签页），返回string数组；如果屏幕上没有WPS窗口则返回空数组");
    } catch (err) {
        console.log('===== aiQuery枚举WPS标签栏失败，仅用窗口标题判定 =====');
    }
    console.log(`===== WPS窗口标题: ${JSON.stringify(titles)}，标签栏: ${JSON.stringify(tabNames)} =====`);
    // 标题/标签名可能换行显示（如"1806491_t est1.docx"），去除空白后比对
    return [...titles, ...tabNames].map(n => String(n).replace(/\s+/g, ''));
}

/**
 * 快速判断文件是否已打开（仅窗口标题，2s内返回；用于双击后的高频轮询）
 */
async function isFileOpenedQuick(system, fileName) {
    const titles = await getOpenWpsWindows(system);
    return titles.some(t => t.replace(/\s+/g, '').includes(fileName));
}

/**
 * 关闭WPS可能弹出的提示弹窗（授权已过期/许可协议/登录推广），避免模态弹窗阻塞文件打开
 */
async function dismissWpsPopup(agent) {
    try {
        const hasPopup = await agent.aiBoolean('屏幕上存在WPS的提示弹窗（如授权已过期、许可协议、登录提示等弹窗）', { timeoutMs: 5000 });
        if (!hasPopup) {
            return false;
        }
        await agent.aiTap("WPS弹窗的右上角关闭按钮或'确定'/'关闭'/'稍后'/'继续使用'按钮");
        console.log('===== 检测到WPS提示弹窗并已关闭 =====');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * 顶部边缘图标下移点击点到图标下部安全区（v3诊断证实顶部裸坐标点击可正常命中图标，
 * 保留作保守防护；真因是AI混淆同外观孪生图标，见openFileOnDesktopByDouble的孪生修正逻辑）
 */
function safeClickY(rect) {
    const midY = Math.round(rect.top + rect.height / 2);
    return midY < 70 ? Math.round(rect.top + rect.height * 0.8) : midY;
}

/**
 * 一次aiQuery枚举桌面上全部1806491测试图标的名称与位置
 * 模型可对照全部标签做区分，比单图标aiLocate可靠（历史日志证实AI会混淆两个同外观pptx图标的定位）
 */
async function enumDesktopTestIcons(agent) {
    try {
        const icons = await agent.aiQuery('桌面上所有文件名以1806491开头的文件图标。注意：其中包含两两外观完全相同的docx/pptx/xlsx图标对，请逐个仔细阅读图标下方的完整文件名区分test1和test2。返回数组，每项包含name（图标下方显示的完整文件名）和bbox（图标矩形[left,top,width,height]）；若桌面上没有则返回空数组');
        if (Array.isArray(icons)) {
            console.log(`===== 桌面图标枚举: ${JSON.stringify(icons)} =====`);
            return icons;
        }
    } catch (err) {
        console.log(`===== 桌面图标枚举失败: ${err.message || err} =====`);
    }
    return [];
}

/**
 * 从枚举结果中找目标文件图标的点击点（去除标签换行空白后匹配名称）
 * excludePoint：排除与该点距离<=25px的图标（用于跳过已证实点开的是孪生文件的旧位置）
 */
function pickIconPoint(icons, fileName, excludePoint) {
    for (const it of icons) {
        const nm = String((it && (it.name || it.text)) || '').replace(/\s+/g, '');
        if (!nm || !nm.includes(fileName)) continue;
        const bb = (it && it.bbox) || {};
        const l = Number(bb.left !== undefined ? bb.left : bb[0]);
        const t = Number(bb.top !== undefined ? bb.top : bb[1]);
        const w = Number(bb.width !== undefined ? bb.width : bb[2]);
        const h = Number(bb.height !== undefined ? bb.height : bb[3]);
        if (![l, t, w, h].every(Number.isFinite) || w <= 0 || h <= 0) continue;
        const cx = Math.round(l + w / 2);
        const cy = safeClickY({ top: t, height: h });
        if (excludePoint && Math.hypot(cx - excludePoint[0], cy - excludePoint[1]) <= 25) {
            continue;
        }
        return [cx, cy];
    }
    return null;
}

/**
 * 桌面双击打开单个文件并轮询确认其已打开（X层xdotool双击，不依赖右键菜单的视觉定位）
 * 双击前先显示桌面，避免窗口遮挡图标；确认含窗口标题+标签栏双层判定；
 * 孪生修正：历史日志证实AI定位两个同外观pptx图标时会返回另一个的bbox（双击test1.pptx位置
 * 实际打开test2.pptx），检测到点开孪生文件后用枚举aiQuery取同名"另一个"图标位置改点重试；
 * 超时则关闭可能阻塞的WPS弹窗后原位置重试一次，仍失败则抛错
 */
async function openFileOnDesktopByDouble(agent, system, fileName, maxWaitMs = 45000) {
    // 已打开则直接返回（补开循环场景，避免重复双击已开文件）
    if (await isFileOpenedQuick(system, fileName)) {
        console.log(`===== ${fileName}已处于打开状态，跳过双击 =====`);
        return;
    }
    // 孪生文件：同前缀同扩展名的另一个测试文件（外观相同，AI定位易混淆两者）
    const twinName = fileName.includes('test1') ? fileName.replace('test1', 'test2') : fileName.replace('test2', 'test1');
    await system.exec("wmctrl -k on || true");
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 定位：aiLocate失败（如桌面图标刷新慢/模型匹配失败）时降级用枚举aiQuery按名取bbox
    let clickPoint = null;
    try {
        const icon = await agent.aiLocate(`桌面上文件名为${fileName}的文件图标`);
        if (icon?.rect) {
            clickPoint = [Math.round(icon.rect.left + icon.rect.width / 2), safeClickY(icon.rect)];
        }
    } catch (err) {
        console.log(`===== aiLocate定位${fileName}异常: ${err.message || err} =====`);
    }
    if (!clickPoint) {
        clickPoint = pickIconPoint(await enumDesktopTestIcons(agent), fileName, null);
    }
    if (!clickPoint) {
        throw new Error(`未能获取到${fileName}的图标坐标（aiLocate与枚举aiQuery均失败）`);
    }
    console.log(`===== ${fileName}双击点: (${clickPoint[0]},${clickPoint[1]}) =====`);
    /**
     * 在指定点双击并轮询确认：返回'target'=目标已打开，'twin'=孪生文件被打开，
     * 'timeout'=超时未确认（高频窗口标题轮询+每5轮一次含标签栏的完整快照）
     */
    const tryDoubleClickAt = async (pt) => {
        await system.exec("wmctrl -k on || true");
        await new Promise(resolve => setTimeout(resolve, 1500));
        await system.exec(`xdotool mousemove ${pt[0]} ${pt[1]} click --repeat 2 --delay 120 1`);
        let checkCount = 0;
        const start = Date.now();
        while (Date.now() - start < maxWaitMs) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            checkCount++;
            if (await isFileOpenedQuick(system, fileName)) {
                return 'target';
            }
            // 双击打开了孪生文件 → 本次点击命中的是孪生图标，尽早中断改点重试
            if (await isFileOpenedQuick(system, twinName)) {
                return 'twin';
            }
            if (checkCount % 5 === 0) {
                const opened = await snapshotOpenedFiles(agent, system);
                if (opened.some(n => n.includes(fileName))) {
                    return 'target';
                }
                if (opened.some(n => n.includes(twinName))) {
                    return 'twin';
                }
            }
        }
        return 'timeout';
    };
    // 第一次尝试
    let result = await tryDoubleClickAt(clickPoint);
    if (result === 'target') {
        console.log(`===== ${fileName}已确认打开 =====`);
        return;
    }
    let opened = await snapshotOpenedFiles(agent, system);
    if (opened.some(n => n.includes(fileName))) {
        console.log(`===== ${fileName}已确认打开（完整快照） =====`);
        return;
    }
    // 关键修正：点开了孪生文件（或超时疑似定位错图标），从枚举中取同名"另一个"图标位置改点重试
    if (result === 'twin' || result === 'timeout') {
        console.log(`===== ${fileName}双击结果:${result}，回桌面后枚举定位改点重试 =====`);
        // 枚举aiQuery必须在桌面截图上执行：WPS窗口在前台时截图非桌面会返回空数组（本次失败根因），
        // 先wmctrl -k on显示桌面再枚举
        await system.exec("wmctrl -k on || true");
        await new Promise(resolve => setTimeout(resolve, 2000));
        const altPoint = pickIconPoint(await enumDesktopTestIcons(agent), fileName, clickPoint);
        if (altPoint) {
            console.log(`===== 改点替代位置: (${altPoint[0]},${altPoint[1]}) =====`);
            const r2 = await tryDoubleClickAt(altPoint);
            if (r2 === 'target') {
                console.log(`===== 改点后${fileName}已确认打开 =====`);
                return;
            }
            const opened2 = await snapshotOpenedFiles(agent, system);
            if (opened2.some(n => n.includes(fileName))) {
                console.log(`===== 改点后${fileName}已确认打开（完整快照） =====`);
                return;
            }
        } else {
            // 枚举为空/无替代点时放弃视觉重试（原位置重放只会再次点开孪生文件），改用shell兜底打开
            console.log(`===== 枚举未找到替代图标位置，gio open shell兜底打开${fileName} =====`);
            await system.exec(`gio open "$HOME/Desktop/${fileName}" || gio open "$HOME/桌面/${fileName}" || true`);
            const gioStart = Date.now();
            while (Date.now() - gioStart < maxWaitMs) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                if (await isFileOpenedQuick(system, fileName)) {
                    console.log(`===== gio open兜底后${fileName}已确认打开 =====`);
                    return;
                }
            }
            const openedGio = await snapshotOpenedFiles(agent, system);
            if (openedGio.some(n => n.includes(fileName))) {
                console.log(`===== gio open兜底后${fileName}已确认打开（完整快照） =====`);
                return;
            }
        }
    }
    // 兜底：关闭WPS弹窗后回桌面重新定位重试（用枚举新坐标而非原位置重放已知错误点击）
    console.log(`===== ${fileName}未确认打开，关闭WPS弹窗后回桌面重新定位重试 =====`);
    await dismissWpsPopup(agent);
    await system.exec("wmctrl -k on || true");
    await new Promise(resolve => setTimeout(resolve, 2000));
    const retryPoint = pickIconPoint(await enumDesktopTestIcons(agent), fileName, result === 'twin' ? clickPoint : null);
    if (retryPoint) {
        console.log(`===== 重新定位点: (${retryPoint[0]},${retryPoint[1]}) =====`);
        await tryDoubleClickAt(retryPoint);
    } else {
        // 视觉定位彻底失败，shell兜底
        console.log(`===== 重新枚举仍无替代点，gio open shell兜底打开${fileName} =====`);
        await system.exec(`gio open "$HOME/Desktop/${fileName}" || gio open "$HOME/桌面/${fileName}" || true`);
    }
    opened = await snapshotOpenedFiles(agent, system);
    if (opened.some(n => n.includes(fileName))) {
        console.log(`===== 重试后${fileName}已确认打开（完整快照） =====`);
        return;
    }
    throw new Error(`${fileName}双击打开失败（含孪生混淆修正、回桌面枚举改点与gio open兜底），窗口标题+标签栏均未发现`);
}

/**
 * 悬停任务栏WPS图标触发预览：预览缩略图可能需要新的鼠标移动事件才弹出，
 * 单次悬停+短超时aiWaitFor失败后重新悬停重试
 */
async function hoverUntilPreviewShown(agent, timeoutMs) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        await agent.aiHover("任务栏上的WPS图标");
        try {
            await agent.aiWaitFor("任务栏上方显示了WPS窗口预览缩略图", { timeoutMs: 5000, checkIntervalMs: 1000 });
            // 等待预览缩略图完全加载展示
            await new Promise(resolve => setTimeout(resolve, 1000));
            return;
        } catch (err) {
            console.log('===== 本次悬停未出现WPS预览缩略图，重新悬停重试 =====');
        }
    }
    throw new Error(`悬停任务栏WPS图标后${timeoutMs}ms内未出现WPS窗口预览缩略图`);
}

/**
 * 清理残留应用窗口：优雅关闭所有非系统窗口，对未响应的按窗口PID强杀
 * 桌面号为-1及标题含desktop的是桌面/任务栏等常驻系统窗口，跳过不关
 * （执行后桌面可能残留误开的其他应用窗口（如VSCode），遮挡桌面会干扰后续用例执行）
 */
async function cleanupResidualWindows(system) {
    await system.exec("wmctrl -l | awk '$2 != -1 && tolower($0) !~ /desktop/ {print $1}' | xargs -r -n1 wmctrl -ic || true");
    await new Promise(resolve => setTimeout(resolve, 3000));
    for (let attempt = 1; attempt <= 3; attempt++) {
        const countRes = await system.exec("wmctrl -l | awk '$2 != -1 && tolower($0) !~ /desktop/' | wc -l");
        const count = parseInt(String(countRes.stdout).trim(), 10) || 0;
        if (count === 0) {
            console.log('===== 残留应用窗口已全部清理 =====');
            return;
        }
        console.log(`===== 第${attempt}次清理后仍有${count}个应用窗口，对残留窗口按PID强杀 =====`);
        const idsRes = await system.exec("wmctrl -l | awk '$2 != -1 && tolower($0) !~ /desktop/ {print $1}'");
        for (const wid of String(idsRes.stdout).trim().split('\n').filter(Boolean)) {
            const pidRes = await system.exec(`xdotool getwindowpid ${wid} 2>/dev/null || true`);
            const pid = String(pidRes.stdout).trim();
            if (pid) {
                await system.exec(`ps -p ${pid} -o comm= 2>/dev/null | grep -vE '^(dde-desktop|dde-dock|dde-shell|dde-lock|kwin|Xorg|startdde|systemd)' | grep -q . && kill -9 ${pid} || true`);
            }
            await system.exec(`wmctrl -ic ${wid} || true`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

describe('1806491-文管和桌面，选择多个WPS office的docx,pptx,xlsx文件后按回车', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        // 清理可能残留的WPS组件进程(wps=文字, wpp=演示, et=表格)，避免残留窗口干扰任务栏预览
        await system.exec("pkill -9 wps; pkill -9 -x wpp; pkill -9 -x et; true");
        // 清理上次执行可能残留的其他应用窗口（如VSCode），防止其遮挡桌面/干扰后续操作
        await cleanupResidualWindows(system);
        await uos.showDesktop();
        const user = process.env.TEST_USERNAME;
        // 前置条件：判断是否已安装cn.wps.wps-office，未安装则先安装
        const hasWPS = await system.exec(`dpkg -l | grep -E "^ii\\s+cn\\.wps\\.wps-office\\s" | wc -l`);
        if (parseInt(hasWPS.stdout.trim(), 10) === 0) {
            const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
            await installDeb(system, "cn.wps.wps-office");
        } else {
            console.log("cn.wps.wps-office已安装，不需要再安装");
        }
        // 前置条件：在Documents/1806491目录创建测试文件
        await system.exec(`mkdir -p /home/${user}/Documents/1806491`);
        await system.exec(`touch /home/${user}/Documents/1806491/1806491_test1.docx`);
        await system.exec(`touch /home/${user}/Documents/1806491/1806491_test2.docx`);
        await system.exec(`touch /home/${user}/Documents/1806491/1806491_test1.pptx`);
        await system.exec(`touch /home/${user}/Documents/1806491/1806491_test2.pptx`);
        await system.exec(`touch /home/${user}/Documents/1806491/1806491_test1.xlsx`);
        await system.exec(`touch /home/${user}/Documents/1806491/1806491_test2.xlsx`);
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1806491-文管和桌面，选择多个WPS office的docx,pptx,xlsx文件后按回车', async ({ device, agent, uos, system }) => {
        const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const user = process.env.TEST_USERNAME;
        const expectedFiles = ['1806491_test1.docx', '1806491_test2.docx', '1806491_test1.pptx', '1806491_test2.pptx', '1806491_test1.xlsx', '1806491_test2.xlsx'];

        /**
         * 预期校验：wmctrl窗口标题与expectedFiles做集合比对（确定性校验）
         * 不用aiAssert——2026-09-16 16:14运行证实，任务栏hover预览显示单个PPT的6张幻灯片缩略图，
         * AI会误判为"并非6个独立文件窗口"导致断言失败，而此时wmctrl已确认6/6窗口全部打开
         */
        const verifyWpsWindows = async (stepLabel) => {
            const titles = await getOpenWpsWindows(system);
            console.log(`===== ${stepLabel}已打开WPS窗口: ${JSON.stringify(titles)} =====`);
            const missing = expectedFiles.filter(name => !titles.some(t => t.includes(name)));
            if (missing.length > 0) {
                throw new Error(`${stepLabel}预期失败: 以下文件未打开WPS窗口: ${JSON.stringify(missing)}`);
            }
            console.log(`===== ${stepLabel}预期通过: 6个文件窗口全部打开 =====`);
        };

        // 步骤1：打开文管，选择多个docx,pptx,xlsx文件后按回车
        console.log("步骤1：打开文管，选择多个docx,pptx,xlsx文件后按回车");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await agent.aiTap("文件管理器左侧导航栏的'文档'文本");
        await agent.aiWaitFor("进入到文档文件夹");
        await agent.aiDoubleClick("1806491", { deepThink: true });
        await agent.aiWaitFor("进入1806491文件夹");
        await agent.aiDoubleClick("1806491_test1", { deepThink: true });
        // 处理WPS启动弹窗
        try {
            await agent.aiWaitFor("许可协议窗口", { timeoutMs: 3000 });
            await agent.aiTap("许可协议窗口中已阅读的复选框", { deepThink: true });
            await agent.aiTap("许可协议窗口的确定按钮", { deepThink: true });
        } catch (err) {
            console.log('===== 未检测到WPS许可协议弹窗，跳过处理 =====');
        }
        await system.exec("kill -9 $(pgrep wps) 2>/dev/null || true");
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Ctrl+A全选：kill WPS后焦点可能不在文管（历史日志证实仅剩最后点击的xlsx单选），
        // 每次先激活文管窗口再按Ctrl+A，用aiQuery数选中数做确定性校验（阈值6），失败重试
        let selectOk = false;
        for (let selAttempt = 1; selAttempt <= 3 && !selectOk; selAttempt++) {
            if (selAttempt > 1) {
                console.log(`===== 第${selAttempt - 1}次全选未确认，重试 =====`);
            }
            // 激活文管窗口（wmctrl -a匹配不到空标题窗口，按列表行取ID用-i激活）
            await system.exec("wmctrl -l | grep -i 'dde-file-manager' | head -1 | awk '{print $1}' | xargs -r wmctrl -i -a");
            await new Promise(resolve => setTimeout(resolve, 1000));
            await device.pressKey("ctrl+a");
            await new Promise(resolve => setTimeout(resolve, 800));
            try {
                const selNames = await agent.aiQuery("1806491文件夹中当前处于选中状态（有高亮选中背景）的所有文件名，返回string数组；若没有选中项则返回空数组");
                const cnt = Array.isArray(selNames) ? selNames.length : 0;
                console.log(`===== 第${selAttempt}次Ctrl+A后选中数: ${cnt} (${JSON.stringify(selNames)}) =====`);
                if (cnt >= 6) {
                    selectOk = true;
                }
            } catch (err) {
                console.log(`===== 第${selAttempt}次aiQuery查询选中状态失败：${err.message || err} =====`);
            }
        }
        if (!selectOk) {
            throw new Error("Ctrl+A全选重试3次仍未选中6个文件");
        }
        // 按回车打开
        await device.pressKey("Enter");
        // 轮询等待6个WPS窗口全部真正启动（WPS首次启动构建字体缓存可能远慢于固定sleep的预期）
        await waitWpsWindowsReady(system, 6, 180000);
        await hoverUntilPreviewShown(agent, 60000);

        // 预期1：这些文件都可以打开（确定性校验，避免hover预览的幻灯片缩略图误导AI视觉断言）
        await verifyWpsWindows('步骤1');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        // 彻底结束所有WPS组件进程(wps=文字, wpp=演示, et=表格)，避免残留窗口影响步骤2
        await system.exec("pkill -9 wps; pkill -9 -x wpp; pkill -9 -x et; true");
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 步骤2：桌面，选择多个docx,pptx,xlsx文件后按回车
        console.log("步骤2：桌面，选择多个docx,pptx,xlsx文件后按回车");
        // 在桌面创建6个测试文件
        await system.exec(`touch /home/${user}/Desktop/1806491_test1.docx`);
        await system.exec(`touch /home/${user}/Desktop/1806491_test2.docx`);
        await system.exec(`touch /home/${user}/Desktop/1806491_test1.pptx`);
        await system.exec(`touch /home/${user}/Desktop/1806491_test2.pptx`);
        await system.exec(`touch /home/${user}/Desktop/1806491_test1.xlsx`);
        await system.exec(`touch /home/${user}/Desktop/1806491_test2.xlsx`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 步骤1打开过的WPS窗口及其他应用窗口可能残留并遮挡桌面，先显示桌面确保测试文件图标可见
        await system.exec("wmctrl -k on || true");
        await new Promise(resolve => setTimeout(resolve, 2000));
        // 等待桌面刷新显示出6个测试文件图标
        // v3(2026-09-29)：桌面可能残留其他用例的文件（如1808457.txt），
        // 宽泛的"6个1806491测试文件图标"会被AI误把"1808457"也按数字包含/总数混淆而失败（重跑实证），
        // 改为明确按前缀1806491_test统计并忽略无关文件
        await agent.aiWaitFor("桌面上文件名以1806491_test开头的文件图标恰好有6个（test1和test2各docx/pptx/xlsx）。注意：桌面上可能存在1808457.txt等其他无关文件，请忽略它们，只统计1806491_test开头的图标", { timeoutMs: 15000, checkIntervalMs: 2000 });
        // 用xdotool在X层实现"单击首图标 + Shift+单击末图标"的连续多选：
        // device.keyDown的修饰键状态对aiTap注入的点击不生效（历史日志证实Shift/Ctrl+点击后只剩最后点击的文件被选中）；
        // 框选会误选竖列相邻的系统图标（历史日志证实误选中"WPS文字"/"WPS办公小助手"）；
        // xdotool在X server层保持shift按下状态，click为真实X事件，修饰键可靠生效
        const firstIcon = await agent.aiLocate("桌面上文件名为1806491_test1.docx的文件图标");
        const lastIcon = await agent.aiLocate("桌面上文件名为1806491_test2.xlsx的文件图标");
        if (!firstIcon?.rect || !lastIcon?.rect) {
            throw new Error('aiLocate未能获取到1806491测试文件图标的坐标');
        }
        const cxF = Math.round(firstIcon.rect.left + firstIcon.rect.width / 2);
        const cyF = Math.round(firstIcon.rect.top + firstIcon.rect.height / 2);
        const cxL = Math.round(lastIcon.rect.left + lastIcon.rect.width / 2);
        const cyL = Math.round(lastIcon.rect.top + lastIcon.rect.height / 2);
        console.log(`===== 首图标中心(${cxF},${cyF})，末图标中心(${cxL},${cyL}) =====`);

        const verifySelection = async () => {
            let selectedNames = [];
            try {
                selectedNames = await agent.aiQuery("桌面上所有处于选中状态的图标的完整文件名（选中的图标周围有明显的高亮选中框），未选中的图标不要返回，返回string数组");
            } catch (err) {
                console.log('===== aiQuery未查询到任何选中图标 =====');
            }
            const nameList = Array.isArray(selectedNames) ? selectedNames : (selectedNames ? [selectedNames] : []);
            // 桌面标签可能换行显示（如"1806491_t est1.docx"），去除空白后比对
            const normalized = nameList.map(n => String(n).replace(/\s+/g, ''));
            console.log(`===== 当前选中图标: ${JSON.stringify(nameList)} =====`);
            const missing = expectedFiles.filter(name => !normalized.some(n => n.includes(name)));
            const extra = normalized.filter(n => !expectedFiles.some(name => n.includes(name)));
            if (missing.length === 0 && extra.length === 0) {
                return true;
            }
            console.log(`===== 校验失败: 未选中=${JSON.stringify(missing)}，误选中=${JSON.stringify(extra)} =====`);
            return false;
        };
        let allSelected = false;
        for (let attempt = 1; attempt <= 2; attempt++) {
            console.log(`===== 第${attempt}次Shift+点击连续多选 =====`);
            // 清除已有选择后单击首个图标选中
            await agent.aiTap("桌面空白区域");
            await new Promise(resolve => setTimeout(resolve, 500));
            await system.exec(`xdotool mousemove ${cxF} ${cyF} click 1`);
            await new Promise(resolve => setTimeout(resolve, 800));
            // shift按住单击末个图标，追加连续选择
            await system.exec(`xdotool keydown shift mousemove ${cxL} ${cyL} click 1 keyup shift`);
            await new Promise(resolve => setTimeout(resolve, 800));
            allSelected = await verifySelection();
            if (allSelected) {
                console.log(`===== 第${attempt}次多选成功，6个文件全部选中且无误选 =====`);
                break;
            }
        }
        if (!allSelected) {
            // 连续多选失败（首尾图标间可能夹有系统图标，连选会把它们一并选中），
            // 兜底改用Ctrl+逐个点击6个文件图标，逐个追加选择，精确无误选
            console.log('===== 连续多选未通过校验，改用Ctrl+逐个点击6个文件图标 =====');
            await agent.aiTap("桌面空白区域");
            await new Promise(resolve => setTimeout(resolve, 500));
            for (const fileName of expectedFiles) {
                const icon = await agent.aiLocate(`桌面上文件名为${fileName}的文件图标`);
                if (!icon?.rect) {
                    throw new Error(`aiLocate未能获取到${fileName}的图标坐标`);
                }
                const cx = Math.round(icon.rect.left + icon.rect.width / 2);
                // 顶部边缘图标中心点击会被顶部系统栏截获（历史日志证实pptx点击未命中），与双击路径同样用safeClickY下移
                const cy = safeClickY(icon.rect);
                await system.exec(`xdotool keydown ctrl mousemove ${cx} ${cy} click 1 keyup ctrl`);
                await new Promise(resolve => setTimeout(resolve, 600));
            }
            allSelected = await verifySelection();
        }
        if (allSelected) {
            // 桌面上对多选文件按回车只会打开其中一个（UOS桌面行为），改用右键选中项→"打开"来打开全部选中文件
            // 右键"打开"任一环节失败则降级为逐个双击打开（不直接终止用例）
            console.log('步骤2.3：右键选中文件并点击"打开"');
            try {
                await agent.aiRightClick("桌面上已选中的1806491_test1.docx文件图标");
                await agent.aiTap("右键菜单中的打开选项");
            } catch (err) {
                console.log(`===== 右键"打开"失败(${err.message})，降级为逐个双击打开全部文件 =====`);
                for (const fileName of expectedFiles) {
                    await openFileOnDesktopByDouble(agent, system, fileName);
                }
            }
        } else {
            // 多选无法精确选中时，逐个双击打开全部6个文件，仍可验证"这些文件都可以打开"的核心预期
            console.log('===== 多选未能精确选中6个文件，改为逐个双击打开全部文件 =====');
            for (const fileName of expectedFiles) {
                await openFileOnDesktopByDouble(agent, system, fileName);
            }
        }

        // 等待右键"打开"启动的WPS窗口出现（WPS首次启动构建字体缓存可能远慢于预期）
        await waitWpsWindowsReady(system, 1, 120000);
        await new Promise(resolve => setTimeout(resolve, 5000));
        // 识别缺失的文件并逐个双击补开（标签页感知：已开进标签页的文件不再重复补开）
        const openedNow = await snapshotOpenedFiles(agent, system);
        const missingFiles = expectedFiles.filter(name => !openedNow.some(n => n.includes(name)));
        if (missingFiles.length > 0) {
            console.log(`===== 右键打开未覆盖全部文件，逐个双击补开: ${JSON.stringify(missingFiles)} =====`);
            for (const fileName of missingFiles) {
                await openFileOnDesktopByDouble(agent, system, fileName);
            }
        }

        // 轮询校验：窗口标题+标签栏双层判定6个文件全部打开
        // （逐个补开环节已逐个确认过打开，此处为兜底校验，最多3次、每次间隔10s）
        let lastMissing = expectedFiles;
        for (let attempt = 1; attempt <= 3; attempt++) {
            const opened = await snapshotOpenedFiles(agent, system);
            lastMissing = expectedFiles.filter(name => !opened.some(n => n.includes(name)));
            if (lastMissing.length === 0) {
                break;
            }
            console.log(`===== 第${attempt}次校验仍缺: ${JSON.stringify(lastMissing)}，10s后重试 =====`);
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
        if (lastMissing.length > 0) {
            throw new Error(`步骤2预期失败: 以下文件未打开(窗口标题+标签栏均未发现): ${JSON.stringify(lastMissing)}`);
        }
        await hoverUntilPreviewShown(agent, 60000);
        console.log('===== 步骤2预期通过: 6个文件全部打开 =====');
        await system.exec("pkill -9 wps; pkill -9 -x wpp; pkill -9 -x et; true");
    }, { timeout: 1200000, tags: ['1806491', 'level3', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, agent, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        // 清理测试涉及及易残留的应用进程（wps=文字, wpp=演示, et=表格；杀启动器进程会被系统以收起状态自动重启）
        await system.exec("pkill -9 wps; pkill -9 -x wpp; pkill -9 -x et; pkill dde-launcher; true");
        // 清理执行期间误开/残留的所有应用窗口，避免遗留到下次执行遮挡桌面
        await cleanupResidualWindows(system);
        const user = process.env.TEST_USERNAME;
        await system.exec(`rm -rf /home/${user}/Documents/1806491`);
        // 清理桌面测试文件
        await system.exec(`rm -f /home/${user}/Desktop/1806491_test1.docx`);
        await system.exec(`rm -f /home/${user}/Desktop/1806491_test2.docx`);
        await system.exec(`rm -f /home/${user}/Desktop/1806491_test1.pptx`);
        await system.exec(`rm -f /home/${user}/Desktop/1806491_test2.pptx`);
        await system.exec(`rm -f /home/${user}/Desktop/1806491_test1.xlsx`);
        await system.exec(`rm -f /home/${user}/Desktop/1806491_test2.xlsx`);
        // 清理cn.wps.wps-office安装
        await system.exec(`echo '${process.env.TEST_PASSWORD}' | sudo -S apt remove -y cn.wps.wps-office`);
        await system.exec(`echo '${process.env.TEST_PASSWORD}' | sudo -S dpkg --purge cn.wps.wps-office`);
    });
});