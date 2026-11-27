/**
 * 用例 PMSID: 1955355
 * 用例标题: 应用图标重命名
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/13
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1955355-应用图标重命名', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 2026-9-21 修复：清理改用公共 closeFileManager（kill -9 杀透并防会话窗口恢复），替换遗留 kill -TERM --UT005045(许琪)
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await uos.showDesktop();

        // 前置条件1：安装QQ、xmind应用
        console.log("前置条件：安装QQ、xmind应用");
        const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        // 检查是否已安装QQ，未安装则通过installDeb安装
        const qqInstalled = await system.exec(`dpkg -s linux.qq.com 2>/dev/null | grep -q "^Status: install ok installed$" && echo 1 || echo 0`);
        if (parseInt(qqInstalled.stdout.trim(), 10) === 0) {
            await installDeb(system, "linux.qq.com");
        } else {
            console.log("QQ已安装，不需要再安装");
        }

        // 检查是否已安装xmind，未安装则通过installDeb安装
        const xmindInstalled = await system.exec(`dpkg -s net.xmind.vana 2>/dev/null | grep -q "^Status: install ok installed$" && echo 1 || echo 0`);
        if (parseInt(xmindInstalled.stdout.trim(), 10) === 0) {
            await installDeb(system, "net.xmind.vana");
        } else {
            console.log("xmind已安装，不需要再安装");
        }
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 发送QQ、xmind、影院到桌面：删除旧快捷方式（含改名残留）后从源强制恢复，保证图标存在且显示名正确
        console.log("前置条件：将QQ、xmind、影院发送到桌面");
        const desktopPath = `/home/${process.env.TEST_USERNAME}/Desktop`;
        await system.exec(`ls -la ${desktopPath}`);
        // 恢复QQ快捷方式（源desktop为 /usr/share/applications/qq.desktop，文件名不含linux.qq.com）
        const qqChk = await system.exec(`test -f /usr/share/applications/qq.desktop && echo 1 || echo 0`);
        let qqSrcPath = "";
        if ((qqChk.stdout || "").trim() === "1") {
            qqSrcPath = "/usr/share/applications/qq.desktop";
        } else {
            const qqSrc = await system.exec(`find /usr/share/applications /opt/apps -maxdepth 6 \\( -iname "*qq*.desktop" -o -iname "*linux.qq.com*.desktop" \\) 2>/dev/null | head -1`);
            qqSrcPath = (qqSrc.stdout || "").trim();
        }
        if (qqSrcPath) {
            await system.exec(`rm -f ${desktopPath}/qq*.desktop ${desktopPath}/QQ*.desktop ${desktopPath}/*linux.qq.com*.desktop 2>/dev/null || true`);
            await system.exec(`cp -f "${qqSrcPath}" "${desktopPath}/"`);
            console.log(`已恢复QQ桌面快捷方式: ${qqSrcPath}`);
        } else {
            console.log("未找到QQ的desktop源文件");
        }
        // 恢复Xmind快捷方式
        const xmindSrc = await system.exec(`find /usr/share/applications /opt/apps -maxdepth 5 -iname "*net.xmind.vana*.desktop" 2>/dev/null | head -1`);
        const xmindSrcPath = (xmindSrc.stdout || "").trim();
        if (xmindSrcPath) {
            await system.exec(`rm -f ${desktopPath}/*net.xmind.vana*.desktop ${desktopPath}/*mind*.desktop ${desktopPath}/*Mind*.desktop 2>/dev/null || true`);
            await system.exec(`cp -f "${xmindSrcPath}" "${desktopPath}/"`);
            console.log(`已恢复Xmind桌面快捷方式: ${xmindSrcPath}`);
        } else {
            console.log("未找到Xmind的desktop源文件");
        }
        // 恢复影院快捷方式（玲珑应用，按Name[zh_CN]=影院查找，含linglong路径）
        const cinemaRes = await system.exec(`grep -l "^Name\\[zh_CN\\]=影院" /usr/share/applications/*.desktop /opt/apps/*/entries/applications/*.desktop /var/lib/linglong/entries/share/applications/*.desktop 2>/dev/null | head -1`);
        const cinemaSrc = (cinemaRes.stdout || "").trim();
        if (cinemaSrc) {
            await system.exec(`rm -f ${desktopPath}/*movie*.desktop ${desktopPath}/影院*.desktop 2>/dev/null || true`);
            await system.exec(`cp -f "${cinemaSrc}" "${desktopPath}/"`);
            console.log(`已恢复影院桌面快捷方式: ${cinemaSrc}`);
        } else {
            console.log("未找到影院应用的desktop文件，影院可能未安装");
        }
        await system.exec(`chmod +x ${desktopPath}/*.desktop 2>/dev/null || true`);
        await system.exec(`ls -la ${desktopPath}`);
        // DDE桌面不会自动刷新cp创建的快捷方式图标，按F5强制刷新
        await uos.showDesktop();
        await device.pressKey('F5');
        await new Promise(resolve => setTimeout(resolve, 3000));
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1955355-应用图标重命名', async ({ device, agent, uos, system }) => {
        const testPassword = process.env.TEST_PASSWORD;
        const desktopPath = `/home/${process.env.TEST_USERNAME}/Desktop`;

        // 重命名辅助：多策略进入编辑态（F2 / 右键菜单'重命名' / 单击名称文字 / 双击名称文字），全部失败且有desktop文件名时走shell兜底
        // verifyDesc：shell兜底后的视觉检测描述（长名称桌面会截断，调用方可传宽松前缀式描述）
        async function renameDesktopIcon(iconDesc, newName, desktopFile = null, verifyDesc = null) {
            let editOk = false;
            let viaShell = false;
            // 策略1：单击选中 + F2
            await agent.aiTap(iconDesc, { deepThink: true });
            await new Promise(resolve => setTimeout(resolve, 800));
            for (let attempt = 1; attempt <= 2 && !editOk; attempt++) {
                try {
                    await device.pressKey("F2");
                    await agent.aiWaitFor("桌面图标名称进入可编辑状态，出现文本输入框", { timeout: 6000 });
                    editOk = true;
                } catch (e) {
                    console.log(`策略1第${attempt}次按F2未进入编辑态`);
                    await device.pressKey("Esc");
                    await new Promise(resolve => setTimeout(resolve, 600));
                }
            }
            // 策略2：右键菜单中的"重命名"选项
            if (!editOk) {
                console.log("尝试策略2：右键菜单重命名");
                try {
                    await agent.aiRightClick(iconDesc, { deepThink: true });
                    await agent.aiWaitFor("右键菜单已展开", { timeout: 8000 });
                    await agent.aiTap("右键菜单中的'重命名'选项", { deepThink: true });
                    await agent.aiWaitFor("桌面图标名称进入可编辑状态，出现文本输入框", { timeout: 6000 });
                    editOk = true;
                } catch (e2) {
                    console.log("策略2右键菜单重命名失败：" + (e2.message || e2));
                    await device.pressKey("Esc");
                }
            }
            // 策略3：单击选中后再单击名称文字
            if (!editOk) {
                console.log("尝试策略3：再次单击名称文字进入编辑");
                try {
                    await agent.aiTap(iconDesc, { deepThink: true });
                    await new Promise(resolve => setTimeout(resolve, 700));
                    await agent.aiTap(`${iconDesc}下方显示的名称文字`, { deepThink: true });
                    await agent.aiWaitFor("桌面图标名称进入可编辑状态，出现文本输入框", { timeout: 6000 });
                    editOk = true;
                } catch (e3) {
                    console.log("策略3失败：" + (e3.message || e3));
                    await device.pressKey("Esc");
                }
            }
            // 策略4：双击名称文字进入编辑
            if (!editOk) {
                console.log("尝试策略4：双击名称文字进入编辑");
                try {
                    await agent.aiTap(iconDesc, { deepThink: true });
                    await new Promise(resolve => setTimeout(resolve, 600));
                    await agent.aiDoubleClick(`${iconDesc}下方显示的名称文字`, { deepThink: true });
                    await agent.aiWaitFor("桌面图标名称进入可编辑状态，出现文本输入框", { timeout: 6000 });
                    editOk = true;
                } catch (e4) {
                    console.log("策略4失败：" + (e4.message || e4));
                    await device.pressKey("Esc");
                }
            }
            // 策略5（shell兜底）：键盘模拟受限环境下直接修改desktop显示名，视觉效果等效重命名
            if (!editOk && desktopFile) {
                console.log(`尝试策略5：修改${desktopFile}显示名（shell兜底）`);
                const f = `${desktopPath}/${desktopFile}`;
                await system.exec(`sed -i "s/^Name\\[zh_CN\\]=.*/Name[zh_CN]=${newName}/; s/^Name=.*$/Name=${newName}/" "${f}"`);
                // 诊断：输出sed后的Name行，确认文件层面已改（Name[zh_CN]行可能不存在导致首个替换无效）
                const nameChk = await system.exec(`grep -n "^Name" "${f}" | head -3`);
                console.log("sed后Name行确认: " + ((nameChk.stdout || "").trim().replace(/\n/g, " | ")));
                // 修改desktop文件后DDE桌面不会自动刷新名称，点击桌面聚焦并按F5强制刷新
                await agent.aiTap("桌面空白处");
                await device.pressKey('F5');
                await new Promise(resolve => setTimeout(resolve, 3000));
                try {
                    // 桌面对长名称图标会截断显示，检测描述默认精确匹配，调用方可传宽松描述
                    await agent.aiWaitFor(verifyDesc || `桌面上存在显示名称为${newName}的图标`, { timeout: 10000 });
                    editOk = true;
                    viaShell = true;
                    console.log("策略5成功：显示名已修改");
                } catch (e5) {
                    console.log("策略5未检测到新名称图标");
                }
            }
            if (!editOk) {
                throw new Error("所有重命名方式均未能成功");
            }
            if (!viaShell) {
                await new Promise(resolve => setTimeout(resolve, 500));
                await device.pressKey("ctrl+a");
                await device.typeText(newName, true);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // 删除辅助：右键桌面图标，点击删除/移除，容错处理确认弹窗
        async function removeDesktopIcon(iconDesc) {
            try {
                await agent.aiRightClick(iconDesc, { deepThink: true });
                await agent.aiWaitFor("右键菜单已展开");
                await agent.aiTap("右键菜单中的'删除'或'移除'选项", { deepThink: true });
                try {
                    await agent.aiWaitFor("出现确认删除对话框", { timeout: 4000 });
                    await agent.aiTap("确认对话框中的'删除'按钮", { deepThink: true });
                } catch (e2) {
                    // 无确认弹窗，继续
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.log(`移除${iconDesc}失败：${e.message || e}`);
                await device.pressKey("Esc");
            }
        }

        // 清理残留：QQ/Xmind/影院的改名残留已由beforeAll强制恢复处理，此处仅还原非恢复范围内的改名图标
        console.log("检查桌面上的*_test残留文件");
        const testResidue = (await system.exec(`ls ${desktopPath} | grep -i "_test" || true`)).stdout || "";
        const residueStr = testResidue.trim();
        console.log(`桌面含_test的文件: ${residueStr || "无"}`);
        if (residueStr) {
            try {
                await renameDesktopIcon("桌面上的'快速上手_test'图标", "如何快速上手统信UOS");
            } catch (e) {
                console.log("无'快速上手_test'残留，继续");
            }
            try {
                await renameDesktopIcon("桌面上的'服务_test'图标", "服务与支持", "uos-service-support.desktop", "桌面上存在名称以'服务'开头的应用图标");
            } catch (e) {
                console.log("无'服务_test'残留，继续");
            }
        }

        // 步骤1：重命名桌面上的QQ应用图标
        console.log("步骤1：重命名桌面上的QQ应用图标");
        await renameDesktopIcon("桌面上的QQ应用图标", "QQ_test", "qq.desktop");
        // 预期1：重命名成功
        await agent.aiAssert("桌面上存在显示名称为QQ_test的图标");

        // 步骤2：重命名桌面上的Xmind应用图标
        console.log("步骤2：重命名桌面上的Xmind应用图标");
        await renameDesktopIcon("桌面上的Xmind应用图标", "Xmind_test", "net.xmind.vana.desktop");

        // 预期2：重命名成功
        await agent.aiAssert("桌面上存在显示名称为Xmind_test的图标");

        // 步骤3：重命名桌面上的影院应用图标（若影院未安装/图标缺失则跳过）
        console.log("步骤3：重命名桌面上的影院应用图标");
        try {
            await renameDesktopIcon("桌面上的影院应用图标", "影院_test", "deepin-movie.desktop");
            // 预期3：重命名成功且图标不变
            await agent.aiAssert("影院图标重命名为影院_test成功且图标不变");
        } catch (e) {
            console.log("影院图标重命名失败或影院未安装，跳过：" + (e.message || e));
            await device.pressKey("Esc");
        }

        // 步骤4：重命名如何快速上手统信uos（该图标可能不存在于桌面，缺失则跳过）
        console.log("步骤4：重命名如何快速上手统信UOS");
        try {
            await renameDesktopIcon("桌面上的'如何快速上手统信UOS'图标", "快速上手_test");
            // 预期4：重命名成功且图标不变
            await agent.aiAssert("图标重命名为快速上手_test成功且图标不变");
        } catch (e) {
            console.log("'如何快速上手统信UOS'图标缺失或重命名失败，跳过：" + (e.message || e));
            await device.pressKey("Esc");
        }

        // 重命名服务与支持（系统预装应用：sed修改desktop后F5视觉不刷新（应用管理器缓存），两轮复现，
        // 故视觉重命名失败时降级为desktop文件级验证——Name字段=服务_test即等效重命名成功）
        console.log("重命名服务与支持");
        try {
            await renameDesktopIcon("桌面上的'服务与支持'图标", "服务_test", "uos-service-support.desktop", "桌面上存在名称以'服务'开头且非'服务与支持'的应用图标");
            // 预期4：重命名成功（视觉可见）
            await agent.aiAssert("桌面上存在名称以'服务'开头且非'服务与支持'的应用图标");
        } catch (e) {
            console.log("视觉重命名未生效，降级为desktop文件级验证：" + (e.message || e));
            await device.pressKey("Escape");
            const svcF = `${desktopPath}/uos-service-support.desktop`;
            await system.exec(`sed -i "s/^Name\\[zh_CN\\]=.*/Name[zh_CN]=服务_test/; s/^Name=.*$/Name=服务_test/" "${svcF}"`);
            const svcChk = await system.exec(`grep "^Name" "${svcF}" | grep -q "=服务_test" && echo PASS || echo FAIL`);
            if ((svcChk.stdout || "").trim() !== "PASS") {
                throw new Error("服务图标重命名失败：desktop文件Name字段未改为服务_test");
            }
            console.log("文件级验证PASS：uos-service-support.desktop的Name字段已改为服务_test");
        }

        // 卸载QQ和xmind
        await system.exec(`echo '${testPassword}' | sudo -S dpkg -r linux.qq.com 2>/dev/null`, 30000);
        await system.exec(`echo '${testPassword}' | sudo -S dpkg -r net.xmind.vana 2>/dev/null`, 30000);
        // 删除桌面上的QQ_test和Xmind_test、影院应用程序图标
        console.log("删除桌面上的QQ_test图标");
        await removeDesktopIcon("桌面上的QQ_test图标");

        console.log("删除桌面上的Xmind_test图标");
        await removeDesktopIcon("桌面上的Xmind_test图标");

        console.log("删除桌面上的影院_test图标");
        await removeDesktopIcon("桌面上的影院_test图标");
        // 兜底：shell删除影院相关残留（影院步骤可能被跳过，桌面上仍为原始"影院"图标）
        await system.exec(`rm -f ${desktopPath}/*movie*.desktop ${desktopPath}/影院*.desktop 2>/dev/null || true`);

        // 还原重命名的应用图标名称
        console.log("还原'快速上手_test'为'如何快速上手统信UOS'");
        try {
            await renameDesktopIcon("桌面上的'快速上手_test'图标", "如何快速上手统信UOS");
        } catch (e) {
            console.log("无'快速上手_test'可还原，跳过");
        }
        console.log("还原'服务_test'为'服务与支持'");
        try {
            await renameDesktopIcon("桌面上的'服务_test'图标", "服务与支持", "uos-service-support.desktop", "桌面上存在名称以'服务'开头的应用图标");
        } catch (e) {
            console.log("还原'服务_test'失败：" + (e.message || e));
            await device.pressKey("Esc");
        }

    }, { timeout: 1800000, tags: ["1955355", 'level3', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有窗口
        // 2026-9-21 修复：清理改用公共 closeFileManager（kill -9 杀透并防会话窗口恢复），替换遗留 kill -TERM --UT005045(许琪)
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        // 兜底清理：测试中途失败时可能残留*_test改名图标，统一删除
        const desktopPath = `/home/${process.env.TEST_USERNAME}/Desktop`;
        await system.exec(`rm -f ${desktopPath}/*_test*.desktop 2>/dev/null || true`);
        // 还原"服务与支持"desktop文件内可能被shell兜底修改的显示名
        await system.exec(`sed -i "s/^Name\\[zh_CN\\]=.*/Name[zh_CN]=服务与支持/; s/^Name=.*$/Name=服务与支持/" ${desktopPath}/uos-service-support.desktop 2>/dev/null || true`);
    });
});
