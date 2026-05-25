#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2026/2/26
@Autho  : chengweibin@uniontech.com
@File   : test_dde_1979649.py
@Desc   : 画板-关于
"""
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src, sleep
from src.cmdctl import CmdCtl


class TestDdeCase(BaseCase):


    def test_dde_1979649(self):
        """获取终端rpm包版本"""
        result = CmdCtl.run_cmd("rpm -qa deepin-draw --qf '%{VERSION}'")
        self.system_devicemanager_version = result.strip()  # 获取完整的版本号

        """启动器打开画板-关于"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("huaban")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("画板")
        Src.select_menu(1)
        sleep(2)
        self.assert_process_status(True,"deepin-draw")

        #点击右上角关于
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")


        # 验证关于窗口内容
        self.assert_ocr_exist("主题", "关于" )  # 验证应用名称
        euler.dde_dock.click_by_ocr("关于")
        self.assert_ocr_exist( "画板是一款轻量级的绘图工具")
        self.assert_process_status(True,"deepin-draw")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-draw")
        yield
        DdeMethod().kill_process("deepin-draw")
        DdeMethod().click_restore()
        DdeMethod().esc()

