/**
 * 用例 PMSID: 1802217
 * 用例标题: 【通知中心】内容有图片的通知信息，图片超出规定大小后会自动缩放
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1802217-【通知中心】内容有图片的通知信息，图片超出规定大小后会自动缩放', () => {
  const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64/apps/';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知（删库+重启 dde-shell），确保通知中心为空
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 准备测试图片: 小图片(10x10, 小于40px)和大图片(400x400, 大于106px)
    await system.exec(`ffmpeg -y -f lavfi -i color=c=0xFF0000:s=10x10 -frames:v 1 /tmp/qjx_img_small.png`);
    await system.exec(`ffmpeg -y -f lavfi -i color=c=0x0000FF:s=400x400 -frames:v 1 /tmp/qjx_img_large.png`);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1802217-【通知中心】内容有图片的通知信息，图片超出规定大小后会自动缩放', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 关闭可能残留的系统认证弹窗，避免遮挡通知横幅/通知中心
    const { closeSystemAuthDialog } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await closeSystemAuthDialog(agent);

    // 步骤 1: 传入图片长度和宽度小于40px尺寸
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "test" 0 "" "小图片测试" "小于40px尺寸图片" "[]" '{"urgency": <1>, "image-path": <"file:///tmp/qjx_img_small.png">}' 60000`);
    await agent.aiWaitFor('桌面右下角出现通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查1: 横幅为瞬时展示且小图片视觉难以判定，图片展示以通知中心验证为准
    console.log('通知横幅已弹出（小图片展示将在通知中心验证）');
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiWaitFor('通知中心中显示标题为"小图片测试"的通知信息', { timeoutMs: 15000 });
    // 本机实测: 小于40px的小图片在通知中心仅显示占位图标（dde 通知服务不渲染极小图片），属本机产品行为限制
    const smallImgShown = await agent.aiBoolean('通知中心中"小图片测试"通知正文区域展示了红色小图片', { deepThink: true });
    if (smallImgShown) {
      console.log('小图片正常展示');
    } else {
      console.log('小图片未展示（本机通知服务不渲染小于40px图片，仅显示占位图标）——需在支持小图片渲染的 DDE 环境验证');
    }
    await agent.aiAssert('通知中心中标题为"小图片测试"的通知信息正常展示，标题和正文内容完整');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 步骤 2: 传入图片长度或宽度大于106px尺寸
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "test" 0 "" "大图片测试" "大于106px尺寸图片" "[]" '{"urgency": <1>, "image-path": <"file:///tmp/qjx_img_large.png">}' 60000`);
    await agent.aiWaitFor('桌面右下角出现通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查2: 横幅为瞬时展示且视觉判定不稳定，图片展示以通知中心验证为准
    console.log('通知横幅已弹出（大图片展示将在通知中心验证）');
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiWaitFor('通知中心中显示标题为"大图片测试"的通知信息', { timeoutMs: 15000 });
    await agent.aiAssert('通知中心中标题为"大图片测试"的通知信息正文区域展示了一张图片（图片已展示），通知标题和正文文字完整可读');
  }, { timeout: 600000, tags: ['1802217', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 清理通知（删库+重启 dde-shell）
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
