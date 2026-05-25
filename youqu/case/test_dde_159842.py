from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_159842(self):
        """控制中心关闭"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        self.assert_process_status(True, "control-center")
        euler.dde_dock.click_by_img("close_window_btn_1.png")
        sleep(6)
        self.assert_process_status(False, "control-center")

    def teardown_method(self):
        """关闭控制中心"""
        ...
