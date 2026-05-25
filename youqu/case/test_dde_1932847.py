from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1932847_1(self):
        """启动器打开 Icon Browser"""
        euler = DdeMethod()
        euler.open_software_by_launcher("Icon Browser")
        sleep(5)
        self.assert_process_status(True, "gtk4-icon-browser")

    def test_dde_1932847_2(self):
        """桌面打开 Icon Browser"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("Icon Browser")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("Icon Browser")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("icon-browser_icon.png")
        sleep(5)
        self.assert_process_status(True, "gtk4-icon-browser")
        DdeMethod().kill_process("gtk4-icon-browser")
        sleep(3)
        euler.dde_dock.right_click_by_img("icon-browser_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "gtk4-icon-browser")

    def test_dde_1932847_3(self):
        """终端打开 Icon Browser"""
        Cmd.run_cmd("gtk4-icon-browser &")
        sleep(5)
        self.assert_process_status(True, "gtk4-icon-browser")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("gtk4-icon-browser")
        yield
        DdeMethod().kill_process("gtk4-icon-browser")
        DdeMethod().click_restore()
        DdeMethod().esc()
