/**
 * 功能：获取dde-dconfig的get和set命令
 * 生成时间: 2026-3-12 19:40:00
 * 编写人: UT001924(李鹤)
 */

export async function getDconfigValue( appId, resource, key, system ) {
  const cmd = `dde-dconfig --get -a ${appId} -r ${resource} -k ${key}`;
  const result = await system.exec(cmd);
  return result.stdout.trim();
}

export async function setDconfigValue( appId, resource, key, value, system ) {
  const cmd = `dde-dconfig --set -a ${appId} -r ${resource} -k ${key} -v ${value}`;
  await system.exec(cmd);
}

/**
 * 功能：busctl获取和设置属性值公共函数
 * 生成时间: 2026-3-12 20:23:00
 * 编写人: UT001924(李鹤)
 */

export async function BusctlGetProperty(busType, busName, objectPath, interfaceName, key, system) {
  const cmd = `busctl ${busType} get-property ${busName} ${objectPath} ${interfaceName} ${key}`;
  const result = await system.exec(cmd);
  return result.stdout.trim().split(' ').pop();
}

export async function BusctlSetProperty(busType, busName, objectPath, interfaceName, key, value, system) {
  const cmd = `busctl ${busType} set-property ${busName} ${objectPath} ${interfaceName} ${key} ${value}`;
  await system.exec(cmd);
}

/**
 * 功能：恢复更新设置配置项的默认值
 * 生成时间: 2026-6-23 14:00:00
 * 编写人: UT001924(李鹤)
 */

export async function resetUpdateSettings(system) {
  const resetCommandList = [
    "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetIdleDownloadConfig s '{\"IdleDownloadEnabled\":false,\"BeginTime\":\"17:00\",\"EndTime\":\"20:00\"}'",
    "busctl --system set-property org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Manager UpdateMode t 5",
    "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetDownloadSpeedLimit s '{\"DownloadSpeedLimitEnabled\":false,\"LimitSpeed\":\"1024\"}'",
    "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetAutoDownloadUpdates b 0",
    "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetUpdateNotify b 1",
    "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Manager SetAutoClean b 1"
  ];

  for (const cmd of resetCommandList) {
    await system.exec(cmd);
  }
}

/**
 * 功能：判断是否有认证弹窗，有认证弹窗就关闭
 * 生成时间: 2026-6-23 20:35:00
 * 编写人: UT001924(李鹤)
 */

export async function closeAuthDialog(agent, device) {
  const hasAuthDialog = await agent.aiBoolean('"需要认证"或"需认证"', { deepThink: true });
  if (hasAuthDialog) {
    console.log('有认证弹窗');
    await agent.aiTap('"需要认证"或"需认证"文字', { deepThink: true })
    await device.pressKey("esc");
  } else {
    console.log('没有认证弹窗');
  }
}

/**
 * 功能：悬浮定位后长按拖动鼠标
 * 生成时间: 2026-7-17 17:00:00
 * 编写人: UT001924(李鹤)
 * @param agent Agent实例（用于aiHover定位目标元素）
 * @param device PCDevice实例
 * @param hoverPrompt aiHover的定位描述（如：标题为"xxx"的通知横幅）
 * @param dx 横向拖动距离（正数向右，负数向左）
 * @param dy 纵向拖动距离（正数向下，负数向上）
 * @param holdMs 按住左键等待时间（毫秒）
 */

export async function hoverDrag(agent, device, hoverPrompt: string, dx: number, dy: number, holdMs: number) {
  const pcService = device.getPCService();

  // 1. 悬浮定位到目标元素
  await agent.aiHover(hoverPrompt, { deepThink: true });
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 2. 获取当前鼠标位置作为拖动起点
  const pos = await pcService.mouse.getPosition();
  const startX = pos.x;
  const startY = pos.y;

  // 3. 按下鼠标左键
  await pcService.mouse.pressButton(0);

  // 4. 按住保持指定时间
  await new Promise(resolve => setTimeout(resolve, holdMs));

  // 5. 平滑分段拖动：根据总距离智能计算步长和间隔
  // 总距离越大，步长适当增大但不超过20px；间隔保持8ms保证流畅
  const totalDist = Math.sqrt(dx * dx + dy * dy);
  const step = Math.min(20, Math.max(8, Math.round(totalDist / 15)));
  const delayMs = 8;
  const xDir = dx > 0 ? 1 : -1;
  const yDir = dy > 0 ? 1 : -1;
  let currX = 0, currY = 0;
  while (Math.abs(dx - currX) > step || Math.abs(dy - currY) > step) {
    if (Math.abs(dx - currX) > step) currX += step * xDir;
    if (Math.abs(dy - currY) > step) currY += step * yDir;
    await pcService.mouse.move([{ x: startX + currX, y: startY + currY }]);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  // 剩余距离一次性走完，避免残留偏移
  await pcService.mouse.move([{ x: startX + dx, y: startY + dy }]);

  // 6. 松开鼠标左键
  await pcService.mouse.releaseButton(0);

  // 7. 等待操作完成后的动画：距离越大等待越长，最少1000ms，最多5000ms
  const settleMs = Math.min(5000, Math.max(1000, Math.round(totalDist * 5)));
  await new Promise(resolve => setTimeout(resolve, settleMs));
}

