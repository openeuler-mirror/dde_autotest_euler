/**
 * 用例 PMSID: 1804585
 * 用例标题: UBXC006010 smb文件操作
 * 生成时间：2026-08-03
 * 用例编写人：UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1804585-UBXC006010 smb文件操作', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        const { SmbMount, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const ip = process.env.SMB_IP;
        // // 前置完全卸载smb
        await cleanSmbMounts(agent, system);
        // 用户名挂载smb
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await SmbMount(agent, system, device, 1);
        await agent.aiAssert(`侧边栏出现${ip}文本`);
    });

    beforeEach(async ({ device, agent, system, uos }) => {
        console.log('2. beforeEach: 每个测试前的准备');

    });

    test('1804585-UBXC006010 smb文件操作', async ({ device, agent, uos, system }) => {
        const userName = process.env.TEST_USERNAME;
        const SMB_IP = process.env.SMB_IP;
        const SMB_USER = process.env.SMB_USERNAME;
        const SMB_PASS = process.env.SMB_PASSWORD;
        const TEST_PASSWORD = process.env.TEST_PASSWORD;
        // 步骤1：本地挂载Samba共享
        console.log("步骤1：本地挂载Samba共享");
        // 预期1：挂载成功
        await agent.aiAssert("smb挂载成功，侧边栏显示共享目录");

        // 步骤2：打开终端进入samba目录中复制文件到/home/uos目录
        console.log(`步骤2：打开终端进入samba目录中复制文件到/home/${userName}`);
        // 通过 Ctrl+Alt+T 快捷键打开终端
        await device.pressKey("Ctrl+Alt+T");
        await agent.aiWaitFor("终端窗口已打开");
        // 进入smb挂载目录
        await device.typeText(`cd /media/${userName}/smbmounts/smb-share:server=${SMB_IP},share=smbtest`);
        await device.pressKey("Enter");
        await agent.aiWaitFor("终端显示已进入smb目录");
        // 在smb目录中创建测试文件
        await device.typeText("touch 1804585.txt");
        await device.pressKey("Enter");
        await device.typeText(`cp 1804585.txt /home/${userName}/`);
        await device.pressKey("Enter");
        // 关闭终端
        await device.typeText("exit");
        await device.pressKey("Enter");
        await agent.aiWaitFor("终端窗口已关闭");
        await agent.aiAssert("1804585.txt");

        // 预期2：复制成功无报错
        // 复制文件到/home/uos目录
        await new Promise(resolve => setTimeout(resolve, 100));
        await agent.aiTap("左侧主目录文本,不是计算机");
        await agent.aiAssert("1804585.txt");

        // 步骤3：在终端对已挂载的smb文件夹进行新增、修改、删除操作
        console.log("步骤3：在终端对已挂载的smb文件夹进行新增、修改、删除操作");
        // 重新打开终端
        await device.pressKey("Ctrl+Alt+T");
        await agent.aiWaitFor("终端窗口已打开");
        // 进入smb挂载目录
        await device.typeText(`cd /media/${userName}/smbmounts/smb-share:server=${SMB_IP},share=smbtest`);
        await device.pressKey("Enter");
        await agent.aiWaitFor("终端显示已进入smb目录");
        // 新增文件
        await device.typeText("touch 1804585_new.txt");
        await device.pressKey("Enter");
        await agent.aiWaitFor("新增文件命令执行完成");
        // 预期3a：新增操作成功
        await agent.aiAssert("终端中touch命令执行成功，无报错信息");
        // 验证新增文件存在
        await device.typeText("ls 1804585_new.txt");
        await device.pressKey("Enter");
        await agent.aiAssert("终端显示1804585_new.txt文件存在");

        // 修改文件内容
        const MOUNT_POINT = "/mnt/smbtest";
        const TARGET_FILE = `${MOUNT_POINT}/1804585_new.txt`;
        const WRITE_CONTENT = "1804585的测试";

        // 1.切回用户家目录，避免停留在gvfs挂载目录
        await device.typeText("cd ~");
        await device.pressKey("Enter");

        // 2.清理旧挂载，屏蔽未挂载报错
        await device.typeText(`sudo umount ${MOUNT_POINT} 2>/dev/null || true`);
        await device.pressKey("Enter");
        await device.typeText(`${TEST_PASSWORD}`);
        await device.pressKey("Enter");

        // 3.创建挂载目录
        await device.typeText(`sudo mkdir -p ${MOUNT_POINT}`);
        await device.pressKey("Enter");

        // 4.cifs挂载，使用shell环境变量 $SMB_USER $SMB_PASS，增加forceuid,forcegid,cache=none,actimeo=0
        await device.typeText(`sudo mount -t cifs //${SMB_IP}/smbtest /mnt/smbtest -o username="${SMB_USER}",password="${SMB_PASS}",vers=3.0,uid=$(id -u),gid=$(id -g),forceuid,forcegid,file_mode=0644,dir_mode=0755,cache=none,actimeo=0
`);
        await device.pressKey("Enter");
        await agent.aiAssert("挂载无报错输出");

        // 5.写入测试内容
        await device.typeText(`printf '${WRITE_CONTENT}\\n' > ${TARGET_FILE}`);
        await device.pressKey("Enter");

        // 6.stat强制触发SMB服务端网络往返，解决cifs异步写延迟，丢弃输出
        await device.typeText(`stat ${TARGET_FILE} >/dev/null`);
        await device.pressKey("Enter");

        // 兜底极短等待，应对网络抖动
        await new Promise(resolve => setTimeout(resolve, 300));

        // 7.cat读取校验，验证修改内容
        await device.typeText(`cat ${TARGET_FILE}`);
        await device.pressKey("Enter");
        await agent.aiAssert(`终端输出显示了${WRITE_CONTENT}`);
        await new Promise(resolve => setTimeout(resolve, 300));

        // 删除文件
        await device.typeText(`rm ${TARGET_FILE}`);
        await device.pressKey("Enter");
        await device.typeText(`stat ${TARGET_FILE} >/dev/null 2>&1`);
        await device.pressKey("Enter");
        await new Promise(resolve => setTimeout(resolve, 300));

        await device.typeText(`test -f ${TARGET_FILE} && echo "FILE_EXIST" || echo "FILE_NOT_EXIST"`);
        await device.pressKey("Enter");
        await agent.aiAssert("终端输出显示了FILE_NOT_EXIST");

        await device.typeText("exit");
        await device.pressKey("Enter");
        await agent.aiWaitFor("终端窗口已关闭");

    }, { timeout: 600000, tags: ['1804585', 'level3', 'smb', 'DITT', 'xuqi'] });

    afterEach(async ({ device, agent, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 卸载测试中手动挂载的cifs目录，避免挂载残留影响后续用例（system.exec以root执行，无需sudo）
        await system.exec("umount /mnt/smbtest 2>/dev/null || true");
        const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanSmbMounts(agent, system);
        // 2026-9-21 修复：清理改用公共 closeFileManager（kill -9 杀透并防会话窗口恢复），替换遗留 kill -TERM --UT005045(许琪)
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
    });
});
