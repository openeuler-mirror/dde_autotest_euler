/**
 * 辅助函数: 红莲花安全浏览器 测试辅助函数
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

export async function ensureInstalled({ system, env }: { system: any; env: any }) {
  console.log('>>> 检查 红莲花安全浏览器 安装状态');
  const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.haitaichina.htbrowser`;
  await system.exec(installCmd);
  console.log('>>> 红莲花安全浏览器 安装命令已执行');
}

export async function ensureUninstalled({ system, env }: { system: any; env: any }) {
  console.log('>>> 卸载 红莲花安全浏览器');
  const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.haitaichina.htbrowser`;
  await system.exec(uninstallCmd);
  console.log('>>> 红莲花安全浏览器 卸载命令已执行');
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
  console.log('>>> 清理 红莲花安全浏览器 测试环境');
  const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.haitaichina.htbrowser`;
  await system.exec(uninstallCmd);
  console.log('>>> 清理完成');
}
