from case.base_case import BaseCase
from pylinuxauto import sleep
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271089_1(self):
        """在文本编辑器中对修改内容进行保存"""
        euler = DdeMethod()
        euler.dde_method_open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        self.assert_process_status(True, "deepin-editor")
        euler.dde_editor_method_click_menu_btn_by_attr()
        euler.dde_method_click_by_ocr("退出")
        sleep(3)
        self.assert_process_status(False, "deepin-editor")
