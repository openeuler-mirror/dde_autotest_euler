import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import CmdCtl as Cmd
from src import Src
from src import sleep


class TestDeepinTerminalCase(BaseCase):


    @pytest.fixture(scope="class", autouse=True)
    def setup_1271263(self):
        """前置和后置"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("terminal")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("终端")
        sleep(1)
        euler.click(*euler.ocr("发送到桌面"))
        Src.esc()
        sleep(3)

        yield
        Cmd.run_cmd("rm -rf /home/uos/Desktop/deepin-terminal.desktop")

    @pytest.fixture(scope="function", autouse=True)
    def clean_1271263(self):
        """清除环境"""
        yield
        Src.kill_process("deepin-terminal")

    def test_dde_1271263_1(self):
        """终端——启动"""
        # 1. 在启动器中选中终端，点击右键－发送到桌面，查看软件显示
        # 1. 终端图标会出现在桌面显示
        euler = DdeMethod()
        self.assert_image_exist_in_dde("desktop_terminal.png")
        # 2. 在桌面上，用鼠标双击终端图标，查看软件显示
        # 2. 终端正常启动
        euler.dde_desktop.double_click_terminal_by_img()
        sleep(3)
        self.assert_true(Src.get_process_status("deepin-terminal"))

    def test_dde_1271263_2(self):
        """终端——启动"""
        # 3. 在桌面上选中终端图标，点击右键－打开，查看软件显示
        # 3. 终端正常启动
        euler = DdeMethod()
        euler.dde_desktop.right_click_terminal_by_img()
        sleep(1)
        Src.down()
        Src.enter()
        sleep(3)
        self.assert_true(Src.get_process_status("deepin-terminal"))

    def test_dde_1271263_3(self):
        """终端——启动"""
        # 4. 按快捷键Ctrl+Alt+T，查看系统显示
        # 4. 终端正常启动
        Src.ctrl_alt_t()
        sleep(3)
        self.assert_true(Src.get_process_status("deepin-terminal"))

