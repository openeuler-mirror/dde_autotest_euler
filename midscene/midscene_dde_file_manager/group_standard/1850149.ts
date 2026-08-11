/**
 * 用例 PMSID: 1850149
 * 用例标题: 访问NFS
 * 生成时间: 2026-04-22 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850149-访问NFS', () => {
  const user = process.env.TEST_USERNAME;
  const passwd = process.env.TEST_PASSWORD;
  const nfs_share_dir = `/home/${user}/Desktop/share`;
  const mount_dir = `/home/${user}/Desktop/mount`;
  const test_file = 'testfile_1850149.txt';

  const server_deb = [ 'nfs-kernel-server' ];
  const client_debs = [ 'nfs-common', 'libnfs-utils' ];
  const nfs_share_line = `${nfs_share_dir} 127.0.0.1(rw,sync,no_subtree_check,no_root_squash)`;

  let nfs_setup = false;
  let nfs_mount = false;

  async function isInstalled(system, deb) {
    let result = await system.exec(`dpkg -l ${deb} | grep -E ^ii`);
    return result.success;
  }

  async function debInstall(system, deb) {
    let installed = await isInstalled(system, deb);
    if (!installed) {
      console.log(`安装${deb}`);
      await system.exec(`echo ${passwd} | sudo -S apt-get update && echo ${passwd} | sudo -S apt-get install ${deb} -y`, 300000);
    };
    // 强制杀死apt相关进程
    await system.exec(`echo ${passwd} | sudo -S su -c "ps aux | grep apt | grep -v grep | awk '{print $2}' | xargs -I {} --no-run-if-empty kill -15 {}"`);
    assertTrue(await isInstalled(system, deb), `安装${deb}失败`);
  }

  async function debUninstall(system, deb) {
    let installed = await isInstalled(system, deb);
    if (installed) {
      console.log(`卸载${deb}`);
      await system.exec(`echo ${passwd} | sudo -S apt-get remove --purge ${deb} -y`, 300000);
    };
    // 强制杀死apt相关进程
    await system.exec(`echo ${passwd} | sudo -S su -c "ps aux | grep apt | grep -v grep | awk '{print $2}' | xargs -I {} --no-run-if-empty kill -15 {}"`);
    installed = await isInstalled(system, deb);
    assertTrue(!installed, `卸载${deb}失败`);
  }

  async function NFSSetup(system) {
    let nfs_setup = false;
    await system.exec(`test -d ${nfs_share_dir} || mkdir ${nfs_share_dir}`);
    await system.exec(`test -f ${nfs_share_dir}/${test_file} || yes "Hello World! 你好, 世界!" | head -c 1024 > ${nfs_share_dir}/${test_file}`);

    for(let deb of server_deb) {
      let installed = await isInstalled(system, deb);
      if (!installed) {
        console.log(`安装${deb}`);
        await debInstall(system, deb);
      }
    }

    let result = await system.exec(`grep "${nfs_share_line}" /etc/exports`);
    if (result.success) {
      console.log('nfs已配置');
      nfs_setup = true;
    } else {
      console.log('nfs未配置, 正在配置...');
      nfs_setup = false;
      await system.exec(`echo ${passwd} | sudo -S sed -i '$a ${nfs_share_line}' /etc/exports`);
    }

    await system.exec(`echo ${passwd} | sudo -S systemctl restart nfs-kernel-server`);

    return nfs_setup;
  }

  async function NFSClean(system) {
    await system.exec(`echo ${passwd} | sudo -S systemctl stop nfs-kernel-server`);
    await system.exec(`echo ${passwd} | sudo -S systemctl disable nfs-kernel-server`);
    await system.exec(`echo ${passwd} | sudo -S sed -i '/${nfs_share_dir}/d' /etc/exports`);
    await system.exec(`test -d ${nfs_share_dir} && rm -rf ${nfs_share_dir}`);

    for(let deb of server_deb) {
      let installed = await isInstalled(system, deb);
      if (installed) {
        console.log(`卸载${deb}`);
        await debUninstall(system, deb);
      }
    }
  }

  async function NFSMount(system) {
    let nfs_mount = false;
    for (let deb of client_debs) {
      let installed = await isInstalled(system, deb);
      if (!installed) {
        console.log(`安装${deb}`);
        await debInstall(system, deb);
      }
    };
    let result = await system.exec(`mount -l 2>/dev/null | grep 127.0.0.1:${nfs_share_dir} | grep ${mount_dir}`);
    if (result.success) {
      console.log('nfs已挂载');
      nfs_mount = true;
      return;
    } else {
      console.log('nfs未挂载, 正在挂载...');
      nfs_mount = false;
      await system.exec(`test -d ${mount_dir} || mkdir ${mount_dir}`);
      // 清理测试文件, 防止误判干扰
      await system.exec(`test -f ${mount_dir}/${test_file} && rm ${mount_dir}/${test_file} || true`);
      await system.exec(`echo ${passwd} | sudo -S mount -t nfs 127.0.0.1:${nfs_share_dir} ${mount_dir}`);
    }
    return nfs_mount;
  }

  async function NFSUnmount(system) {
    await system.exec(`echo ${passwd} | sudo -S umount ${mount_dir}`);
    await system.exec(`test -d ${mount_dir} && rm -rf ${mount_dir}`);

    for (let deb of client_debs) {
      let installed = await isInstalled(system, deb);
      if (installed) {
        console.log(`卸载${deb}`);
        await debUninstall(system, deb);
      }
    };
  }

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 配置NFS共享
    console.log('准备步骤: 配置NFS共享');
    nfs_setup = await NFSSetup(system);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 测试前没有挂载NFS, 清理NFS挂载
    console.log('清理步骤: 测试前没有挂载NFS, 清理NFS挂载');
    if (!nfs_mount) {
      console.log('清理NFS挂载');
      await NFSUnmount(system);
    }

    // 清理步骤: 测试前没有配置NFS, 清理NFS配置
    console.log('清理步骤: 测试前没有配置NFS, 清理NFS配置');
    if (!nfs_setup) {
      console.log('清理NFS配置');
      await NFSClean(system);
    }

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await device.pressKey('Super', 'Down');
    await system.exec(`killall dde-file-manager`);
    await agent.aiWaitFor('没有打开的文件管理器窗口');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850149-访问NFS', async ({ device, system, agent, uos }) => {

    // 步骤 1: 挂载NFS
    console.log('步骤 1: 挂载NFS');
    nfs_mount = await NFSMount(system);

    // 步骤 2: 打开${mount_dir}文件夹
    console.log('步骤 1: 打开${mount_dir}文件夹');
    await system.exec(`dde-file-manager ${mount_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${mount_dir}打开成功`);

    // 预期 2: ${mount_dir}文件夹中存在${test_file}文件
    console.log('预期 1: ${mount_dir}文件夹中存在${test_file}文件');
    await agent.aiAssert(`文件${test_file}存在`);

  }, { timeout: 600000, tags: ['1850149', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'nfs'] });

});
