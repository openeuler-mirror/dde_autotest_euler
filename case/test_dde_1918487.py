#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1918487_1(self):
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

    def test_dde_1918487_2(self):
        """启动器-右键发送到桌面，发送到任务栏，开机自动启动"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        # 发送到桌面
        euler.dde_launcher.right_click_by_attr("计算器")
        euler.dde_dock.click_by_ocr("发送到桌面")
        sleep(2)
        # 发送到任务栏
        euler.dde_launcher.right_click_by_attr("计算器")
        euler.dde_dock.click_by_ocr("发送到任务栏")
        # 设置开机自动启动
        euler.dde_launcher.right_click_by_attr("计算器")
        euler.dde_dock.click_by_ocr("开机自动启动")

        # 断言右键菜单内容
        euler.dde_launcher.right_click_by_attr("计算器")
        self.assert_ocr_exist("打开", "从桌面上移除", "从任务栏上移除",
                               "取消开机自动启动")

        # 断言桌面显示计算器
        DdeMethod().click_restore()
        sleep(2)
        self.assert_ocr_exist("计算器")

        # 恢复
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        # 从桌面移除
        euler.dde_launcher.right_click_by_attr("计算器")
        euler.dde_dock.click_by_ocr("从桌面上移除")
        sleep(2)
        # 从任务栏移除
        euler.dde_launcher.right_click_by_attr("计算器")
        sleep(2)
        euler.dde_dock.click_by_ocr("从任务栏上移除")
        sleep(2)
        # 取消开机自动启动
        euler.dde_launcher.right_click_by_attr("计算器")
        sleep(2)
        euler.dde_dock.click_by_ocr("取消开机自动启动")
        sleep(2)

        # 断言右键菜单恢复
        euler.dde_launcher.right_click_by_attr("计算器")
        sleep(2)
        self.assert_ocr_exist("打开", "发送到桌面", "发送到任务栏",
                              "开机自动启动")

    def test_dde_1918487_3(self):
        """启动器-所有分类-右键打开应用"""
        euler = DdeMethod()

        # 1. 打开启动器
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        # 打开所有分类-办公学习 子菜单
        euler.dde_dock.click_by_img("launcher_all_category_btn.png")
        sleep(2)
        euler.dde_launcher.click_by_ocr("办公学习")
        sleep(2)
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        sleep(2)

        # 显示应用右键菜单
        self.assert_ocr_exist("打开", "发送到桌面", "发送到任务栏",
                              "开机自动启动")

        euler.dde_dock.click_by_ocr("打开")
        sleep(3)

        self.assert_process_status(True, "deepin-editor")
        self.assert_ocr_exist("文本编辑器")

    def test_dde_1918487_4(self):
        """启动器-所有分类-右键发送到桌面，发送到任务栏，开机自动启动"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        # 打开所有分类-办公学习 子菜单
        euler.dde_dock.click_by_img("launcher_all_category_btn.png")
        sleep(2)
        euler.dde_launcher.click_by_ocr("办公学习")
        sleep(2)
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        sleep(2)
        # 发送到桌面
        euler.dde_dock.click_by_ocr("发送到桌面")
        sleep(2)
        # 发送到任务栏
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        sleep(2)
        euler.dde_dock.click_by_ocr("发送到任务栏")
        sleep(2)
        # 设置开机自动启动
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        sleep(2)
        euler.dde_dock.click_by_ocr("开机自动启动")
        sleep(2)

        # 断言右键菜单内容
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        sleep(2)
        self.assert_ocr_exist("打开", "从桌面上移除", "从任务栏上移除",
                               "取消开机自动启动")

        # 断言桌面显示文本编辑器
        DdeMethod().click_restore()
        sleep(2)
        self.assert_ocr_exist("文本编辑器")

        # 恢复
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        euler.dde_dock.click_by_img("launcher_all_category_btn.png")
        sleep(2)
        euler.dde_launcher.click_by_ocr("办公学习")
        sleep(2)
        # 从桌面移除
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        sleep(2)
        euler.dde_dock.click_by_ocr("从桌面上移除")
        sleep(2)
        # 从任务栏移除
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        euler.dde_dock.click_by_ocr("从任务栏上移除")
        # 取消开机自动启动
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        euler.dde_dock.click_by_ocr("取消开机自动启动")

        # 断言右键菜单恢复
        euler.dde_launcher.right_click_by_attr("文本编辑器")
        self.assert_ocr_exist("打开", "发送到桌面", "发送到任务栏",
                              "开机自动启动")

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        yield
        DdeMethod().kill_process("gnome-calculator")
        DdeMethod().kill_process("deepin-editor")
        DdeMethod().click_restore()
        sleep(2)
