from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1916767_1(self):
        """启动器打开看图"""
        euler = DdeMethod()
        euler.open_software_by_launcher("kantu")
        sleep(5)
        self.assert_process_status(True, "deepin-image-viewer")

    def test_dde_1916767_2(self):
        """终端打开看图"""
        Cmd.run_cmd("deepin-image-viewer &")
        sleep(5)
        self.assert_process_status(True, "deepin-image-viewer")

    def test_dde_1916767_3(self):
        """桌面打开看图"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("kantu")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("看图")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("kantu.png")
        sleep(5)
        self.assert_process_status(True, "deepin-image-viewer")
        DdeMethod().kill_process("deepin-image-viewer")
        sleep(3)
        euler.dde_dock.right_click_by_img("kantu.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "deepin-image-viewer")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-image-viewer")
        yield
        DdeMethod().kill_process("deepin-image-viewer")
        DdeMethod().click_restore()
        DdeMethod().esc()
