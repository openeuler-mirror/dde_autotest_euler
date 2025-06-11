from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_117272(self):
        """控制中心中账户默认显示"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        Src.hot_key("winleft", "up")
        euler.dde_dock.click_by_img("control_account_btn.png")
        sleep(6)
        self.assert_ocr_exist('uos')


    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
