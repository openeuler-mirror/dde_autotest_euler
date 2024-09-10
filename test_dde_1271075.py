import pylinuxauto
from case.base_case import BaseCase
from pylinuxauto import sleep
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271075_1(self):
        """在文本编辑器中删除文字内容"""
        euler = DdeMethod()
        euler.base_method_create_file_in_documents_by_cmd("test.txt")
        euler.dde_method_open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.dde_editor_method_click_menu_btn_by_attr()
        euler.dde_editor_method_choose_save_as_option_by_ocr()
        euler.dde_editor_method_click_by_attr("保存")
        sleep(1)
        self.assert_ocr_exist("已存在")
        euler.dde_method_close_window()

    def teardown_method(self):
        """关闭文本编辑器"""
        DdeMethod().dde_editor_method_close_tab_by_attr("*test.txt")
        DdeMethod().dde_editor_method_quit_editor_by_ocr()
        DdeMethod().base_method_delete_file_in_documents_by_cmd("test.txt")
