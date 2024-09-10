import pylinuxauto
from case.base_case import BaseCase
from pylinuxauto import sleep
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271089_1(self):
        """退出文本编辑器"""
        euler = DdeMethod()
        euler.dde_method_open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        self.assert_process_status(True, "deepin-editor")
        euler.dde_editor_method_quit_editor_by_ocr()
        sleep(3)
        self.assert_process_status(False, "deepin-editor")

    def test_dde_1271089_2(self):
        """退出文本编辑器"""
        euler = DdeMethod()
        euler.dde_method_open_software_by_launcher("wenbenbianjiqi")
        sleep(6)
        self.assert_process_status(True, "deepin-editor")
        pylinuxauto.alt_f4()
        sleep(3)
        self.assert_process_status(False, "deepin-editor")
