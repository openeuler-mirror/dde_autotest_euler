from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1932581_1(self):
        """启动器打开Print Editor"""
        euler = DdeMethod()
        euler.open_software_by_launcher("Print Editor")
        sleep(5)
        self.assert_process_status(True, "gtk4-print-editor")

    def test_dde_1932581_2(self):
        """桌面打开Print Editor"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("Print Editor")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("Print Editor")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("print-editor_icon.png")
        sleep(5)
        self.assert_process_status(True, "gtk4-print-editor")
        DdeMethod().kill_process("gtk4-print-editor")
        sleep(3)
        euler.dde_dock.right_click_by_img("print-editor_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "gtk4-print-editor")

    def test_dde_1932581_3(self):
        """终端打开Print Editor"""
        Cmd.run_cmd("gtk4-print-editor &")
        sleep(5)
        self.assert_process_status(True, "gtk4-print-editor")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("gtk4-print-editor")
        yield
        DdeMethod().kill_process("gtk4-print-editor")
        DdeMethod().click_restore()
        DdeMethod().esc()
