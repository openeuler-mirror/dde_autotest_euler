#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/27 13:42:04
"""
from case.base_case import BaseCase
from method.dde_autotest_euler_method import DdeAutotestEulerMethod

class TestMyCase(BaseCase):

    def test_mycase_001(self):
        """this is my test case title"""
        # 用例步骤，调用方法层封装好的方法进行操作
        DdeAutotestEulerMethod().click_dde_file_manager_on_dock_by_attr()
        # 在关键节点进行断言
        self.assert_true(True)
