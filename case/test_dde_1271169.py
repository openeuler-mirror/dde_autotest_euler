from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271169(self):
        """日志收集工具-单模块日志导出"""
        euler = DdeMethod()
        euler.open_software_by_launcher("rizhishoujigongju")
        sleep(6)
        euler.export_log_by_attr("Boot-Shutdown Event", "Html (*.html)")
        self.assert_image_exist_in_dde("test_dde_1271169")

    def teardown_method(self):
        """通过命令关闭日志收集工具"""
        DdeMethod().dde_dock.kill_process_by_cmd("deepin-log-viewer")
        DdeMethod().dde_dock.delete_all_file_in_documents_by_cmd()
