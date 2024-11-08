import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271153(self):
        """归档管理器"""
        euler = DdeMethod()
        euler.open_software_by_launcher("guidang")
        sleep(2)
        self.assert_process_status(True, "deepin-compressor")


    @pytest.fixture(autouse=True)
    def clear(self):
        """关闭Firefox浏览器"""
        DdeMethod().kill_process("deepin-compressor")
        yield
        DdeMethod().kill_process("deepin-compressor")
