from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1271153(self):
        """归档管理器"""
        euler = DdeMethod()
        euler.dde_method_open_software_by_launcher("guidang")
        sleep(2)
        self.assert_process_status(True, "deepin-compressor")

    def teardown_method(self):
        """"""
        Src.alt_f4()
