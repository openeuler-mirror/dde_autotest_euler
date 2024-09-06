from case.base_case import BaseCase
from method.dde_method import DdeMethod
from pylinuxauto import sleep
from method.dde_control_center_method import DdeControlCenterMethod


class TestDdeCase(BaseCase):
    def test_dde_1271033(self):
        """在删除账户(当前登陆)"""
        DdeMethod().dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        DdeControlCenterMethod().dde_control_center_enter_view_by_search_box("zhanghu")
        self.assert_image_exist_in_dde("test_dde_1271033_1")
        self.assert_image_exist_in_dde("test_dde_1271033_2")

    def teardown_method(self):
        """关闭控制中心窗口"""
        DdeMethod().dde_method_close_window()
