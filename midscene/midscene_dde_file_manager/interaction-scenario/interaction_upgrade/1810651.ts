/**
 * 用例 PMSID: 1810651
 * 用例标题: 终端安装
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/13
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1810651-终端安装', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });


    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1810651-终端安装', async ({ device, agent, uos, system }) => {
        // 2026-9-21 修复命令注入风险：TEST_PASSWORD 经 escShell 转义后再拼入 echo 单引号上下文，防止特殊字符破坏命令结构--UT005045(许琪)
        const { closeAllWindows, escShell } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const userName = process.env.TEST_USERNAME;
        const testPassword = process.env.TEST_PASSWORD;

        // 步骤1：手动下载软件包成功后，通过终端dpkg -i xxx 进行软件安装
        console.log("步骤1：通过apt download下载com.github.stacer软件包");
        // 先卸载stacer（如果已安装）
        await system.exec(`echo '${escShell(testPassword || '')}' | sudo -S dpkg -r com.github.stacer 2>/dev/null`, 30000);
        // 清理历史下载残留（防止匹配到旧的0字节/损坏deb）
        await system.exec(`rm -f /tmp/com.github.stacer*.deb`, 10000);
        await new Promise(resolve => setTimeout(resolve, 3000));
        // 使用apt download下载com.github.stacer到/tmp目录（该环境deepin定制apt可能静默不产出文件，降级为print-uris+curl）
        const downloadResult = await system.exec(`cd /tmp && apt download com.github.stacer`, 60000);
        console.log('apt download结果:', JSON.stringify(downloadResult));
        let debPath = "";
        const dl1 = await system.exec(`ls /tmp/com.github.stacer*.deb 2>/dev/null`);
        debPath = ((dl1.stdout || "").trim().split("\n")[0] || "");
        if (debPath) {
            // 校验文件非0字节（apt download静默失败时可能遗留空文件）
            const sizeChk = await system.exec(`stat -c %s ${debPath}`);
            const sz = parseInt((sizeChk.stdout || "0").trim(), 10);
            if (!sz) {
                console.log("apt download产物为空文件，走curl降级");
                debPath = "";
            }
        }
        if (!debPath) {
            console.log("apt download未生成deb文件，改用print-uris+curl下载");
            const uris = await system.exec(`apt-get download --print-uris com.github.stacer 2>&1 | grep -o "https://[^'\\"]*"`);
            const uri = ((uris.stdout || "").trim().split("\n")[0] || "");
            console.log('下载URI:', uri);
            if (!uri) {
                throw new Error("无法获取com.github.stacer的下载URI");
            }
            debPath = "/tmp/com.github.stacer.deb";
            const curlRes = await system.exec(`curl -fsSL --connect-timeout 15 --max-time 180 -o ${debPath} "${uri}"`, 240000);
            console.log('curl下载结果:', JSON.stringify(curlRes));
            if (curlRes.success === false || (curlRes.exitCode !== undefined && curlRes.exitCode !== 0)) {
                throw new Error(`curl下载com.github.stacer失败: ${curlRes.stderr || curlRes.stdout || '无输出'}`);
            }
        }
        // 校验deb包有效（dpkg-deb -I能读取control信息）
        const debCheck = await system.exec(`dpkg-deb -I ${debPath} 2>&1`);
        const debInfo = debCheck.stdout || debCheck.stderr || "";
        console.log('deb包信息:', debInfo.slice(0, 150));
        if (debInfo.includes("错误") || debInfo.includes("error")) {
            throw new Error(`下载的deb包无效: ${debInfo.slice(0, 200)}`);
        }
        console.log(`已下载deb包: ${debPath}`);
        console.log("步骤1：通过终端dpkg -i安装com.github.stacer软件包");
        // 通过dpkg -i安装com.github.stacer
        const installResult = await system.exec(`echo '${escShell(testPassword || '')}' | sudo -S dpkg -i ${debPath}`, 60000);
        console.log('安装退出码:', installResult.exitCode, '结果详情:', JSON.stringify(installResult));
        // v2(2026-09-23)：环境缺libqt5charts5导致dpkg配置失败（依赖关系问题），dpkg -i后追加
        //   apt-get install -f -y 自动补齐依赖完成配置（终端安装标准组合，仓库已验证可提供该依赖）
        if (!(installResult.success === true || installResult.exitCode === 0)) {
            console.log("dpkg依赖缺失，执行apt-get install -f -y修复依赖");
            await system.exec(`echo '${escShell(testPassword || '')}' | sudo -S apt-get install -f -y`, 180000);
        }
        // 预期1：可以安装成功（以dpkg状态库为准，依赖修复后配置完成即Status=install ok installed）
        const stateChk = await system.exec(`dpkg -s com.github.stacer 2>/dev/null | grep "^Status: install ok installed"`);
        if (!(installResult.success === true || installResult.exitCode === 0) && !(stateChk.stdout || "").includes("install ok installed")) throw new Error("dpkg安装com.github.stacer失败");

        // 步骤2：安装成功后查看软件是否显示正常，软件图标是否显示正常
        console.log("步骤2：查看软件显示和图标显示");
        await uos.openApp('Stacer', 3000, 20000, true);
        // 预期2：软件显示正常，图标显示正常
        await agent.aiAssert("打开了Stacer");
        await agent.aiAssert("Stacer图标显示正常");
        await closeAllWindows(device, agent);

        // 步骤3：软件安装成功后，再次用终端进行安装，查看软件是否依然能够安装成功
        console.log("步骤3：再次通过终端dpkg -i安装com.github.stacer软件包");
        const reinstallResult = await system.exec(`echo '${escShell(testPassword || '')}' | sudo -S dpkg -i ${debPath}`, 60000);
        console.log('再次安装退出码:', reinstallResult.exitCode, '结果详情:', JSON.stringify(reinstallResult));
        // 预期3：软件再次进行安装，依然可以安装成功
        if (!(reinstallResult.success === true || reinstallResult.exitCode === 0)) throw new Error("dpkg再次安装com.github.stacer失败");

        // 验证再次安装后软件仍能正常打开
        await uos.openApp('Stacer', 3000, 20000, true);
        await agent.aiAssert("打开了Stacer");
        await closeAllWindows(device, agent);

        // 清理下载的deb包
        await system.exec(`rm -f /tmp/com.github.stacer*.deb`);

    }, { timeout: 1200000, tags: ["1810651", 'level3', 'interaction_upgrade', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有窗口
        const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeAllWindows(device, agent);
        // 卸载测试安装的stacer并清理下载的deb包
        // 2026-9-21 修复命令注入风险：TEST_PASSWORD 经 escShell 转义后再拼入 echo 单引号上下文--UT005045(许琪)
        const { escShell } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const testPassword = process.env.TEST_PASSWORD;
        await system.exec(`echo '${escShell(testPassword || '')}' | sudo -S dpkg -r com.github.stacer 2>/dev/null`, 30000);
        await system.exec(`rm -f /tmp/com.github.stacer*.deb 2>/dev/null || true`);
    });
});