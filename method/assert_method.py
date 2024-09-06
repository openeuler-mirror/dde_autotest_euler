#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from pylinuxauto.assertx import Assert
from config import config


class AssertMethod(Assert):
    """AssertMethod"""

    @classmethod
    def assert_image_exist_in_dde(cls, img_name, rate=0.8):
        """断言图像存在于dde界面中"""
        cls.assert_image_exist(f"{config.ASSERT_RES}/{img_name}", rate=rate)

    @classmethod
    def assert_image_not_exist_in_dde(cls, img_name, rate=0.8):
        """断言图像不存在于dde界面中"""
        cls.assert_image_not_exist(f"{config.ASSERT_RES}/{img_name}", rate=rate)
