/**
 * 功能：设备管理器-所有公共方法
 * 生成时间: 2026-04-21 19:30:00
 * 编写人: UT005045(许琪)
 */

export async function openDeviceManager(device: any, agent: any, uos: any) {
  const pwd = process.env.TEST_PASSWORD;
  await agent.aiTap("任务栏左下角启动器");
  await device.typeText('设备管理器', true);
  await new Promise(resolve => setTimeout(resolve, 500));
  await agent.aiWaitFor("弹出了鉴权对话框");
  await device.typeText(pwd, true);
  await uos.maximizeWindow();
}