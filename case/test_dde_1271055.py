from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271055_1(self, clear_process_1):
        """启动器打开画板"""
        euler = DdeMethod()
        euler.open_software_by_launcher("huaban")
        sleep(5)
        self.assert_process_status(True, "deepin-draw")

    def test_dde_1271055_2(self, clear_process_2):
        """桌面打开画板"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("huaban")
        sleep(3)
        euler.dde_dock.right_click_by_ocr("画板")
        Src.select_menu(2)
        sleep(2)
        euler.deepin_draw.double_click_by_img("deepin_draw_icon.png")
        sleep(5)
        self.assert_process_status(True, "deepin-draw")
        DdeMethod().deepin_draw.kill_process_by_cmd("deepin-draw")
        sleep(3)
        euler.deepin_draw.right_click_by_img("deepin_draw_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "deepin-draw")

    def test_dde_1271055_3(self, clear_process_1):
        """终端打开画板"""
        Cmd.run_cmd("deepin-draw &")
        sleep(3)
        self.assert_process_status(True, "deepin-draw")

    @pytest.fixture
    def clear_process_1(self):
        """清理环境"""
        yield
        DdeMethod().deepin_draw.kill_process_by_cmd("deepin-draw")

    @pytest.fixture
    def clear_process_2(self):
        """清理环境"""
        yield
        DdeMethod().deepin_draw.kill_process_by_cmd("deepin-draw")
        DdeMethod().deepin_draw.click_by_img("deepin_draw_icon.png")
        Src.delete()
