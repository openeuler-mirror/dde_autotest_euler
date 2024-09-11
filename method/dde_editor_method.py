from time import sleep
from funnylog2.config import config as funnylog2_config
from config import config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DdeEditorMethod(BaseMethod):
    def dde_editor_method_click_by_attr(self, path):
        """在文本编辑器中通过元素点击"""
        pylinuxauto.find_element_by_attr_path(f"/deepin-editor/{path}").click()

    def dde_editor_method_right_click_by_attr(self, path):
        """在文本编辑器中通过元素右键点击"""
        pylinuxauto.find_element_by_attr_path(f"/deepin-editor/{path}").right_click()

    def dde_editor_method_click_menu_btn_by_attr(self):
        """在文本编辑器中通过元素点击右上角菜单按钮"""
        self.dde_editor_method_click_by_attr("DTitlebarDWindowOptionButton")

    def dde_editor_method_choose_open_file_option_by_ocr(self):
        """在文本编辑器的菜单栏中选择 打开文件 选项"""
        pylinuxauto.find_element_by_ocr("打开文件").click()

    def dde_editor_method_choose_save_as_option_by_ocr(self):
        """在文本编辑器的菜单栏中选择 另存为 选项"""
        pylinuxauto.find_element_by_ocr("另存为").click()

    def dde_editor_method_quit_editor_by_ocr(self):
        """通过菜单栏退出文本编辑器"""
        self.dde_editor_method_click_menu_btn_by_attr()
        sleep(2)
        pylinuxauto.find_element_by_ocr("退出").click()

    def dde_editor_method_close_tab_by_attr(self, tab_name):
        """在文本编辑器中通过元素，通过右键关闭标签（适用于修改，不适用于新建的标签）"""
        self.dde_editor_method_right_click_by_attr(tab_name)
        sleep(1)
        pylinuxauto.select_menu(1)


if __name__ == "__main__":
    sleep(3)
    DdeEditorMethod().dde_editor_method_close_tab_by_attr("*未命名文档1")
