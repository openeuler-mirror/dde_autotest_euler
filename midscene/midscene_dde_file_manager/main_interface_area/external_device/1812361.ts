/**
 * 用例 PMSID: 1812361
 * 用例标题: 缩略图预览，网络协议显示，文管设置和组策略同步
 * 生成时间: 2026-08-21
 * 用例编写人: UT006487(王薇)
 */

describe('1812361-缩略图预览，网络协议显示，文管设置和组策略同步', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //安装dde-dconfig-editor工具
    const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await installDeb(system, 'dde-dconfig-editor');
  });

  test('1812361-缩略图预览，网络协议显示，文管设置和组策略同步', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 打开文件管理器，右上角设置，侧边栏点击缩略图预览 =====');

    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap('右上角有3条横线的图标', { deepThink: true });
    await agent.aiTap('下拉菜单中的设置', { deepThink: true });
    await agent.aiTap('侧边栏中的缩略图预览');

    console.log('===== 预期1: 加载网络、手机、光盘目录的缩略图左侧为未勾选状态 =====');
    await agent.aiAssert('加载网络、手机、光盘目录的缩略图左侧为未勾选状态');

    console.log('✅ 预期1验证通过: 加载网络、手机、光盘目录的缩略图左侧为未勾选状态');

    console.log('===== 步骤2: 勾选加载网络、手机、光盘左侧图标 =====');
    await agent.aiAction('勾选加载网络、手机、光盘目录的缩略图左边的勾选框');
    await agent.aiAssert('加载网络、手机、光盘目录的缩略图左侧为勾选状态');

    console.log('===== 预期2: 终端命令输入命令查看输出结果为true =====');
    const result2 = await system.exec('dde-dconfig get org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k remoteThumbnailEnable');
    const output2 = result2.stdout?.trim() || String(result2).trim();
    console.log(`步骤2 dde-dconfig get 输出结果: ${output2}`);

    if (output2 === 'true') {
      console.log(`✅ 预期2验证通过: 输出结果为 "${output2}"，符合预期`);
    } else {
      console.error(`❌ 预期2验证失败: 期望 "true"，实际为 "${output2}"`);
      throw new Error(`验证失败: dde-dconfig get 输出结果 "${output2}" 不符合预期 true`);
    }

    console.log('===== 步骤3: 取消勾选加载网络、手机、光盘左侧图标 =====');
    await agent.aiAction('取消勾选加载网络、手机、光盘目录的缩略图左边的勾选框');
    await agent.aiAssert('加载网络、手机、光盘目录的缩略图左侧为未勾选状态');

    console.log('===== 预期3: 终端命令输入命令查看输出结果为false =====');
    const result3 = await system.exec('dde-dconfig get org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k remoteThumbnailEnable');
    const output3 = result3.stdout?.trim() || String(result3).trim();
    console.log(`步骤3 dde-dconfig get 输出结果: ${output3}`);

    if (output3 === 'false') {
      console.log(`✅ 预期3验证通过: 输出结果为 "${output3}"，符合预期`);
    } else {
      console.error(`❌ 预期3验证失败: 期望 "false"，实际为 "${output3}"`);
      throw new Error(`验证失败: dde-dconfig get 输出结果 "${output3}" 不符合预期 false`);
    }

    console.log('✅ 测试用例执行完成');

  }, { timeout: 600000, tags: ['1812361', 'level3', 'external_device', 'wangwei'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap('右上角有3条横线的图标', { deepThink: true });
    await agent.aiTap('下拉菜单中的设置', { deepThink: true });
    await agent.aiTap('侧边栏中的缩略图预览');
    const isChecked = await agent.aiBoolean('加载网络、手机、光盘目录的缩略图被勾选');
    if (isChecked) {
      console.log('已勾选，点击取消勾选');
      await agent.aiAction('取消勾选加载网络、手机、光盘目录的缩略图左边的勾选框');
    } else {
      console.log('未勾选，无需操作');
    }
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });
});
