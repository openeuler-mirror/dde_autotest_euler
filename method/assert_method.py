#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from apps.dde_autotest_euler.config import config
from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import logger
from src.assert_common import AssertCommon


class AssertMethod(AssertCommon):
    """AssertMethod"""

    @classmethod
    def assert_image_exist_in_dde(cls, img_name, rate=0.8):
        """断言图像存在于dde界面中"""
        cls.assert_image_exist(f"{config.ASSERT_RES}/{img_name}", rate=rate)

    @classmethod
    def assert_image_not_exist_in_dde(cls, img_name, rate=0.8):
        """断言图像不存在于dde界面中"""
        cls.assert_image_not_exist(f"{config.ASSERT_RES}/{img_name}", rate=rate)

    @staticmethod
    def assert_equal(expect, actual):
        """判断预期值<{{expect}>与实际值<{{actual}>相等"""
        if expect != actual:
            raise AssertionError(f"预期值<{expect}>与实际值<{actual}>不相等")

    @staticmethod
    def assert_not_equal(expect, actual):
        """判断预期值<{{expect}>与实际值<{{actual}>不相等"""
        if expect == actual:
            raise AssertionError(f"预期值<{expect}>与实际值<{actual}>相等")

    @staticmethod
    def assert_in(target: str, pool: str):
        """判断<{{target}}>在<{{pool}}>中"""
        if target not in pool:
            raise AssertionError(f"<{target}>不在<{pool}>中")

    @staticmethod
    def assert_not_in(target: str, pool: str):
        """判断<{{target}}>不在<{{pool}}>中"""
        if target in pool:
            raise AssertionError(f"<{target}>在<{pool}>中")

    @staticmethod
    def assert_sequence_in(target: list, pool: list):
        """判断<{{target}}>在<{{pool}}>中"""
        for i in target:
            if i not in pool:
                raise AssertionError(f"{pool}中不存在{i}")

    @staticmethod
    def assert_sequence_not_in(target: list, pool: list):
        """判断<{{target}}>不在<{{pool}}>中"""
        for i in target:
            if i in pool:
                raise AssertionError(f"{pool}中存在{i}")

    @staticmethod
    def assert_true(expect):
        """断言{{expect}}结果为真"""
        if not expect:
            raise AssertionError(f"<{expect}>不为真")

    @staticmethod
    def assert_false(expect):
        """断言{{expect}}结果为假"""
        if expect:
            raise AssertionError(f"<{expect}>不为假")

    @staticmethod
    def assert_any(expect):
        """断言任一{{expect}}结果为真"""
        if not any(expect):
            raise AssertionError(f"<{expect}>均不为真")

    @staticmethod
    def assert_all(expect):
        """断言所有{{expect}}结果为真"""
        if not all(expect):
            raise AssertionError(f"<{expect}>不均为真")

    @staticmethod
    def assert_process_status(expect, app):
        """
         断言应用进程是否存在
        :param expect: 进程期望结果 True /False
        :param app: 应用名字
        """
        logger.info(f"断言应用进程状态{app}与期望{expect}是否相同")
        if expect != BaseMethod().base_method_get_process_status(app):
            raise AssertionError(f"断言应用进程状态{app}与期望{expect}不相同")
