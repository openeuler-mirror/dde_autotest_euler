#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from method.assert_method import AssertMethod
from method.dde_method import DdeMethod
import pylinuxauto


class BaseCase(AssertMethod):
    """用例基类"""

    def click_restore(self):
        """
        点击左上角
        """
        pylinuxauto.mousekey.click(10, 10)
