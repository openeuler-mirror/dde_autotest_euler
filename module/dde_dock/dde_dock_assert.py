#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/6/12
@Author : xianglongfei@uniontech.com
@Desc   : 任务栏断言库
"""

import os
import logging
from time import sleep
from src import Src
from src.assert_common import AssertCommon
from apps.dde_autotest_euler.module.dde_dock.dde_dock_dbus import DockDbus


class DdeDockAssert(AssertCommon):
    """任务栏断言库"""
    @staticmethod
    def assert_dock_mode(mode):
        """断言任务栏模式"""
        mode_conf = {
            "efficient": int(1),
            "fashion": int(0)
        }
        if mode_conf['efficient'] == mode:
            mode_text = "高效模式"
        elif mode_conf['fashion'] == mode:
            mode_text = "时尚模式"
        else:
            raise AssertionError(f"任务栏模式参数<{mode}>未知!")
        logging.info("断言任务栏模式是否: %s", mode_text)
        dock_mode = DockDbus.get_display_mode()
        AssertCommon.assert_true(dock_mode == mode)

    @staticmethod
    def assert_dock_location(location):
        """断言任务栏位置"""
        location_conf = {
            "up": int(0),
            "right": int(1),
            "down": int(2),
            "left": int(3)
        }
        if location_conf['up'] == location:
            location_text = "上"
        elif location_conf['right'] == location:
            location_text = "右"
        elif location_conf['down'] == location:
            location_text = "下"
        elif location_conf['left'] == location:
            location_text = "左"
        else:
            raise AssertionError(f"任务栏位置参数<{location}>未知!")
        logging.info("断言任务栏位置是否: %s", location_text)
        dock_location = DockDbus.get_position()
        AssertCommon.assert_true(dock_location == location)
