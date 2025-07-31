from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1914075(self):
        """控制中心-默认程序"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        euler.dde_dock.click_by_ocr("默认程序")
        sleep(6)
        euler.dde_dock.click_by_ocr("文本")
        self.assert_ocr_exist('文本编辑器')

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
