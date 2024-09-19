import time
import pylinuxauto
from case.base_case import BaseCase
from method.dde_terminal_method import DdeTerminalMethod
from method.dde_method import DdeMethod

class TestDdeCase(BaseCase):
    def test_dde_1271331(self):
        """桌面-右键菜单-在终端中打开"""
        pylinuxauto.hot_key('win', 'd')
        time.sleep(2)
        euler = DdeTerminalMethod()
        euler.dde_terminal_method__right_click_by_xy()
        time.sleep(2)
        
        self.assert_ocr_exist("uos@")
    
    def teardown_method(self):
        """关闭窗口"""
        DdeMethod().dde_method_close_window()
        time.sleep(2)

