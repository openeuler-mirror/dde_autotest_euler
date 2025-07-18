# -*- coding: utf-8 -*-
from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import sleep, ElementNotFound
from src.depends.dogtail.tree import SearchError
from apps.dde_autotest_euler.config import config

class DdeFileManagerMethod(BaseMethod):

    def __init__(self):
        super().__init__(
            name="dde-file-manager",
        )

    def click_by_attr(self, path):
        """在文管中通过元素点击"""
        self.dog.element_click(path)

    def click_trash_dir_in_left_view_by_attr(self):
        """文管侧边栏点击，回收站目录"""
        self.click_by_attr("回收站")

    def click_document_dir_in_left_view_by_attr(self):
        """文管侧边栏点击，文档目录"""
        self.click_dir_in_left_view_by_attr("文档")

    def click_desktop_dir_in_left_view_by_attr(self):
        """文管侧边栏点击，桌面目录"""
        self.click_dir_in_left_view_by_attr("桌面")

    def click_video_dir_in_left_view_by_attr(self):
        """文管侧边栏点击，视频目录"""
        self.click_dir_in_left_view_by_attr("视频")

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

    def click_empty_btn_in_right_view_by_attr(self):
        """点击回收站右上方的清空按钮"""
        self.dog.element_click("EmptyTrashButton")

    def click_empty_confirm_btn_by_image(self):
        """回收站清空按钮弹窗，点击确认"""
        self.click_by_img("trash_empty_confirm.png")

    def click_empty_cancle_btn_by_image(self):
        """回收站清空按钮弹窗，点击取消"""
        self.click_by_img("trash_empty_cancle.png")

    def click_empty_x_btn_by_image(self):
        """回收站清空按钮弹窗，点击x"""
        self.click_by_img("trash_empty_x.png")

    def right_click_trash_in_desktop_by_image(self):
        """桌面，右键回收站(有文件)"""
        self.right_click_by_img("desktop_trash_no_empty.png")

    def click_dialog_drop_menu_by_image(self):
        """点击文件选择对话框的下拉菜单"""
        self.click_by_img("dde_file_manager_dialog_drop_menu.png")

    def click_dialog_pop_replace_by_image(self):
        """文件选择对话框, 弹窗的替换按钮"""
        self.click_by_img("dde_file_manager_dialog_pop_replace.png")

    def cp_static_res(self, file_name, dest_path):
        """复制static_res下的文件到其他路径"""
        file_path = f"{config.STATIC_RES}/{file_name}"
        self.run_cmd(f"cp {file_path} {dest_path}")
    
    def click_window_min_by_image(self):
        """终端右上角，最小化"""
        self.click_by_img("min_window_btn.png")
