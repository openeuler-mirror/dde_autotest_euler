from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1271001(self):
        """控制中心-网络-DSL功能测试"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        euler.add_network_dsl_by_control_center()
        sleep(3)
        self.assert_ocr_exist("连接")

    def teardown_method(self):
        """将新增的DSL删除，关闭控制中心窗口"""
        DdeMethod().delete_network_dsl_by_control_center()
        sleep(1)
        DdeMethod().dde_control_center.kill_dde_control_center()
