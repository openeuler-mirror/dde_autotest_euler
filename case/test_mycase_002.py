#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/27 13:42:04
"""
from case.base_case import BaseCase
from youqu3 import sleep
from youqu3.gui import pylinuxauto

class TestMyCase(BaseCase):

    def test_mycase_002(self, check):
        """快捷键 ctrl + alt + t 启动终端"""
        # 用例步骤，调用方法层封装好的方法进行操作
        pylinuxauto.ctrl_alt_t()
        # 在关键节点进行断言
        # 等待 2 秒，判断终端是否启动
        sleep(2)
        check.asset_true(True)
