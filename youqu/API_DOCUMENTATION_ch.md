# dde_autotest_euler API 文档

## 概述
本文档提供了 dde_autotest_euler 框架中所有可用方法的完整列表，按文件名和类别进行组织。这些方法来源于三个主要文件以及从上级目录（`src/`, 由 [YouQu](https://youqu.uniontech.com/) 框架提供）导入的方法。

## 目录
1. [DDE 方法 (dde_method.py)](#dde-方法-dde_methodpy)
2. [断言方法 (assert_method.py)](#断言方法-assert_methodpy)
3. [基础方法 (base_method.py)](#基础方法-base_methodpy)
4. [从 src/ 导入的方法](#从-src-导入的方法)

---

## DDE 方法 (dde_method.py)

**类：** `DdeMethod`

### 属性（返回方法实例）
这些属性返回不同 DDE 组件的特定方法类实例：

| 属性 | 返回 | 描述 |
|------|------|------|
| `dde_polkit_agent` | `DdePolkitAgentMethod()` | DDE 策略工具代理方法 |
| `dde_dock` | `DdeDockMethod()` | DDE 任务栏方法 |
| `dde_control_center` | `DdeControlCenterMethod()` | DDE 控制中心方法 |
| `dde_launcher` | `DdeLauncherMethod()` | DDE 启动器方法 |
| `deepin_font_manager` | `DeepinFontManagerMethod()` | deepin字体管理器方法 |
| `browser` | `BrowserMethod()` | 浏览器方法 |
| `deepin_editor` | `DeepinEditorMethod()` | deepin编辑器方法 |
| `deepin_devicemanager` | `DeepinDeviceManagerMethod()` | deepin设备管理器方法 |
| `deepin_log_viewer` | `DeepinLogViewerMethod()` | deepin日志查看器方法 |
| `deepin_terminal` | `DeepinTerminalMethod()` | deepin终端方法 |
| `deepin_draw` | `DeepinDrawMethod()` | deepin绘图方法 |
| `deepin_system_monitor` | `DeepinSystemMonitorMethod()` | deepin系统监视器方法 |
| `dde_desktop` | `DdeDesktopMethod()` | DDE 桌面方法 |
| `dde_file_manager` | `DdeFileManagerMethod()` | DDE 文件管理器方法 |
| `deepin_screen_recorder` | `DeepinScreenRecorderMethod()` | deepin屏幕录制器方法 |

### 方法

#### 应用程序管理
| 方法 | 参数 | 描述 |
|------|------|------|
| `open_software_by_launcher(text)` | `text: str` | 通过启动器打开软件 |

#### 控制中心操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `delete_keyboard_layout_in_control_center()` | 无 | 在控制中心的键盘布局视图删除除选中之外的布局 |
| `add_hanyu_keyboard_layout_in_control_center()` | 无 | 在控制中心中添加汉语键盘布局 |
| `add_english_system_language_in_control_center()` | 无 | 在控制中心中添加英语系统语言 |
| `delete_system_language_by_img()` | 无 | 在系统语言视图中删除其他的系统语言 |
| `add_common_account_by_control_center()` | 无 | 在控制中心中添加新的账户test |
| `add_root_account_by_control_center()` | 无 | 在控制中心中添加新的管理员账户test |
| `delete_test_account_by_control_center()` | 无 | 在控制中心中将新添加的账户test删除 |
| `change_current_account_password_by_control_center()` | 无 | 在控制中心中修改当前用户密码 |
| `reset_current_account_password_from_change_password_by_control_center()` | 无 | 在控制中心中将修改的当前用户密码重置为修改前的密码 |
| `change_other_account_password_by_control()` | 无 | 在控制中心中修改非当前用户密码 |
| `reset_other_account_password_from_change_password_by_control_center()` | 无 | 在控制中心中将修改的非当前用户密码重置为修改前的密码 |
| `change_resolution_by_control_center()` | 无 | 在控制中心中修改屏幕分辨率 |
| `reset_resolution_by_control_center()` | 无 | 在控制中心中将修改的分辨率调回1920x1080 |
| `add_network_dsl_by_control_center()` | 无 | 在控制中心的网络模块中添加DSL |
| `delete_network_dsl_by_control_center()` | 无 | 在控制中心的网络DSL模块中删除添加的测试DSL连接 |
| `change_time_by_control_center()` | 无 | 在控制中心中手动修改时间 |
| `change_time_area_by_control_center()` | 无 | 在控制中心中更改时区 |
| `delete_other_time_area_by_control_center()` | 无 | 删除时区列表多余的一个时区 |

#### 字体管理器操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `search_font_in_font_manager(fontname)` | `fontname: str` | 在字体管理器中搜索字体 |

#### 文件操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `click_documents_in_pop_window_by_img()` | 无 | 在文本编辑器的文件管理器弹窗中点击左侧文档目录 |
| `rename_file_in_pop_window_by_attr(filename)` | `filename: str` | 在弹出的文件保存窗口中对文件进行重命名并且保存 |
| `rename_file_same_name_in_pop_window_by_attr(filename)` | `filename: str` | 在弹出的文件保存窗口中将文件重命名为重复名称并且点击保存 |
| `click_save_btn_in_pop_window()` | 无 | 在弹出的文件保存窗口中点击保存 |

#### 导出操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `export_file_by_attr(module)` | `module: str` | 导出设备管理器中的模块信息 |
| `export_log_by_attr(log_name, log_type)` | `log_name: str, log_type: str` | 导出日志查看器中的日志 |
| `export_all_log_by_attr()` | 无 | 导出所有的日志 |

#### 实用工具操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `click_restore()` | 无 | 点击左上角 |

---

## 断言方法 (assert_method.py)

**类：** `AssertMethod`

### 图像断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_image_exist_in_dde(img_name, rate=0.8)` | `img_name: str, rate: float` | 断言图像存在于dde界面中 |
| `assert_image_not_exist_in_dde(img_name, rate=0.8)` | `img_name: str, rate: float` | 断言图像不存在于dde界面中 |

### 值断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_equal(expect, actual)` | `expect: any, actual: any` | 判断预期值与实际值相等 |
| `assert_not_equal(expect, actual)` | `expect: any, actual: any` | 判断预期值与实际值不相等 |
| `assert_in(target, pool)` | `target: str, pool: str` | 判断目标在池中 |
| `assert_not_in(target, pool)` | `target: str, pool: str` | 判断目标不在池中 |
| `assert_sequence_in(target, pool)` | `target: list, pool: list` | 判断序列在池中 |
| `assert_sequence_not_in(target, pool)` | `target: list, pool: list` | 判断序列不在池中 |
| `assert_true(expect)` | `expect: any` | 断言结果为真 |
| `assert_false(expect)` | `expect: any` | 断言结果为假 |
| `assert_any(expect)` | `expect: any` | 断言任一结果为真 |
| `assert_all(expect)` | `expect: any` | 断言所有结果为真 |

### 进程断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_process_status(expect, app)` | `expect: bool, app: str` | 断言应用进程是否存在 |

---

## 基础方法 (base_method.py)

**类：** `BaseMethod`

### OCR 操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `click_by_ocr(text)` | `text: str` | 通过ocr识别点击 |
| `double_click_by_ocr(text)` | `text: str` | 通过ocr识别双击 |
| `right_click_by_ocr(text)` | `text: str` | 通过ocr识别右键点击 |

### 图像操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `get_x_y_by_img(img_name)` | `img_name: str` | 通过图像，获取坐标 |
| `click_by_img(img_name)` | `img_name: str` | 通过图像识别点击 |
| `right_click_by_img(img_name)` | `img_name: str` | 通过图像识别右键点击 |
| `double_click_by_img(img_name)` | `img_name: str` | 通过图像识别双击 |

### 文件操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `create_file_in_documents_by_cmd(filename)` | `filename: str` | 通过给定名称在文档目录下创建文件 |
| `delete_file_in_documents_by_cmd(filename)` | `filename: str` | 通过给定名称在文档目录下删除文件 |
| `delete_all_file_in_documents_by_cmd()` | 无 | 通过给定名称在文档目录下删除所有文件 |

### 进程操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `get_process_status(app, grep_list=None)` | `app: str, grep_list: str` | 获取进程状态 |

---

## 从 src/ 导入的方法

### AssertCommon (assert_common.py)

#### 图像断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_image_exist(widget, rate=None, multiple=False, picture_abspath=None, network_retry=None, pause=None, timeout=None, match_number=None)` | 各种参数 | 期望界面存在模板图片 |
| `assert_image_exist_during_time(widget, screen_time, rate=None, pause=None)` | 各种参数 | 在一段时间内截图多张图片进行识别 |
| `assert_image_not_exist(widget, rate=None, multiple=False, picture_abspath=None, network_retry=None, pause=None, timeout=None, match_number=None)` | 各种参数 | 期望界面不存在模板图片 |

#### 文件断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_file_exist(widget, file=None, recursive=False)` | 各种参数 | 期望存在文件路径 |
| `assert_file_not_exist(widget, file=None, recursive=False)` | 各种参数 | 期望不存在文件路径 |
| `assert_file_endwith_exist(path, endwith)` | `path: str, endwith: str` | 断言路径下是否存在以endwith结果的文件 |

#### 元素断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_element_exist(expr)` | `expr: str` | 期望元素存在 |
| `assert_element_not_exist(expr)` | `expr: str` | 期望元素不存在 |
| `assert_element_numbers(expr, number)` | `expr: str, number: int` | 查找元素的个数与期望一致 |

#### 窗口断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_window_size(expect, real)` | `expect: tuple, real: tuple` | 断言窗口大小与期望一致 |
| `assert_window_amount(app, expect)` | `app: str, expect: int` | 断言应用窗口数量 |

#### 进程断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_process_status(expect, app)` | `expect: bool, app: str` | 断言应用进程是否存在 |
| `assert_process_num(num, app)` | `num: int, app: str` | 断言应用进程的数量 |

#### 共享文件夹断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_share_folder(filename)` | `filename: str` | 断言存在共享文件夹 |
| `assert_not_share_folder(filename)` | `filename: str` | 断言不存在共享文件夹 |

#### 主题断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_theme(expect)` | `expect: str` | 断言主题 |

#### 值断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_equal(expect, actual)` | `expect: any, actual: any` | 断言相等 |
| `assert_not_equal(expect, actual)` | `expect: any, actual: any` | 断言不相等 |
| `assert_true(expect)` | `expect: any` | 断言结果为真 |
| `assert_false(expect)` | `expect: any` | 断言结果为假 |

#### 图片断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_pic_px(file, size=(0, 0))` | `file: str, size: tuple` | 断言图片尺寸 |

#### OCR 断言
| 方法 | 参数 | 描述 |
|------|------|------|
| `assert_ocr_exist(*args, picture_abspath=None, similarity=0.6, return_first=False, lang="ch", network_retry=None, pause=None, timeout=None, max_match_number=None, mode="all", bbox=None)` | 各种参数 | 断言文案存在 |
| `assert_ocr_not_exist(*args, picture_abspath=None, similarity=0.6, return_first=False, lang="ch", network_retry=None, pause=None, timeout=None, max_match_number=None, bbox=None)` | 各种参数 | 断言文案不存在 |

### ShortCut (shortcut.py)

#### 系统快捷键
| 方法 | 参数 | 描述 |
|------|------|------|
| `ctrl_f9()` | 无 | ctrl+f9快捷键设置壁纸 |
| `super_up()` | 无 | super+up最大化窗口 |
| `win_left()` | 无 | win+left向左切换工作区 |
| `win_right()` | 无 | win+right向右切换工作区 |
| `super_d()` | 无 | 快捷键super+d |
| `super_l()` | 无 | 快捷键super+l |
| `super()` | 无 | 快捷键super |

#### 控制快捷键
| 方法 | 参数 | 描述 |
|------|------|------|
| `ctrl_shift_shortcut_down()` | 无 | ctrl+shift+?唤起快捷键面板 |
| `ctrl_shift_shortcut_up()` | 无 | ctrl+shift+?收起快捷键面板 |
| `ctrl_a()` | 无 | ctrl+a |
| `ctrl_w()` | 无 | ctrl+w |
| `ctrl_l()` | 无 | ctrl+l |
| `ctrl_g()` | 无 | ctrl+g |
| `ctrl_n()` | 无 | ctrl+n |
| `ctrl_x()` | 无 | ctrl+x |
| `ctrl_s()` | 无 | ctrl+s |
| `ctrl_f()` | 无 | ctrl+f |
| `ctrl_v()` | 无 | ctrl+v |
| `ctrl_c()` | 无 | ctrl+c |
| `ctrl_z()` | 无 | ctrl+z |
| `ctrl_y()` | 无 | ctrl+y |
| `ctrl_i()` | 无 | ctrl+i |
| `ctrl_h()` | 无 | ctrl+h |
| `ctrl_o()` | 无 | ctrl+o |
| `ctrl_e()` | 无 | ctrl+e |
| `ctrl_r()` | 无 | ctrl+r |
| `ctrl_shift_s()` | 无 | ctrl+shift+s |
| `ctrl_shift()` | 无 | ctrl+shift |
| `ctrl_space()` | 无 | ctrl+space |
| `ctrl_shift_e()` | 无 | ctrl+shift+e |
| `ctrl_shift_w()` | 无 | ctrl+shift+w |
| `ctrl_shift_r()` | 无 | ctrl+shift+r |
| `ctrl_shift_z()` | 无 | ctrl+shift+z |
| `ctrl_shift_up()` | 无 | ctrl+shift+up |
| `ctrl_shift_down()` | 无 | ctrl+shift+down |
| `ctrl_shift_left()` | 无 | ctrl+shift+left |
| `ctrl_shift_right()` | 无 | ctrl+shift+right |
| `ctrl_shift_n()` | 无 | ctrl+shift+n |
| `ctrl_shift_tab()` | 无 | 快捷键ctrl+shift+tab |
| `ctrl_up()` | 无 | ctrl+up |
| `ctrl_down()` | 无 | ctrl+down |
| `ctrl_left()` | 无 | ctrl+left |
| `ctrl_right()` | 无 | ctrl+right |
| `ctrl_rod()` | 无 | ctrl+- |
| `ctrl_add()` | 无 | ctrl++ |
| `ctrl_tab()` | 无 | 快捷键ctrl+tab |
| `ctrl_scroll(direction, amount_of_scroll=1)` | `direction: str, amount_of_scroll: int` | ctrl+滚轮 |
| `shift_scroll(direction, amount_of_scroll=1)` | `direction: str, amount_of_scroll: int` | shift+滚轮 |

#### Alt 快捷键
| 方法 | 参数 | 描述 |
|------|------|------|
| `alt_tab()` | 无 | 快捷键alt+tab |
| `alt_f4()` | 无 | alt+f4 |
| `alt_f2()` | 无 | alt+f2 |
| `alt_m()` | 无 | alt+m |
| `alt_d()` | 无 | alt+d |
| `alt_enter()` | 无 | 快捷键影院进入全屏 |
| `alt_o()` | 无 | ocr应用内部快捷键 |
| `alt_s()` | 无 | 快捷键连拍截图 |
| `alt_p()` | 无 | 贴图应用内部快捷键 |
| `alt_shift_tab()` | 无 | 快捷键切换应用窗口 |
| `alt_printscreen()` | 无 | 快捷键alt+PrintScreen |
| `ctrl_alt_t()` | 无 | ctrl+alt+t |
| `ctrl_alt_down()` | 无 | ctrl+alt+down |
| `ctrl_alt_up()` | 无 | ctrl+alt+up |
| `ctrl_alt_a()` | 无 | ctrl+alt+a |
| `ctrl_alt_v()` | 无 | 快捷键打开剪切板 |
| `ctrl_alt_delete()` | 无 | 快捷键打开剪切板 |

#### 功能键
| 方法 | 参数 | 描述 |
|------|------|------|
| `f1()` | 无 | f1 |
| `f2()` | 无 | f2 |
| `f3()` | 无 | f3 |
| `f5()` | 无 | f5 |

#### 导航键
| 方法 | 参数 | 描述 |
|------|------|------|
| `tab()` | 无 | tab |
| `esc()` | 无 | esc |
| `right()` | 无 | 键盘方向键-右键 |
| `left()` | 无 | 键盘方向键-左键 |
| `up()` | 无 | 键盘方向键-上键 |
| `down()` | 无 | 键盘方向键-下键 |
| `enter()` | 无 | 回车 |
| `space()` | 无 | space |
| `backspace()` | 无 | backspace |
| `delete()` | 无 | delete |
| `pageup()` | 无 | 上一页 |
| `pagedown()` | 无 | 下一页 |

#### Shift 组合键
| 方法 | 参数 | 描述 |
|------|------|------|
| `shift()` | 无 | shift |
| `shift_right()` | 无 | shift+right |
| `shift_down()` | 无 | shift+down |
| `shift_up()` | 无 | shift+up |
| `shift_delete()` | 无 | shift+delete |
| `shift_left()` | 无 | shift+左方向键 |
| `shift_space()` | 无 | shift+space |

#### Windows 键
| 方法 | 参数 | 描述 |
|------|------|------|
| `winleft_d()` | 无 | winleft+d |
| `winleft_q()` | 无 | winleft+q |
| `winleft_e()` | 无 | winleft+e |

#### 特殊键
| 方法 | 参数 | 描述 |
|------|------|------|
| `dot()` | 无 | 键盘点号 |
| `printscreen()` | 无 | 快捷键截取全屏 |
| `ctrl_printscreen()` | 无 | 快捷键启动延时截图 |

#### 单个字母键
| 方法 | 参数 | 描述 |
|------|------|------|
| `p()` | 无 | 按下p快捷键 |
| `h()` | 无 | 按下h快捷键 |
| `f()` | 无 | 按下f快捷键 |
| `s()` | 无 | 按下s快捷键 |
| `o()` | 无 | 按下o快捷键 |
| `r()` | 无 | 按下r快捷键 |
| `i()` | 无 | 按下i快捷键 |

#### 特殊操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `press_left_sometime(sometime)` | `sometime: int` | 按住键盘方向键-左键一段时间 |
| `press_up_sometime(sometime)` | `sometime: int` | 按住键盘方向键-上键一段时间 |

### MouseKey (mouse_key.py)

#### 屏幕操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `screen_size()` | 无 | 获取屏幕大小 |
| `current_location(out_log=True)` | `out_log: bool` | 获取当前鼠标位置 |

#### 鼠标移动
| 方法 | 参数 | 描述 |
|------|------|------|
| `move_to(_x, _y, duration=0.4)` | `_x: int, _y: int, duration: float` | 移动到指定位置 |
| `move_rel(_x, _y, duration=0.4)` | `_x: int, _y: int, duration: float` | 相对移动到位置 |
| `move_rel_and_click(_x, _y)` | `_x: int, _y: int` | 相对移动并点击 |

#### 鼠标点击
| 方法 | 参数 | 描述 |
|------|------|------|
| `click(_x=None, _y=None, _type="pyautogui")` | `_x: int, _y: int, _type: str` | 点击鼠标左键 |
| `middle_click()` | 无 | 单击鼠标滚轮中间 |
| `right_click(_x=None, _y=None)` | `_x: int, _y: int` | 单击鼠标右键 |
| `double_click(_x=None, _y=None, interval=0.3)` | `_x: int, _y: int, interval: float` | 双击鼠标左键 |
| `triple_click(_x=None, _y=None)` | `_x: int, _y: int` | 三击鼠标左键 |

#### 鼠标拖拽操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `drag_to(_x, _y, duration=0.4, delay=1)` | `_x: int, _y: int, duration: float, delay: int` | 拖拽到指定位置(绝对位置) |
| `drag_rel(_x, _y)` | `_x: int, _y: int` | 按住鼠标左键,拖拽到指定位置(相对位置) |

#### 鼠标按键控制
| 方法 | 参数 | 描述 |
|------|------|------|
| `mouse_down(_x=None, _y=None, button=1)` | `_x: int, _y: int, button: int` | 按住鼠标键不放 |
| `mouse_up(button=1)` | `button: int` | 松开鼠标左键 |

#### 鼠标滚轮
| 方法 | 参数 | 描述 |
|------|------|------|
| `mouse_scroll(amount_of_scroll, duration=1)` | `amount_of_scroll: int, duration: int` | 滚动鼠标滚轮 |

#### 键盘输入
| 方法 | 参数 | 描述 |
|------|------|------|
| `input_message(message, delay_time=300, interval=0.2, wayland_shift=False, _ydotool=False)` | 各种参数 | 输入字符串 |
| `press_key(key, interval=0.0, _ydotool=False)` | `key: str, interval: float, _ydotool: bool` | 按下键盘按键 |
| `press_key_down(key)` | `key: str` | 按下键盘按键不放 |
| `press_key_up(key)` | `key: str` | 松开键盘按键 |

#### 热键
| 方法 | 参数 | 描述 |
|------|------|------|
| `hot_key(*args, interval=0.03)` | `*args: str, interval: float` | 组合键 |
| `hot_key_down(*args)` | `*args: str` | 按下组合键不放 |
| `hot_key_up(*args)` | `*args: str` | 松开组合键 |

#### 组合操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `move_to_and_click(_x, _y)` | `_x: int, _y: int` | 移动到指定位置并点击 |
| `move_to_and_right_click(_x, _y)` | `_x: int, _y: int` | 移动到指定位置并右键点击 |
| `move_to_and_double_click(_x, _y)` | `_x: int, _y: int` | 移动到指定位置并双击 |
| `move_on_and_drag_to(start, end)` | `start: tuple, end: tuple` | 移动到起始位置并拖拽到结束位置 |
| `move_on_and_drag_rel(start, end)` | `start: tuple, end: tuple` | 移动到起始位置并相对拖拽 |

#### 菜单操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `select_menu(number)` | `number: int` | 选择菜单项 |
| `reverse_select_menu(number)` | `number: int` | 反向选择菜单项 |
| `select_submenu(number)` | `number: int` | 选择子菜单项 |

#### 实用工具操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `locate_all_on_screen(image_path)` | `image_path: str` | 在屏幕上定位所有匹配的图像 |
| `draw_line(start_x, start_y, rel_x, rel_y)` | `start_x: int, start_y: int, rel_x: int, rel_y: int` | 绘制直线 |
| `clear()` | 无 | 清除 |

### CmdCtl (cmdctl.py)

#### 命令执行
| 方法 | 参数 | 描述 |
|------|------|------|
| `sudo_run_cmd(command, workdir=None, interrupt=False, timeout=25, out_debug_flag=True, command_log=True, password=None, return_code=False)` | 各种参数 | 以sudo权限运行命令 |
| `run_cmd(command, interrupt=False, timeout=25, out_debug_flag=True, command_log=True, executable="/bin/bash", return_code=False, workdir=None)` | 各种参数 | 运行命令 |
| `expect_run(cmd, events, return_code=False, timeout=30)` | 各种参数 | 期望运行命令 |

#### 进程管理
| 方法 | 参数 | 描述 |
|------|------|------|
| `monitor_process(app_name, grep_list=None)` | `app_name: str, grep_list: str` | 监控进程 |
| `get_process_status(app, grep_list=None)` | `app: str, grep_list: str` | 获取进程状态 |
| `get_daemon_process_status(app, grep_list=None)` | `app: str, grep_list: str` | 获取守护进程状态 |
| `get_daemon_process_num(app, grep_list=None)` | `app: str, grep_list: str` | 获取守护进程数量 |
| `kill_process(process, grep_list=None)` | `process: str, grep_list: list/tuple` | 杀死进程 |
| `sudo_kill_process(process, grep_list=None)` | `process: str, grep_list: list/tuple` | 以sudo权限杀死进程 |

#### 系统操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `minimize_current_window()` | 无 | 最小化当前窗口 |
| `change_sys_icon_theme(theme="bloom")` | `theme: str` | 更改系统图标主题 |
| `change_app_to_default_theme(app_name)` | `app_name: str` | 将应用更改为默认主题 |

### FileCtl (filectl.py)

#### 文件创建
| 方法 | 参数 | 描述 |
|------|------|------|
| `creat_files(path, file_name="", file_type="dir")` | `path: str, file_name: str, file_type: str` | 创建文件或文件夹 |

#### 文件删除
| 方法 | 参数 | 描述 |
|------|------|------|
| `delete_files(path, ignores=(), includes=())` | `path: str, ignores: tuple, includes: tuple` | 删除文件或文件夹 |

#### 文件操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `rename_files(path, old_name, new_name)` | `path: str, old_name: str, new_name: str` | 重命名文件 |
| `move_files(path, file_name, new_path=None, new_file_name=None)` | 各种参数 | 移动文件 |
| `file_exists(*files, abspath=False, _try=True)` | 各种参数 | 检查文件是否存在 |
| `file_name_and_format(position, _format=None)` | `position: str, _format: str` | 获取文件名和格式 |

#### 文件搜索
| 方法 | 参数 | 描述 |
|------|------|------|
| `find_files(path, startwith=None, include=None, endwith=None, not_includes=(), recursive=False, abs_path=False)` | 各种参数 | 查找文件 |

### ImageUtils (image_utils.py)

#### 图像识别
| 方法 | 参数 | 描述 |
|------|------|------|
| `find_image_remote(widget, rate=None, multiple=False, picture_abspath=None, screen_bbox=None, log_level="info", network_retry=None, pause=None, timeout=None, max_match_number=None)` | 各种参数 | 远程查找图像 |

### OCRUtils (ocr_utils.py)

#### OCR 操作
| 方法 | 参数 | 描述 |
|------|------|------|
| `ocr(*args, **kwargs)` | 各种参数 | OCR负载均衡 |
| `ocr_remote(target_strings=None, picture_abspath=None, similarity=0.6, return_default=False, return_first=False, lang="ch", network_retry=None, pause=None, timeout=None, max_match_number=None)` | 各种参数 | 远程OCR |
| `ocrx(*args, **kwargs)` | 各种参数 | 支持链式调用的OCR |

#### OCR 动作
| 方法 | 参数 | 描述 |
|------|------|------|
| `click()` | 无 | OCR识别后点击 |
| `right_click()` | 无 | OCR识别后右键点击 |
| `double_click()` | 无 | OCR识别后双击 |
| `center()` | 无 | 获取OCR识别结果的中心点 |
| `all_result()` | 无 | 获取所有OCR识别结果 |

#### OCR 搜索
| 方法 | 参数 | 描述 |
|------|------|------|
| `ocr_find_by_range(text, x1=None, x2=None, y1=None, y2=None)` | 各种参数 | 在指定范围内查找文本 |

### Calculate (calculate.py)

#### 坐标计算
| 方法 | 参数 | 描述 |
|------|------|------|
| `coordinate_distance(start, end)` | `start: tuple, end: tuple` | 计算两个坐标之间的直线距离 |
| `translational_coordinates(start, relative)` | `start: tuple, relative: tuple` | 计算坐标平移 |

---

## 使用示例

### 基本用法
```python
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from apps.dde_autotest_euler.method.assert_method import AssertMethod
from apps.dde_autotest_euler.method.base_method import BaseMethod

# 创建实例
dde = DdeMethod()
assert_method = AssertMethod()
base = BaseMethod("test")

# 使用 DDE 方法
dde.open_software_by_launcher("terminal")
dde.add_common_account_by_control_center()

# 使用断言方法
assert_method.assert_equal("expected", "actual")
assert_method.assert_image_exist_in_dde("test.png")

# 使用基础方法
base.click_by_ocr("button")
base.create_file_in_documents_by_cmd("test.txt")
```

### 实际测试用例示例

#### 示例 1: 文件管理器操作
```python
# 打开文件管理器并测试文件操作
def test_file_manager_operations():
    euler = DdeMethod()
    
    # 打开文件管理器
    euler.dde_dock.click_dde_file_manager_by_attr()
    sleep(3)
    
    # 导航到文档目录
    euler.dde_file_manager.click_document_dir_in_left_view_by_attr()
    sleep(3)
    
    # 创建测试文件
    euler.dde_file_manager.click_file_in_right_view_by_attr("test1")
    
    # 删除文件（移动到回收站）
    Src.delete()
    
    # 检查回收站目录
    euler.dde_file_manager.click_trash_dir_in_left_view_by_attr()
    sleep(3)
    
    # 断言文件存在于回收站
    self.assert_image_exist_in_dde("test_dde_1271281_1")
    
    # 清空回收站
    euler.dde_file_manager.click_empty_btn_in_right_view_by_attr()
    euler.dde_file_manager.click_empty_confirm_btn_by_image()
    
    # 验证回收站为空
    self.assert_file_not_exist("/home/uos/.local/share/Trash/files/test1")
```

#### 示例 2: 应用程序启动和控制
```python
# 启动应用程序并测试基本功能
def test_application_launch():
    euler = DdeMethod()
    
    # 启动系统监视器
    euler.open_software_by_launcher("xitongjianshiqi")
    sleep(5)
    
    # 验证进程正在运行
    self.assert_process_status(True, "deepin-system-monitor")
    
    # 启动终端
    Src.ctrl_alt_t()
    sleep(2)
    
    # 打开终端设置
    euler.deepin_terminal.click_option_by_attr()
    sleep(5)
    
    # 导航设置
    for _ in range(4):
        Src.down()
    Src.enter()
    sleep(3)
    
    # 验证设置界面
    self.assert_ocr_not_exist("主题", max_match_number=1)
    self.assert_ocr_not_exist("关于", max_match_number=1)
```

#### 示例 3: 屏幕录制和截图
```python
# 测试屏幕录制功能
def test_screen_recording():
    euler = DdeMethod()
    
    # 启动屏幕录制器
    euler.open_software_by_launcher("jietuluping")
    sleep(3)
    
    # 验证进程正在运行
    self.assert_process_status(True, "deepin-screen-recorder")
    
    # 选择录制区域
    Src.mouse_down(300, 300)
    Src.drag_to(600, 600, 1, 1)
    Src.click(350, 350)
    
    # 右键点击并退出
    Src.right_click(350, 350)
    euler.deepin_screen_recorder.click_by_ocr("退出")
    sleep(3)
    
    # 验证进程已停止
    self.assert_process_status(False, "deepin-screen-recorder")
```

#### 示例 4: 文本编辑器操作
```python
# 测试文本编辑器功能
def test_text_editor():
    euler = DdeMethod()
    
    # 创建测试文件
    euler.dde_dock.create_file_in_documents_by_cmd("test.txt")
    
    # 启动文本编辑器
    euler.open_software_by_launcher("wenbenbianjiqi")
    sleep(6)
    
    # 打开文件
    euler.deepin_editor.click_menu_btn_by_attr()
    euler.deepin_editor.choose_open_file_option_by_ocr()
    sleep(3)
    
    # 导航到文档
    euler.click_documents_in_pop_window_by_img()
    sleep(2)
    Src.ctrl_a()
    Src.enter()
    sleep(3)
    
    # 编辑文件
    Src.input_message("test content")
    
    # 使用 Ctrl+W 关闭标签
    Src.ctrl_w()
    sleep(2)
    
    # 验证标签已关闭
    self.assert_element_not_exist("$/deepin-editor//test.txt")
```

#### 示例 5: 控制中心操作
```python
# 测试控制中心功能
def test_control_center():
    euler = DdeMethod()
    
    # 打开控制中心
    euler.dde_dock.click_control_center_btn_by_attr()
    sleep(6)
    
    # 导航到键盘设置
    euler.dde_control_center.click_keyboard_and_language_by_attr()
    euler.dde_control_center.click_keyboard_layout_by_attr()
    
    # 添加键盘布局
    euler.dde_control_center.click_add_keyboard_layout_btn_by_attr()
    euler.dde_control_center.click_hanyu_keyboard_layout_at_list()
    euler.dde_control_center.click_bottom_add_btn_by_attr()
    
    # 更改分辨率
    euler.dde_control_center.enter_view_by_search_box("xianshi")
    euler.dde_control_center.click_by_attr("1024×768 (推荐)")
    euler.dde_control_center.click_by_attr("1280×800")
    sleep(1)
    euler.dde_control_center.click_by_attr("Btn_保存")
    sleep(2)
```

#### 示例 6: OCR 和图像识别
```python
# 测试 OCR 和图像识别
def test_ocr_and_image():
    euler = DdeMethod()
    
    # 通过 OCR 文本识别点击
    euler.click_by_ocr("打开图片")
    sleep(3)
    
    # 通过图像识别点击
    euler.click_by_img("desktop_size_set_button.png")
    
    # 断言图像存在
    self.assert_image_exist_in_dde("test_dde_1271275_1.png")
    
    # 断言 OCR 文本存在
    self.assert_ocr_exist("新建文件夹", "新建文档", "显示方式", "排序方式")
    
    # 断言 OCR 文本不存在
    self.assert_ocr_not_exist("回收站", max_match_number=1)
```

#### 示例 7: 文件操作和命令
```python
# 测试文件操作和命令执行
def test_file_operations():
    euler = DdeMethod()
    
    # 使用命令创建文件
    euler.create_file_in_documents_by_cmd("test.txt")
    euler.run_cmd("touch ~/Documents/test1")
    euler.run_cmd("mkdir ~/Videos/test_dir")
    
    # 检查文件存在性
    self.assert_file_exist("/home/uos/.local/share/Trash/files/test1")
    
    # 删除文件
    euler.delete_file_in_documents_by_cmd("test.txt")
    euler.delete_all_file_in_documents_by_cmd()
    
    # 检查文件不存在
    self.assert_file_not_exist("/home/uos/.local/share/Trash/files/test1")
```

#### 示例 8: 鼠标和键盘操作
```python
# 测试鼠标和键盘操作
def test_mouse_keyboard():
    euler = DdeMethod()
    
    # 鼠标操作
    euler.move_to(100, 200, duration=0.4)
    euler.click(100, 200)
    euler.right_click(100, 200)
    euler.double_click(100, 200)
    euler.drag_to(300, 400, duration=0.4, delay=1)
    
    # 键盘操作
    euler.input_message("Hello World")
    euler.press_key("enter")
    euler.hot_key("ctrl", "a")
    euler.hot_key("ctrl", "c")
    euler.hot_key("ctrl", "v")
    
    # 鼠标滚轮
    euler.mouse_scroll(-30)  # 向下滚动
    euler.mouse_scroll(30)   # 向上滚动
```

#### 示例 9: 进程管理
```python
# 测试进程管理
def test_process_management():
    euler = DdeMethod()
    
    # 检查进程状态
    status = euler.get_process_status("deepin-terminal")
    self.assert_process_status(True, "deepin-terminal")
    
    # 杀死进程
    euler.kill_process("deepin-terminal")
    sleep(3)
    
    # 验证进程已杀死
    self.assert_process_status(False, "deepin-terminal")
    
    # 监控进程
    euler.monitor_process("deepin-terminal")
```

#### 示例 10: 高级断言
```python
# 测试各种断言方法
def test_assertions():
    euler = DdeMethod()
    
    # 元素断言
    self.assert_element_exist("$/dde-desktop//test.txt")
    self.assert_element_not_exist("$/dde-desktop//nonexistent.txt")
    self.assert_element_numbers("$/dde-desktop//*.txt", 5)
    
    # 窗口断言
    self.assert_window_size((1920, 1080), (1920, 1080))
    self.assert_window_amount("dde-file-manager", 1)
    
    # 主题断言
    self.assert_theme("浅色")
    
    # 文件断言
    self.assert_file_endwith_exist("/home/uos/Documents", "txt")
    
    # 值断言
    self.assert_equal("expected", "expected")
    self.assert_not_equal("expected", "actual")
    self.assert_true(True)
    self.assert_false(False)
    self.assert_in("substring", "main string")
    self.assert_not_in("substring", "other string")
```

---
