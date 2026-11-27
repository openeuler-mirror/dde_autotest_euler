/**
 * 用例 PMSID: 1815975
 * 用例标题: 长文件名功能  - 剪贴板
 * 用例模块: 文件管理器/主界面区域/文件操作
 * 来源用例: 禅道 PMS https://pms.uniontech.com/testcase-view-1815975.html （v7，5 步）
 * 生成时间: 2026-11-09
 * 用例编写人: UT000159（游伟）
 */
// @ts-nocheck

// 用例原文（PMS 1815975）：
//   前置1 开启长文件名功能（重启生效）
//        开启命令：dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.mount.dlnfs -v true
//   前置2 库目录、U盘内部、桌面有多个长文件名的文件、文件夹、应用
//   步骤1 复制长文件名的文件，检查剪贴板(win+v)的文件名称显示
//         预期：剪贴板正常打开，文件名显示部分名称，中间以...显示
//   步骤2 剪切长文件名的文件，检查剪贴板(win+v)的文件名称显示
//         预期：剪贴板正常打开，文件名显示部分名称，中间以...显示
//   步骤3 剪贴板的长文件名的文件，拖拽到桌面
//         预期：拖拽成功，桌面正常显示
//   步骤4 剪贴板中，删除该长文件名记录
//         预期：删除成功
//   步骤5 剪贴板中，全部清除长文件名记录
//         预期：全部清除成功
//
// 实现说明（对照同族脚本 1815915「长文件名功能(关闭) - 剪贴板」）：
//   1) 环境开关按"先取快照、后还原"处理（2026-11-09 youwei 要求：测试开始前先获取长文件名状态，
//      测试完成后再恢复成初始状态）：beforeAll 第一件事用 dde-dconfig 快照长文件名相关开关——
//      org.deepin.dlnfs/ulnfs 与 org.deepin.dde.file-manager/dfm.mount.dlnfs 的当前值、
//      isDefaultValue 标记，以及文管进程是否在跑；测试需要长文件名开启时仍用 common.ts 的
//      enableLongFileName 开启（org.deepin.dlnfs/ulnfs=true + 冷启动文管）；
//      afterAll 按快照把两个开关写回（原本是默认值就 reset，原本有非默认值就 set 回原值）并复位
//      文管进程/桌面；不再无条件写 ulnfs=false——旧写法会把"本来开启"的长文件名环境改成关闭，
//      污染后续用例与人工环境；
//   2) 长文件名素材放在库目录（文档）下：先复制、再剪切，剪贴板各留一条记录；
//   3) 步骤3「拖拽到桌面」先收掉文管窗口露出真实桌面（唯一可见落点即桌面），再用系统级 ls 校验
//      桌面真的出现了该长文件名文件，并在真实桌面上做视觉断言（2026-11-09 修：原判据依赖文管窗口视图，易误判）；
//   4) 步骤4/5 用剪贴板面板的条目数与"剪贴板中无内容"客观/AI 交叉校验。

const caseDir = process.env.TESTCASE_DIR;
const USERNAME = process.env.TEST_USERNAME;
const DOCS = `/home/${USERNAME}/Documents`;
const DESKTOP = `/home/${USERNAME}/Desktop`;
// 长文件名：160 个中文字符（480 字节），远超 255 字节限制，必须开长文件名功能才可创建
const LONG_CORE = '长文件名功能测试'.repeat(20);
const LONG_FILE = `${LONG_CORE}.txt`;
const LONG_DIR = `${LONG_CORE}文件夹`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// —— 长文件名开关初始状态快照 / 恢复 ——
// 需求（2026-11-09）：测试开始前先获取长文件名状态，测试完成后恢复成初始状态。
const DLNFS_APPID = 'org.deepin.dlnfs';
const DLNFS_RESOURCE = 'org.deepin.dlnfs';
const FM_APPID = 'org.deepin.dde.file-manager';
const FM_RESOURCE = 'org.deepin.dde.file-manager';
const ULNFS_KEY = 'ulnfs';
const DFM_DLNFS_KEY = 'dfm.mount.dlnfs';

