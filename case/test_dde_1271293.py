from case.base_case import BaseCase
from pylinuxauto import sleep
from method.dde_method import DdeMethod
from method.dde_control_center_method import DdeControlCenterMethod
from method.dde_dock_method import DdeDockMethod


class TestDdeCase(BaseCase):
    def test_dde_1271293(self):
        """查看系统信息—版本协议"""
        DdeDockMethod().dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        DdeControlCenterMethod().dde_control_center_method_click_system_info_by_attr()
        sleep(1)
        self.assert_image_exist_in_dde("logo_deepin.png")

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_method_close_window()
