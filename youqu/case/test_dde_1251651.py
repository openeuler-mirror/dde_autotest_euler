from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1251651(self):
        """电源右键菜单功能-电源的设置选项"""
        euler = DdeMethod()
        euler.dde_dock.right_click_by_img("launcher_power_btn.png")
        sleep(6)
        euler.dde_dock.click_by_ocr("电源设置")
        sleep(6)
        self.assert_ocr_exist("电源管理", "使用电源", "唤醒设置")

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
