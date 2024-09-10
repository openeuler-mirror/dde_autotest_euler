#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

import os
import pylinuxauto
from funnylog2 import logger
from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
from config import config
from nocmd import Cmd


class BaseMethod:
    dde_control_center_path = "/dde-control-center"
    account_message = "uostest12#$"
    change_password = "testpass12#$"

    """应用的方法基类"""

    GREP_LIST = (
        "grep",
        "pytest",
        "python",
        "asan",
        "tee",
        "ffmpeg",
        "youqu",
    )

    def base_method_click_by_ocr(self, text):
        """通过ocr识别点击"""
        pylinuxauto.find_element_by_ocr(text).click()

    def base_method_double_click_by_ocr(self, text):
        """通过ocr识别双击"""
        pylinuxauto.find_element_by_ocr(text).double_click()

    def base_method_click_by_img(self, img_name):
        """通过图像识别点击"""
        pylinuxauto.find_element_by_image(f"{config.IMAGE_RES}/{img_name}").click()

    def base_method_double_click_by_img(self, img_name):
        """通过图像识别双击"""
        pylinuxauto.find_element_by_image(f"{config.IMAGE_RES}/{img_name}").double_click()

    def base_method_right_click_by_ocr(self, text):
        """通过ocr识别右键点击"""
        pylinuxauto.find_element_by_ocr(text).right_click()

    def base_method_right_click_by_img(self, img_name):
        """通过图片识别右键点击"""
        pylinuxauto.find_element_by_image(f"{config.IMAGE_RES}/{img_name}").right_click()

    def base_method_create_file_in_documents_by_cmd(self, filename):
        """通过给定名称在 文档 目录下创建文件"""
        Cmd.run(f"touch ~/Documents/{filename}")
        Cmd.run(f"echo 'This is test message' >> ~/Documents/{filename}")

    def base_method_delete_file_in_documents_by_cmd(self, filename):
        """通过给定名称在 文档 目录下删除文件"""
        Cmd.run(f"rm ~/Documents/{filename}")

    def base_method_kill_process_by_cmd(self, process):
        """通过命令关闭进程"""
        Cmd.run(f"killall {process}")

    def base_method_get_process_status(cls, app: str, grep_list: str = None) -> bool:
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
