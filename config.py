#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

import pathlib
import os


class _Config:
    ROOTDIR = pathlib.Path(__file__).parent
    ASSERT_RES = ROOTDIR / "case/assert_res"
    IMAGE_RES = ROOTDIR / "method/image_res"
    STATIC_RES = ROOTDIR / "method/static_res"
    BASE_PATH = os.getcwd()


config = _Config()
