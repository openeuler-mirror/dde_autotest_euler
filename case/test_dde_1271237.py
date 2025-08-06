from apps.dde_autotest_euler.case.base_case import BaseCase
from src import sleep
from apps.dde_autotest_euler.method.dde_method import DdeMethod
import pytest
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1271237(self):
        """测试文本编辑器创建、保存和打开文件功能"""
        # 新建文档
        Src.run_cmd("touch ~/Desktop/test.txt")
        # 初始化DDE方法实例
        euler = DdeMethod()
        sleep(2)
        # 在桌面双击打开文档
        euler.dde_dock.double_click_by_ocr("test.txt")
        sleep(6)  # 等待编辑器启动

        # 输入文本内容
        euler.deepin_editor.input_message("HelloWorld")
        sleep(3)

        # 保存文件
        Src.hot_key("ctrl", "s")
        sleep(1)
        
        # 关闭文本编辑器
        euler.deepin_editor.quit_editor_by_ocr()
        sleep(2)
        Src.click(1, 1)  # 点击空白处以确保焦点正确
        sleep(1)

        # 重新打开文件验证内容
        euler.dde_dock.double_click_by_ocr("test.txt")
        sleep(6)  # 等待编辑器启动
        
        # 验证文件内容
        self.assert_ocr_exist("HelloWorld")

    @pytest.fixture(autouse=True)
    def clear_test_file(self):
        """清理测试环境"""
        DdeMethod().kill_process("deepin-editor")  # 确保编辑器已关闭
        yield
        # 测试后清理
        sleep(1)
        DdeMethod().kill_process("deepin-editor")
        Src.run_cmd("rm -f ~/Desktop/test.txt")  # 删除测试文件
