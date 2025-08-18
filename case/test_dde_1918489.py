#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1918489(self):
        """启动器-右键打开应用"""
        euler = DdeMethod()
        
        # 1. 打开启动器
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)

        euler.dde_launcher.right_click_by_attr("计算器")
        
        # 显示应用右键菜单
        self.assert_ocr_exist("打开", "发送到桌面", "发送到任务栏",
                              "开机自动启动")

        euler.dde_dock.click_by_ocr("打开")
        sleep(3)
        
        self.assert_process_status(True, "gnome-calculator")
        self.assert_ocr_exist("基本", "撤消")

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        yield
        DdeMethod().kill_process("gnome-calculator")
        DdeMethod().click_restore()
        sleep(2)
