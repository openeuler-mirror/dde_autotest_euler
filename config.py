#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

import pathlib
import os
from pylinuxauto.config import config as pylinuxauto_config
from youqu3 import setting


class _Config:
    ROOTDIR = pathlib.Path(__file__).parent
    ASSERT_RES = ROOTDIR / "case/assert_res"
    IMAGE_RES = ROOTDIR / "method/image_res"
    STATIC_RES = ROOTDIR / "method/static_res"
    BASE_PATH = os.getcwd()

    pylinuxauto_config.OCR_SERVER_IP = "10.8.13.7"
    pylinuxauto_config.IMAGE_SERVER_IP = "10.8.12.175"
    setting.REPORT_SERVER_IP = "10.8.12.47"


config = _Config()
