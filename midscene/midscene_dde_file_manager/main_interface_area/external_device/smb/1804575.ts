/**
 * 用例 PMSID: 1804575
 * 用例标题: UBXC005781 文件搜索
 * 生成时间：2026-07-21
 * 用例编写人：UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1804575-UBXC005781 文件搜索', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system, uos }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const { SmbMount, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const ip = process.env.SMB_IP;
        await uos.openApp('文件管理器', 3000, 20000, true);
        // 前置完全卸载smb
        await cleanSmbMounts(agent, system);
        // 用户名挂载smb
        await agent.aiAssert("文件管理器界面已显示");
        await SmbMount(agent, system, device, 1);
        await agent.aiAssert(`侧边栏出现${ip}文本`);
    });

    test('1804575-UBXC005781 文件搜索', async ({ device, agent, uos, system }) => {

        // 步骤1：挂载smb
        console.log("步骤1：挂载smb");
        // 预期1：挂载成功
        await agent.aiAssert("smb挂载成功，侧边栏显示共享目录");

        // 步骤2：在smb路径中创建测试文件，刷新后搜索
        console.log("步骤2：在smb路径中创建测试文件并搜索");
        await system.exec(`touch /media/${process.env.TEST_USERNAME}/smbmounts/smb-share:server=${process.env.SMB_IP},share=smbtest/1804575_file.txt`, 500);
        await device.pressKey("F5");
        await device.pressKey("F5");
        await agent.aiWaitFor("1804575_file.txt文件已显示");
        // v2(2026-09-23)：搜索框折叠为放大镜+远程浮层遮挡，aiTap必败（经验103）。
        // 多点门控展开+二次点击聚焦+xdotool type直输+入框门控，坐标按1920x1080等比缩放
        let geo = "1920 1080";
        try {
            const g = await system.exec("xdotool getdisplaygeometry");
            const gs = String(g.stdout || "").trim();
            if (/\d+\s+\d+/.test(gs)) geo = gs;
        } catch (e) { }
        const gn = geo.split(/\s+/).map(Number);
        const rw = (gn[0] || 1920) / 1920, rh = (gn[1] || 1080) / 1080;
        const xy = (x, y) => `${Math.round(x * rw)} ${Math.round(y * rh)}`;
        const candidates = [[1675, 62], [1675, 72], [1695, 62], [1715, 62]];
        let searchOpened = false;
        for (const [cx, cy] of candidates) {
            await system.exec(`xdotool mousemove --sync ${xy(cx, cy)} click 1`);
            await new Promise(resolve => setTimeout(resolve, 700));
            try {
                searchOpened = await agent.aiBoolean("工具栏右侧的搜索输入框已展开，放大镜图标旁出现可输入的文本框（有光标或占位提示文字）");
            } catch (e) { searchOpened = false; }
            if (searchOpened) break;
        }
        if (!searchOpened) throw new Error('多次坐标点击后搜索框仍未展开');
        let typed = false;
        for (let t = 1; t <= 3 && !typed; t++) {
            await system.exec(`xdotool mousemove --sync ${xy(1715, 62)} click 1`);
            await new Promise(resolve => setTimeout(resolve, 300));
            await system.exec(`xdotool type --delay 60 "1804575"`);
            await new Promise(resolve => setTimeout(resolve, 600));
            try {
                typed = await agent.aiBoolean("右上角搜索输入框内已显示字符串1804575");
            } catch (e) { typed = false; }
            if (!typed) await system.exec(`xdotool key ctrl+a BackSpace`);
        }
        if (!typed) throw new Error('多次xdotool type后关键字仍未进入搜索框');
        await device.pressKey("Enter");
        await agent.aiWaitFor("搜索结果加载完毕");
        // 预期2：搜索成功
        await agent.aiAssert("搜索结果中出现1804575_file.txt");

    }, { timeout: 600000, tags: ['1804575', 'level3', 'smb', 'DITT', 'xuqi'] });

    afterEach(async ({ device, agent, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanSmbMounts(agent, system, 1);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
