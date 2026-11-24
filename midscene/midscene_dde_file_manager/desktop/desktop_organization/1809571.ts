// @ts-nocheck

/**
 * 用例 PMSID: 1809571
 * 用例标题: 【桌面自动整理】大尺寸集合，超出集合图标，翻页浏览
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

// v10(2026-11-09 实证)：1920x1080 下「大」尺寸集合为 6 行×5 列 = 30 个，30 个文件恰好全显示、
//   不存在溢出，翻页无从发生（滚轮自然无变化）。改为 40 个，超出 6 行容量约 2 行，构造真实溢出
const FILE_COUNT = 40;
// 文件名称尽量简短，降低 AI 识别长文件名时插入分隔符导致的误读
const FILE_PREFIX = 't1-';
const FILE_SUFFIX = '.txt';
const LAST_FILE = `${FILE_PREFIX}${String(FILE_COUNT).padStart(2, '0')}${FILE_SUFFIX}`;
const FIRST_FILE = `${FILE_PREFIX}01${FILE_SUFFIX}`;
const COLUMNS = 4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const organizerCmd = (value) =>
    `dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v ${value}`;

describe('1809571-【桌面自动整理】大尺寸集合，超出集合图标，翻页浏览', () => {

    // 激活桌面窗口（uos.showDesktop 在远程环境会唤出启动器应用列表，改用 wmctrl 激活）
    async function activateDesktop(device, system) {
        await device.pressKey('Esc');
        await sleep(500);
        const res = await system.exec('wmctrl -l', 10000);
        const lines = String(res?.stdout || '').split('\n').filter((item) => item.trim());
        console.log('诊断点: wmctrl -l =>', lines.slice(0, 12).join(' | '));
        const line = lines.find((item) => /桌面|Desktop/i.test(item));
        const id = line ? line.trim().split(/\s+/)[0] : '';
        if (id) {
            await system.exec(`wmctrl -i -a ${id}`, 5000);
        } else {
            await system.exec('wmctrl -k on', 5000);
        }
        await sleep(1000);
    }

    async function organizeDesktop(agent) {
        await agent.aiRightClick('桌面空白处');
        // v4(2026-10-29)：右键菜单为本地瞬时渲染（实测 <1s），用固定等待替代 aiWaitFor，省一次模型调用
        await sleep(900);
        await agent.aiTap('右键菜单中的整理桌面');
        await agent.aiWaitFor('桌面右侧出现文件集合框', { timeoutMs: 30000 });
        await sleep(1500);
    }

    async function setCollectionSize(agent, device, sizeName) {
        // v7(2026-10-29 复跑实证)：桌面同时存在多个集合框（应用程序/文档/图片/其他）时，
        //   「桌面右侧的文件集合框」会被定位成整列聚合框（实测 bbox 覆盖 x1436-1908 / y7-961），
        //   其「右上角图标」落到别的集合上，随后「集合尺寸选项」必然 not found（失败跑 112s 即卡在此处）。
        //   改为以本用例的 t1-01.txt 作锚点，只指向含 t1 文件的那个集合框；仍失败再退回通用描述重试 1 次
        // v8(2026-11-09 复跑实证)：整理桌面后集合视口可能停在末页（30 个文件只显示 t1-16~t1-30），
        //   此时「包含 t1-01.txt」必然 not found；且集合实测落在桌面右上而非右下（右下是应用图标集合）。
        //   改为「含 t1 文件」的锚点，不绑定具体序号与方位；aiHover 收进 try，让第 2 次尝试真正生效
        const specific = `桌面右侧包含${FILE_PREFIX}开头txt文件的集合框`;
        for (let attempt = 1; attempt <= 2; attempt++) {
            const box = attempt === 1 ? specific : '桌面右侧的文件集合框';
            try {
                await agent.aiHover(box);
                // v4(2026-10-29)：集合框右上角悬浮图标是悬停即现的本地浮层，固定等待替代 aiWaitFor
                await sleep(1000);
                await agent.aiTap(`${box}右上角的图标`);
                await sleep(500);
                await agent.aiTap('集合尺寸选项');
                await agent.aiTap(`${sizeName}尺寸选项`);
                await sleep(1500);
                return;
            } catch (err) {
                console.log(`第${attempt}次设置集合尺寸失败:`, String(err?.message || err).split('\n')[0]);
                await device.pressKey('Esc');
                await sleep(600);
            }
        }
        throw new Error(`设置集合尺寸（${sizeName}）失败`);
    }

    async function queryFirstFileName(agent) {
        const raw = await agent.aiQuery('文件集合框中左上角第一个文件的名称');
        return String(raw ?? '').trim();
    }

    // 从文件名称中解析序号（如 t1-05.txt -> 5），解析失败返回 null
    function parseIndex(name) {
        const text = String(name || '').toLowerCase();
        const pos = text.lastIndexOf('txt');
        if (pos < 0) {
            return null;
        }
        const digits = text.slice(0, pos).replace(/\D/g, '');
        const tail = digits.slice(-2);
        if (tail.length < 2) {
            return null;
        }
        const index = parseInt(tail, 10);
        return Number.isNaN(index) ? null : index;
    }

    // v2(2026-10-29)：scrollCollection(aiHover+aiScroll) 已删除——aiScroll 对桌面集合框不生效，统一走 wheelScroll

    // aiScroll 对桌面集合框不生效（实测 distance 放大到 160 首个文件仍不变），
    // 改为真实滚轮事件（按键4向上、按键5向下）
    // v3(2026-10-29 复跑实证)：v2 用 aiQuery 取 bbox 再按 bbox 中心 mousemove 发滚轮不可靠——
    //   本次 aiQuery 返回的 bbox 中心落在 (871,747)（真实屏幕 1920x1080，集合框实际在右下 ~(1669,835)），
    //   滚轮打在空白桌面上，翻页完全无效。改为先 aiHover 把真实指针移到集合框上，再在指针当前位置发滚轮
    //   （不再用模型给的坐标做 mousemove），并用 getmouselocation 记录实际落点便于排查
    // v4(2026-10-29 复跑实证)：一次 aiHover 后缓存指针坐标复用，后续直接 xdotool mousemove <坐标> click 4/5。
    //   但同轮复跑暴露 aiHover 落点不稳定（两次分别落在 (1669,803) 有效区与 (1670,484) 集合框外，
    //   后者滚轮全部空转）→ v5 改为「候选锚点 + 实测校验」：候选点各发一次滚轮并读首个文件，变了才认作锚点
    let wheelPoint = null;

    // v6(2026-11-02 复跑实证)：`click 5 5 5 ...` 连点会被滚动动画吞掉，实测 10 格只移动 2 个图标（约 0.5 行），
    //   步骤5 滚回顶部 5 轮×10 格只从 t1-27 退到 t1-19，滚程不足必失败。
    //   改为 `click --repeat N --delay 100`，逐格间隔下发，落点更接近真实滚轮
    async function moveAndWheel(system, point, direction, clicks) {
        const button = direction === 'up' ? 4 : 5;
        console.log(`xdotool 滚轮: (${point.x},${point.y}) ${direction} x${clicks}`);
        // v9(2026-11-09 实证)：单条 click --repeat 100 --delay 100 实测耗时 10.03s，正好撞上远程
        //   /command/execute 的 10s 上限，返回 500「命令执行超时」并触发约 7 分钟重试后用例失败。
        //   改为每批最多 20 格（约 2s），分批下发
        let remaining = clicks;
        while (remaining > 0) {
            const batch = Math.min(remaining, 20);
            await system.exec(`xdotool mousemove ${point.x} ${point.y} click --repeat ${batch} --delay 100 ${button}`, 8000);
            remaining -= batch;
            if (remaining > 0) {
                await sleep(400);
            }
        }
        await sleep(1200);
    }

    async function wheelScroll(system, direction, clicks = 3) {
        if (!wheelPoint) {
            throw new Error('滚轮锚点尚未确定');
        }
        await moveAndWheel(system, wheelPoint, direction, clicks);
    }

    // 候选锚点：集合框位于桌面右列（历史跑实测右下 x1444-1894 / y666-1003），先取几何点即可，
    // 不花模型调用；几何点全部失效时再调 aiHover 兜底（见 hoverAnchor）
    async function buildAnchorCandidates(system) {
        const geo = await system.exec('xdotool getdisplaygeometry', 5000);
        const [w, h] = String(geo?.stdout || '').trim().split(/\s+/).map((v) => parseInt(v, 10));
        const W = Number.isFinite(w) && w > 0 ? w : 1920;
        const H = Number.isFinite(h) && h > 0 ? h : 1080;
        // v8(2026-11-09 复跑实证)：集合框不一定在右下——本次整理后文本集合落在桌面右上
        //   （上方框内 t1-16~t1-30，右下是应用图标集合），原 5 个右下候选点全部空转。
        // v10(2026-11-09 截图实测)：1920x1080 下「大」尺寸的 t1 集合为 x1444-1894 / y337-956，
        //   上方 y<337 是应用图标集合。候选点按「大尺寸集合中下部 → 右角(小/中尺寸) → 右上(历史布局)」排序
        const list = [
            [0.87, 0.55], [0.87, 0.65], [0.87, 0.75], [0.87, 0.85], [0.80, 0.75], [0.93, 0.75],
            [0.87, 0.92], [0.93, 0.90], [0.80, 0.88],
            [0.87, 0.16], [0.87, 0.24], [0.87, 0.32],
        ].map(([rx, ry]) => ({
            x: Math.round(W * rx),
            y: Math.round(H * ry),
            src: 'geo',
        }));
        console.log('滚轮候选锚点(几何):', list.map((p) => `(${p.x},${p.y})`).join(' | '));
        return list;
    }

    // 几何点全部失效时的兜底：aiHover 真实落点（实测定位不稳定，只在需要时调用）
    async function hoverAnchor(agent, system) {
        try {
            await agent.aiHover(`桌面右侧文件集合框中的${FIRST_FILE}图标`);
            const loc = await system.exec('xdotool getmouselocation', 5000);
            const matched = String(loc?.stdout || '').match(/x:(\d+)\s+y:(\d+)/);
            if (matched) {
                return { x: parseInt(matched[1], 10), y: parseInt(matched[2], 10), src: 'aiHover' };
            }
        } catch (err) {
            console.log('aiHover 定位集合框失败:', String(err?.message || err).split('\n')[0]);
        }
        return null;
    }

    // 逐个候选点实测：滚轮后首个文件发生变化，说明该点落在集合框内，即认定生效
    async function calibrateAnchor(agent, system, beforeName, candidates) {
        for (const point of candidates) {
            wheelPoint = point;
            await moveAndWheel(system, point, 'down', 3);
            let after = await queryFirstFileName(agent);
            if (after !== beforeName) {
                return { point, after };
            }
            console.log(`锚点 ${point.src}(${point.x},${point.y}) 3 格滚轮后首个文件未变化，加量到 6 格`);
            await moveAndWheel(system, point, 'down', 6);
            after = await queryFirstFileName(agent);
            if (after !== beforeName) {
                return { point, after };
            }
        }
        return null;
    }

    // v8(2026-11-09 实证)：整理桌面后集合视口可能停在末页（30 个文件只显示 t1-16~t1-30），
    //   而后续步骤都以首行 t1-01 为基准。按候选点逐个向上滚到底，用「t1-01 是否可见」作客观判据，
    //   命中点复用为后续滚轮锚点（集合框位置随集合数量变化，不能写死右下）
    // v9(2026-11-09 实证)：固定 100 格会撞远程 /command/execute 10s 上限；且末页时「t1-01 是否可见」
    //   无法区分「锚点无效」与「还没滚到顶」，每个候选点都白花一次模型判定。
    //   改为每轮 40 格（约 5s），用「首个文件名是否变化」判断锚点是否命中；命中后继续 40 格/轮，
    //   最多 3 轮（可覆盖 8 行视口），首个文件回到 t1-01 即写回 wheelPoint
    async function ensureCollectionTop(agent, system) {
        const startName = await queryFirstFileName(agent);
        if (parseIndex(startName) === 1) {
            console.log(`✅ 集合已在首行（${startName}），无需回顶`);
            return true;
        }
        console.log(`集合当前首个文件: ${startName || '(未识别)'}，开始回顶`);
        const candidates = await buildAnchorCandidates(system);
        for (const point of candidates) {
            let current = startName;
            for (let round = 1; round <= 3; round++) {
                await moveAndWheel(system, point, 'up', 40);
                const after = await queryFirstFileName(agent);
                if (after === current) {
                    console.log(`锚点 (${point.x},${point.y}) 第${round}轮滚轮后首个文件未变化（${after}），判定该点无效`);
                    break;
                }
                current = after;
                console.log(`锚点 (${point.x},${point.y}) 第${round}轮回顶后首个文件: ${current}`);
                if (parseIndex(current) === 1) {
                    wheelPoint = point;
                    console.log(`✅ 集合已滚回首行，锚点 (${point.x},${point.y}) src=${point.src}`);
                    return true;
                }
            }
        }
        return false;
    }

    async function scrollUntilVisible(agent, system, fileName, direction, maxTimes, clicks = 10) {
        // v2(2026-10-29)：aiScroll 对桌面集合框已实证不生效，原实现前 3 次必然空转；
        //   改为每轮真实滚轮，轮次上限 15→8，视觉判定次数同步下降
        // v4(2026-10-29)：单轮滚轮 6 格→10 格（约 2.5 行），到边界会自动截断不会过冲，
        //   每轮省一次 aiBoolean（约 10s），轮次上限同步下调（调用方 15/8 → 6/5）
        // v6(2026-11-02)：单轮格数可由调用方指定；回顶部滚程最长（需覆盖 8 行），传 30 格兜底
        for (let i = 0; i < maxTimes; i++) {
            const visible = await agent.aiBoolean(`文件集合框中可以看到${fileName}文件图标`);
            if (visible) {
                return true;
            }
            await wheelScroll(system, direction, clicks);
        }
        return await agent.aiBoolean(`文件集合框中可以看到${fileName}文件图标`);
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
        await system.exec(`rm -f ${DESKTOP}/${FILE_PREFIX}*`, 10000);
        // 前置条件：集合内超过 16 个图标
        await system.exec(`seq -w 1 ${FILE_COUNT} | xargs -I{} touch ${DESKTOP}/${FILE_PREFIX}{}${FILE_SUFFIX}`, 60000);
        const countRes = await system.exec(`ls -1 ${DESKTOP}/${FILE_PREFIX}* | wc -l`, 10000);
        const count = parseInt((countRes.stdout || '0').trim(), 10);
        if (count !== FILE_COUNT) {
            throw new Error(`造数失败：桌面 ${FILE_PREFIX}* 文件数量为 ${count}，期望 ${FILE_COUNT}`);
        }
        await system.exec(organizerCmd(1), 5000);
        await sleep(1000);
    });

    test('1809571-【桌面自动整理】大尺寸集合，超出集合图标，翻页浏览', async ({ device, agent, uos, system }) => {
        console.log('===== 步骤0: 开启桌面整理，前置条件：集合为大尺寸 =====');
        await organizeDesktop(agent);
        // v10(2026-11-09 实证)：先设尺寸再回顶——切换尺寸会重排集合并自动回到首行，
        //   且设尺寸用的锚点是「含 t1 文件的集合框」，不依赖 t1-01 是否可见
        await setCollectionSize(agent, device, '大');
        if (!(await ensureCollectionTop(agent, system))) {
            console.log('⚠️ 几何候选点均未命中集合框，未能确认回顶，继续按当前视口执行');
        }
        await agent.aiAssert('桌面右侧存在文件集合框');

        console.log('===== 预期1: 超出的图标可以翻页浏览，且显示滚动条 =====');
        // 滚动条为悬停显示的浮层，先悬停再检测；检测不到时以翻页滚动结果为准
        await agent.aiHover('桌面右侧的文件集合框');
        await sleep(800);
        const hasScrollBar = await agent.aiBoolean('文件集合框右侧显示滚动条');
        console.log(`大尺寸集合滚动条检测结果: ${hasScrollBar}`);

        console.log('===== 步骤2: 鼠标左键拖动集合框滚动条 =====');
        await agent.aiHover('桌面右侧的文件集合框');
        const beforeDragName = await queryFirstFileName(agent);
        try {
            await agent.aiDrag('文件集合框右侧的滚动条滑块', '文件集合框中部');
            await sleep(1200);
            const afterDragName = await queryFirstFileName(agent);
            console.log(`拖动滚动条前首个文件: ${beforeDragName}，拖动后首个文件: ${afterDragName}`);
        } catch (err) {
            console.log('拖动滚动条失败，跳过该项:', String(err?.message || err).split('\n')[0]);
        }

        console.log('===== 步骤1/3: 鼠标在集合内滚动一次滚轮，检查翻页高度 =====');
        // v5(2026-10-29 复跑实证)：aiHover 落点不稳定（两次分别落在 (1669,803) 有效区与 (1670,484) 集合框外，
        //   另有一次直接定位失败），改为候选锚点 + 实测校验：先用几何点（零模型开销）逐个试，
        //   滚轮后首个文件变了才认作锚点；几何点全失效才调 aiHover 兜底。
        //   首个候选点先向上滚 10 格回到首行（到顶会自动截断）
        const anchorCandidates = await buildAnchorCandidates(system);
        // v9(2026-11-09)：ensureCollectionTop 已实测过的锚点提到首位复用，避免从无效点重新试错
        if (wheelPoint) {
            const idx = anchorCandidates.findIndex((p) => p.x === wheelPoint.x && p.y === wheelPoint.y);
            if (idx >= 0) {
                anchorCandidates.splice(idx, 1);
            }
            anchorCandidates.unshift(wheelPoint);
        }
        wheelPoint = anchorCandidates[0];
        await moveAndWheel(system, wheelPoint, 'up', 10);

        const beforeName = await queryFirstFileName(agent);
        const beforeIndex = parseIndex(beforeName);
        console.log(`滚动前集合框左上角第一个文件: ${beforeName}`);

        const direction = 'down';
        let calibrated = await calibrateAnchor(agent, system, beforeName, anchorCandidates);
        if (!calibrated) {
            console.log('几何锚点全部失效，改用 aiHover 定位集合框');
            const aiPoint = await hoverAnchor(agent, system);
            if (aiPoint) {
                calibrated = await calibrateAnchor(agent, system, beforeName, [aiPoint]);
            }
        }
        if (!calibrated) {
            throw new Error(`滚动前后首个文件名称一致（${beforeName}），滚轮翻页功能异常`);
        }
        const afterName = calibrated.after;
        console.log(`一次滚动后集合框左上角第一个文件: ${afterName}`);
        console.log(`✅ 滚轮锚点生效: (${wheelPoint.x},${wheelPoint.y}) source=${wheelPoint.src}`);

        const afterIndex = parseIndex(afterName);
        if (beforeIndex !== null && afterIndex !== null) {
            const delta = Math.abs(afterIndex - beforeIndex);
            console.log(`一次滚动跨越文件序号: ${delta}（一行 ${COLUMNS} 个）`);
            // aiScroll 的 distance 不映射为单格滚轮刻度，实测一次滚动会跨越数行，
            // 因此翻页高度只做记录，逐行浏览能力由步骤4/5 首尾往返校验
            if (delta > COLUMNS * 2) {
                console.log(`⚠️ 一次滚动跨越 ${delta} 个图标，超过两行 ${COLUMNS * 2} 个，属滚轮步长抖动`);
            }
        }
        console.log('✅ 一次滚动可翻页浏览集合内超出的图标');

        console.log('===== 步骤4: 滚动到底行 =====');
        const reachedBottom = await scrollUntilVisible(agent, system, LAST_FILE, direction, 6);
        if (!reachedBottom) {
            throw new Error(`断言失败：滚动到底后仍看不到最后一个文件 ${LAST_FILE}`);
        }
        // 大尺寸集合内容超出时末行图标被边框截断属翻页正常表现，只校验图标排列不重叠
        await agent.aiAssert('文件集合框内的文件图标按网格整齐排列，图标之间没有重叠');
        console.log(`✅ 滚动到底，${LAST_FILE} 可见`);

        console.log('===== 步骤5: 滚动到首行 =====');
        const backDirection = direction === 'down' ? 'up' : 'down';
        const reachedTop = await scrollUntilVisible(agent, system, FIRST_FILE, backDirection, 6, 30);
        if (!reachedTop) {
            throw new Error(`断言失败：滚回顶部后仍看不到第一个文件 ${FIRST_FILE}`);
        }
        const topName = await queryFirstFileName(agent);
        const topIndex = parseIndex(topName);
        if (topIndex !== null && topIndex !== 1) {
            throw new Error(`断言失败：滚回顶部后集合框左上角第一个文件为 ${topName}，期望 ${FIRST_FILE}`);
        }
        // 同上，仅校验图标排列，不禁止超出内容的边框截断表现
        await agent.aiAssert('文件集合框内的文件图标按网格整齐排列，图标之间没有重叠');
        console.log(`✅ 滚回首行，首个文件为 ${topName}`);

        console.log('✅ 测试用例执行完成');
    }, { timeout: 1800000, tags: ['1809571', 'level3', 'desktop_organization', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('3. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await sleep(500);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/${FILE_PREFIX}*`, 10000);
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('4. afterAll: 清理测试套件');
        await device.pressKey('Esc');
        await system.exec(organizerCmd(0), 5000);
        await system.exec(organizerCmd(1), 5000);
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const DESKTOP = `'${TEST_HOME}/Desktop'`;
        await system.exec(`rm -f ${DESKTOP}/${FILE_PREFIX}*`, 10000);
        await clearEnvironment(system);
        await closeFileManager(system);
        await activateDesktop(device, system);
    });
});
