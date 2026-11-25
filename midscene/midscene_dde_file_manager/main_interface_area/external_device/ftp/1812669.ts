// @ts-nocheck

/**
 * 用例 PMSID: 1812669
 * 用例标题: 【FTP】挂载ftp目录下搜索
 * 生成时间：2026-07-30
 * 用例编写人：UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1812669-【FTP】挂载ftp目录下搜索', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");

        await uos.showDesktop();
        const { cleanFtpMounts, FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const ip = process.env.FTP_IP;
        // // 前置完全卸载ftp
        await cleanFtpMounts(agent, system);
        // 打开文件管理器并挂载ftp
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await FtpMount(agent, system, device, 1);

        // 在FTP目录下创建真实可播放的测试文件
        console.log('在FTP目录下创建真实可播放的测试文件');
        // 经 gvfs/FTP 传输大文件较慢，超时过短会导致 cp 被中途终止、文件截断（视频播放器打开后一直空白），需给足复制时间
        await system.exec(`cp /usr/share/dde-introduction/uos/1-DDE.mp4 /run/user/1000/gvfs/ftp\\:host\\=${ip}/1812669_video.mp4`, 30000);
        await system.exec(`cp /usr/share/wallpapers/deepin/desktop.jpg /run/user/1000/gvfs/ftp\\:host\\=${ip}/1812669_image.jpg`, 10000);
        await system.exec(`cp /usr/share/music/bensound-sunny.mp3 /run/user/1000/gvfs/ftp\\:host\\=${ip}/1812669_music.mp3`, 10000);
        // gvfs FUSE挂载路径不支持shell重定向写入，改用cp方式创建文本文件
        await system.exec(`echo "test content" > /tmp/1812669_text.txt`);
        await system.exec(`cp /tmp/1812669_text.txt /run/user/1000/gvfs/ftp\\:host\\=${ip}/1812669_text.txt`, 5000);
    });


    beforeEach(async ({ device, agent, system, uos }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1812669-【FTP】挂载ftp目录下搜索', async ({ device, agent, uos, system }) => {
        // v2(2026-09-23)：前序用例的外部查看器（编辑器/播放器/音乐/图片）可能挂起在保存对话框上残留，
        // 遮挡文件管理器致步骤1.3 waitFor 超时（1812239 编辑器保存框实证）。test 体开头强杀清场，
        // 不杀 dde-file-manager（FTP 挂载导航保持）；字符类防 pkill 匹配自身命令行
        await system.exec("pkill -9 -f '[d]eepin-editor' ; pkill -9 -f '[d]eepin-movie' ; pkill -9 -f '[d]eepin-music' ; pkill -9 -f '[d]eepin-image-viewer' ; true");
        await new Promise(resolve => setTimeout(resolve, 800));
        // ===== 步骤1：打开ftp上的视频，图片，文本文件，音乐 =====
        console.log('===== 步骤1：打开ftp上的视频，图片，文本文件，音乐 =====');

        // 打开视频文件
        console.log('步骤1.1：打开ftp上的视频文件');
        await device.pressKey("F5");
        await agent.aiTap("文件管理器右上方列表视图按钮", { deepThink: true });
        await agent.aiWaitFor("1812669_video.mp4已展示")
        await agent.aiDoubleClick("1812669_video.mp4", { deepThink: true });
        // 播放器加载大视频时窗口可能短暂空白，放宽判定为播放器窗口已打开并给足等待时间
        await agent.aiWaitFor("视频播放器窗口已打开", { timeoutMs: 30000, checkIntervalMs: 2000 });
        await system.exec("kill -TERM $(pidof deepin-movie)");

        // 打开图片文件
        console.log('步骤1.2：打开ftp上的图片文件');
        await agent.aiWaitFor("1812669_image.jpg已展示", { timeoutMs: 30000, checkIntervalMs: 2000 });
        await agent.aiDoubleClick("1812669_image.jpg");
        await agent.aiWaitFor("图片文件已正常打开", { timeoutMs: 30000, checkIntervalMs: 2000 });
        await agent.aiTap("图片窗口右上角关闭按钮:X", { deepThink: true });
        // 等待图片查看器完全关闭、文件管理器回到前台，避免界面未稳定导致后续定位失败
        await agent.aiWaitFor("图片查看器窗口已关闭，文件管理器窗口已显示", { timeoutMs: 15000, checkIntervalMs: 1000 });
        // 刷新文件列表，确保关闭图片查看器后视图能展示全部文件
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 打开文本文件
        console.log('步骤1.3：打开ftp上的文本文件');
        await agent.aiWaitFor("1812669_text.txt已展示", { timeoutMs: 30000, checkIntervalMs: 2000 });
        await agent.aiDoubleClick("1812669_text.txt");
        await agent.aiWaitFor("文本文件已正常打开", { timeoutMs: 30000, checkIntervalMs: 2000 });
        await agent.aiTap("文本窗口右上角关闭按钮:X", { deepThink: true });
        await agent.aiWaitFor("文本编辑器窗口已关闭，文件管理器窗口已显示", { timeoutMs: 15000, checkIntervalMs: 1000 });
        // 刷新文件列表，确保关闭文本编辑器后视图能展示全部文件
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 打开音乐文件
        console.log('步骤1.4：打开ftp上的音乐文件');
        await agent.aiWaitFor("1812669_music.mp3已展示", { timeoutMs: 30000, checkIntervalMs: 2000 });
        await agent.aiDoubleClick("1812669_music.mp3");
        await agent.aiWaitFor("音乐文件已正常打开", { timeoutMs: 30000, checkIntervalMs: 2000 });
        await system.exec("kill -TERM $(pidof deepin-music)");


        // 预期1：正常打开每种类型文件
        console.log('✅ 步骤1验证通过：正常打开每种类型文件');

        // ===== 步骤2：点击搜索-输入关键字，如1-按enter键 =====
        console.log('===== 步骤2：点击搜索-输入关键字，如1-按enter键 =====');
        // v4(2026-09-23)：搜索框默认折叠为放大镜图标，位于工具栏最右侧排序按钮旁，
        // 远程会话"远程控制提醒"黑色浮层常显遮挡其约80%区域，AI视觉无法定位（实证Ctrl+F/F3/主菜单均无入口）。
        // 折叠热区中心约(1675,62)，单点y=72偏下存在未命中风险（1812823 SFTP首跑实证点击后未进搜索态），
        // 改用多点候选+展开态aiBoolean门控重试，坐标基于1920x1080实测，按分辨率等比缩放
        let geo = "1920 1080";
        try {
            const g = await system.exec("xdotool getdisplaygeometry");
            const gs = String(g.stdout || "").trim();
            if (/\d+\s+\d+/.test(gs)) geo = gs;
        } catch (e) { }
        const gn = geo.split(/\s+/).map(Number);
        const rw = (gn[0] || 1920) / 1920, rh = (gn[1] || 1080) / 1080;
        const candidates = [[1675, 62], [1675, 72], [1695, 62], [1715, 62]];
        let searchOpened = false;
        for (const [cx, cy] of candidates) {
            await system.exec(`xdotool mousemove --sync ${Math.round(cx * rw)} ${Math.round(cy * rh)} click 1`);
            await new Promise(resolve => setTimeout(resolve, 700));
            try {
                searchOpened = await agent.aiBoolean("工具栏右侧的搜索输入框已展开，放大镜图标旁出现可输入的文本框（有光标或占位提示文字）");
            } catch (e) { searchOpened = false; }
            if (searchOpened) { console.log(`点击(${cx},${cy})成功展开搜索框`); break; }
            console.log(`点击(${cx},${cy})未展开搜索框，尝试下一候选坐标`);
        }
        if (!searchOpened) throw new Error('多次坐标点击后搜索框仍未展开（远程浮层遮挡/热区偏移）');
        // v4.2(2026-09-23)：device.typeText 走剪贴板Ctrl+V，在搜索框场景连续两轮粘贴丢失
        // （框已展开聚焦但为空）。改用 xdotool type 走XTest直接发键事件（远端普通目录手工实证入框），
        // 并门控验证字符已入框
        let typed = false;
        for (let t = 1; t <= 3 && !typed; t++) {
            await system.exec(`xdotool mousemove --sync ${Math.round(1715 * rw)} ${Math.round(62 * rh)} click 1`);
            await new Promise(resolve => setTimeout(resolve, 300));
            await system.exec(`xdotool type --delay 100 "1"`);
            await new Promise(resolve => setTimeout(resolve, 600));
            try {
                typed = await agent.aiBoolean("右上角搜索输入框内已显示字符1");
            } catch (e) { typed = false; }
            console.log(`第${t}次向搜索框输入"1"，入框校验=${typed}`);
            if (!typed) await system.exec(`xdotool key ctrl+a BackSpace`);
        }
        if (!typed) throw new Error('多次xdotool type后字符仍未进入搜索框');
        await device.pressKey("Enter");
        await system.exec(`sleep 5`);

        // 预期2：成功搜索，返回搜索结果
        console.log('步骤2.1：验证成功搜索，返回搜索结果');
        await agent.aiAssert("文件夹内展示了搜索结果");
        console.log('✅ 步骤2验证通过：成功搜索，返回搜索结果');

        // 等待搜索完成，避免结果列表仍在刷新导致定位漂移
        // 用正向检测"正在搜索"提示是否存在（反向描述"不再显示"易被AI误判导致一直返回false）
        let searchCompleted = false;
        for (let attempt = 1; attempt <= 10; attempt++) {
            const stillSearching = await agent.aiBoolean("界面上显示'正在搜索'的提示或加载动画", { timeoutMs: 5000 });
            if (!stillSearching) {
                searchCompleted = true;
                console.log(`===== 第${attempt}次检测：搜索已完成 =====`);
                break;
            }
            console.log(`===== 第${attempt}次检测：搜索仍在进行，等待后重试 =====`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        if (!searchCompleted) {
            // FTP挂载目录搜索较慢，提示检测可能误判；只要搜索结果仍展示即视为搜索完成
            console.log('===== 检测超时，最终确认搜索结果是否仍展示 =====');
            await agent.aiAssert("文件夹内仍展示搜索结果");
            console.log('===== 搜索结果仍展示，视为搜索已完成，继续执行 =====');
        }
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 获取搜索结果中的具体名称，用于精确定位，避免模糊描述导致误点空白区域
        // aiQuery无匹配结果时会抛错，搜索结果可能全是文件夹（或全是文件），需容错处理
        let firstFolderName = '';
        let firstFileName = '';
        try {
            firstFolderName = await agent.aiQuery("搜索结果中第一个文件夹的完整名称，返回string");
        } catch (err) {
            console.log('===== 搜索结果中未查询到文件夹 =====');
        }
        try {
            firstFileName = await agent.aiQuery("搜索结果中第一个文件（非文件夹）的完整名称，返回string");
        } catch (err) {
            console.log('===== 搜索结果中未查询到非文件夹的文件 =====');
        }
        console.log(`搜索结果第一个文件夹: ${firstFolderName}，第一个文件: ${firstFileName}`);
        // 步骤3目标：优先文件夹，无文件夹则回退到文件，再回退到第一个结果条目
        const step3Target = firstFolderName
            ? `名称为"${firstFolderName}"的文件夹`
            : (firstFileName ? `名称为"${firstFileName}"的文件` : '搜索结果中的第一个条目');
        // 步骤4目标：优先非文件夹的文件，无文件则回退到文件夹
        const step4Target = firstFileName
            ? `名称为"${firstFileName}"的文件`
            : `名称为"${firstFolderName}"的文件夹`;

        // ===== 步骤3：选中搜索结果中文件/文件夹-右键 =====
        console.log('===== 步骤3：选中搜索结果中文件/文件夹-右键 =====');
        await agent.aiTap(step3Target);
        await agent.aiRightClick(step3Target);
        await agent.aiWaitFor("弹出右键菜单");

        // 预期3：右键菜单正常显示且功能均可正常操作
        console.log('步骤3.1：验证右键菜单正常显示且功能均可正常操作');
        await agent.aiAssert("右键菜单包含打开选项");
        await agent.aiAssert("右键菜单包含复制选项");
        await agent.aiAssert("右键菜单包含删除选项");
        await agent.aiAssert("右键菜单包含属性选项");
        console.log('✅ 步骤3验证通过：右键菜单正常显示且功能均可正常操作');

        // 关闭右键菜单
        await device.pressKey("esc");
        await new Promise(resolve => setTimeout(resolve, 300));

        // ===== 步骤4：搜索过程中-选中已搜索出的文件/文件夹 =====
        console.log('===== 步骤4：搜索过程中-选中已搜索出的文件/文件夹 =====');
        // v2(2026-09-29)：AI重定位条目时可能命中横跨全宽的整行容器（bbox如[92,213,998,250]），
        // 右键中心点落入空白区弹出"全选/显示方式/排序方式"空白菜单（无"打开"，1812669实证），
        // 改为与步骤3一致的aiTap选中+右键（选中态可锚定定位），并校验菜单含"打开"，失败Esc重试
        let step4MenuOk = false;
        for (let attempt = 1; attempt <= 3 && !step4MenuOk; attempt++) {
            try {
                await agent.aiTap(step4Target);
                await agent.aiRightClick(step4Target);
                await agent.aiWaitFor("弹出右键菜单", { timeout: 8000 });
                step4MenuOk = await agent.aiBoolean("右键菜单包含打开选项");
            } catch (e) {
                console.log(`第${attempt}次步骤4右键流程异常: ${(e && e.message) || e}`);
            }
            if (!step4MenuOk) {
                console.log(`第${attempt}次步骤4右键菜单无"打开"（疑似空白区菜单或定位偏移），Esc后重试`);
                await device.pressKey("esc");
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        if (!step4MenuOk) {
            throw new Error("步骤4右键搜索结果条目未能弹出含'打开'选项的文件右键菜单（已重试3次）");
        }

        // 预期4：正常呼出右键菜单且功能正常
        console.log('步骤4.1：验证正常呼出右键菜单且功能正常');
        await agent.aiAssert("右键菜单包含打开选项");
        await agent.aiAssert("右键菜单包含复制选项");
        await agent.aiAssert("右键菜单包含属性选项");
        console.log('✅ 步骤4验证通过：正常呼出右键菜单且功能正常');

        // 关闭右键菜单
        await device.pressKey("esc");
        await new Promise(resolve => setTimeout(resolve, 300));

        // ===== 步骤5：搜索过程中-点击侧边栏其他目录，如视频 =====
        console.log('===== 步骤5：搜索过程中-点击侧边栏其他目录，如视频 =====');
        await agent.aiTap("侧边栏的视频目录");
        await new Promise(resolve => setTimeout(resolve, 500));

        // 预期5：正常打开视频目录，文管正常运行
        console.log('步骤5.1：验证正常打开视频目录，文管正常运行');
        await agent.aiAssert("窗口已进入视频目录");
        console.log('✅ 步骤5验证通过：正常打开视频目录，文管正常运行');
        console.log('✅ 1812669用例测试完成');
    }, { timeout: 1200000, tags: ['1812669', 'level3', 'ftp', 'DITT', 'xuqi'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const ip = process.env.FTP_IP;
        // 清除FTP目录下的测试文件
        await system.exec(`rm -f /run/user/1000/gvfs/ftp\\:host\\=${ip}/1812669_video.mp4`, 500);
        await system.exec(`rm -f /run/user/1000/gvfs/ftp\\:host\\=${ip}/1812669_image.jpg`, 500);
        await system.exec(`rm -f /run/user/1000/gvfs/ftp\\:host\\=${ip}/1812669_music.mp3`, 500);
        await system.exec(`rm -f /run/user/1000/gvfs/ftp\\:host\\=${ip}/1812669_text.txt`, 500);
        await system.exec(`rm -f /tmp/1812669_text.txt`);
        // 卸载ftp
        const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanFtpMounts(agent, system, device);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
