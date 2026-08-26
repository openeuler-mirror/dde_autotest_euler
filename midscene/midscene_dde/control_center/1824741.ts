/**
 * 用例 PMSID: 1824741
 * 用例标题: 【控制中心】【系统】【语言和区域】设置货币正数为¥ 1.1(符号和数字存在空格)
 * 生成时间: 2026-05-07 10:30:00
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1824741-【控制中心】【系统】【语言和区域】设置货币正数为¥ 1.1(符号和数字存在空格)', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1824741-【控制中心】【系统】【语言和区域】设置货币正数为¥ 1.1(符号和数字存在空格)', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    // 步骤 2: 点击语言和区域
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    // 步骤 3: 点击货币正数下拉框，切换货币正数为¥ 1.1(符号和数字存在空格)
    await agent.aiTap("'货币正数'区域的ˇ符号");
    await agent.aiTap("货币正数下拉框中的[¥ 1.1]选项(而不是¥1.1)",{ deepThink: true });
    // 验证货币正数格式为¥ 1.1
    // 通过D-Bus获取当前货币正数格式，断言与期望值'¥ 1.1'一致
    const result = await system.exec("busctl --user call org.deepin.dde.Format1 /org/deepin/dde/Format1 org.freedesktop.DBus.Properties Get ss 'org.deepin.dde.Format1' 'PositiveCurrencyFormat'");
    // 解析busctl返回值（返回格式：v s "\302\245 1.1"），将八进制字节序列按UTF-8解码
    const match = result.stdout.match(/"(.+)"/);
    const rawValue = match ? match[1] : '';
    // 将八进制转义（如\302\245）收集为字节数组，整体按UTF-8解码
    const utf8Bytes = [];
    rawValue.replace(/\\([0-7]{3})|(.)/g, (_, oct, char) => {
      if (oct) {
        utf8Bytes.push(parseInt(oct, 8));
      } else {
        // 非转义字符逐字节追加
        for (let i = 0; i < char.length; i++) {
          utf8Bytes.push(char.charCodeAt(i));
        }
      }
      return '';
    });
    const currentPositiveCurrencyFormat = Buffer.from(utf8Bytes).toString('utf-8');
    //console.log(`   - D-Bus查询当前货币正数格式：${currentPositiveCurrencyFormat}`);
    assertEqual('¥ 1.1', currentPositiveCurrencyFormat);
  }, { timeout: 600000, tags: ['1824741', 'level3'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 步骤: 恢复窗口大小
    await device.pressKey("Super", "Down")
    // 步骤: 关闭控制中心窗口
    await uos.closeCurrentWindow();
    // 步骤: 还原货币正数默认值为'¥1.1'
    await system.exec("busctl --user call org.deepin.dde.Format1 /org/deepin/dde/Format1 org.freedesktop.DBus.Properties Set ssv 'org.deepin.dde.Format1' 'PositiveCurrencyFormat' s '¥1.1'");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});