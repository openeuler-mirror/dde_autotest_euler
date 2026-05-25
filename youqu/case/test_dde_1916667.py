from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1916667(self):
        """控制中心中网络详情的展示"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(3)
        euler.dde_dock.click_by_ocr("网络")
        sleep(1)
        self.assert_ocr_exist("网络详情")
        euler.dde_dock.click_by_ocr("网络详情")
        sleep(1)
        self.assert_ocr_exist("接口", "MAC", "IPv4", "网关", "DNS")



    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
