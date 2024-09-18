from pylinuxauto import sleep
from case.base_case import BaseCase
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271157(self):
        """日志收集工具-全部日志导出"""
        euler = DdeMethod()
        euler.dde_method_open_software_by_launcher("rizhishoujigongju")
        sleep(6)
        euler.deepin_log_viewer_input_root_password()
        euler.deepin_log_viewer_method_export_all_log_by_attr()
        self.assert_image_exist_in_dde("test_dde_1271169")

    def teardown_method(self):
        """通过命令关闭日志收集工具"""
        DdeMethod().base_method_kill_process_by_cmd("deepin-log-viewer")
        DdeMethod().base_method_delete_all_file_in_documents_by_cmd()
