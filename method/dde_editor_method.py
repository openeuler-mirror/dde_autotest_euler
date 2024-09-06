from time import sleep
from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DdeEditorMethod(BaseMethod):
    def dde_editor_method_click_by_attr(self, path):
        """在文本编辑器中通过元素点击"""
        pylinuxauto.find_element_by_attr_path(f"/deepin-editor/{path}").click()

    def dde_editor_method_click_menu_btn_by_attr(self):
        """在文本编辑器中通过元素点击右上角菜单按钮"""
        self.dde_editor_method_click_by_attr("DTitlebarDWindowOptionButton")

    def dde_editor_method_choose_open_file_option_by_attr(self):
        """在文本编辑器的菜单栏中选择 打开文件 选项"""
        pylinuxauto.find_element_by_ocr("打开文件").click()


if __name__ == "__main__":
    sleep(3)
    DdeEditorMethod().dde_editor_method_click_menu_btn_by_attr()
