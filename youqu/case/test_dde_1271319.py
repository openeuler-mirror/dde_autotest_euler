import pytest

from src import sleep
from src import Src
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271319_1(self):
        """任务栏-应用区域的添加&移除"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("kantu")
        sleep(2)
        euler.dde_launcher.right_click_by_attr("看图")
        Src.select_menu(3)
        sleep(2)
        self.assert_element_exist("$/dde-dock//Btn_看图")
        euler.dde_launcher.right_click_by_attr("看图")
        Src.select_menu(3)
        sleep(2)
        self.assert_element_not_exist("$/dde-dock//Btn_看图")

    def test_dde_1271319_2(self):
        """任务栏-应用区域的添加&移除"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("kantu")
        sleep(2)
        euler.dde_launcher.right_click_by_attr("看图")
        Src.select_menu(3)
        Src.press_key("win")
        sleep(2)
        self.assert_element_exist("$/dde-dock//Btn_看图")
        euler.dde_dock.right_click_by_attr("Btn_看图")
        Src.select_menu(2)
        sleep(2)
        self.assert_element_not_exist("$/dde-dock//Btn_看图")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().click_restore()
        sleep(1)
        yield
        DdeMethod().click_restore()
        sleep(2)
