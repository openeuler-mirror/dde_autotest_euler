from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from apps.dde_autotest_euler.method.vender.dde_control_center_method import DdeControlCenterMethod
from apps.dde_autotest_euler.method.vender.dde_dock_method import DdeDockMethod


class TestDdeCase(BaseCase):
    def test_dde_1271295(self):
        """查看系统信息—版本协议"""
        DdeDockMethod().click_control_center_btn_by_attr()
        sleep(6)
        DdeControlCenterMethod().enter_view_by_search_box("banbenxieyi")
        self.assert_ocr_exist("公共授权", "版权所有", "中文翻译", "其他类型")

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
