/**
 * 用例 PMSID: 1654945
 * 用例标题: 日志json配置文件内容
 * 生成时间: 2026-04-22
 * 用例编写人: UT006165（李日华）
 */

describe('1654945-日志json配置文件内容', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1654945-日志json配置文件内容', async ({ device, agent, uos, system }) => {
    // 步骤 1: 检查路径存在/usr/share/deepin-log-viewer/deepin-log.conf.d/
    const checkDirCmd = "ls -d /usr/share/deepin-log-viewer/deepin-log.conf.d/";
    const dirResult = await system.exec(checkDirCmd);
    console.log('dirResult',dirResult.stdout);
    assertTrue(dirResult.stdout);

    // 步骤 2: 进入该路径下查看文件，文件后缀名全为.json文件
    const checkFilesCmd = "ls /usr/share/deepin-log-viewer/deepin-log.conf.d/";
    const filesResult = await system.exec(checkFilesCmd);
    console.log('dirResult',filesResult.stdout);
    
    const files = filesResult.stdout.trim().split('\n');
    console.log('file:',files)
    //说明：循环检查该路径文件下的所有文件的后缀名，不符合均抛出异常
    for (const file of files) {
      assertTrue(file.endsWith('.json'))
      if (!file.endsWith('.json')) {
        throw new Error(`发现非 .json 后缀的文件: ${file}`);
      }
    }

    // 步骤 3: 该路径下存在dde-file-manager.json、org.deepin.kwin.json、org.deepin.dde.shell.json
    const requiredFiles = [
      'dde-file-manager.json',
      'org.deepin.kwin.json',
      'org.deepin.dde.shell.json'
    ];
    //说明：仅循环检查三个核心组件的日志是否存在
    for (const requiredFile of requiredFiles) {
      const checkFileCmd = `ls /usr/share/deepin-log-viewer/deepin-log.conf.d/${requiredFile}`;
      const fileResult = await system.exec(checkFileCmd);
      console.log('dirResult',fileResult.stdout);
      assertTrue(fileResult.stdout);
      if (!fileResult.stdout) {
        throw new Error(`/usr/share/deepin-log-viewer/deepin-log.conf.d/ 路径下缺少必需的文件: ${requiredFile}`);
      }
    }

    // 步骤 4: 查看dde-file-manager.json文件，检查文件内容
    const ddeFileManagerContentCmd = "cat /usr/share/deepin-log-viewer/deepin-log.conf.d/dde-file-manager.json";
    const ddeFileManagerContentResult = await system.exec(ddeFileManagerContentCmd);
    const ddeFileManagerContent = JSON.parse(ddeFileManagerContentResult.stdout);
    const expectedDdeFileManagerContent = {
        "name": "dde-file-manager",
        "group": "",
        "submodules": [{
                        "name": "dde-file-manager",
                        "filter": "",
                        "exec": "/usr/libexec/dde-file-manager",
                        "logType": "journal",
                        "logPath": ""
                },
                {
                        "name": "dde-select-dialog-wayland",
                        "filter": "",
                        "exec": "/usr/bin/dde-select-dialog-wayland",
                        "logType": "journal",
                        "logPath": ""
                },
                {
                        "name": "dde-select-dialog-x11",
                        "filter": "",
                        "exec": "/usr/bin/dde-select-dialog-x11",
                        "logType": "journal",
                        "logPath": ""
                },
                {
                        "name": "dde-file-dialog",
                        "filter": "",
                        "exec": "/usr/bin/dde-file-dialog",
                        "logType": "journal",
                        "logPath": ""
                },
                {
                        "name": "dde-file-manager-daemon",
                        "filter": "",
                        "exec": "/usr/bin/dde-file-manager-daemon",
                        "logType": "journal",
                        "logPath": ""
                }
        ],
        "visible": true,
        "version": "V2.0"
    };
    // 比较对象内容
    assertTrue(JSON.stringify(ddeFileManagerContent) === JSON.stringify(expectedDdeFileManagerContent));

    // 步骤 5: 查看文件org.deepin.kwin.json，检查文件内容
    const kwinContentCmd = "cat /usr/share/deepin-log-viewer/deepin-log.conf.d/org.deepin.kwin.json";
    const kwinContentResult = await system.exec(kwinContentCmd);
    const kwinContent = JSON.parse(kwinContentResult.stdout);
    const expectedKwinContent = {
        "name": "窗管",
        "submodules": [
            {
                "name": "kwin_x11",
                "filter": "",
                "exec": "/usr/bin/kwin_x11",
                "logType": "journal"
            }, {
                "name": "kwin_wayland",
                "filter": "",
                "exec": "/usr/bin/kwin_wayland",
                "logType": "journal"
            }
        ],
        "visible": 1,
        "version": "V1.0"
    };
    assertTrue(JSON.stringify(kwinContent) === JSON.stringify(expectedKwinContent));

    // 步骤 6: 查看文件org.deepin.dde.shell.json，检查文件内容
    const ddeShellContentCmd = "cat /usr/share/deepin-log-viewer/deepin-log.conf.d/org.deepin.dde.shell.json";
    const ddeShellContentResult = await system.exec(ddeShellContentCmd);
    const ddeShellContent = JSON.parse(ddeShellContentResult.stdout);
    const expectedDdeShellContent = {
        "name": "dde-shell",
        "group": "dde",
        "submodules": [
            {
                "name": "shell.dde-apps.amappitemmodel",
                "filter": "org.deepin.dde.shell.dde-apps.amappitemmodel",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dde-apps.appgroup",
                "filter": "org.deepin.dde.shell.dde-apps.appgroup",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell",
                "filter": "org.deepin.dde.shell",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.layershell.window",
                "filter": "org.deepin.dde.shell.layershell.window",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.layershell.surface",
                "filter": "org.deepin.dde.shell.layershell.surface",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.layershell",
                "filter": "org.deepin.dde.shell.layershell",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.drag",
                "filter": "org.deepin.dde.shell.drag",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock",
                "filter": "org.deepin.dde.shell.dock",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.docksettings",
                "filter": "org.deepin.dde.shell.dock.docksettings",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.x11",
                "filter": "org.deepin.dde.shell.dock.x11",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.showdesktop",
                "filter": "org.deepin.dde.shell.dock.showdesktop",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.abstractdesktopfile",
                "filter": "org.deepin.dde.shell.dock.abstractdesktopfile",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.amdesktopfile",
                "filter": "org.deepin.dde.shell.dock.amdesktopfile",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.taskmanager.dockglobalelementmodel",
                "filter": "org.deepin.dde.shell.dock.taskmanager.dockglobalelementmodel",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.taskmanager",
                "filter": "org.deepin.dde.shell.dock.taskmanager",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.taskmanager.treelandwindow",
                "filter": "org.deepin.dde.shell.dock.taskmanager.treelandwindow",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.taskmanager.x11WindowPreview",
                "filter": "org.deepin.dde.shell.dock.taskmanager.x11WindowPreview",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.taskmanager.x11utils",
                "filter": "org.deepin.dde.shell.dock.taskmanager.x11utils",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.taskmanager.x11window",
                "filter": "org.deepin.dde.shell.dock.taskmanager.x11window",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.dock.taskmanager.x11windowmonitor",
                "filter": "org.deepin.dde.shell.dock.taskmanager.x11windowmonitor",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.notification",
                "filter": "org.deepin.dde.shell.notification",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.osd",
                "filter": "org.deepin.dde.shell.osd",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.osd.kblayout",
                "filter": "org.deepin.dde.shell.osd.kblayout",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            },
            {
                "name": "shell.loader",
                "filter": "org.deepin.dde.shell.loader",
                "exec": "/usr/bin/dde-shell",
                "logType": "journal"
            }
        ],
        "visible": 1,
        "version": "V1.0"
    };
    assertTrue(JSON.stringify(ddeShellContent) === JSON.stringify(expectedDdeShellContent));

  }, { timeout: 120000, tags: ['1654945', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });

});
