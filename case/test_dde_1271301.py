from case.base_case import BaseCase
from pylinuxauto import sleep
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271301(self):
        """在控制中心中添加汉语键盘布局"""
        DdeMethod().dde_method_add_hanyu_keyboard_layout_in_control_center()
        self.assert_image_exist_in_dde("test_dde_1271301.png")

    def teardown_method(self):
        """环境清理，将新增的汉语键盘布局删除"""
        sleep(2)
        DdeMethod().dde_method_delete_keyboard_layout_in_control_center()
        DdeMethod().dde_method_close_window()
