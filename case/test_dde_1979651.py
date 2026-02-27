#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2026/2/26
@Autho  : chengweibin@uniontech.com
@File   : test_dde_1979651.py
@Desc   : 日历-关于
"""
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src, sleep
from src.cmdctl import CmdCtl


class TestDdeCase(BaseCase):


    def test_dde_1979651(self):
        """获取rpm包版本"""
        result = CmdCtl.run_cmd("rpm -qa dde-calendar --qf '%{VERSION}'")
        self.dde_calendar_version = result.strip()  # 获取完整的版本号

        """启动器打开日历-关于"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("rili")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("日历")
        Src.select_menu(1)
        sleep(2)
        self.assert_process_status(True,"dde-calendar")

        #点击右上角关于
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")


        # 验证关于窗口内容
        self.assert_ocr_exist("主题", "关于" )  # 验证应用名称
        euler.dde_dock.click_by_ocr("关于")
        self.assert_ocr_exist( "dde-calendar")
        self.assert_ocr_exist(self.dde_calendar_version)
        self.assert_process_status(True,"dde-calendar")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("dde-calendar")
        yield
        DdeMethod().kill_process("dde-calendar")
        DdeMethod().click_restore()
        DdeMethod().esc()