// 说明：用例文件被框架用 new Function 直接执行（不做 TS 转译），这里只能写纯 JS，
//   不使用 interface / 类型注解，快照用普通对象承载。
const initialLongNameState = {};

/** 取命令 stdout（system.exec 在部分实现下直接返回字符串，此处兼容两种返回） */
function execStdout(res) {
  return ((typeof res === 'string' ? res : (res && res.stdout) || '') + '').trim();
}

/** 读取 dconfig 键的当前值与"是否为默认值"标记；键不存在/读取失败返回 undefined */
async function readDconfigKey(system, appid, resource, key) {
  const rawValue = execStdout(await system.exec(`dde-dconfig --get -a ${appid} -r ${resource} -k ${key} 2>/dev/null`))
    .replace(/^"|"$/g, '');
  if (!rawValue || /error/i.test(rawValue)) {
    console.log(`长文件名状态读取：${appid}/${key} 无有效值（原始输出="${rawValue}"）`);
    return undefined;
  }
  const rawDefault = execStdout(await system.exec(`dde-dconfig --get -a ${appid} -r ${resource} -k ${key} -m isDefaultValue 2>/dev/null`))
    .replace(/^"|"$/g, '').toLowerCase();
  const isDefault = rawDefault === 'true' ? true : rawDefault === 'false' ? false : null;
  console.log(`长文件名状态读取：${appid}/${key} = ${rawValue}（isDefaultValue=${rawDefault || '未知'}）`);
  return { value: rawValue, isDefault };
}

/** 前置：快照长文件名相关开关与文管进程状态（读取失败重试 3 次，仍失败则快速失败） */
async function captureLongNameState(system) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    initialLongNameState.ulnfs = await readDconfigKey(system, DLNFS_APPID, DLNFS_RESOURCE, ULNFS_KEY);
    if (initialLongNameState.ulnfs) break;
    console.log(`长文件名状态（${DLNFS_APPID}/${ULNFS_KEY}）第 ${attempt} 次读取失败，重试`);
    await sleep(1500);
  }
  if (!initialLongNameState.ulnfs) {
    throw new Error(`前置失败：无法获取长文件名初始状态（${DLNFS_APPID}/${ULNFS_KEY}），不进入测试以免测试后无法恢复环境`);
  }
  initialLongNameState.dfmMountDlnfs = await readDconfigKey(system, FM_APPID, FM_RESOURCE, DFM_DLNFS_KEY);
  const pidOut = execStdout(await system.exec('pidof dde-file-manager 2>/dev/null || echo none'));
  initialLongNameState.fileManagerRunning = !!pidOut && pidOut !== 'none';
  console.log(`长文件名初始状态快照：ulnfs=${JSON.stringify(initialLongNameState.ulnfs)}，`
    + `dfm.mount.dlnfs=${JSON.stringify(initialLongNameState.dfmMountDlnfs)}，文管进程在跑=${initialLongNameState.fileManagerRunning}`);
}

/** 把单个 dconfig 键恢复到快照值：原本是默认值 → reset；原本有非默认值 → set 回原值 */
async function restoreDconfigKey(system, appid, resource, key, snap) {
  if (!snap) {
    console.log(`长文件名状态恢复：${appid}/${key} 无初始快照，跳过`);
    return;
  }
  if (snap.isDefault === true) {
    await system.exec(`dde-dconfig --reset -a ${appid} -r ${resource} -k ${key} 2>/dev/null; true`);
    console.log(`长文件名状态恢复：${appid}/${key} 初始为默认值，已 reset`);
  } else {
    await system.exec(`dde-dconfig --set -a ${appid} -r ${resource} -k ${key} -v ${snap.value} 2>/dev/null; true`);
    console.log(`长文件名状态恢复：${appid}/${key} 已写回初始值 ${snap.value}`);
  }
}

