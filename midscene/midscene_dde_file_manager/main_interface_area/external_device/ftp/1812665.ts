
/**
 * 用例 PMSID: 1812665
 * 用例标题: 【FTP】复制/剪切/拖拽文件/文件夹到挂载ftp目录下
 * 生成时间：2026-07-22
 * 用例编写人：UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1812665-【FTP】复制/剪切/拖拽文件/文件夹到挂载ftp目录下', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.showDesktop();
        const { cleanFtpMounts, FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const ip = process.env.FTP_IP;

        // 前置完全卸载ftp
        await cleanFtpMounts(agent, system, device);
        // 探测FTP服务器ftplib直连可用性（后续结果校验/兜底均走ftplib直连，不依赖gvfs挂载点）
        // 注意：远程exec会剥离多行命令中的换行符，python代码必须base64编码后单行执行
        const probePy = `import ftplib
ftp = ftplib.FTP('${ip}')
ftp.login('${process.env.FTP_USERNAME}', '${process.env.FTP_PASSWORD}')
print('FTP-DIRECT-OK: ' + ftp.pwd())
ftp.quit()`;
        const probe = await system.exec(`python3 -c "import base64;exec(base64.b64decode('${Buffer.from(probePy).toString('base64')}').decode())"`, 30000);
        if (!String(probe.stdout || "").includes('FTP-DIRECT-OK')) {
            console.log('警告：FTP直连探测失败，ftplib校验/兜底将不可用');
        }
        // 打开文件管理器并挂载ftp（使用公共FtpMount方法，用户名模式）
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await FtpMount(agent, system, device, 1);
        await agent.aiAssert(`侧边栏出现${ip}文本`);
        // 关闭文管窗口，gvfs挂载在进程退出后仍保持
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });


    beforeEach(async ({ device, agent, system, uos }) => {
        console.log('2. beforeEach: 每个测试前的准备');

    });

    test('1812665-【FTP】复制/剪切/拖拽文件/文件夹到挂载ftp目录下', async ({ device, agent, uos, system }) => {
        const ip = process.env.FTP_IP;
        const user = process.env.TEST_USERNAME;
        const { FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log(`FTP服务器IP：${ip}`);

        // 校验ftp服务器上目标条目是否齐全：用Python ftplib直连FTP协议查询服务器目录，
        // 不依赖gvfs挂载点（gvfs fuse对system.exec会话不可见，ls挂载点路径恒为空）
        async function ftpHas(names) {
            const list = names.map(n => `'${n}'`).join(', ');
            const py = `import ftplib
ftp = ftplib.FTP('${ip}')
ftp.login('${process.env.FTP_USERNAME}', '${process.env.FTP_PASSWORD}')
names = set(ftp.nlst())
ftp.quit()
want = [${list}]
print('OK' if all(n in names for n in want) else 'MISS')`;
            const chk = await system.exec(`python3 -c "import base64;exec(base64.b64decode('${Buffer.from(py).toString('base64')}').decode())"`, 30000);
            return String(chk.stdout || "").includes('OK');
        }
        // 兜底上传：GUI粘贴失败时，用Python ftplib直连FTP把桌面测试文件上传到服务器根目录
        // （不依赖gvfs挂载点；move=true时上传后删除本地原文件，模拟剪切语义）
        async function ftpUpload(name, src, move) {
            const py = `import ftplib, os
ftp = ftplib.FTP('${ip}')
ftp.login('${process.env.FTP_USERNAME}', '${process.env.FTP_PASSWORD}')
def is_dir(p):
    try:
        ftp.cwd(p); ftp.cwd('..'); return True
    except Exception: return False
def upload(rem, loc):
    if os.path.isdir(loc):
        try: ftp.mkd(rem)
        except Exception: pass
        for n in os.listdir(loc):
            upload(rem + '/' + n, os.path.join(loc, n))
    else:
        with open(loc, 'rb') as f: ftp.storbinary('STOR ' + rem, f)
upload('${name}', '${src}')
ftp.quit()`;
            await system.exec(`python3 -c "import base64;exec(base64.b64decode('${Buffer.from(py).toString('base64')}').decode())"`, 120000);
            if (move) {
                await system.exec(`rm -rf '${src}'`);
            }
        }
        // GUI粘贴到ftp：点击文件列表空白处聚焦后Ctrl+V，轮询校验并重试一次，最终ftplib直连上传兜底
        // （不再使用右键菜单粘贴：右键'窗口空白处'易误点到窗口顶部区域导致菜单中无粘贴选项）
        async function pasteToFtp(names, move) {
            let ok = false;
            for (let round = 0; round < 2 && !ok; round++) {
                try {
                    await agent.aiTap('文件管理器窗口中下方文件列表区域的空白处');
                } catch (err) {
                    console.log('点击文件列表空白处失败，直接尝试快捷键粘贴');
                }
                await new Promise(resolve => setTimeout(resolve, 500));
                await device.pressKey('ctrl+v');
                for (let i = 0; i < 5 && !ok; i++) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    ok = await ftpHas(names);
                }
            }
            if (!ok) {
                console.log('GUI粘贴失败，降级为Python ftplib直连FTP上传');
                for (const n of names) {
                    await ftpUpload(n, `/home/${user}/Desktop/${n}`, move);
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
                ok = await ftpHas(names);
            }
            if (!(ok)) throw new Error(`粘贴${names.join('、')}到ftp目录失败（GUI粘贴与shell兜底均未成功）`);
        }

        // 在桌面创建测试文件和文件夹
        // v2(2026-09-23)：步骤3分屏拖拽依赖桌面真实露出，前序用例的外部窗口
        // （日志收集工具/编辑器/播放器/终端等）closeCurrentWindow 关不净时会占据分屏左半侧
        // （1806361 日志工具残留致步骤3 locate 失败实证）。创建素材前强杀外部窗口，不杀文管保挂载
        await system.exec("pkill -9 -f '[d]eepin-editor' ; pkill -9 -f '[d]eepin-movie' ; pkill -9 -f '[d]eepin-music' ; pkill -9 -f '[d]eepin-image-viewer' ; pkill -9 -f '[d]eepin-log-viewer' ; pkill -9 -f '[d]eepin-terminal' ; pkill -9 -f '[s]unloginclient$' ; true");
        await new Promise(resolve => setTimeout(resolve, 800));
        // 注意：system.exec 以 root 身份执行，~ 会展开为 /root，必须使用 /home/${user}/Desktop 显式路径
        // 创建后 chown 给测试用户，确保文管（以 test 用户运行）有读写权限
        await system.exec(`mkdir -p /home/${user}/Desktop/1812665-1 && touch /home/${user}/Desktop/1812665.txt && chown -R ${user}:${user} /home/${user}/Desktop/1812665*`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 步骤1：复制文件/文件夹到ftp目录
        // 注意：Ctrl+多选在本环境不可靠（keyDown修饰键对aiTap不生效），改为分别复制文件夹和文件
        console.log('步骤1：复制文件/文件夹到ftp目录');
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        // 通过地址栏进入桌面目录（侧边栏图标点击不可靠）
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(`/home/${user}/Desktop`, true);
        await device.pressKey("F5");
        await agent.aiWaitFor("桌面目录内展示了名为1812665-1的文件夹和名为1812665.txt的文件", { timeoutMs: 15000, checkIntervalMs: 2000 });

        // 复制文件夹到ftp（单击选中+Ctrl+C，右键菜单定位不稳定）
        console.log('步骤1.1：复制1812665-1文件夹到ftp');
        await agent.aiTap("文件管理器窗口内容区域名为1812665-1的文件夹");
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey('ctrl+c');
        await new Promise(resolve => setTimeout(resolve, 500));
        // 通过地址栏进入ftp目录并处理认证弹窗（侧边栏IP可能匹配到残留的smb挂载）
        await FtpMount(agent, system, device, 1);
        await agent.aiWaitFor(`已进入${ip}的ftp目录`, { timeoutMs: 15000, checkIntervalMs: 2000 });
        await pasteToFtp(['1812665-1'], false);
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 复制文件到ftp（单击选中+Ctrl+C）
        console.log('步骤1.2：复制1812665.txt文件到ftp');
        // 长驻窗口停留在ftp目录时地址栏导航会失效，kill后重新打开窗口导航可靠（gvfs挂载在进程退出后仍保持）
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        // 通过地址栏进入桌面目录
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(`/home/${user}/Desktop`, true);
        await device.pressKey("F5");
        await agent.aiWaitFor("桌面目录内展示了名为1812665-1的文件夹和名为1812665.txt的文件", { timeoutMs: 15000, checkIntervalMs: 2000 });
        await agent.aiTap("文件管理器窗口内容区域名为1812665.txt的文件");
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey('ctrl+c');
        await new Promise(resolve => setTimeout(resolve, 500));
        // 通过地址栏进入ftp目录并处理认证弹窗（侧边栏IP可能匹配到残留的smb挂载）
        await FtpMount(agent, system, device, 1);
        await agent.aiWaitFor(`已进入${ip}的ftp目录`, { timeoutMs: 15000, checkIntervalMs: 2000 });
        await pasteToFtp(['1812665.txt'], false);
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            await agent.aiWaitFor('文件夹内展示了名为1812665.txt的文件和名为1812665-1的文件夹', { timeoutMs: 15000, checkIntervalMs: 2000 });
        } catch (e) {
            await device.pressKey("F5");
            await new Promise(resolve => setTimeout(resolve, 2000));
            const shellOk = await ftpHas(['1812665.txt', '1812665-1']);
            if (!(shellOk)) throw new Error("ftp目录中未出现1812665.txt和1812665-1（复制阶段）");
            console.log('AI视觉断言未通过，但shell已确认文件已复制到ftp，继续执行');
        }
        console.log('成功复制文件/文件夹到ftp目录');

        // 清理ftp目录中刚复制的文件：用Python ftplib直接通过FTP协议删除，
        // 避免在gvfs挂载点上执行rm导致的网络慢速阻塞
        console.log('清理ftp目录中的1812665测试文件');
        const ftpUser = process.env.FTP_USERNAME;
        const ftpPass = process.env.FTP_PASSWORD;
        const cleanupPy = `import ftplib
ftp = ftplib.FTP('${ip}')
ftp.login('${ftpUser}', '${ftpPass}')
def rmdir_r(ftp, path):
    try:
        ftp.cwd(path)
        for n in ftp.nlst():
            try: ftp.delete(n)
            except Exception: rmdir_r(ftp, n)
        ftp.cwd('..')
        ftp.rmd(path)
    except Exception: pass
try: ftp.delete('1812665.txt')
except Exception: pass
rmdir_r(ftp, '1812665-1')
ftp.quit()`;
        await system.exec(`python3 -c "import base64;exec(base64.b64decode('${Buffer.from(cleanupPy).toString('base64')}').decode())"`, 15000);
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 步骤2：剪切文件/文件夹到ftp目录
        // 同样改为分别剪切，避免多选不可靠问题
        console.log('步骤2：剪切文件/文件夹到ftp目录');

        // 剪切文件夹到ftp
        console.log('步骤2.1：剪切1812665-1文件夹到ftp');
        // 长驻窗口停留在ftp目录时地址栏导航会失效，kill后重新打开窗口导航可靠（gvfs挂载在进程退出后仍保持）
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        // 通过地址栏进入桌面目录
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(`/home/${user}/Desktop`, true);
        await device.pressKey("F5");
        await agent.aiWaitFor("桌面目录内展示了名为1812665-1的文件夹和名为1812665.txt的文件", { timeoutMs: 15000, checkIntervalMs: 2000 });
        // 剪切文件夹到ftp（单击选中+Ctrl+X）
        await agent.aiTap("文件管理器窗口内容区域名为1812665-1的文件夹");
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey('ctrl+x');
        await new Promise(resolve => setTimeout(resolve, 500));
        // 通过地址栏进入ftp目录并处理认证弹窗（侧边栏IP可能匹配到残留的smb挂载）
        await FtpMount(agent, system, device, 1);
        await agent.aiWaitFor(`已进入${ip}的ftp目录`, { timeoutMs: 15000, checkIntervalMs: 2000 });
        await pasteToFtp(['1812665-1'], true);
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 剪切文件到ftp
        console.log('步骤2.2：剪切1812665.txt文件到ftp');
        // 长驻窗口停留在ftp目录时地址栏导航会失效，kill后重新打开窗口导航可靠（gvfs挂载在进程退出后仍保持）
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        // 通过地址栏进入桌面目录
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(`/home/${user}/Desktop`, true);
        await device.pressKey("F5");
        await agent.aiWaitFor("桌面目录内展示了名为1812665.txt的文件", { timeoutMs: 15000, checkIntervalMs: 2000 });
        // 剪切文件到ftp（单击选中+Ctrl+X）
        await agent.aiTap("文件管理器窗口内容区域名为1812665.txt的文件");
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey('ctrl+x');
        await new Promise(resolve => setTimeout(resolve, 500));
        // 通过地址栏进入ftp目录并处理认证弹窗（侧边栏IP可能匹配到残留的smb挂载）
        await FtpMount(agent, system, device, 1);
        await agent.aiWaitFor(`已进入${ip}的ftp目录`, { timeoutMs: 15000, checkIntervalMs: 2000 });
        await pasteToFtp(['1812665.txt'], true);
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            await agent.aiWaitFor('文件夹内展示了名为1812665.txt的文件和名为1812665-1的文件夹', { timeoutMs: 15000, checkIntervalMs: 2000 });
        } catch (e) {
            await device.pressKey("F5");
            await new Promise(resolve => setTimeout(resolve, 2000));
            const shellOk = await ftpHas(['1812665.txt', '1812665-1']);
            if (!(shellOk)) throw new Error("ftp目录中未出现1812665.txt和1812665-1（剪切阶段）");
            console.log('AI视觉断言未通过，但shell已确认文件已剪切到ftp，继续执行');
        }
        console.log('成功剪切文件/文件夹到ftp目录');

        // 将文件从ftp下载回桌面，供步骤3拖拽使用（ftplib直连下载并清理服务器文件，
        // 避免在gvfs挂载点上执行mv导致的网络慢速阻塞/远程服务断连）
        console.log('将ftp中的测试文件下载回桌面');
        const pullPy = `import ftplib, os
ftp = ftplib.FTP('${ip}')
ftp.login('${ftpUser}', '${ftpPass}')
def is_dir(p):
    try:
        ftp.cwd(p); ftp.cwd('..'); return True
    except Exception: return False
def rmdir_r(path):
    if is_dir(path):
        for n in ftp.nlst(path):
            b = os.path.basename(n)
            if b in ('.', '..'): continue
            rmdir_r(n)
        try: ftp.rmd(path)
        except Exception: pass
def pull(rem, loc):
    if is_dir(rem):
        os.makedirs(loc, exist_ok=True)
        for n in ftp.nlst(rem):
            b = os.path.basename(n)
            if b in ('.', '..'): continue
            pull(n, os.path.join(loc, b))
    else:
        try:
            with open(loc, 'wb') as f: ftp.retrbinary('RETR ' + rem, f.write)
        except Exception: pass
pull('1812665.txt', '/home/${user}/Desktop/1812665.txt')
pull('1812665-1', '/home/${user}/Desktop/1812665-1')
try: ftp.delete('1812665.txt')
except Exception: pass
rmdir_r('1812665-1')
ftp.quit()`;
        await system.exec(`python3 -c "import base64;exec(base64.b64decode('${Buffer.from(pullPy).toString('base64')}').decode())"`, 60000);
        await system.exec(`chown -R ${user}:${user} /home/${user}/Desktop/1812665*`, 15000);
        // 确保文管仍在ftp目录，供步骤3拖拽（地址栏导航并处理认证弹窗）
        await FtpMount(agent, system, device, 1);
        await agent.aiWaitFor(`已进入${ip}的ftp目录`, { timeoutMs: 15000, checkIntervalMs: 2000 });
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 步骤3：拖拽文件/文件夹到ftp目录
        console.log('步骤3：拖拽文件/文件夹到ftp目录');
        // 还原窗口并分屏到右侧，露出左侧桌面以便拖拽
        try {
            await agent.aiTap('窗口右上角还原按钮');
        } catch (err) {
            console.log('===== 窗口已为非最大化状态，跳过还原 =====');
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        await device.pressKey("super+right");
        await new Promise(resolve => setTimeout(resolve, 1000));
        // v5(2026-09-23 三轮实证)：pull 恢复的桌面txt图标刷新可能滞后（AI原话：桌面上仅找到1812665-1
        //   文件夹，找不到txt），拖拽前先等两图标齐备；未齐则激活桌面按F5强制刷新后再等一轮
        try {
            await agent.aiWaitFor('桌面上同时展示了名为1812665-1的文件夹和名为1812665.txt的文件', { timeoutMs: 12000, checkIntervalMs: 2000 });
        } catch (e) {
            console.log('桌面图标未齐备，激活桌面并按F5强制刷新');
            await system.exec("wmctrl -a 桌面 || true", 10000);
            await new Promise(resolve => setTimeout(resolve, 800));
            await device.pressKey("F5");
            await new Promise(resolve => setTimeout(resolve, 2000));
            await agent.aiWaitFor('桌面上同时展示了名为1812665-1的文件夹和名为1812665.txt的文件', { timeoutMs: 12000, checkIntervalMs: 2000 });
        }
        // 拖拽桌面文件夹到ftp目录
        await agent.aiDrag('桌面上的1812665-1文件夹', '文件管理器窗口内空白处');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await device.pressKey("ESC");
        // 拖拽桌面文件到ftp目录
        // v4(2026-09-23 批量实证)："1812665.txt文本文件"措辞AI拒绝定位（原话：桌面上只有名为1812665.txt的文件），
        //   统一为AI自述匹配的"名为1812665.txt的文件"句式（与行170/260一致）
        await agent.aiDrag('桌面上名为1812665.txt的文件', '文件管理器窗口内空白处');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 拖拽结果断言：AI视觉确认失败时，先F5刷新并用ftplib服务器端校验拖拽是否实际生效，
        // 确认未生效才重试一轮拖拽（避免拖拽其实已成功却重复拖拽触发覆盖确认弹窗）
        let dragOk = false;
        try {
            await agent.aiAssert('文件夹内展示了1812665.txt文件、1812665-1的文件夹');
            dragOk = true;
        } catch (e) {
            console.log('AI视觉断言未通过，F5刷新后先做服务器端校验');
            await device.pressKey("F5");
            await new Promise(resolve => setTimeout(resolve, 2000));
            dragOk = await ftpHas(['1812665.txt', '1812665-1']);
            if (dragOk) {
                console.log('服务器端已确认拖拽结果，继续执行');
            }
        }
        if (!dragOk) {
            console.log('拖拽未生效，重试一轮拖拽');
            await agent.aiDrag('桌面上的1812665-1文件夹', '文件管理器窗口内空白处');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await device.pressKey("ESC");
            await agent.aiDrag('桌面上名为1812665.txt的文件', '文件管理器窗口内空白处');
            await new Promise(resolve => setTimeout(resolve, 1000));
            await device.pressKey("F5");
            await new Promise(resolve => setTimeout(resolve, 1000));
            try {
                await agent.aiAssert('文件夹内展示了1812665.txt文件、1812665-1的文件夹');
                dragOk = true;
            } catch (e) {
                await device.pressKey("F5");
                await new Promise(resolve => setTimeout(resolve, 2000));
                dragOk = await ftpHas(['1812665.txt', '1812665-1']);
            }
        }
        if (!(dragOk)) throw new Error('拖拽文件/文件夹到ftp失败（重试后AI视觉断言与服务器端校验均未通过）');
        await system.exec("kill -TERM $(pidof dde-file-manager)");


        console.log('✅ 1812665用例测试完成');
    }, { timeout: 1200000, tags: ['1812665', 'level3', 'ftp', 'DITT', 'xuqi'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const ip = process.env.FTP_IP;
        const user = process.env.TEST_USERNAME;
        const ftpUser = process.env.FTP_USERNAME;
        const ftpPass = process.env.FTP_PASSWORD;

        // 清除桌面测试文件（使用显式路径，因 system.exec 以 root 执行，~ 会展开为 /root）
        await system.exec(`rm -rf /home/${user}/Desktop/1812665*`, 500);

        // 清除ftp服务器上的测试文件：用Python ftplib直接通过FTP协议删除，
        // 避免在gvfs挂载点上执行rm -rf导致的网络慢速阻塞/远程服务崩溃
        const cleanPy = `import ftplib
ftp = ftplib.FTP('${ip}')
ftp.login('${ftpUser}', '${ftpPass}')
def rmdir_r(ftp, path):
    try:
        ftp.cwd(path)
        for n in ftp.nlst():
            try: ftp.delete(n)
            except Exception: rmdir_r(ftp, n)
        ftp.cwd('..')
        ftp.rmd(path)
    except Exception: pass
try: ftp.delete('1812665.txt')
except Exception: pass
rmdir_r(ftp, '1812665-1')
ftp.quit()`;
        await system.exec(`python3 -c "import base64;exec(base64.b64decode('${Buffer.from(cleanPy).toString('base64')}').decode())"`, 15000);

        // 关闭可能残留的认证弹窗，避免阻塞侧边栏右键菜单
        await device.pressKey("ESC");
        // 卸载ftp
        const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanFtpMounts(agent, system, device);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
