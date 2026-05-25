import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271199(self):
        """检查设备管理器的各模块信息显示"""
        euler = DdeMethod()
        euler.open_software_by_launcher("shebeiguanliqi")
        sleep(6)
        self.assert_ocr_exist("CPU数量")
        sleep(1)
        euler.deepin_devicemanager.click_by_attr("处理器")
        self.assert_ocr_exist("名称", "制造商", "最大频率", "架构")
        sleep(1)
        euler.deepin_devicemanager.click_by_attr("主板")
        self.assert_ocr_exist("版本")
        sleep(1)
        euler.deepin_devicemanager.click_by_attr("内存")
        self.assert_ocr_exist("总位宽", "序列号")
        sleep(1)
        euler.deepin_devicemanager.click_by_attr("显示适配器")
        self.assert_ocr_exist("中断")
        sleep(1)
        euler.deepin_devicemanager.click_by_attr("音频适配器")
        self.assert_ocr_exist("时钟频率")
        sleep(1)
        euler.deepin_devicemanager.click_by_attr("存储设备")
        self.assert_ocr_exist("固件版本")
        sleep(1)
        euler.deepin_devicemanager.click_by_attr("鼠标")
        self.assert_ocr_exist("型号")
        sleep(1)
        euler.deepin_devicemanager.click_by_attr("键盘")
        self.assert_ocr_exist("硬件类别")
        sleep(1)
        euler.deepin_devicemanager.click_by_attr("光驱")
        self.assert_ocr_exist("总线信息")

    @pytest.fixture(autouse=True)
    def clear(self):
        """通过命令关闭启动器"""
        DdeMethod().kill_process("deepin-devicemanager")
        yield
        DdeMethod().kill_process("deepin-devicemanager")