/** 后置：把长文件名开关恢复成初始状态，并把文管进程/桌面复位到测试前的样子 */
async function restoreLongNameState(system, uos) {
  await restoreDconfigKey(system, FM_APPID, FM_RESOURCE, DFM_DLNFS_KEY, initialLongNameState.dfmMountDlnfs);
  await restoreDconfigKey(system, DLNFS_APPID, DLNFS_RESOURCE, ULNFS_KEY, initialLongNameState.ulnfs);
  // 文管进程状态复位：初始在跑 → 冷启动（ulnfs 变更须冷启动文管才生效）；初始没跑 → 关闭文管
  if (initialLongNameState.fileManagerRunning) {
    await system.exec('kill -9 $(pidof dde-file-manager) 2>/dev/null; sleep 2; nohup /usr/bin/dde-file-manager >/dev/null 2>&1 &', 15000);
    await sleep(5000);
  } else {
    await system.exec('killall -15 dde-file-manager 2>/dev/null; true');
    await sleep(2000);
  }
  // 回读校验：恢复后的值必须与快照一致，否则显式报错，避免环境静默漂移
  const nowUlnfs = await readDconfigKey(system, DLNFS_APPID, DLNFS_RESOURCE, ULNFS_KEY);
  const nowDfm = await readDconfigKey(system, FM_APPID, FM_RESOURCE, DFM_DLNFS_KEY);
  console.log(`长文件名状态恢复校验：ulnfs=${JSON.stringify(nowUlnfs)}（期望 ${JSON.stringify(initialLongNameState.ulnfs)}），`
    + `dfm.mount.dlnfs=${JSON.stringify(nowDfm)}（期望 ${JSON.stringify(initialLongNameState.dfmMountDlnfs)}）`);
  if (!nowUlnfs || nowUlnfs.value !== initialLongNameState.ulnfs?.value
    || !nowDfm || nowDfm.value !== initialLongNameState.dfmMountDlnfs?.value) {
    throw new Error('后置失败：长文件名状态未恢复到初始值');
  }
  await uos.showDesktop();
}

/** 关闭文管窗口并回到桌面（剪贴板面板需要桌面可见） */
async function backToDesktop(uos, system) {
  try {
    await uos.closeCurrentWindow();
  } catch (error) {
    // 已无窗口时忽略
  }
  await system.exec('killall -15 dde-file-manager 2>/dev/null; true');
  await sleep(1500);
  await uos.showDesktop();
}

/** 打开剪贴板面板（super+v）并等待渲染 */
async function openClipboard(device) {
  await device.pressKey('super+v');
  await sleep(1200);
}

