from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import ElementNotFound
from src.depends.dogtail.tree import SearchError


class DdeDesktopMethod(BaseMethod):

    def __init__(self):
        super().__init__("dde-desktop")

    def click_by_attr(self, path):
        """在启动器中通过元素点击"""
        self.dog.element_click(path)

    def right_click_by_xy(self):
        """通过右键点击【在终端中打开】"""
        self.right_click(960, 540)
        self.click_by_ocr("在终端中打开")

    def click_center_in_dialog_by_attr(self):
        """文件选择对话框，点击中心"""
        try:
            self.dog.find_element_by_attr(f"$//midwiget/dm_splitter/right_view").point()
            self.double_click()
        except ElementNotFound:
            raise ElementNotFound("right_view")

    def click_file_in_dialog_by_attr(self, file_name):
        """文件选择对话框，点击打开文管右侧文件"""
        try:
            self.dog.find_element_by_attr(f"$//right_view/file_view//{file_name}").point()
            self.click()
        except ElementNotFound:
            raise ElementNotFound(file_name)

    def double_click_file_in_dialog_by_attr(self, file_name):
        """文件选择对话框，双击打开文管右侧文件"""
        try:
            self.dog.find_element_by_attr(f"$//right_view/file_view//{file_name}").point()
            self.double_click()
        except ElementNotFound:
            raise ElementNotFound(file_name)

    def right_click_file_in_dialog_by_attr(self, file_name):
        """文件选择对话框，点击打开文管右侧文件"""
        try:
            self.dog.find_element_by_attr(f"$//right_view/file_view//{file_name}").point()
            self.right_click()
        except ElementNotFound:
            raise ElementNotFound(file_name)

    def click_icon_view_in_dialog_by_attr(self):
        """文件选择对话框，图标视图"""
        try:
            self.dog.find_element_by_attr(f"$//ContollerToolBar/action_botton_1").point()
            self.double_click()
        except ElementNotFound:
            raise ElementNotFound("图标视图按钮")

    def click_list_view_in_dialog_by_attr(self):
        """文件选择对话框，列表视图"""
        try:
            self.dog.find_element_by_attr(f"$//ContollerToolBar/action_botton_2").point()
            self.double_click()
        except ElementNotFound:
            raise ElementNotFound("列表视图按钮")

    def click_search_btn_in_dialog_by_attr(self):
        """文件选择对话框，搜索按钮"""
        try:
            self.dog.find_element_by_attr(f"$//crumb_search_frame/search_button").point()
            self.click()
        except ElementNotFound:
            raise ElementNotFound("search_button")

    def click_dir_in_left_dialog_by_attr(self, _dir):
        """文件选择对话框，点击侧边栏目录"""
        try:
            self.dog.find_element_by_attr(f"$//side_bar_view//{_dir}").point()
            self.click()
        except SearchError:
            raise ElementNotFound(_dir)

    def click_document_dir_in_left_dialog_by_attr(self):
        """文件选择对话框，文档目录"""
        self.click_dir_in_left_dialog_by_attr("文档")

    def click_desktop_dir_in_left_dialog_by_attr(self):
        """文件选择对话框，桌面目录"""
        self.click_dir_in_left_dialog_by_attr("桌面")

    def click_video_dir_in_left_dialog_by_attr(self):
        """文件选择对话框，视频目录"""
        self.click_dir_in_left_dialog_by_attr("视频")

    def click_picture_dir_in_left_dialog_by_attr(self):
        """文件选择对话框，图片目录"""
        self.click_dir_in_left_dialog_by_attr("图片")

    def click_dialog_x_btn_by_image(self):
        """回收站清空按钮弹窗，点击x"""
        self.click_by_img("trash_empty_x.png")

    def double_click_terminal_by_img(self):
        """双击终端"""
        self.double_click_by_img("desktop_terminal.png")

    def right_click_terminal_by_img(self):
        """双击终端"""
        self.right_click_by_img("desktop_terminal.png")
