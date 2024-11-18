# -*- coding: utf-8 -*-
from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import Src, sleep, ElementNotFound
from src.depends.dogtail.tree import SearchError

class DdeFileManagerMethod(BaseMethod):

    def __init__(self):
        super().__init__(
            name="dde-file-manager",
        )

    def click_by_attr(self, path):
        """在文管中通过元素点击"""
        self.dog.element_click(path)

    def click_center_in_right_view_by_attr(self):
        """点击右侧内容区域的空白处"""
        self.click(*self.dog.element_center("DMainWindow"))

    def click_trash_dir_in_left_view_by_attr(self):
        """文管侧边栏点击，回收站目录"""
        self.click_by_attr("回收站")

    def click_document_dir_in_left_view_by_attr(self):
        """文管侧边栏点击，文档目录"""
        self.click_dir_in_left_view_by_attr("文档")

    def click_dir_in_left_view_by_attr(self, _dir):
        """点击文管的侧边栏目录"""
        try:
            self.dog.find_element_by_attr(f"$//side_bar_view//{_dir}").point()
            self.click()
        except SearchError:
            raise ElementNotFound(_dir)

    def click_file_in_right_view_by_attr(self, file_name):
        """点击打开文管右侧文件"""
        try:
            self.dog.find_element_by_attr(f"$//file_view//{file_name}").point()
            self.click()
        except ElementNotFound:
            raise ElementNotFound(file_name)

    def double_click_file_in_right_view_by_attr(self, file_name):
        """点击打开文管右侧文件"""
        try:
            self.dog.find_element_by_attr(f"$//file_view//{file_name}").point()
            self.double_click()
        except ElementNotFound:
            raise ElementNotFound(file_name)

    def right_click_file_in_right_view_by_attr(self, file_name, computer=False):
        """
        右键点击文管右侧文件
        """
        try:
            self.dog.find_element_by_attr(
                f"$//file{'' if computer else '_'}view//{file_name}"
            ).point()
            self.right_click()
            sleep(0.5)
        except ElementNotFound:
            try:
                self.dog.find_element_by_attr(f"$//{file_name}").point()
                self.right_click()
            except:
                raise ElementNotFound(file_name)