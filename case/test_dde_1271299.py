from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271299(self):
        """添加系统语言"""
        DdeMethod().add_english_system_language_in_control_center()
        sleep(2)
        self.assert_ocr_exist("语言列表", "美国英语", "简体中文")

    def teardown_method(self):
        """清理环境，将新增的系统语言删除"""
        sleep(2)
        DdeMethod().delete_system_language_by_img()
        DdeMethod().dde_control_center.kill_dde_control_center()
