#[tauri::command]
pub fn get_download_dir() -> String {
    // 获取用户下载文件夹路径
    let download_dir = dirs::download_dir().expect("Failed to get download directory");
    return download_dir.display().to_string();
}
