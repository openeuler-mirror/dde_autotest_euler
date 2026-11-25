/**
 * 用例 PMSID: 1812369
 * 用例标题: 磁盘隐藏-检查组策略增加磁盘隐藏组策略
 * 生成时间: 2026-08-21
 * 用例编写人: UT006487(王薇)
 */

describe('1812369-磁盘隐藏-检查组策略增加磁盘隐藏组策略', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await installDeb(system, 'dde-dconfig-editor');
  });

  test('1812369-磁盘隐藏-检查组策略增加磁盘隐藏组策略', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 终端命令输入dde-dconfig get org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.disk.hidden =====');

    const result = await system.exec('dde-dconfig get org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.disk.hidden');
    const output = result.stdout?.trim() || String(result).trim();
    console.log(`dde-dconfig get 输出结果: ${output}`);

    console.log('===== 预期1: 查看步骤1的输出结果为以下三种的一个为通过：包含[ 或 显示true 或 显示false =====');

    const containsEmptyBrackets = output.includes('[');
    const isTrue = output === 'true';
    const isFalse = output === 'false';

    if (containsEmptyBrackets || isTrue || isFalse) {
      console.log(`✅ 验证通过: 输出结果为 "${output}"，符合预期`);
    } else {
      console.error(`❌ 验证失败: 输出结果为 "${output}"，不符合预期(期望包含[ 或 显示true 或 显示false)`);
      throw new Error(`验证失败: dde-dconfig get 输出结果 "${output}" 不符合预期`);
    }

    console.log('✅ 测试用例执行完成');

  }, { timeout: 300000, tags: ['1812369', 'level3', 'external_device', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });
});
