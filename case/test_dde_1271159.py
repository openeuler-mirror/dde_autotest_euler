from pylinuxauto import sleep
from case.base_case import BaseCase
from method.dde_method import DdeMethod
import pylinuxauto


class TestDdeCase(BaseCase):
    def test_dde_1271159_1(self):
        """日志收集工具-启动日志查看-鉴权失败"""
        euler = DdeMethod()
        euler.dde_method_open_software_by_launcher("rizhishoujigongju")
        sleep(6)
        pylinuxauto.find_element_by_attr_path(
            "/dde-polkit-agent/EditableText_passwordinput"
        ).click()
        pylinuxauto.input_message("1")
        pylinuxauto.enter()
        sleep(2)
        self.assert_image_exist_in_dde("test_dde_1271159_1")

    def test_dde_1271159_2(self):
        """日志收集工具-启动日志查看-鉴权成功"""
        euler = DdeMethod()
        euler.dde_method_open_software_by_launcher("rizhishoujigongju")
        sleep(6)
        euler.deepin_log_viewer_input_root_password()
        self.assert_ocr_exist("状态")

    def teardown_method(self):
        """通过命令关闭日志收集工具"""
        DdeMethod().base_method_kill_process_by_cmd("deepin-log-viewer")