describe('1815975-长文件名功能  - 剪贴板', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 用例要求：测试开始前先获取长文件名状态（测试结束后据此恢复初始状态）
    await captureLongNameState(system);
    const { closeFileManager, clearEnvironment, enableLongFileName } =
      await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await uos.showDesktop();
    await closeFileManager(system);
    // 前置1：开启长文件名功能（界面不可达，属于环境开关，通过配置通道开启）
    await enableLongFileName(device, agent, system);
    // 前置2：库目录（文档）下准备长文件名文件与文件夹
    await system.exec(`rm -rf '${DOCS}/${LONG_FILE}' '${DOCS}/${LONG_DIR}' '${DESKTOP}/${LONG_FILE}' 2>/dev/null; true`);
    await system.exec(`printf '%s\\n' 'ws89 1815975 long file name' > '${DOCS}/${LONG_FILE}'`);
    await system.exec(`mkdir -p '${DOCS}/${LONG_DIR}'`);
    const chk = await system.exec(`ls -1 '${DOCS}' | wc -l`);
    console.log(`前置校验：文档目录条目数=${String(chk.stdout || '').trim()}（长文件名素材已创建）`);
    // 2026-11-06：显式校验长文件名素材确实落盘——若 ulnfs 长文件名功能没真正生效，
    //   创建会静默失败，必须在这里快速失败并给出可诊断的信息，而不是等到步骤1 视觉断言才开始报错。
    const fOk = String((await system.exec(`test -f '${DOCS}/${LONG_FILE}' && echo yes || echo no`)).stdout || '').includes('yes');
    const dOk = String((await system.exec(`test -d '${DOCS}/${LONG_DIR}' && echo yes || echo no`)).stdout || '').includes('yes');
    console.log(`前置校验：长文件名文件存在=${fOk}，长文件名文件夹存在=${dOk}`);
    if (!fOk || !dOk) {
      throw new Error(`前置失败：长文件名素材未创建成功（文件=${fOk}，文件夹=${dOk}），长文件名功能可能未生效`);
    }
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1815975-长文件名功能  - 剪贴板', async ({ device, agent, uos, system }) => {
    // 步骤1：复制长文件名文件，检查剪贴板文件名称显示
    console.log('步骤1：文档内复制长文件名文件，打开剪贴板检查名称显示');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器窗口已打开', { timeoutMs: 40000, checkIntervalMs: 1000 });
    await uos.maximizeWindow();
    await agent.aiTap('文件管理器左侧边栏中的"文档"', { deepThink: true });
    await sleep(2500);
    await agent.aiAssert('文件管理器内容区域显示以"长文件名功能测试"开头的长文件名文件和文件夹');
    await agent.logScreenshot('1815975_step1_docs');
    // 目标文件按名称排序后至少有 2 个条目以"长文件名功能测试"开头，用"文件（非文件夹）"限定定位
    await agent.aiRightClick('文件管理器内容区域中名称为长文件名的文件（非文件夹）图标', { deepThink: true });
    await sleep(1000);
    await agent.aiTap('右键菜单中的"复制"选项');
    await sleep(1500);
    await backToDesktop(uos, system);
    await openClipboard(device);
    await agent.logScreenshot('1815975_step1_clipboard');
    await agent.aiAssert('剪贴板面板中展示了名称以"长文件名功能测试"开头、中间以省略号（...）省略显示的条目');
    console.log('步骤1通过：复制后剪贴板正常显示长文件名（中间省略号）');
    await device.pressKey('Escape');
    await sleep(800);

    // 步骤2：剪切长文件名文件，检查剪贴板文件名称显示
    console.log('步骤2：文档内剪切长文件名文件，打开剪贴板检查名称显示');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器窗口已打开', { timeoutMs: 40000, checkIntervalMs: 1000 });
    await uos.maximizeWindow();
    await agent.aiTap('文件管理器左侧边栏中的"文档"', { deepThink: true });
    await sleep(2500);
    await agent.aiRightClick('文件管理器内容区域中名称为长文件名的文件（非文件夹）图标', { deepThink: true });
    await sleep(1000);
    await agent.aiTap('右键菜单中的"剪切"选项');
    await sleep(1500);
    await openClipboard(device);
    await agent.logScreenshot('1815975_step2_clipboard');
    await agent.aiAssert('剪贴板面板中展示了名称以"长文件名功能测试"开头、中间以省略号（...）省略显示的条目');
    console.log('步骤2通过：剪切后剪贴板正常显示长文件名（中间省略号）');

    // 步骤3：把剪贴板里的长文件名文件拖拽到桌面
    console.log('步骤3：从剪贴板拖拽长文件名条目到桌面');
    // 2026-11-09 改写判据基线：原来在"文管窗口最大化、把桌面盖住"的情况下让 AI 自己找落点，
    //   实测 AI 会把条目拖进文管当前目录（文档）并弹出"文件冲突"对话框，或先把窗口最小化再找不到窗口，
    //   导致步骤3 反复误判失败（13:41、13:53 两次重跑实证）。现在先把文管窗口收掉、露出真实桌面，
    //   再打开剪贴板面板拖拽——此时屏幕上唯一的可见落点就是桌面，拖拽后也直接在真实桌面上做视觉断言，
    //   整个判据不再依赖文管窗口的当前目录/窗口状态。
    await backToDesktop(uos, system);
    await openClipboard(device);
    await agent.logScreenshot('1815975_step3_clipboard');
    await agent.aiAction('把剪贴板面板中名称以"长文件名功能测试"开头的条目拖拽到桌面的空白区域并松开');
    await sleep(3000);
    await agent.logScreenshot('1815975_step3_drag');
    let onDesktop = false;
    for (let i = 0; i < 15; i++) {
      const r = await system.exec(`test -e '${DESKTOP}/${LONG_FILE}' && echo yes || echo no`);
      if (String(r.stdout || '').includes('yes')) {
        onDesktop = true;
        break;
      }
      await sleep(2000);
    }
    if (!onDesktop) {
      throw new Error(`步骤3失败：拖拽后桌面未出现长文件名文件 ${LONG_FILE}`);
    }
    await agent.aiAssert('桌面上出现了以"长文件名功能测试"开头的长文件名文件图标（名称中间以省略号显示）');
    console.log('步骤3通过：拖拽成功，桌面出现长文件名文件');
    await device.pressKey('Escape');
    await sleep(800);

    // 步骤4：在剪贴板中删除该长文件名记录
    console.log('步骤4：剪贴板中删除该长文件名记录');
    await openClipboard(device);
    await agent.aiHover('剪贴板面板中名称以"长文件名功能测试"开头的条目');
    await sleep(1200);
    let removed = false;
    for (let attempt = 1; attempt <= 3 && !removed; attempt++) {
      try {
        await agent.aiTap('该剪贴板条目上出现的删除按钮（× 图标）', { deepThink: true });
      } catch (error) {
        console.log(`第 ${attempt} 次定位删除按钮失败，重新悬浮条目`);
        await agent.aiHover('剪贴板面板中名称以"长文件名功能测试"开头的条目');
        await sleep(1000);
      }
      await sleep(1800);
      removed = await agent.aiBoolean('剪贴板面板中已不存在名称以"长文件名功能测试"开头的条目');
      console.log(`第 ${attempt} 次删除后，长文件名条目已消失=${removed}`);
    }
    await agent.logScreenshot('1815975_step4_deleted');
    if (!removed) {
      throw new Error('步骤4失败：剪贴板中长文件名记录未被删除');
    }
    console.log('步骤4通过：剪贴板中长文件名记录删除成功');

    // 步骤5：全部清除
    console.log('步骤5：剪贴板中全部清除');
    await agent.aiTap('剪贴板面板中的"全部清除"');
    await sleep(1500);
    await agent.aiAssert('剪贴板中无内容');
    await agent.logScreenshot('1815975_step5_clear_all');
    console.log('步骤5通过：剪贴板全部清除成功');
    await device.pressKey('Escape');
    await sleep(800);
  }, { timeout: 1800000, tags: ['1815975', 'level3', 'remote', 'home', 'longfilename', 'DITT', 'youwei'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, resetDconfigDefaults } =
      await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await system.exec(`rm -rf '${DOCS}/${LONG_FILE}' '${DOCS}/${LONG_DIR}' '${DESKTOP}/${LONG_FILE}' 2>/dev/null; true`);
    // 通用复位（清 dconfig/json，作用于 org.deepin.dde.file-manager）——必须先执行：
    // 它会把 dfm.mount.dlnfs 一并 reset，若放在恢复之后会覆盖恢复结果
    await resetDconfigDefaults(system);
    // 再按 beforeAll 快照把长文件名开关恢复成初始状态，并复位文管进程/桌面
    await restoreLongNameState(system, uos);
  });
});
