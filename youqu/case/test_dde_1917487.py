#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1917487(self):
        # 打开控制中心
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        #打开右上角菜单栏，显示帮助、主题、关于、退出
        self.assert_process_status(True, "dde-control-center")
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")
        sleep(3)
        self.assert_ocr_exist("帮助", "主题", "关于", "退出")
        #点击帮助，打开帮助文档
        euler.dde_dock.click_by_ocr("帮助")
        sleep(3)
        self.assert_ocr_exist("帮助手册")
        #关闭帮助文档
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")
        sleep(3)
        euler.dde_dock.click_by_ocr("退出")
        sleep(3)
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")
        sleep(3)
        euler.dde_dock.click_by_ocr("关于")
        sleep(6)
        self.assert_ocr_exist("deepin")

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        yield
        DdeMethod().kill_process("dde-control-center")
        DdeMethod().click_restore()
        sleep(2)

