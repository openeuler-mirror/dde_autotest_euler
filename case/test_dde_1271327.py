import time
import pylinuxauto
from case.base_case import BaseCase


class TestDdeCase(BaseCase):
    def test_dde_1271327_1(self):
        """快捷键关闭剪贴板"""
        pylinuxauto.hot_key('ctrl', 'alt', 'v')
        time.sleep(2)
        self.assert_ocr_exist("剪贴板")
        pylinuxauto.hot_key('ctrl', 'alt', 'v')
        time.sleep(2)
        self.assert_ocr_not_exist("剪贴板")
    
    def test_dde_1271327_2(self):
        """点击空白处关闭剪贴板"""
        pylinuxauto.hot_key('ctrl', 'alt', 'v')
        time.sleep(2)
        self.assert_ocr_exist("剪贴板")
        pylinuxauto.click(1000, 500)
        time.sleep(2)
        self.assert_ocr_not_exist("剪贴板")
