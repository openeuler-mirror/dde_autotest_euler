from time import sleep
from src import Src
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.base_method import BaseMethod
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271175(self):
        """系统监视器-重启系统服务"""
        euler = DdeMethod()
        euler.open_software_by_launcher("xitongjianshiqi")
        sleep(5)
        euler.deepin_system_monitor.click_system_services_btn_by_attr()
        euler.deepin_system_monitor.search_process_or_service("bluetooth")
        euler.deepin_system_monitor.right_click_first_service_in_system_services()
        Src.select_menu(2)
        sleep(3)
        Src.input_message(BaseMethod.account_message)
        sleep(3)
        Src.enter()
        self.assert_ocr_exist("已启动")

    @pytest.fixture(autouse=True)
    def clear_file_in_home_and_kill_process(self):
        """关闭进程"""
        yield
        DdeMethod().kill_process("deepin-system-monitor")
