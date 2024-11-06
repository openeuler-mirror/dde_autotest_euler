from src import Src
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271091_1(self):
        """在文本编辑器中对修改内容进行保存"""
        euler = DdeMethod()
        euler.create_file_in_documents_by_cmd("test.txt")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_open_file_option_by_ocr()
        sleep(3)
        euler.deepin_editor.click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        Src.input_message("a")
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_save_option_by_ocr()
        self.assert_image_exist_in_dde("test_dde_1271091.png")

    def test_dde_1271091_2(self):
        """在文本编辑器中对修改内容进行保存"""
        euler = DdeMethod()
        euler.create_file_in_documents_by_cmd("test.txt")
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        euler.deepin_editor.click_menu_btn_by_attr()
        euler.deepin_editor.choose_open_file_option_by_ocr()
        sleep(3)
        euler.deepin_editor.click_documents_in_pop_window_by_img()
        sleep(2)
        Src.ctrl_a()
        Src.enter()
        Src.input_message("a")
        Src.ctrl_s()
        self.assert_image_exist_in_dde("test_dde_1271091.png")

    @pytest.fixture(autouse=True)
    def clear_test_file(self):
        """删除测试文件，关闭文本编辑器窗口"""
        yield
        DdeMethod().deepin_editor.close_tab_by_attr("test.txt")
        DdeMethod().deepin_editor.quit_editor_by_ocr()
        DdeMethod().delete_file_in_documents_by_cmd("test.txt")
        sleep(3)
