from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1892485_1(self):
        """启动器打开文件管理器"""
        euler = DdeMethod()
        euler.open_software_by_launcher("wenjianguanliqi")
        sleep(5)
        self.assert_process_status(True, "dde-file-manager")

    def test_dde_1892485_2(self):
        """桌面打开文件管理器"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("wenjianguanliqi")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("文件管理器")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("dde_file_manager_icon.png")
        sleep(5)
        self.assert_process_status(True, "dde-file-manager")
        DdeMethod().kill_process("dde-file-manage")
        sleep(3)
        euler.dde_dock.right_click_by_img("dde_file_manager_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "dde-file-manage")

    def test_dde_1892485_3(self):
        """终端打开文件管理器"""
        Cmd.run_cmd("dde-file-manager &")
        sleep(5)
        self.assert_process_status(True, "dde-file-manage")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("dde-file-manage")
        yield
        DdeMethod().kill_process("dde-file-manage")
        DdeMethod().click_restore()
        DdeMethod().esc()
