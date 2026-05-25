from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1892803_1(self):
        """启动器打开日历"""
        euler = DdeMethod()
        euler.open_software_by_launcher("rili")
        sleep(5)
        self.assert_process_status(True, "dde-calendar")

    def test_dde_1892803_2(self):
        """桌面打开日历"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("rili")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("日历")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("dde-calendar_icon.png")
        sleep(5)
        self.assert_process_status(True, "dde-calendar")
        DdeMethod().kill_process("dde-calendar")
        sleep(3)
        euler.dde_dock.right_click_by_img("dde-calendar_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "dde-calendar")

    def test_dde_1892803_3(self):
        """终端打开日历"""
        Cmd.run_cmd("dde-calendar &")
        sleep(5)
        self.assert_process_status(True, "dde-calendar")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("dde-calendar")
        yield
        DdeMethod().kill_process("dde-calendar")
        DdeMethod().click_restore()
        DdeMethod().esc()
