import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):
    def test_dde_1271157(self):
        """日志收集工具-全部日志导出"""
        euler = DdeMethod()
        euler.open_software_by_launcher("rizhishoujigongju")
        sleep(6)
        euler.dde_polkit_agent.input_password()
        euler.export_all_log_by_attr()
        self.assert_image_exist_in_dde("test_dde_1271169")

    @pytest.fixture(autouse=True)
    def clear(self):
        """关闭Firefox浏览器"""
        DdeMethod().kill_process("deepin-log-viewer")
        yield
        DdeMethod().kill_process("deepin-log-viewer")
