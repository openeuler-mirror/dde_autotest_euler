/**
 * 辅助函数: Visual Studio Code 测试辅助函数
 * 生成时间: 2026-09-18 15:30:00
 * 用例编写人：UT003531(钱程)
 */

export async function ensureInstalled({ system, env }: { system: any; env: any }) {
  console.log('>>> 安装 Visual Studio Code');
  const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install com.visualstudio.code`;
  await system.exec(installCmd);
  console.log('>>> Visual Studio Code 安装命令已执行');
}

export async function ensureUninstalled({ system, env }: { system: any; env: any }) {
  console.log('>>> 卸载 Visual Studio Code');
  const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.visualstudio.code`;
  await system.exec(uninstallCmd);
  console.log('>>> Visual Studio Code 卸载命令已执行');
}

export async function openApp({ uos, appSearchName }: { uos: any; appSearchName: string }) {
  console.log(`>>> 打开 ${appSearchName}`);
  await uos.openApp(appSearchName);
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
  console.log('>>> 清理 Visual Studio Code 测试环境');
  const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.visualstudio.code`;
  await system.exec(uninstallCmd);
  console.log('>>> 清理完成');
}
