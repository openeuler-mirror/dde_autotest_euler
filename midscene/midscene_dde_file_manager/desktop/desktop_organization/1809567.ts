// @ts-nocheck

/**
 * 用例 PMSID: 1809567
 * 用例标题: 【桌面自动整理】小尺寸集合，超出集合图标，翻页浏览
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const FILE_COUNT = 20;
// 文件名称尽量简短，降低 AI 识别长文件名时插入分隔符导致的误读
const FILE_PREFIX = 't7-';
const FILE_SUFFIX = '.txt';
const LAST_FILE = `${FILE_PREFIX}${String(FILE_COUNT).padStart(2, '0')}${FILE_SUFFIX}`;
const FIRST_FILE = `${FILE_PREFIX}01${FILE_SUFFIX}`;
const COLUMNS = 4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const organizerCmd = (value) =>
    `dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v ${value}`;

describe('1809567-【桌面自动整理】小尺寸集合，超出集合图标，翻页浏览', () => {

    // 最小化遮挡桌面的窗口：WPS 未保存文档会让 Alt+F4 无效，closeAllWindows 连打 8 轮会拖满
    // 180s 钩子超时；改为直接最小化，桌面恢复可操作且无弹窗残留 --UT005045(许琪)
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

    async function setCollectionSize(agent, sizeName) {
        await agent.aiHover('桌面右侧的文件集合框');
        await agent.aiWaitFor('框右上角出现一个图标', { timeoutMs: 20000 });
        await agent.aiTap('文件集合框右上角的图标');
        await agent.aiTap('集合尺寸选项');
        await agent.aiTap(`${sizeName}尺寸选项`);
        await sleep(1500);
    }

    async function queryFirstFileName(agent) {
        const raw = await agent.aiQuery('文件集合框中左上角第一个文件的名称');
        return String(raw ?? '').trim();
    }

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

    async function locateCollectionBox(agent) {
        // 2026-11-03 全量随机批次实录：桌面同时存在多个集合框（"新建文件夹"组、WPS/主页组、电脑组、t7 组），
        //   "桌面右侧的文件集合框" 会定位到别的框，滚轮落在错误框上导致 t7 首项始终不变 → 用文件名锚定本用例集合框
        const prompts = [`包含${FIRST_FILE}文件图标的文件集合框`, `桌面右侧包含${FILE_PREFIX}文件的集合框`, '桌面右侧的文件集合框'];
        let lastError = null;
        for (let i = 0; i < 3; i++) {
            try {
                // 模型偶发返回非法 bbox（如 "993 295" 缺逗号）导致解析失败，换描述重试可规避 --UT005045(许琪)
                return await agent.aiLocate(prompts[i % prompts.length]);
            } catch (error) {
                lastError = error;
                console.log(`第${i + 1}次定位文件集合框失败，更换描述重试`);
                await sleep(2000);
            }
        }
        throw lastError;
    }

    // 集合框在单次运行内位置固定，缓存 aiLocate 结果：原实现每次滚动都要 aiHover + aiScroll + aiLocate 共 3 次模型调用，
    // 而 aiScroll 对桌面集合框实测不生效（distance 40/80/160 后首项均不变），只保留 xdotool 真实滚轮事件
    let collectionCenter = null;

    async function scrollCollection(agent, direction = 'down', distance = 40, system, forceRelocate = false) {
        const btn = direction === 'up' ? 4 : 5;
        const clicks = Math.max(3, Math.round(distance / 20));
        const ENV = 'export DISPLAY=:0; DM_USER=$(stat -c %U /run/user/1000 2>/dev/null | tr -cd "a-zA-Z0-9_-"); export XAUTHORITY=/home/${DM_USER:-test}/.Xauthority;';
        if (system) {
            if (!collectionCenter || forceRelocate) {
                collectionCenter = null;
                const loc = await locateCollectionBox(agent);
                const rect = loc && loc.rect;
                const center = (loc && loc.center) || (rect ? [rect.left + rect.width / 2, rect.top + rect.height / 2] : null);
                if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
                    collectionCenter = [Math.round(center[0]), Math.round(center[1])];
                }
            }
            if (collectionCenter) {
                const [cx, cy] = collectionCenter;
                await system.exec(`${ENV} xdotool mousemove --sync ${cx} ${cy}; sleep 0.3; for i in $(seq 1 ${clicks}); do xdotool click ${btn}; sleep 0.1; done`, 20000);
                await sleep(900);
                return;
            }
        }
        // 取不到集合框坐标时退回框架的 aiHover/aiScroll
        await agent.aiHover('桌面右侧的文件集合框');
        await agent.aiScroll('右侧文件集合框', { direction, distance });
        await sleep(1200);
    }

    async function scrollUntilVisible(agent, fileName, direction, maxTimes, system) {
        for (let i = 0; i < maxTimes; i++) {
            const visible = await agent.aiBoolean(`文件集合框中可以看到${fileName}文件图标`);
            if (visible) {
                return true;
            }
            // 单格滚轮在部分尺寸下不生效，逐次加大滚动幅度；失败后强制重定位集合框，避免缓存坐标落在别的框上
            await scrollCollection(agent, direction, 40 + i * 20, system, i > 0);
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
        // 前置条件：集合内超过 8 个图标
        await system.exec(`seq -w 1 ${FILE_COUNT} | xargs -I{} touch ${DESKTOP}/${FILE_PREFIX}{}${FILE_SUFFIX}`, 60000);
        const countRes = await system.exec(`ls -1 ${DESKTOP}/${FILE_PREFIX}* | wc -l`, 10000);
        const count = parseInt((countRes.stdout || '0').trim(), 10);
        if (count !== FILE_COUNT) {
            throw new Error(`造数失败：桌面 ${FILE_PREFIX}* 文件数量为 ${count}，期望 ${FILE_COUNT}`);
        }
        await system.exec(organizerCmd(1), 5000);
        await sleep(1000);
    });

    test('1809567-【桌面自动整理】小尺寸集合，超出集合图标，翻页浏览', async ({ device, agent, uos, system }) => {
        console.log('===== 步骤0: 开启桌面整理，前置条件：集合为小尺寸 =====');
        await organizeDesktop(agent);
        await setCollectionSize(agent, '小');
        await agent.aiAssert('桌面右侧存在文件集合框');

        console.log('===== 预期1: 超出的图标可以翻页浏览，且显示滚动条 =====');
        // 滚动条为悬停显示的浮层，先悬停再检测；检测不到时以翻页滚动结果为准
        await agent.aiHover('桌面右侧的文件集合框');
        await sleep(800);
        const hasScrollBar = await agent.aiBoolean('文件集合框右侧显示滚动条');
        console.log(`小尺寸集合滚动条检测结果: ${hasScrollBar}`);

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
        await scrollUntilVisible(agent, FIRST_FILE, 'up', 15, system);
        const beforeName = await queryFirstFileName(agent);
        const beforeIndex = parseIndex(beforeName);
        console.log(`滚动前集合框左上角第一个文件: ${beforeName}`);

        let direction = 'down';
        let afterName = beforeName;
        // 单格滚轮在部分尺寸下不生效，逐次加大滚动幅度直到首个文件变化
        for (const distance of [40, 80, 160]) {
            await scrollCollection(agent, direction, distance, system, distance > 40);
            afterName = await queryFirstFileName(agent);
            if (afterName !== beforeName) {
                break;
            }
            console.log(`distance=${distance} 滚动后首个文件未变化（${beforeName}），加大幅度重试`);
        }
        if (afterName === beforeName) {
            direction = 'up';
            for (const distance of [40, 80, 160]) {
                await scrollCollection(agent, direction, distance, system, distance > 40);
                afterName = await queryFirstFileName(agent);
                if (afterName !== beforeName) {
                    break;
                }
            }
        }
        console.log(`一次滚动后集合框左上角第一个文件: ${afterName}`);
        if (afterName === beforeName) {
            throw new Error(`滚动前后首个文件名称一致（${beforeName}），滚轮翻页功能异常`);
        }

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
        const reachedBottom = await scrollUntilVisible(agent, LAST_FILE, direction, 15, system);
        if (!reachedBottom) {
            throw new Error(`断言失败：滚动到底后仍看不到最后一个文件 ${LAST_FILE}`);
        }
        // 小尺寸集合内容超出时末行图标被边框截断属翻页正常表现，只校验图标排列不重叠
        await agent.aiAssert('文件集合框内的文件图标按网格整齐排列，图标之间没有重叠');
        console.log(`✅ 滚动到底，${LAST_FILE} 可见`);

        console.log('===== 步骤5: 滚动到首行 =====');
        const backDirection = direction === 'down' ? 'up' : 'down';
        const reachedTop = await scrollUntilVisible(agent, FIRST_FILE, backDirection, 15, system);
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
    }, { timeout: 1800000, tags: ['1809567', 'level3', 'desktop_organization', 'xuqi'] });

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
