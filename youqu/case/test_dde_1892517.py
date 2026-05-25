from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1892517_1(self):
        """启动器打开设备管理器"""
        euler = DdeMethod()
        euler.open_software_by_launcher("shebeiguanliqi")
        sleep(5)
        self.assert_process_status(True, "deepin-devicemanager")

    def test_dde_1892517_2(self):
        """桌面打开设备管理器"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("shebeiguanliqi")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("设备管理器")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("deepin_devicemanager_icon.png")
        sleep(5)
        self.assert_process_status(True, "deepin-devicemanager")
        DdeMethod().kill_process("deepin-devicemanager")
        sleep(3)
        euler.dde_dock.right_click_by_img("deepin_devicemanager_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "deepin-devicemanager")

    def test_dde_1892517_3(self):
        """终端打开设备管理器"""
        Cmd.run_cmd("deepin-devicemanager &")
        sleep(5)
        self.assert_process_status(True, "deepin-devicemanager")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-devicemanager")
        yield
        DdeMethod().kill_process("deepin-devicemanager")
        DdeMethod().click_restore()
        DdeMethod().esc()
