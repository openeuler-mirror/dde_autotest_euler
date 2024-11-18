#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

import os

from apps.dde_autotest_euler.config import config
from src import Src, logger


class BaseMethod(Src):
    """应用的方法基类"""
    dde_control_center_path = "/dde-control-center"
    account_message = "uostest12#$"
    change_password = "testpass12#$"

    GREP_LIST = (
        "grep",
        "pytest",
        "python",
        "asan",
        "tee",
        "ffmpeg",
        "youqu",
    )

    def __init__(self, name):
        super().__init__(name)

    def click_by_ocr(self, text):
        """通过ocr识别点击"""
        self.click(*self.ocr(text))

    def double_click_by_ocr(self, text):
        """通过ocr识别双击"""
        self.double_click(*self.ocr(text))

    def click_by_img(self, img_name):
        """通过图像识别点击"""
        self.click(*self.find_image(f"{config.IMAGE_RES}/{img_name}"))

    def right_click_by_img(self, img_name):
        """通过图像识别右键点击"""
        self.right_click(*self.find_image(f"{config.IMAGE_RES}/{img_name}"))

    def double_click_by_img(self, img_name):
        """通过图像识别双击"""
        self.double_click(*self.find_image(f"{config.IMAGE_RES}/{img_name}"))

    def right_click_by_ocr(self, text):
        """通过ocr识别右键点击"""
        self.right_click(*self.ocr(text))

    def right_click_by_img(self, img_name):
        """通过图片识别右键点击"""
        self.right_click(*self.find_image(f"{config.IMAGE_RES}/{img_name}"))

    def create_file_in_documents_by_cmd(self, filename):
        """通过给定名称在 文档 目录下创建文件"""
        self.run_cmd(f"touch ~/Documents/{filename}")
        self.run_cmd(f"echo 'This is test message' >> ~/Documents/{filename}")

    def delete_file_in_documents_by_cmd(self, filename):
        """通过给定名称在 文档 目录下删除文件"""
        self.run_cmd(f"rm ~/Documents/{filename}")

    def delete_all_file_in_documents_by_cmd(self):
        """通过给定名称在 文档 目录下删除所有文件"""
        self.run_cmd(f"rm ~/Documents/*")

    @classmethod
    def get_process_status(cls, app: str, grep_list: str = None) -> bool:
        """
         获取进程状态
        :param app: 应用包名
        :return: Boolean
        """
        if grep_list:
            cls.GREP_LIST = grep_list
        cmd = ""
        for i in cls.GREP_LIST:
            cmd += f"grep -v {i} | "
        cmd_txt = f"ps -aux | grep {app} | {cmd.rstrip('| ')}"
        logger.debug(cmd_txt)
        command = os.popen(cmd_txt)
        result = command.read()
        command.close()
        if result:
            logger.debug(result)
            return True
        return False
