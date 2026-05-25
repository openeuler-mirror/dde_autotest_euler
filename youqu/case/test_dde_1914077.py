from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1914077(self):
        """控制中心-个性化-任务栏"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        euler.dde_dock.click_by_ocr("个性化")
        sleep(6)
        euler.dde_dock.click_by_ocr("任务栏")
        self.assert_ocr_exist('模式', '位置', '插件区域')

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
