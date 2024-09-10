import pylinuxauto
import pytest
from case.base_case import BaseCase
from pylinuxauto import sleep
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271091_1(self):
        """在文本编辑器中对修改内容进行保存"""
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
        pylinuxauto.input_message("a")
        euler.dde_editor_method_click_menu_btn_by_attr()
        euler.base_method_click_by_ocr("保存")
        self.assert_image_exist_in_dde("test_dde_1271091.png")

    def test_dde_1271091_2(self):
        """在文本编辑器中对修改内容进行保存"""
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
        pylinuxauto.input_message("a")
        pylinuxauto.ctrl_s()
        self.assert_image_exist_in_dde("test_dde_1271091.png")

    @pytest.fixture(autouse=True)
    def clear_test_file(self):
        """删除测试文件，关闭文本编辑器窗口"""
        yield
        DdeMethod().dde_editor_method_close_tab_by_attr("test.txt")
        DdeMethod().dde_editor_method_quit_editor_by_ocr()
        DdeMethod().base_method_delete_file_in_documents_by_cmd("test.txt")
        sleep(3)
