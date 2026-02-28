#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2026/2/28
@Autho  : chengweibin@uniontech.com
@File   : test_dde_1979933.py
@Desc   : 文本编辑器-设置
"""
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src, sleep
from src.cmdctl import CmdCtl


class TestDdeCase(BaseCase):

    def test_dde_1979933(self):
        """启动器打开文本编辑器-设置"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("wenbenbianjiqi")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        Src.select_menu(1)
        sleep(2)
        self.assert_process_status(True, "deepin-editor")

        # 点击右上角关于
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")

        # 验证关于窗口内容
        self.assert_ocr_exist("新窗口", "新标签页", "设置")  # 验证应用名称
        euler.dde_dock.click_by_ocr("设置")
        sleep(2)
        self.assert_ocr_exist("基础设置", "快捷键", "高级设置")
        self.assert_process_status(True, "deepin-editor")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-editor")
        yield
        DdeMethod().kill_process("deepin-editor")
        DdeMethod().click_restore()
        DdeMethod().esc()
