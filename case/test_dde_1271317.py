from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271317_1(self):
        """检查启动器的 全部分类 模块"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        euler.dde_launcher.click_all_categories_or_back_by_attr()
        sleep(1)
        self.assert_ocr_exist("音乐欣赏")

        sleep(1)
        euler.dde_launcher.click_all_categories_or_back_by_attr()
        sleep(1)
        self.assert_ocr_exist("搜索")

    def test_dde_1271317_2(self):
        """检查启动器 全部分类 视图中 系统管理 分类内容"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        euler.dde_launcher.click_all_categories_or_back_by_attr()
        sleep(3)
        euler.dde_launcher.click_system_manager_in_all_categories_view()
        sleep(3)
        self.assert_ocr_exist("系统监视器")

    def teardown_method(self):
        """通过命令关闭启动器"""
        DdeMethod().dde_dock.kill_process_by_cmd("dde-launcher")
        sleep(3)
