/**
 * 用例 PMSID: 1807041
 * 用例标题: [005][core]聚合拖拽-桌面未铺满时，拖拽6个文件至桌面空白处
 * 生成时间: 2026-01-20 16:00:00
 * 用例编写人: UT000159（游伟）
 */

const work_dir = "~/Desktop/";
const test_file_pre = "testfile_1807041_";
const check_file_pre = "checkfile_1807041_";
const test_file_count = 30;
const check_file_count = 6;

const bak_dir = "~/bak";

const desktop_files = [
  "dde-computer.desktop",
  "deepin-tooltips.desktop",
  "uos-service-support.desktop",
  "dde-trash.desktop",
  "dde-home.desktop",
];

describe('1807041-[core]聚合拖拽-桌面未铺满时，拖拽6个文件至桌面空白处_', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 隐藏桌面图标
    console.log('隐藏桌面图标');
    await system.exec(`mkdir -pv ${bak_dir}`);
    for (let i = 0; i < desktop_files.length; i++) {
      let file = desktop_files[i];
      await system.exec(`mv ~/Desktop/${file} ${bak_dir}/${file}`);
    };
    // 备份桌面其它文件
    await system.exec(`mv ~/Desktop/* ${bak_dir}`);
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807041-[005][core]聚合拖拽-桌面未铺满时, 拖拽6个文件至桌面空白处', async ({ device, agent, uos, system }) => {
    const dest = "桌面右上角";
    // 步骤 1 : 创建${check_file_count}个以${test_file_pre}开头的文件, 并选中
    console.log(`步骤 1: 创建${check_file_count}个${check_file_pre}文件`);
    for (let i = 0; i < check_file_count; i++) {
      await system.exec(`echo checkfile${i} > ${work_dir}${check_file_pre}${i}.txt`);
    }
    await agent.aiWaitFor(`桌面上有${check_file_count}个以${check_file_pre}开头的文件`);
    await device.pressKey('Ctrl', 'A');
    await agent.aiWaitFor(`桌面上有${check_file_count}个以${check_file_pre}开头的文件被选中`);

    // 步骤 2: 创建${test_file_count}个以${test_file_pre}开头的文件
    console.log(`步骤 2: 创建${test_file_count}个${test_file_pre}文件`);
    for (let i = 0; i < test_file_count; i++) {
      await system.exec(`echo testfile${i} > ${work_dir}${test_file_pre}${i}.txt`);
    }
    await agent.aiWaitFor(`桌面上有${test_file_count}个以${test_file_pre}开头的文件`);

    // 步骤 3: 拖拽至桌面空白处
    console.log(`步骤 3: 拖拽选中的文件至桌面空白处`);
    // await agent.aiAction("将被选中的6个文件拖拽到桌面中心坐标处");
    await agent.aiDrag(`${check_file_pre}0.txt文件`, dest);
    await agent.aiWaitFor(`被选中的${check_file_count}个文件移动到${dest}`);
    await agent.aiAssert(`桌面上有${check_file_count}个文件被选中`);
    await agent.aiAssert(`被选中的${check_file_count}个文件是按文件名排序的`);

  }, { timeout: 600000, tags: ['1807041', 'level2', 'smoke', 'DITT', 'youwei', 'desktop', 'emblems', 'badges'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    for (let i = 0; i < test_file_count; i++) {
      await system.exec(`test -f ${work_dir}${test_file_pre}${i}.txt && rm ${work_dir}${test_file_pre}${i}.txt | true`);
    }
    for (let i = 0; i < check_file_count; i++) {
      await system.exec(`test -f ${work_dir}${check_file_pre}${i}.txt && rm ${work_dir}${check_file_pre}${i}.txt | true`);
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复测试前隐藏的文件
    console.log('恢复测试前隐藏的文件');
    for (const file of desktop_files) {
      await system.exec(`mv ${bak_dir}/${file} ~/Desktop/${file}`);
    };
    // 恢复其它文件
    await system.exec(`mv ${bak_dir}/* ~/Desktop/`)
    await system.exec(`rmdir ${bak_dir}`);
  });
});
