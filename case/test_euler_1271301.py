import pytest
from case.base_case import BaseCase
from youqu3 import sleep
from method.dde_method import DdeMethod


class TestMyCase(BaseCase):
    def test_euler_1271301(self):
        """在控制中心中添加汉语键盘布局"""
        DdeMethod().dde_method_add_hanyu_keyboard_layout_in_control_center()
        self.assert_image_exist_in_dde("keyboard_layout_hanyu.png")

    @pytest.fixture(scope="function", autouse=True)
    def tear_down(self):
        """环境清理，将新增的汉语键盘布局删除"""
        yield
        sleep(2)
        DdeMethod().dde_method_delete_keyboard_layout_by_img()
        DdeMethod().dde_method_close_window()