from case.base_case import BaseCase
from pylinuxauto import sleep
from method.dde_method import DdeMethod
from method.dde_control_center_method import DdeControlCenterMethod
from method.dde_dock_method import DdeDockMethod


class TestDdeCase(BaseCase):
    def test_dde_1271297(self):
        """查看系统信息—关于本机"""
        DdeDockMethod().dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        DdeControlCenterMethod().dde_control_center_enter_view_by_search_box("guanyubenji")
        self.assert_ocr_exist("版本", "类型", "版本授权", "内核版本", "处理器", "内存")

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_method_close_window()
