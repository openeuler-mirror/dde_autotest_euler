#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271311(self):
        """从启动器中打开火狐浏览器"""
        euler = DdeMethod()
        euler.open_software_by_launcher("Firefox")
        # 等待 10 秒，判断browser是否启动
        sleep(10)
        self.assert_process_status(True, "firefox")

    def teardown_method(self):
        """环境清理，关闭火狐浏览器"""
        DdeMethod().kill_process("firefox")
