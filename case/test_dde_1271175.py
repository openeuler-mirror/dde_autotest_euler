from time import sleep
import pylinuxauto
import pytest
from case.base_case import BaseCase
from method.base_method import BaseMethod
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271175(self, clear_file_in_home_and_kill_process):
        """系统监视器-重启系统服务"""
        euler = DdeMethod()
        euler.dde_method_open_software_by_launcher("xitongjianshiqi")
        sleep(5)
        euler.deepin_system_monitor_method_click_system_services_btn_by_attr()
        euler.deepin_system_monitor_method_search_process_or_service("bluetooth")
        euler.deepin_system_monitor_method_right_click_first_service_in_system_services()
        pylinuxauto.select_menu(2)
        sleep(3)
        pylinuxauto.input_message(BaseMethod.account_message)
        sleep(3)
        pylinuxauto.enter()
        self.assert_ocr_exist("已启动")

    @pytest.fixture
    def clear_file_in_home_and_kill_process(self):
        """关闭进程"""
        yield
        DdeMethod().base_method_kill_process_by_cmd("deepin-system-monitor")
