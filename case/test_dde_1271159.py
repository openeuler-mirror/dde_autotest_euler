from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import Src
from setting import conf


class TestDdeCase(BaseCase):
    def test_dde_1271159_1(self):
        """日志收集工具-启动日志查看-鉴权失败"""
        euler = DdeMethod()
        euler.open_software_by_launcher("rizhishoujigongju")
        sleep(6)
        euler.dde_polkit_agent.click_by_attr("EditableText_passwordinput")
        euler.input_message("1")
        sleep(3)
        euler.enter()
        sleep(2)
        self.assert_image_exist_in_dde("test_dde_1271159_1")

    def test_dde_1271159_2(self):
        """日志收集工具-启动日志查看-鉴权成功"""
        euler = DdeMethod()
        euler.open_software_by_launcher("rizhishoujigongju")
        sleep(6)
        euler.dde_polkit_agent.input_password()
        self.assert_ocr_exist("状态")

    def teardown_method(self):
        """通过命令关闭日志收集工具"""
        DdeMethod().kill_process("deepin-log-viewer")
