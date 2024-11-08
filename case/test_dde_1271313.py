#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1271313_1(self):
        """在任务栏中点击启动器"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()

        # 等待 1 秒，判断launcher是否启动
        sleep(1)
        self.assert_ocr_exist("搜索")
        sleep(1)

    def test_dde_1271313_2(self):
        """通过按键win打开启动器"""
        sleep(2)
        Src.win_left()

        # 等待 1 秒，判断launcher是否启动
        sleep(1)
        self.assert_ocr_exist("搜索")
        sleep(1)

    def teardown_method(self):
        """通过命令关闭启动器"""
        DdeMethod().kill_process("dde-launcher")
        sleep(3)
