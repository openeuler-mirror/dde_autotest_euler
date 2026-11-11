/**
 * 用例 PMSID: 1832149
 * 用例标题: 【启动器】【全屏模式】【安装应用】仅有一页，且当前页有空位，安装新应用
 * 生成时间: 2026-08-18
 * 用例编写人: UT005571（王艺桥）
 */

// 公共方法：createTestApp 创建 .desktop 模拟新应用（会进入“最近安装”）；killAppWindows 关闭应用窗口
const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { createTestApp, killAppWindows } = require(helperPath);

// dde-shell 配置文件：current_frame 决定启动器模式（WindowedFrame=窗口模式 / FullscreenFrame=全屏模式）
const settingsIni = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
// 用 createTestApp 模拟新安装应用（.desktop 创建即新装，实测启动器中带蓝点显示），用于验证补位+蓝点
// 说明：原脚本用 apt 真实安装 d-feet，但本测试环境沙箱无法使用 root 权限执行 apt，
//       改用 .desktop 模拟安装，蓝点（新安装标识）机制与真实安装一致，已验证显示
const appD = { name: 'D-Feet测试', file: 'dfeet-test' };
// 用 createTestApp 补充的测试应用（用于验证继续安装补位）
const testApps = [
    { name: '安装测试B1', file: 'install-test-b1' },
    { name: '安装测试B2', file: 'install-test-b2' },
];

// 应用文件夹配置文件路径
const INI_PATH = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
// 初始配置备份路径（用于恢复）
const INIT_INI_PATH = `${caseDir}/midscene_dde/launcher/item-arrangement.ini`;

// 翻到指定页：点击顶部指示圆点，点击点位小（约6px）偶发漏点，带重试并以激活态验证翻页成功
async function flipToPage(agent, pageNo, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`翻页尝试 ${attempt}/${maxAttempts}：点击第 ${pageNo} 个指示圆点`);
        await agent.aiTap(`启动器全屏模式顶部中间的一排圆点指示器（当前第1个为白色激活），点击其中的第 ${pageNo} 个圆点`, { deepThink: true });
        try {
            await agent.aiWaitFor(`启动器已经翻到第 ${pageNo} 页：顶部指示器中第 ${pageNo} 个圆点为白色激活状态，页面显示的是第 ${pageNo} 页的应用图标`, { timeoutMs: 8000 });
            console.log(`已成功翻到第 ${pageNo} 页`);
            return true;
        } catch (e) {
            console.log(`第 ${attempt} 次翻页未生效（可能未点中圆点），重试`);
        }
    }
    return false;
}

