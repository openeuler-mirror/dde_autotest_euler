#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/11/19
@Autho  : chengweibin@uniontech.com
@File   : test_dde_1955475.py
@Desc   : 文件管理器-帮助
"""
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src, sleep


class TestDdeCase(BaseCase):


    def test_dde_1955475(self):
        #启动器打开文件管理器
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("wenjianguanliqi")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("文件管理器")
        Src.select_menu(1)
        sleep(2)
        self.assert_process_status(True,"dde-file-manager")

        #点击右上角关于
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")


        # 验证菜单
        self.assert_ocr_exist("新建窗口", "连接到服务器", "设置", "帮助" )  # 验证应用名称
        euler.dde_dock.click_by_ocr("帮助")
        self.assert_ocr_exist( "帮助手册")
        self.assert_process_status(True,"dde-file-manager")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("dde-file-manager")
        yield
        DdeMethod().kill_process("dde-file-manager")
        DdeMethod().click_restore()
        DdeMethod().esc()

