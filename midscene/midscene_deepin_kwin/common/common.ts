/**
 * 功能：midscene_deepin_kwin 公共函数库
 * 提供应用安装检查、崩溃检测等公共方法
 * 生成时间: 2026-07-14
 * 编写人: UT003620（孙翠）
 */

/**
 * 确保应用已安装，如果未安装则自动通过应用商店安装
 * 生成时间: 2026-07-14
 * 编写人: UT003620（孙翠）
 * @param {string} appName - 应用名称
 * @param {Object} agent - AI 代理对象
 * @param {Object} device - 设备对象
 * @param {Object} uos - UOS 系统对象
 * @param {Object} [options] - 可选配置
 * @param {number} [options.searchTimeout=10000] - 搜索超时时间（毫秒）
 * @param {number} [options.installTimeout=1000000] - 安装超时时间（毫秒）
 * @returns {Promise<boolean>} - 返回应用是否可用（已存在或安装成功）
 */
export async function ensureAppInstalled(
  appName: string,
  agent: any,
  device: any,
  uos: any,
  system: any,
  options: {
    searchTimeout?: number;
    installTimeout?: number;
  } = {}
): Promise<boolean> {
  const {
    searchTimeout = 30000,
    installTimeout = 1000000
  } = options;

  console.log(`[ensureAppInstalled] 开始检查应用 "${appName}" 是否已安装`);

  try {
    // 步骤1: 打开应用商店
    await uos.openApp('应用商店');
    await agent.aiWaitFor('应用商店界面已显示');

    // 步骤2: 点击左侧菜单的应用管理
    await agent.aiTap('点击左侧菜单的应用管理', { deepThink: true });
    await agent.aiWaitFor('应用管理页面已显示');

    // 步骤3: 在搜索框输入应用名（先清空再输入）
    await agent.aiTap('应用管理页面搜索框', { deepThink: true });
    await device.pressKey('LeftCtrl', 'A');
    await device.pressKey('Delete');
    await device.typeText(appName, false);

    // 步骤4: 点击搜索按钮
    await agent.aiTap('搜索按钮', { deepThink: true });
    await agent.aiWaitFor('搜索结果页面已显示');

    // 步骤5: 判断应用是否已安装
    let appInstalled = false;
    try {
      await agent.aiWaitFor(`搜索结果页面显示${appName}应用`, { timeout: searchTimeout });
      console.log(`[ensureAppInstalled] 找到应用 "${appName}"，不需要安装`);
      appInstalled = true;
    } catch (error) {
      console.log(`[ensureAppInstalled] 未找到应用 "${appName}"，需要安装`);
      appInstalled = false;
    }

    // 步骤6: 如果应用未安装，执行安装流程
    if (!appInstalled) {
      console.log(`[ensureAppInstalled] 开始安装应用 "${appName}"`);

      // 点击热门推荐，进入热门推荐页面
      await agent.aiTap('应用商店窗口左侧导航栏的热门推荐', { deepThink: true });
      await agent.aiWaitFor('热门推荐页面已显示');

      // 在搜索框输入应用名
      await agent.aiTap('应用商店搜索框', { deepThink: true });
      await device.typeText(appName, false);
      await device.pressKey('Enter');
      await agent.aiWaitFor('搜索结果页面已显示');

      // 选择deb包格式（去掉玲珑包）
      try {
        await agent.aiTap('包格式后面的如意玲珑选项', { deepThink: true });
        console.log(`[ensureAppInstalled] 已选择deb包格式`);
      } catch (error) {
        console.log(`[ensureAppInstalled] 无需选择包格式或选择失败`);
      }

      // 点击应用图标后面的安装按钮
      await agent.aiTap(`${appName}图标后面的安装按钮`, { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 200000));
      await agent.aiWaitFor(`${appName}应用已安装`, { timeout: installTimeout });
      console.log(`[ensureAppInstalled] 应用 "${appName}" 安装完成`);
          // 关闭应用商店
      await system.exec('killall deepin-home-appstore-client');
    }

    // 关闭应用商店
    await system.exec('killall deepin-home-appstore-client');

    return true;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[ensureAppInstalled] 检查或安装应用 "${appName}" 时出错:`, errorMessage);
    return false;
  }
}

/**
 * 清理桌面环境：释放按键、取消截图面板、关闭所有窗口
 * 生成时间: 2026-07-29
 * 编写人: UT003620（孙翠）
 * @param {Object} device - 设备对象
 * @param {Object} uos - UOS 系统对象
 * @param {Object} agent - AI 代理对象
 */
export async function cleanDesktopEnvironment(device: any, uos: any, agent: any): Promise<void> {
  console.log('[cleanDesktopEnvironment] 开始清理桌面环境');

  // 步骤1：释放所有按键
  try {
    await device.releaseAllKeys();
    console.log('[cleanDesktopEnvironment] 已释放所有按键');
  } catch (e) {
    console.log('[cleanDesktopEnvironment] 释放按键操作跳过');
  }

  // 步骤1.1：判断是否处于锁屏登录界面，如果是则输入系统密码回车进入桌面
  // 说明：锁屏状态下无法操作桌面，需先解锁；锁屏界面不支持剪贴板粘贴，故用xdotool type输入
  try {
    const systemPassword = process.env.TEST_PASSWORD || '';
    let unlocked = false;
    for (let i = 0; i < 3; i++) {
      try {
        await agent.aiWaitFor('锁屏登录界面已显示，包含用户名、密码输入框、时间日期等锁屏元素', { timeout: 2000 });
        console.log(`[cleanDesktopEnvironment] 检测到锁屏登录界面，尝试解锁 (第${i + 1}次)`);
        const cp = await import('node:child_process');
        // 清空可能残留的输入内容
        cp.execSync('xdotool key --repeat 20 BackSpace');
        await new Promise(resolve => setTimeout(resolve, 500));
        if (systemPassword) {
          cp.execSync(`xdotool type --clearmodifiers '${systemPassword}'`);
          await new Promise(resolve => setTimeout(resolve, 500));
          await device.pressKey('Enter');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        // 验证已回到桌面
        await agent.aiWaitFor('已回到系统桌面，锁屏登录界面已消失', { timeout: 5000 });
        unlocked = true;
        console.log('[cleanDesktopEnvironment] 已从锁屏登录界面进入系统桌面');
        break;
      } catch (e) {
        console.log('[cleanDesktopEnvironment] 未检测到锁屏登录界面');
        break;
      }
    }
    if (!unlocked && systemPassword) {
      console.log('[cleanDesktopEnvironment] 锁屏解锁失败，继续尝试后续清理步骤');
    }
  } catch (e) {
    console.log('[cleanDesktopEnvironment] 锁屏界面检查跳过:', e);
  }

  // 步骤2：判断是否有解锁登录秘钥环弹窗，如果有则输入系统密码并点击解锁按钮，检查三遍
  try {
    const systemPassword = process.env.TEST_PASSWORD || '';
    for (let i = 0; i < 3; i++) {
      try {
        await agent.aiWaitFor('桌面上有解锁登录秘钥环弹窗', { timeout: 2000 });
        console.log(`[cleanDesktopEnvironment] 检测到解锁登录秘钥环弹窗，尝试解锁 (第${i + 1}次)`);
        await agent.aiTap('秘钥环弹窗中的密码输入框', { deepThink: true });
        await device.typeText(systemPassword, false);
        await agent.aiTap('秘钥环弹窗中的解锁按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.log('[cleanDesktopEnvironment] 未检测到解锁登录秘钥环弹窗');
        break;
      }
    }
  } catch (e) {
    console.log('[cleanDesktopEnvironment] 秘钥环弹窗检查跳过');
  }

  // 补充步骤：清理可能残留的截图录屏、浏览器、WPS、文管等进程
  // （截图工具栏/浏览器弹窗等 Esc 或 Alt+F4 可能无法关闭，需强制结束进程）
  try {
    const cp = await import('node:child_process');
    cp.execSync('killall deepin-screen-recorder 2>/dev/null || true');
    cp.execSync('killall deepin-music 2>/dev/null || true');
    cp.execSync('killall dde-clipboard 2>/dev/null || true');
    cp.execSync('killall browser 2>/dev/null || true');
    cp.execSync('killall et 2>/dev/null || true');
    cp.execSync('killall wpp 2>/dev/null || true');
    cp.execSync('killall dde-file-manager 2>/dev/null || true');
    cp.execSync('killall prohibit_amd 2>/dev/null || true');
    cp.execSync('killall prohibit_arm 2>/dev/null || true');
    console.log('[cleanDesktopEnvironment] 已清理残留进程（截图录屏/浏览器/WPS/文管）');
  } catch (e) {
    console.log('[cleanDesktopEnvironment] 清理残留进程跳过');
  }

  // 步骤3：判断桌面是否有展开显示的窗口，如果有则Alt+F4关闭，直到所有窗口关闭
  try {
    for (let i = 0; i < 5; i++) {
      try {
        await agent.aiWaitFor('桌面上有展开显示的应用窗口', { timeout: 2000 });
        console.log(`[cleanDesktopEnvironment] 检测到展开窗口，尝试关闭 (第${i + 1}次)`);
        await device.pressKey('Alt', 'F4');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.log('[cleanDesktopEnvironment] 桌面上无展开窗口');
        break;
      }
    }
  } catch (e) {
    console.log('[cleanDesktopEnvironment] 窗口检查跳过');
  }

  // 步骤4：使用showDesktop显示桌面
  try {
    await uos.showDesktop();
    console.log('[cleanDesktopEnvironment] 已显示桌面');
  } catch (e) {
    console.log('[cleanDesktopEnvironment] 显示桌面操作跳过');
  }

  // 步骤6：设置任务栏位置为下、经典（高效）模式、始终显示，保证用例环境一致
  // 说明：函数签名无system参数，使用node:child_process执行命令（与步骤2清理进程方式一致）；
  // 关键：本机任务栏(dde-shell)实时生效的配置源是 DBus 属性 org.deepin.dde.daemon.Dock1，
  // 仅写 gsettings/dde-dconfig 不会触发界面刷新；需用 busctl set-property 立即生效，
  // 同时写 gsettings 保证 dock 重启后配置保持
  try {
    const cp = await import('node:child_process');
    // 持久化配置（dock 重启后回读）
    cp.execSync('gsettings set com.deepin.dde.dock position bottom');
    cp.execSync('gsettings set com.deepin.dde.dock display-mode efficient');
    cp.execSync('gsettings set com.deepin.dde.dock hide-mode keep-showing');
    // 即时生效（Position: 0=top 1=right 2=bottom 3=left；DisplayMode: 0=fashion 1=efficient；
    // HideMode: 0=keep-showing 1=keep-hidden 3=smart-hide）
    cp.execSync('busctl --user set-property org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.daemon.Dock1 Position i 2');
    cp.execSync('busctl --user set-property org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.daemon.Dock1 DisplayMode i 1');
    cp.execSync('busctl --user set-property org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.daemon.Dock1 HideMode i 0');
    console.log('[cleanDesktopEnvironment] 已设置任务栏位置为下、经典模式');
  } catch (e) {
    console.log('[cleanDesktopEnvironment] 设置任务栏位置/模式跳过:', e);
  }

  console.log('[cleanDesktopEnvironment] 桌面环境清理完成');
}

/**
 * 统计指定应用类（WM_CLASS）的窗口数量
 * 说明：多个窗口重叠显示时，AI视觉仅能看到最上层窗口，无法可靠判断窗口数量，
 * 故用xdotool按窗口类统计实际窗口数（dde-file-manager、deepin-terminal等）
 * @param {Object} system - 系统对象
 * @param {string} windowClass - 窗口类名，如 dde-file-manager / deepin-terminal / browser
 * @returns {Promise<number>} - 返回窗口数量
 */
export async function countWindowsByClass(system: any, windowClass: string): Promise<number> {
  const res = await system.exec(`xdotool search --class ${windowClass} 2>/dev/null | wc -l`);
  return parseInt(res.stdout.trim()) || 0;
}

/**
 * 检查kwin_x11进程是否有崩溃记录
 * 生成时间: 2026-07-14
 * 编写人: UT003620（孙翠）
 * @param {Object} system - 系统对象
 * @param {string} [since] - 可选，只检查此时间之后的崩溃记录（格式如 "2026-08-13 17:17:00"）
 * @returns {Promise<boolean>} - 返回是否有kwin_x11崩溃记录
 */
export async function checkKwinCrash(system: any, since?: string): Promise<boolean> {
  // 未提供 since 时，默认只检查最近30分钟的崩溃记录
  const effectiveSince = since || new Date(Date.now() - 30 * 60 * 1000).toLocaleString("zh-CN", { hour12: false });
  console.log("[checkKwinCrash] 执行coredumpctl list检查kwin_x11崩溃日志");
  const cmd = `coredumpctl list --since="${effectiveSince}"`;
  console.log(`[checkKwinCrash] 执行命令: ${cmd}`);
  const coredumpResult = await system.exec(cmd);
  const coredumpOutput = coredumpResult.stdout;
  console.log("coredumpctl list 输出:", coredumpOutput);
  const hasKwinCrash = coredumpOutput.includes("kwin_x11");
  return hasKwinCrash;
}

/**
 * 根据系统架构下载资源文件
 * @param system  Midscene-UOS system 实例
 * @param baseUrl 资源基础URL（不含文件名）
 * @param destDir 目标目录，默认 ~/Desktop
 * @returns { arch, fileName, destPath, success }
 */
export async function downloadByArch(
  system: any,
  baseUrl: string =`${process.cwd()}/apps/midscene_deepin_kwin/resources`,
  destDir: string = '~/Desktop'
) {
    // 1. 判断系统架构
    const result = await system.exec('uname -m');
    const arch = result.stdout.trim();

    // 2. 根据架构拼接文件名并下载
    let fileName: string;
    if (arch === 'x86_64') {
        fileName = 'prohibit_amd';
    } else {
        fileName = 'prohibit_arm';
    }

    const destPath = `${destDir}/${fileName}`;
    const url = `${baseUrl}/${fileName}`;
    // await system.exec(`curl -o ${destPath} ${url}`);
     await system.exec(`cp ${baseUrl}/${fileName} ${destDir}`);

    // 3. 判断文件是否复制成功
    const check = await system.exec(`ls -la ${destPath}`);
    const success = check.success;
    if (!success) {
        throw new Error(`文件下载失败: ${fileName}`);
      }

    return { arch, fileName, destPath, success };
}
