// @ts-nocheck
/**
 * 用例 PMSID: 1812741
 * 用例标题: 卸载sftp-多窗口操作sftp卸载
 * 生成时间：2026-07-28
 * 用例编写人：UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1812741-卸载sftp-多窗口操作sftp卸载', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.showDesktop();
        const { cleanSftpMounts, SftpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        // 前置完全卸载sftp
        await cleanSftpMounts(agent, system);
        // 用户名挂载sftp
        await SftpMount(agent, system, device, 1);
    });


    beforeEach(async ({ device, agent, system, uos }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1812741-卸载sftp-多窗口操作sftp卸载', async ({ device, agent, uos, system }) => {
        // 注意：SFTP 挂载实际使用 SFTP_IP，此前误用 FTP_IP 导致侧边栏右键/断言定位到错误服务器
        const ip = process.env.SFTP_IP;
        const { cleanSftpMounts, SftpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log(`SFTP服务器IP：${ip}`);

        // 锁屏防御：长间隔执行可能遇空闲锁屏（v4实证beforeAll与test之间锁屏致断言失败），未锁屏自动跳过
        const boolLocked = await agent.aiBoolean('页面显示系统锁屏或登录界面（有时钟和密码输入框）');
        if (boolLocked) {
            console.log('执行机处于锁屏状态，输入登录密码解锁');
            await device.typeText(`${process.env.TEST_PASSWORD}`, true);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        // ===== 步骤1：窗口A和窗口B均打开进入同一sftp目录-窗口B卸载sftp =====
        console.log('===== 步骤1：窗口A和窗口B均打开进入同一sftp目录-窗口B卸载sftp =====');

        // 打开窗口A并进入sftp目录
        console.log('步骤1.1：打开窗口A并进入sftp目录');
        // 窗口A布局到左侧
        await agent.aiWaitFor(`窗口地址栏显示${ip}路径且文件列表展示远程目录内容`, { timeout: 15000 });
        await agent.aiAssert(`窗口地址栏显示${ip}路径且文件列表展示远程目录内容`);
        await device.pressKey('super+left');
        await agent.aiWaitFor('左侧文件管理器窗口已布局到屏幕左侧');
        console.log('窗口A已进入sftp目录');

        // 打开窗口B并进入同一sftp目录
        console.log('步骤1.2：打开窗口B并进入同一sftp目录');
        await agent.aiRightClick(`文件管理器左侧边栏${ip}`);
        await agent.aiTap('在新窗口打开');
        // SFTP 服务器对用户目录有限制，挂载后窗口默认进入 sftp 目录下的 upload 子目录
        await agent.aiWaitFor(`窗口地址栏显示${ip}路径且文件列表展示远程目录内容`, { timeout: 15000 });
        await agent.aiAssert(`窗口地址栏显示${ip}路径且文件列表展示远程目录内容`);
        await new Promise(resolve => setTimeout(resolve, 300));

        // 窗口B布局到右侧
        await device.pressKey('super+right');
        await agent.aiWaitFor('右侧文件管理器窗口已布局到屏幕右侧');
        await new Promise(resolve => setTimeout(resolve, 300));
        await agent.aiTap(`文件管理器左侧边栏${ip}`);
        await agent.aiWaitFor(`窗口地址栏显示${ip}路径且文件列表展示远程目录内容`, { timeout: 15000 });
        await agent.aiAssert(`窗口地址栏显示${ip}路径且文件列表展示远程目录内容`);
        console.log('窗口B已进入sftp目录');

        // 窗口B卸载sftp：右键点击侧边栏sftp目录，选择卸载
        // 注意：须用「卸载」菜单项，窗口才会自动切回计算机目录（「取消记住密码并卸载选项」会使窗口停留在失效路径）
        console.log('步骤1.3：窗口B卸载sftp');
        await agent.aiRightClick(`侧边栏中的${ip}文本`);
        await agent.aiTap("卸载");
        await new Promise(resolve => setTimeout(resolve, 300));

        // 预期1：窗口A和窗口B均卸载成功，自动切换到计算机目录
        console.log('步骤1.4：验证窗口A和窗口B均卸载成功，自动切换到计算机目录');
        await agent.aiAssert(`侧边栏不显示${ip}文本`);
        await agent.aiAssert("左侧和右侧的窗口展示为计算机目录");
        console.log('✅ 步骤1验证通过：窗口A和窗口B均卸载成功，自动切换到计算机目录');

        // ===== 步骤2：窗口A进入sftp目录文件夹下-窗口B打开回收站目录-点击侧边栏sftp目录右键卸载 =====
        console.log('===== 步骤2：窗口A进入sftp目录文件夹下-窗口B打开回收站目录-点击侧边栏sftp目录右键卸载 =====');

        // 重新挂载sftp
        console.log('步骤2.1：重新挂载sftp');
        // v2(2026-09-23)：双分屏布局下认证弹窗仅占左半屏，SftpMount内aiTap("连接选项")被AI误定位到
        // 密码框右侧的眼睛图标（日志bbox [296,450,332,556]实证，连接按钮从未被点击，弹窗挂起）。
        // 这里内联确定性挂载：xdotool坐标操作弹窗，坐标基于1920x1080实测，按分辨率等比缩放
        const sftpPwd = process.env.SFTP_PASSWORD;
        const sftpName = process.env.SFTP_USERNAME;
        const sshBase = `sshpass -p '${sftpPwd}' ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 ${sftpName}@${ip}`;
        let geo2 = "1920 1080";
        try {
            const g2 = await system.exec("xdotool getdisplaygeometry");
            const gs2 = String(g2.stdout || "").trim();
            if (/\d+\s+\d+/.test(gs2)) geo2 = gs2;
        } catch (e) { }
        const gn2 = geo2.split(/\s+/).map(Number);
        const rw2 = (gn2[0] || 1920) / 1920, rh2 = (gn2[1] || 1080) / 1080;
        const xy = (x, y) => `${Math.round(x * rw2)} ${Math.round(y * rh2)}`;
        // 先点击左窗口空白区激活左窗口（步骤1.3卸载后焦点可能在右窗口，弹窗须出现在左半屏才能匹配坐标）
        await system.exec(`xdotool mousemove --sync ${xy(250, 700)} click 1`);
        await new Promise(resolve => setTimeout(resolve, 500));
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(`sftp://${ip}`, true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const promptAgain = await agent.aiBoolean("页面出现首次访问的安全提示框，提示标识验证失败，包含'取消登录'和'仍然登录'按钮");
        if (promptAgain) {
            await agent.aiTap("安全提示框中的'仍然登录'按钮");
        }
        await agent.aiWaitFor("弹出标题为'需要认证'的对话框");
        // 注册用户身份（默认通常已选中，点击确保）
        await system.exec(`xdotool mousemove --sync ${xy(583, 485)} click 1`);
        await new Promise(resolve => setTimeout(resolve, 300));
        // 用户名框：清空后xdotool直输
        await system.exec(`xdotool mousemove --sync ${xy(470, 538)} click 1`);
        await system.exec(`xdotool key ctrl+a`);
        await system.exec(`xdotool type --delay 80 '${sftpName}'`);
        // 密码框：xdotool直输（密码1为单字符；Tab移出触发表单校验刷新连接按钮）
        await system.exec(`xdotool mousemove --sync ${xy(470, 579)} click 1`);
        await system.exec(`xdotool key ctrl+a`);
        await system.exec(`xdotool type --delay 80 '${sftpPwd}'`);
        await system.exec(`xdotool key Tab`);
        await new Promise(resolve => setTimeout(resolve, 500));
        // 点连接按钮（弹窗底部右侧），门控确认进入sftp目录；未进入则坐标补点一次
        let entered = false;
        for (let c = 0; c < 2 && !entered; c++) {
            await system.exec(`xdotool mousemove --sync ${xy(562, 668)} click 1`);
            await new Promise(resolve => setTimeout(resolve, 4000));
            try {
                entered = await agent.aiBoolean(`左侧文件管理器窗口已进入sftp远程目录（地址栏显示${ip}，文件列表显示Desktop等家目录内容），且需要认证对话框已关闭`);
            } catch (e) { entered = false; }
            console.log(`第${c + 1}次点连接按钮后进入sftp目录=${entered}`);
        }
        if (!entered) throw new Error('认证弹窗点连接后未进入sftp目录');
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 通过ssh直连在sftp登录根目录（即uos家目录/home/uos，与挂载后窗口视图一致）创建测试文件夹。
        // v2(2026-09-23)：原脚本经gvfs FUSE路径 /sftp/upload 创建，实测uos对/sftp/upload无写权限
        // （touch权限不够），且挂载后窗口进入的是/home/uos而非/sftp/upload（报告截图+ssh探测实证），
        // 文件夹建错位置导致aiWaitFor超时。执行机自带sshpass，system.exec运行于执行机，可直连服务器
        await system.exec(`${sshBase} "mkdir -p ~/1812741_test && ls -d ~/1812741_test"`);
        await device.pressKey("F5");
        await device.pressKey("F5");
        await agent.aiWaitFor("1812741_test文件夹已显示");

        // 窗口A进入sftp目录下的1812741_test文件夹
        console.log('步骤2.2：左侧窗口进入sftp目录文件夹下');
        await agent.aiTap(`文件管理器左侧边栏${ip}`);
        await agent.aiDoubleClick("'1812741_test'文本");
        await agent.aiAssert("左侧窗口已进入1812741_test文件夹");
        console.log('窗口A已进入sftp目录下的1812741_test文件夹');

        // 窗口B打开回收站目录
        console.log('步骤2.3：右侧窗口打开回收站目录sftp');
        await agent.aiTap('右侧窗口中文件管理器左侧栏的回收站');
        await agent.aiAssert("右侧窗口已进入回收站目录");
        console.log('窗口B已进入回收站目录sftp');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 点击侧边栏sftp目录右键卸载（「卸载」菜单项使窗口自动切回计算机目录）
        await agent.aiRightClick(`侧边栏中的${ip}文本`);
        await agent.aiTap("卸载");

        // 预期2：窗口A自动切换到默认目录，即计算机目录上，窗口B正常运行
        console.log('步骤2.5：验证窗口A自动切换到默认目录，窗口B正常运行');
        await agent.aiAssert(`侧边栏不显示${ip}文本`);
        await agent.aiAssert("左侧窗口展示为计算机目录");
        await agent.aiAssert("右侧窗口展示为回收站目录");
        console.log('✅ 步骤2验证通过：窗口A自动切换到默认目录，窗口B正常运行');

        // v2：测试文件夹建在服务器uos家目录，test体内即时清理（afterAll钩子保持原貌不改；
        // 其rm的/sftp/upload旧路径在本环境无该目录，rm -rf静默成功无副作用）
        await system.exec(`${sshBase} "rm -rf ~/1812741_test"`);
        await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
        console.log('✅ 1812741用例测试完成');
    }, { timeout: 1200000, tags: ['1812741', 'level3', 'sftp', 'DITT', 'xuqi'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const ip = process.env.SFTP_IP;
        // 重新打开文管窗口（test结尾已关闭文管），清除sftp的upload目录下的测试文件
        await uos.openApp('文件管理器', 3000, 20000, true);
        await system.exec(`rm -rf /run/user/1000/gvfs/sftp:host=${ip}/sftp/upload/1812741_test`);
        // 若sftp仍处于挂载状态则通过UI卸载（已卸载时跳过，避免找不到侧边栏IP元素报错）
        const mounted = await agent.aiBoolean(`文件管理器左侧边栏中存在${ip}文本`);
        if (mounted) {
            await agent.aiRightClick(`侧边栏中的${ip}文本`);
            await agent.aiTap("卸载");
        }
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
