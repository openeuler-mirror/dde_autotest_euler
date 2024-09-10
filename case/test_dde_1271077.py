import pylinuxauto
from case.base_case import BaseCase
from pylinuxauto import sleep
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271077(self):
        """在文本编辑器中删除文字内容"""
        euler = DdeMethod()
        euler.base_method_create_file_in_documents_by_cmd("test.txt")
        euler.dde_method_open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.dde_editor_method_click_menu_btn_by_attr()
        euler.dde_editor_method_choose_open_file_option_by_ocr()
        sleep(3)
        euler.dde_editor_method_click_documents_in_pop_window_by_img()
        sleep(2)
        pylinuxauto.ctrl_a()
        pylinuxauto.enter()
        sleep(3)
        euler.base_method_right_click_by_ocr("is")
        self.assert_ocr_not_exist("删除")
        euler.base_method_double_click_by_img("test_txt_details.png")
        euler.base_method_right_click_by_ocr("is")
        sleep(1)
        euler.base_method_click_by_ocr("删除")
        self.assert_image_not_exist_in_dde("test_dde_1271077.png")
        sleep(2)
        pylinuxauto.ctrl_a()
        euler.base_method_right_click_by_ocr("is")
        sleep(1)
        euler.base_method_click_by_ocr("删除")
        self.assert_ocr_not_exist("is")

    def teardown_method(self):
        """关闭文本编辑器"""
        DdeMethod().dde_editor_method_close_tab_by_attr("*test.txt")
        DdeMethod().dde_editor_method_quit_editor_by_ocr()
        DdeMethod().base_method_delete_file_in_documents_by_cmd("test.txt")
