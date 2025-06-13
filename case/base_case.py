#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from apps.dde_autotest_euler.method.assert_method import AssertMethod
from apps.dde_autotest_euler.module.dde_dock.dde_dock_assert import DdeDockAssert
class BaseCase(AssertMethod, DdeDockAssert):
    """用例基类"""
