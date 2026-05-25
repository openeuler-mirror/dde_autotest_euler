from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1895987(self):
        """控制中心-声音设置"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        euler.dde_dock.click_by_ocr("声音")
        sleep(6)
        self.assert_ocr_exist('输入', '输出', '系统音效')

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