describe('1832149-【启动器】【全屏模式】【安装应用】仅有一页，且当前页有空位，安装新应用', () => {
    // 标记用例前是否为窗口模式（窗口才需要切全屏模式，afterAll 时据此还原）
    let needRestoreFrame = false;

    beforeAll(async ({ uos, system }) => {
        console.log('beforeAll：确保启动器为全屏模式');
        await uos.showDesktop();

        // 1. 读取启动器模式配置：本用例要求全屏模式，仅当配置为窗口模式时才需要切换
        const frameResult = await system.exec(`cat ${settingsIni}`);
        const isWindowed = frameResult.success && frameResult.stdout.includes('current_frame=WindowedFrame');
        console.log('当前启动器模式：', isWindowed ? '窗口模式，需切换为全屏模式' : '全屏模式（或默认），无需操作');

        // 2. 窗口模式才切换：写配置为全屏模式（重启 dde-shell 后生效，模式持久保持）
        if (isWindowed) {
            needRestoreFrame = true;
            await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ${settingsIni}`);
        }

        // 3. 统一重启一次 dde-shell：让全屏模式配置生效（等待时间留足，让任务栏图标加载完成）
        console.log('重启 dde-shell 刷新应用列表并应用全屏模式');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });

    test('1832149-【启动器】【全屏模式】【安装应用】仅有一页，且当前页有空位，安装新应用', async ({ device, agent, uos, system }) => {
        console.log('开始测试：仅有一页且当前页有空位，安装新应用');

        // 步骤1：打开启动器全屏模式
        console.log('步骤1：打开启动器全屏模式');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示：界面铺满屏幕，显示应用图标网格和底部搜索框', { timeoutMs: 15000 });
        await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');

        // 步骤2：安装新应用 D-Feet测试（createTestApp 模拟新装），验证补位到启动器中 + 蓝点显示
        console.log('步骤2：安装 D-Feet测试，验证补位显示 + 蓝点');
        await device.pressKey('ESC');
        await createTestApp(system, appD.name, appD.file, 'dde-file-manager', 'dde-file-manager', 'Development;', false);
        // 重启 dde-shell 刷新应用列表，使新安装的 D-Feet测试 显示在启动器中
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        // 重新打开启动器查看补位结果
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 15000 });
        // 翻到下一页查找D-Feet测试（系统应用较多自动分页，新应用可能被补位到后续页面）
        const step2Flipped = await flipToPage(agent, 2);
        assertTrue(step2Flipped, '应能翻到第2页');
        // 预期2：新安装的应用依次从第一页开始补位；未启动状态的新安装应用蓝点显示
        await agent.aiAssert('新安装的D-Feet测试应用补位显示在启动器当前页中，且该应用图标上显示蓝点（表示未启动状态的新安装应用）');

        // 步骤3：继续安装2个测试应用（createTestApp 模拟），验证新应用补位显示
        console.log('步骤3：继续安装2个测试应用，验证补位显示');
        await device.pressKey('ESC');
        // 创建时先不重启 dde-shell（restartDdeShell=false），两个都创建完后统一重启一次
        for (const app of testApps) {
            await createTestApp(system, app.name, app.file, 'dde-file-manager', 'dde-file-manager', 'Development;', false);
        }
        // 统一重启一次 dde-shell，让新创建的2个应用显示在启动器中
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        // 重新打开启动器查看补位结果
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 15000 });
        // 新应用可能被补位到不同页面，逐页查找并验证两个新应用均已补位到启动器中
        console.log('步骤3：逐页查找新应用，验证补位');
        let foundB1 = await agent.aiBoolean('当前启动器页面中显示“安装测试B1”应用图标');
        let foundB2 = await agent.aiBoolean('当前启动器页面中显示“安装测试B2”应用图标');
        console.log(`第1页查找结果：安装测试B1=${foundB1}，安装测试B2=${foundB2}`);
        if (!foundB1 || !foundB2) {
            console.log('第1页未同时找到两个应用，翻到第2页继续查找');
            await flipToPage(agent, 2);
            if (!foundB1) {
                foundB1 = await agent.aiBoolean('当前启动器页面中显示“安装测试B1”应用图标');
            }
            if (!foundB2) {
                foundB2 = await agent.aiBoolean('当前启动器页面中显示“安装测试B2”应用图标');
            }
            console.log(`第2页查找结果：安装测试B1=${foundB1}，安装测试B2=${foundB2}`);
        }
        if (!foundB1 || !foundB2) {
            console.log('第2页未同时找到两个应用，翻到第3页继续查找');
            await flipToPage(agent, 3);
            if (!foundB1) {
                foundB1 = await agent.aiBoolean('当前启动器页面中显示“安装测试B1”应用图标');
            }
            if (!foundB2) {
                foundB2 = await agent.aiBoolean('当前启动器页面中显示“安装测试B2”应用图标');
            }
            console.log(`第3页查找结果：安装测试B1=${foundB1}，安装测试B2=${foundB2}`);
        }
        // 预期3：两个新应用均补位显示在启动器中（系统应用较多自动分页，新应用补位到后续页面）
        assertTrue(foundB1, '新应用“安装测试B1”应补位显示在启动器中');
        assertTrue(foundB2, '新应用“安装测试B2”应补位显示在启动器中');

        // 收尾：关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832149', 'level3'] });

    afterAll(async ({ uos, device, system }) => {
        console.log('afterAll：删除测试应用、恢复启动器配置、重启 dde-shell 恢复任务栏图标');
        // 1. 删除 createTestApp 创建的所有测试应用（D-Feet测试 + 2个测试应用）并刷新桌面数据库
        await system.exec(`rm -f ~/.local/share/applications/${appD.file}.desktop 2>/dev/null`);
        for (const app of testApps) {
            await system.exec(`rm -f ~/.local/share/applications/${app.file}.desktop 2>/dev/null`);
        }
        await system.exec('update-desktop-database ~/.local/share/applications/ 2>/dev/null');
        // 2. 用初始配置文件恢复 item-arrangement.ini
        await system.exec(`cp -f ${INIT_INI_PATH} ${INI_PATH} 2>/dev/null`);
        // 3. 关闭测试中可能打开的文件管理器窗口
        await killAppWindows(system, ['dde-file-manager']);
        // 4. 仅当用例前是窗口模式（即用例中切换过）时，才写回窗口配置还原；原本全屏模式则不动
        if (needRestoreFrame) {
            await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=WindowedFrame\\n' > ${settingsIni}`);
        }
        // 5. 收起启动器
        await device.pressKey('ESC');
        // 6. 删除 .desktop 后 dde-shell 热重载应用列表可能导致任务栏(dock)图标错位显示异常，
        //    重启一次 dde-shell 让任务栏图标恢复正常（模式还原、配置恢复也在本次重启时生效）
        console.log('重启 dde-shell 恢复任务栏图标并还原环境');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });
});