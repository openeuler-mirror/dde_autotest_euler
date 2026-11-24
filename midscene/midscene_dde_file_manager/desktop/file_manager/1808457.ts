// @ts-nocheck
/**
 * 用例 PMSID: 1808457
 * 用例标题: 搜索-SFTP搜索拖拽文件到桌面
 * 生成时间: 2026-08-18 10:00:00 
 * 用例编写人：UT005045（许琪）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1808457-搜索-SFTP搜索拖拽文件到桌面', () => {

    // 前置：初始化+设置前置条件
    beforeAll(async ({ uos, system, agent }) => {
        console.log('1. beforeAll: 初始化测试套件，清理旧数据');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.showDesktop();
        // 前置完全卸载sftp
        const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        // 打开文件管理器确保能访问侧边栏进行卸载判断
        await uos.openApp('文件管理器', 3000, 20000, true);
        await cleanSftpMounts(agent, system);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });

    // 每个测试前的准备
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1808457-搜索-SFTP搜索拖拽文件到桌面', async ({ device, agent, uos, system, env }) => {
        const ip = process.env.SFTP_IP;
        console.log(`SFTP服务器IP：${ip}`);

        // ========== 步骤1：打开文件管理器-点击搜索输入sftp://IP地址 ==========
        console.log('===== 步骤1: 打开文件管理器-点击搜索输入sftp://IP地址 =====');
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");

        // 挂载sftp（sftp后端不支持URI子路径，实测窗口始终落在主目录，故挂载用标准URI）
        console.log('===== 步骤1: 挂载sftp目录 =====');
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(`sftp://${ip}`, true);
        const boolB = await agent.aiBoolean(`页面出现标识验证失败文本`);
        if (boolB) {
            console.log('触发弹窗，点击仍然登陆');
            await agent.aiTap("仍然登陆文本");
        } else {
            console.log('未触发弹窗认证');
        }
        const isAuth = await agent.aiBoolean(`页面出现需要认证窗口`);
        if (isAuth) {
            await device.typeText(`${process.env.SFTP_USERNAME}`);
            await agent.aiInput(`${process.env.SFTP_PASSWORD}`, '密码输入框');
            await agent.aiTap("连接选项");
            await system.exec("sleep 2");
        }
        const boolA = await agent.aiBoolean(`页面出现卸载文件系统需要认证文本`);
        if (boolA) {
            console.log('触发弹窗认证，输入密码');
            await device.typeText(`${process.env.TEST_PASSWORD}`, true);
        } else {
            console.log('未触发弹窗认证');
        }
        // 在服务器的 /sftp/upload 下创建测试文件
        // v2(2026-09-23)：system.exec 无用户会话DBUS上下文，对GVFS FUSE路径的mkdir/touch静默失败
        //   （27轮实录：窗口能读upload列表但素材始终未出现，1812811遗留素材的rm清理同样从未生效），
        //   改为sshpass直连SFTP服务器sudo创建（已实测：uos对upload无写权限但有sudo）
        const sftpUser = process.env.SFTP_USERNAME;
        const sftpPass = process.env.SFTP_PASSWORD;
        const remoteCreate = `echo '${sftpPass}' | sudo -S mkdir -p /sftp/upload/1808457 && echo '${sftpPass}' | sudo -S touch /sftp/upload/1808457.txt && echo '${sftpPass}' | sudo -S chmod -R 755 /sftp/upload/1808457`;
        const createRes = await system.exec(`sshpass -p '${sftpPass}' ssh -o StrictHostKeyChecking=no ${sftpUser}@${ip} "${remoteCreate}"`, 60000);
        console.log('SFTP服务器素材创建结果:', JSON.stringify(createRes).slice(0, 200));
        // 通过本地GVFS挂载路径跳转到 /sftp/upload（sftp:// URI带子路径会被忽略，本地FUSE路径不受影响）
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(`/run/user/1000/gvfs/sftp:host=${ip}/sftp/upload`, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await device.pressKey('F5');
        await agent.aiWaitFor("文件夹内存在1808457文件夹和1808457.txt文件", { timeoutMs: 30000, checkIntervalMs: 2000 });
        // ========== 步骤2：拖拽文件/文件夹到桌面 ==========
        console.log('===== 步骤2: 拖拽SFTP中的文件/文件夹到桌面 =====');
        // 还原窗口大小，使桌面可见
        await agent.aiTap('点击窗口右上角还原按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
        // 拖拽文件夹到桌面
        await agent.aiDrag('1808457', '桌面空白处');
        await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
        // 拖拽文件到桌面
        await agent.aiDrag('1808457.txt', '桌面空白处');
        await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
        // 拖拽后DDE桌面可能未自动刷新，先聚焦桌面再按F5强制刷新
        await uos.showDesktop();
        await agent.aiTap("桌面空白处");
        await device.pressKey('F5');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // ========== 预期：成功拖拽到桌面 ==========
        console.log('===== 预期验证: 成功拖拽到桌面 =====');
        await agent.aiWaitFor("桌面存在1808457文件夹和1808457.txt文件", { timeout: 20000 });
        console.log('✅ 步骤2验证通过：成功拖拽文件夹和文件到桌面');
        console.log('✅ 1808457用例测试完成');
        // v2(2026-09-23)：GVFS FUSE路径rm静默失败（afterAll的GVFS清理不生效），改sshpass直连SFTP服务器清理素材
        await system.exec(`sshpass -p '${sftpPass}' ssh -o StrictHostKeyChecking=no ${sftpUser}@${ip} "echo '${sftpPass}' | sudo -S rm -rf /sftp/upload/1808457 /sftp/upload/1808457.txt"`, 60000);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    }, { timeout: 1200000, tags: ["1808457", "level3", "file_manager", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device, env }) => {
        console.log('3. afterAll: 清理测试残留');
        const ip = process.env.SFTP_IP;
        // 清除桌面文件
        await system.exec(`rm -rf ~/Desktop/1808457`);
        await system.exec(`rm -rf ~/Desktop/1808457.txt`);
        // 清除sftp的upload目录下的测试文件
        await system.exec(`rm -rf /run/user/1000/gvfs/sftp\:host=${ip}/sftp/upload/1808457`);
        await system.exec(`rm -rf /run/user/1000/gvfs/sftp\:host=${ip}/sftp/upload/1808457.txt`);
        // 卸载sftp
        await uos.openApp('文件管理器', 3000, 20000, true);
        const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanSftpMounts(agent, system);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});