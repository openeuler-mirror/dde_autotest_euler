import time

import pytest

from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src
from apps.dde_autotest_euler.case.base_case import BaseCase


class TestDdeCase(BaseCase):

    def test_dde_1271327_1(self):
        """快捷键关闭剪贴板"""
        Src.hot_key("ctrl", "alt", "v")
        time.sleep(3)
        self.assert_ocr_exist("剪贴板")
        Src.hot_key("ctrl", "alt", "v")
        time.sleep(3)
        self.assert_ocr_not_exist("剪贴板")

    def test_dde_1271327_2(self):
        """点击空白处关闭剪贴板"""
        Src.hot_key("ctrl", "alt", "v")
        time.sleep(3)
        self.assert_ocr_exist("剪贴板")
        Src.click(1000, 500)
        time.sleep(3)
        self.assert_ocr_not_exist("剪贴板")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().click_restore()
        time.sleep(1)
        yield
        DdeMethod().click_restore()
        time.sleep(2)

