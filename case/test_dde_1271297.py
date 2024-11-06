from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from apps.dde_autotest_euler.method.vender.dde_control_center_method import DdeControlCenterMethod
from apps.dde_autotest_euler.method.vender.dde_dock_method import DdeDockMethod


class TestDdeCase(BaseCase):
    def test_dde_1271297(self):
        """查看系统信息—关于本机"""
        DdeDockMethod().click_control_center_btn_by_attr()
        sleep(6)
        DdeControlCenterMethod().enter_view_by_search_box("guanyubenji")
        self.assert_ocr_exist("版本", "类型", "版本授权", "内核版本", "处理器", "内存")

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().close_window()
