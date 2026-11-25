/**
 * 用例 PMSID: 1806365
 * 用例标题: 日志适配规范-桌面不存在历史记录方式的本地日志
 * 生成时间: 2026-07-10 10:32:58
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME;
const cachePath = `/home/${username}/.cache/deepin`;

// 功能函数：初始化文管测试环境
async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin.dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1806365-日志适配规范-桌面不存在历史记录方式的本地日志', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  test('1806365-日志适配规范-桌面不存在历史记录方式的本地日志', async ({ device, agent, uos, system }) => {
    // 步骤1：检查~/.cache/deepin路径中的文件
    console.log('步骤1：检查~/.cache/deepin路径中是否存在dde-desktop文件夹');
    const result = await system.exec(`bash -c 'ls "${cachePath}" 2>/dev/null'`);
    const output = result.stdout.trim();
    console.log(`~/.cache/deepin 目录内容:\n${output || '(目录为空或不存在)'}`);

    // 断言1：无dde-desktop文件夹
    console.log('断言1：无dde-desktop文件夹');
    if (output.includes('dde-desktop')) {
      console.error(`断言1失败：~/.cache/deepin 目录下存在 dde-desktop 文件夹，实际内容: ${output}`);
    }
    assertTrue(!output.includes('dde-desktop'));
    console.log('断言1通过：~/.cache/deepin 目录下无 dde-desktop 文件夹');

  }, {
    timeout: 600000,
    tags: ['1806365', 'level4', 'external_interaction', 'hujian']
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
  });
});
