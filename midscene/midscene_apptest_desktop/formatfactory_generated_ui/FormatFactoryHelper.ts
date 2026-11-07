/**
 * 辅助函数: 格式工厂 测试辅助函数
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

export async function ensureInstalled({ system, env }: { system: any; env: any }) {
  console.log('>>> 检查 格式工厂 安装状态');
  const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install com.pcfreetime.formatfactory.deepin`;
  await system.exec(installCmd);
  console.log('>>> 格式工厂 安装命令已执行');
}

export async function ensureUninstalled({ system, env }: { system: any; env: any }) {
  console.log('>>> 卸载 格式工厂');
  const killCmd = `pkill -f 'com.pcfreetime.formatfactory.deepin'`;
  await system.exec(killCmd);
  const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.pcfreetime.formatfactory.deepin`;
  await system.exec(uninstallCmd);
  console.log('>>> 格式工厂 卸载命令已执行');
}

export async function openApp({ uos, agent, device, appSearchName }: { uos: any; agent: any; device: any; appSearchName: string }) {
  console.log(`>>> 打开 ${appSearchName}`);
  await uos.openLauncher();
  await uos.searchInLauncher(appSearchName);
  await device.pressKey('Enter');
  await agent.aiWaitFor(`${appSearchName}主界面已显示`, {
    timeoutMs: 60000,
    checkIntervalMs: 3000,
  });
  console.log(`>>> ${appSearchName} 已打开`);
}

export async function handleStartupPopups({ agent }: { agent: any }) {
  console.log('>>> 检查启动弹窗');
  try {
    await agent.aiWaitFor('启动弹窗或提示窗口', { timeoutMs: 10000 });
    await agent.aiTap('弹窗的关闭按钮');
    console.log('>>> 已关闭启动弹窗');
  } catch (e) {
    console.log('>>> 无启动弹窗');
  }
}

export async function cleanup({ system, env }: { system: any; env: any }) {
  console.log('>>> 清理 格式工厂 测试环境');
  const killCmd = `pkill -f 'com.pcfreetime.formatfactory.deepin'`;
  await system.exec(killCmd);
  const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.pcfreetime.formatfactory.deepin`;
  await system.exec(uninstallCmd);
  console.log('>>> 清理完成');
}
