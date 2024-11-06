from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import sleep


class DeepinEditorMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-editor")

    def click_by_attr(self, path):
        """在文本编辑器中通过元素点击"""
        self.dog.element_click(path)

    def right_click_by_attr(self, path):
        """在文本编辑器中通过元素右键点击"""
        self.dog.element_click(path, button=3)

    def click_menu_btn_by_attr(self):
        """在文本编辑器中通过元素点击右上角菜单按钮"""
        self.click_by_attr("DTitlebarDWindowOptionButton")

    def choose_open_file_option_by_ocr(self):
        """在文本编辑器的菜单栏中选择 打开文件 选项"""
        self.ocrx("打开文件").click()

    def choose_save_as_option_by_ocr(self):
        """在文本编辑器的的菜单栏中选择 另存为 选项"""
        self.ocrx("另存为").click()

    def choose_save_option_by_ocr(self):
        """在文本编辑器的的菜单栏中选择 保存 选项"""
        self.ocrx("保存").click()

    def quit_editor_by_ocr(self):
        """通过菜单栏退出文本编辑器"""
        self.click_menu_btn_by_attr()
        sleep(2)
        self.ocrx("退出").click()

    def close_tab_by_attr(self, tab_name):
        """在文本编辑器中通过元素，通过右键关闭标签（适用于修改，不适用于新建的标签）"""
        self.right_click_by_attr(tab_name)
        sleep(1)
        self.select_menu(1)

    def close_tab_by_img(self):
        """在文本编辑器中通过标签右边的关闭图表关闭当前标签"""
        self.click_by_img("deepin_editor_close_tab_icon.png")
        sleep(1)
