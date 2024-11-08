from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271055_1(self):
        """启动器打开画板"""
        euler = DdeMethod()
        euler.open_software_by_launcher("huaban")
        sleep(5)
        self.assert_process_status(True, "deepin-draw")

    def test_dde_1271055_2(self):
        """桌面打开画板"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("huaban")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("画板")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("deepin_draw_icon.png")
        sleep(5)
        self.assert_process_status(True, "deepin-draw")
        DdeMethod().kill_process("deepin-draw")
        sleep(3)
        euler.dde_dock.right_click_by_img("deepin_draw_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "deepin-draw")

    def test_dde_1271055_3(self):
        """终端打开画板"""
        Cmd.run_cmd("deepin-draw &")
        sleep(5)
        self.assert_process_status(True, "deepin-draw")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-draw")
        yield
        DdeMethod().kill_process("deepin-draw")
        DdeMethod().click_restore()
        DdeMethod().esc()
