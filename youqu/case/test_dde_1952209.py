#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/11/10
@Autho  : chengweibin@uniontech.com
@File   : test_dde_1952209.py
@Desc   : 系统监视器-关于
"""
import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src, sleep
from src.cmdctl import CmdCtl


class TestDdeCase(BaseCase):


    def test_dde_1952209_1(self):
        """获取终端rpm包版本"""
        result = CmdCtl.run_cmd("rpm -qa deepin-system-monitor --qf '%{VERSION}'")
        self.system_monitor_version = result.strip()  # 获取完整的版本号

    def test_dde_1952209_2(self):
        """启动器打开系统监视器-关于"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("xitongjianshiqi")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("系统监视器")
        Src.select_menu(1)
        sleep(1)
        self.assert_process_status(True,"deepin-system-monitor")

        #点击右上角关于
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")


        # 验证关于窗口内容
        self.assert_ocr_exist("强制结束应用程序","视图", "主题", "关于" )  # 验证应用名称
        euler.dde_dock.click_by_ocr("关于")
        self.assert_ocr_exist( "主页")
        self.assert_process_status(True,"deepin-system-monitor")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-system-monitor")
        yield
        DdeMethod().kill_process("deepin-system-monitor")
        DdeMethod().click_restore()
        DdeMethod().esc()
