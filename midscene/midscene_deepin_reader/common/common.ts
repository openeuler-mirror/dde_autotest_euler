/**
 * 功能：文档查看器公共方法
 * 生成时间: 2026-05-11
 * 编写人: UT006252(杨通)
 */


/**
 * 功能：清除文档查看器的缓存数据
 * 生成时间: 2026-05-11
 * 编写人: UT006252(杨通)
 */
export async function clearReader(system: any) {
  // 退出文档查看器应用
  await system.exec('killall deepin-reader');
  await new Promise(resolve => setTimeout(resolve, 3000));
  // 删除文档查看器的缓存数据
  await system.exec("rm -rf ~/.local/share/deepin/deepin-reader");
  await system.exec("rm -rf ~/.cache/deepin/deepin-reader");
}