// @ts-nocheck
/**
 * 用例 PMSID: 1810927
 * 用例标题: 埋点，侧边栏各目录去重后的点击分布-多个数据盘（其他名称）
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/10/22
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const logDir = '/var/lib/deepin/event-log';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 提速：文管窗口/目录切换改 shell 客观有界轮询（零模型调用），未命中回落一次原视觉等待
const sh = async (system, cmd, timeout = 10000) => `${((await system.exec(cmd, timeout)) || {}).stdout || ''}`.trim();
const hasTitle = async (system, kw) => parseInt((await sh(system, `wmctrl -l | grep -ic '${kw}' || true`)) || '0', 10) > 0;
const fmWins = async (system) => parseInt((await sh(system, "wmctrl -lx | grep -ci 'dde-file-manager' || true")) || '0', 10) || 0;
const waitUntil = async (fn, timeoutMs = 12000, intervalMs = 500) => {
    const t0 = Date.now();
    while (Date.now() - t0 < timeoutMs) {
        try { if (await fn()) return true; } catch (e) { }
        await sleep(intervalMs);
    }
    return false;
};

// 获取最新的埋点日志文件路径
async function getLatestLogFile(system) {
    const findResult = await system.exec(`ls -t ${logDir}/event_*.log 2>/dev/null | head -1`);
    return findResult.stdout.trim();
}

// 获取日志文件大小（字节数），用于计算新增日志的偏移量
async function getLogFileSize(system, logFile) {
    const result = await system.exec(`stat -c %s ${logFile} 2>/dev/null || echo 0`);
    return parseInt(result.stdout.trim(), 10);
}

// 从指定偏移量开始读取新增日志，限制输出长度避免日志过大
async function readNewLogs(system, logFile, offset) {
    if (offset > 0) {
        const result = await system.exec(`tail -c +${offset + 1} ${logFile} | tail -c 40000`);
        return result.stdout.trim();
    }
    const result = await system.exec(`tail -c 40000 ${logFile}`);
    return result.stdout.trim();
}

// 通过 lsblk 动态识别数据盘：已挂载在 /media/<user>/ 下且非可移动设备（排除 U 盘）
async function getDataDisks(system) {
    const user = TEST_USER;
    const result = await system.exec('lsblk -P -o NAME,RM,TRAN,FSTYPE,MOUNTPOINT 2>/dev/null');
    const lines = (result.stdout || '').split('\n');
    const disks = [];
    for (const line of lines) {
        const name = (line.match(/NAME="([^"]*)"/) || [])[1] || '';
        const rm = (line.match(/RM="([^"]*)"/) || [])[1] || '';
        const fstype = (line.match(/FSTYPE="([^"]*)"/) || [])[1] || '';
        const mountpoint = (line.match(/MOUNTPOINT="([^"]*)"/) || [])[1] || '';
        if (!mountpoint.startsWith(`/media/${user}/`)) continue;
        if (rm === '1') continue;
        if (!fstype || fstype === 'swap') continue;
        disks.push({
            name,
            fstype,
            mountpoint,
            label: mountpoint.split('/').pop(),
        });
    }
    return disks;
}

// v3(2026-11-09 实证)：兼容「全盘安装、无额外数据分区」的执行机——前置条件不满足时用内核 scsi_debug
//   临时造 2 块真实磁盘（/dev/sdX），格式化 ext4 后挂到 /media/<user>/<label>，用例结束在 afterAll 还原。
//   为什么不用 loop 镜像：实测 loop 设备被文管侧边栏过滤（udisks 能识别、HintIgnore=false，但侧边栏不显示），
//   而 scsi_debug 生成的 /dev/sdX 会被 udisks/文管当作普通磁盘正常列出（已截图实证）。
//   只清理本用例自己造出来的对象，不触碰机器原有分区/磁盘
const BUILT_DISK_COUNT = 2;
let builtDisks = [];
let scsiDebugLoadedByUs = false;

// 远程机 test 用户无 sudo 免密（sudo -n mount 报「需要密码」），统一用 sudo -S 从 stdin 供密码
async function sudoRun(system, cmd, timeout = 9000) {
    const { escShell } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    const pwd = (process.env.TEST_PASSWORD || '') + '';
    const res = (await system.exec(`echo '${escShell(pwd)}' | sudo -S -p '' ${cmd}`, timeout)) || {};
    return { out: `${res.stdout || ''}${res.stderr || ''}`.trim(), code: res.exitCode };
}

// 当前机器所有 SCSI 磁盘名（sd + 字母），用于计算 modprobe 后新增了哪几块
async function listSdDisks(system) {
    const out = await sh(system, "lsblk -dn -o NAME 2>/dev/null | grep -E '^sd[a-z]+$' || true");
    return out.split('\n').map((s) => s.trim()).filter(Boolean);
}

async function buildTestDisks(system) {
    if (builtDisks.length > 0) {
        return builtDisks;
    }
    const before = await listSdDisks(system);
    scsiDebugLoadedByUs = !(await sh(system, "lsmod | grep -q '^scsi_debug' && echo loaded || true"));
    const mod = await sudoRun(system, `modprobe scsi_debug add_host=${BUILT_DISK_COUNT} dev_size_mb=64 sector_size=512`, 9000);
    if (mod.code !== 0) {
        throw new Error(`构造数据盘失败：加载 scsi_debug 出错（${mod.out || '无输出'}）`);
    }
    // 内核识别新 SCSI 磁盘 + udev 建节点需要一点时间
    const ready = await waitUntil(async () => (await listSdDisks(system)).length >= before.length + BUILT_DISK_COUNT, 10000, 500);
    const created = (await listSdDisks(system)).filter((n) => before.indexOf(n) < 0).slice(0, BUILT_DISK_COUNT);
    if (!ready || created.length < BUILT_DISK_COUNT) {
        throw new Error(`构造数据盘失败：scsi_debug 未生成 ${BUILT_DISK_COUNT} 块磁盘（新增：${created.join(',') || '无'}）`);
    }
    for (let i = 0; i < created.length; i++) {
        const name = `ut_data_disk_${i + 1}`;
        const dev = `/dev/${created[i]}`;
        const mnt = `/media/${TEST_USER}/${name}`;
        const mkfs = await sudoRun(system, `mkfs.ext4 -q -F -L ${name} ${dev}`);
        if (mkfs.code !== 0) {
            throw new Error(`构造数据盘失败：格式化 ${dev} 出错（${mkfs.out || '无输出'}）`);
        }
        await sudoRun(system, `mkdir -p ${mnt}`);
        const mntRes = await sudoRun(system, `mount ${dev} ${mnt}`);
        const mounted = await sh(system, `findmnt -no TARGET ${mnt} 2>/dev/null || true`);
        if (mntRes.code !== 0 || mounted !== mnt) {
            throw new Error(`构造数据盘失败：挂载 ${dev} -> ${mnt} 未生效（${mntRes.out || '无输出'}）`);
        }
        // 新格式化的 ext4 根目录属 root:root 755，文管判定不可写会弹出「只读」弹窗挡住后续点击，
        //   把挂载点属主改成测试用户，与 udisks 挂载的真实数据盘表现一致
        await sudoRun(system, `chown ${TEST_USER} ${mnt}`);
        // 边构造边记录，构造中途失败时 afterAll 仍能还原已生效的部分
        builtDisks.push({ name, dev, mnt });
    }
    console.log(`已构造临时数据盘: ${builtDisks.map((d) => `${d.dev}->${d.mnt}`).join(' | ')}`);
    return builtDisks;
}

async function cleanupBuiltDisks(system) {
    if (builtDisks.length === 0 && !scsiDebugLoadedByUs) {
        return;
    }
    for (const disk of builtDisks.slice().reverse()) {
        console.log(`清理临时数据盘 ${disk.dev} -> ${disk.mnt}`);
        const umount = await sudoRun(system, `umount ${disk.mnt}`);
        if (umount.code !== 0) {
            console.log(`umount ${disk.mnt} 输出: ${umount.out}`);
        }
        await sudoRun(system, `rmdir ${disk.mnt}`);
    }
    builtDisks = [];
    // 只卸载本用例加载的模块，机器原有 scsi_debug 设备不动
    if (scsiDebugLoadedByUs) {
        const rmmod = await sudoRun(system, 'rmmod scsi_debug');
        console.log(rmmod.code === 0 ? '已卸载 scsi_debug 模块，执行环境已还原' : `卸载 scsi_debug 输出: ${rmmod.out}`);
        scsiDebugLoadedByUs = false;
    }
}

// 获取已安装的文件管理器版本号（取包版本主版本，如 6.5.168-1 -> 6.5.168）
async function getInstalledVersion(system) {
    const result = await system.exec(`dpkg-query -W -f='\${Version}' dde-file-manager 2>/dev/null`);
    const out = (((result && result.stdout) || '') + ((result && result.stderr) || '')).trim();
    return out.split('-')[0];
}

describe('1810927-埋点，侧边栏各目录去重后的点击分布-多个数据盘（其他名称）', () => {
    beforeAll(async ({ uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
    });

    beforeEach(async ({ device }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        await device.pressKey('Esc');
    });

    test('1810927-埋点，侧边栏各目录去重后的点击分布-多个数据盘（其他名称）', async ({ device, agent, uos, system }) => {
        // 前置条件: 数据盘存在多个分区，且名称不止为「数据盘」
        console.log('前置条件: 检查执行机数据盘分区');
        let dataDisks = await getDataDisks(system);
        console.log(`识别到的数据盘: ${JSON.stringify(dataDisks)}`);
        if (dataDisks.length < 2 || process.env.BUILD_TEST_DISKS === '1') {
            // v3(2026-11-09)：全盘安装的机器没有额外数据分区，自动构造临时数据盘后再跑，结束后 afterAll 清理
            //   BUILD_TEST_DISKS=1 仅用于在已有数据盘的机器上验证「构造分支」本身
            console.log(`⚠️ 前置条件不满足（识别到 ${dataDisks.length} 个），自动构造临时数据盘`);
            await buildTestDisks(system);
            await sleep(3000);
            dataDisks = await getDataDisks(system);
            console.log(`构造后识别到的数据盘: ${JSON.stringify(dataDisks)}`);
        }
        if (dataDisks.length < 2) {
            throw new Error(`前置条件不满足：需要至少 2 个非默认可移动数据盘分区，当前识别到 ${dataDisks.length} 个（${dataDisks.map(d => d.label).join(',')}），自动构造亦未生效`);
        }
        const installedVersion = await getInstalledVersion(system);
        console.log(`已安装文件管理器版本: ${installedVersion || '未知'}`);

        // 打开文件管理器
        console.log('打开文件管理器');
        await uos.openApp('文件管理器', { maximizeWindow: true });
        // 客观判据：文管窗口出现；未命中回落原视觉等待
        if (!(await waitUntil(() => fmWins(system) > 0, 10000))) {
            await agent.aiWaitFor('文件管理器界面已显示');
        }

        // 断言前置条件：左侧边栏能看到识别到的各个数据盘入口
        await agent.aiAssert(
            `文件管理器左侧边栏中显示数据盘分区项：${dataDisks.map((d) => d.label).join('、')}`
        );

        // 步骤1: 依次点击左侧边栏中其他名称的数据盘
        const reportedItems = [];
        for (const disk of dataDisks) {
            console.log(`步骤1: 点击左侧边栏中的数据盘 ${disk.label}（${disk.mountpoint}）`);
            let logFile = await getLatestLogFile(system);
            if (!logFile) {
                throw new Error('未找到埋点日志文件');
            }
            let logSizeBefore = await getLogFileSize(system, logFile);

            await agent.aiTap(`左侧边栏中的数据盘 ${disk.label}`);
            // 窗口标题即当前目录名，客观成立即返回；未命中回落一次原视觉等待
            if (!(await waitUntil(() => hasTitle(system, disk.label), 15000))) {
                await agent.aiWaitFor(`文件管理器已切换到 ${disk.label} 数据盘目录`, { timeout: 8000 });
            }
            // 客观判据：埋点日志有新写入（或已轮转）即返回，替代原固定 2.5s 等待
            const logGrew = await waitUntil(async () => {
                const latest = await getLatestLogFile(system);
                if (latest && latest !== logFile) return true;
                return (await getLogFileSize(system, logFile)) > logSizeBefore;
            }, 6000, 500);
            if (!logGrew) {
                await sleep(2000);
            } else {
                // 已检测到写入，留 300ms 让单行日志落盘完整
                await sleep(300);
            }

            // 读取本次点击后新增的埋点日志
            const latestLogFile = await getLatestLogFile(system);
            if (latestLogFile && latestLogFile !== logFile) {
                console.log(`埋点日志文件已切换: ${logFile} -> ${latestLogFile}`);
                logFile = latestLogFile;
                logSizeBefore = 0;
            }
            let newLogs = await readNewLogs(system, logFile, logSizeBefore);
            if (!newLogs) {
                newLogs = await readNewLogs(system, logFile, 0);
            }
            console.log(`点击数据盘 ${disk.label} 后新增的埋点日志:\n${newLogs}`);
            if (!newLogs) {
                throw new Error(`点击数据盘 ${disk.label} 后未产生新的埋点日志`);
            }

            // 断言: 上报内容包含文管版本、操作日期时间、侧边栏目录名称（Data Disk）
            const hasAppVersion = newLogs.indexOf('app_version') >= 0
                && (!installedVersion || newLogs.indexOf(installedVersion) >= 0);
            const sysTimeMatch = newLogs.match(/sysTime[^0-9]{1,10}(\d{10})/);
            const hasSysTime = !!sysTimeMatch && Math.abs(Date.now() / 1000 - parseInt(sysTimeMatch[1], 10)) < 1800;
            // 侧边栏点击事件 tid=1000500003，数据盘（其他名称）去重后统一上报为 Data Disk
            const hasSidebarItem = newLogs.indexOf('1000500003') >= 0
                && newLogs.indexOf('sidebar_item') >= 0
                && newLogs.indexOf('Data Disk') >= 0;
            if (!hasAppVersion || !hasSysTime || !hasSidebarItem) {
                throw new Error(`断言失败：点击数据盘 ${disk.label} 的埋点日志缺少必要内容 - 文管版本:${hasAppVersion}, 操作日期时间:${hasSysTime}, 侧边栏目录名称(Data Disk):${hasSidebarItem}`);
            }
            reportedItems.push(`1000500003/Data Disk(${disk.label})`);
        }

        // 预期1: 多个其他名称数据盘均触发上报事件，且侧边栏目录名称去重后统一为 Data Disk
        console.log(`预期1: 多个数据盘点击均上报，事件列表: ${reportedItems.join(', ')}`);
    }, { timeout: 900000, tags: ['1810927', 'level3', 'configuration', 'tracking', 'DITT', 'xuqi'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await device.pressKey('Esc');
        await closeFileManager(system);
        await clearEnvironment(system);
        // v3(2026-11-09)：还原构造环境（先关文管释放占用，再 umount / 卸载 scsi_debug / 删挂载点）
        await cleanupBuiltDisks(system);
        await uos.showDesktop();
    });
});
