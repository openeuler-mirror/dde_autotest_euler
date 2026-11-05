/**
 * 关闭 XMind 应用启动后的入门弹窗
 * @param params - 包含 uos 和 agent 对象
 */
export async function closeXmindPopup({ uos, agent }: { uos: any; agent: any }) {
  // 尝试等待弹窗出现，如果超时则忽略
  const result =await agent.aiBoolean('应用中出现"快速入门"弹窗',{timeout:15000});
  if(result){
    await agent.aiTap("弹窗中的'跳过'按钮");
    console.log("成功关闭入门弹窗");
  }
  else{console.log('未检测到入门弹窗继续执行测试');}
}

/**
 * XMind 测试中的清理工作：关闭升级弹窗
 * @param params - 包含 system 和 env 对象
 */
export async function closeUpPopup({ uos, agent }: { uos: any; agent: any }) {
  // 尝试等待弹窗出现，如果超时则忽略
  const resultUp =await agent.aiBoolean('应用中出现"升级"弹窗(升级弹框内存在解锁一切精彩，尽享全部新功能字样)',{timeout:10000});
  if(resultUp){
    await agent.aiTap("弹窗右上角的“关闭”按钮（类似×的按钮）");
    console.log("成功关闭升级弹窗");
  }
  else{console.log('未检测到升级弹窗继续执行测试');}

    // 尝试等待弹窗出现，如果超时则忽略
  const result =await agent.aiBoolean('应用中出现"快速入门"弹窗',{timeout:10000});
  if(result){
    await agent.aiTap("弹窗中的'跳过'按钮");
    console.log("成功关闭入门弹窗");
  }
  else{console.log('未检测到入门弹窗继续执行测试');}
}

/**
 * XMind 测试后的清理工作：强制关闭进程、卸载应用、删除缓存
 * @param params - 包含 system 和 env 对象
 */
export async function cleanupXmind({ system, env }: { system: any; env: any }) {
  // 强制关闭窗口（忽略错误）
  const killCmd = `echo '${env.testPassword}' | sudo -S pkill -f "xmind|XMind" || true`;
  await system.exec(killCmd);

  // 清理 /tmp 中的 XMind core dump 文件
  await system.exec(`echo '${env.testPassword}' | sudo -S rm -f /tmp/core.xmind.*`);
  // 清理已停止服务的 systemd-private 目录
  await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf /tmp/systemd-private-*`);
  // 清理 Chromium/Electron 遗留的临时目录
  await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf /tmp/scoped_dir*`);

  // 删除缓存用户数据（注意路径中的单引号处理）
  await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf "/home/uos/.config/Xmind/Electron\ v3/vana/state/editors.json"`);
  await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf "/home/uos/.config/Xmind/Electron\ v3/vana/workbooks"`);
  // 卸载应用
  const unInstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall cn.xmind`;
  await system.exec(unInstallCmd);
  const unInstallCmdDeb = `echo '${env.testPassword}' | sudo -S apt remove -y net.xmind.vana`;
  await system.exec(unInstallCmdDeb);
}