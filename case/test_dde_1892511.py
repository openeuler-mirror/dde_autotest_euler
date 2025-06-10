from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1892511_1(self):
        """启动器打开字体管理器"""
        euler = DdeMethod()
        euler.open_software_by_launcher("zitiguanliqi")
        sleep(5)
        self.assert_process_status(True, "deepin-font-manager")

    def test_dde_1892511_2(self):
        """终端打开字体管理器"""
        Cmd.run_cmd("deepin-font-manager &")
        sleep(5)
        self.assert_process_status(True, "deepin-font-manager")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-font-manager")
        yield
        DdeMethod().kill_process("deepin-font-manager")
        DdeMethod().click_restore()
        DdeMethod().esc()
