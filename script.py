import os
import re

def natural_sort_key(filename):
    # Fungsi untuk mengambil angka dari nama file untuk pengurutan numerik
    # Misalnya, UI_EmotionIcon10.png -> ["10"] -> 10
    match = re.search(r'(\d+)', filename)
    return int(match.group(0)) if match else filename

def rename_files_in_folders(root_folder):
    # Pastikan folder root ada
    if not os.path.exists(root_folder):
        print(f"Folder {root_folder} tidak ditemukan!")
        return
    
    # Iterasi melalui setiap subfolder di root_folder
    for folder_name in sorted(os.listdir(root_folder)):
        folder_path = os.path.join(root_folder, folder_name)
        
        # Pastikan itu adalah folder
        if os.path.isdir(folder_path):
            # Ambil semua file gambar (dengan ekstensi .png)
            files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f)) and f.lower().endswith('.png')]
            
            # Urutkan file berdasarkan angka dalam nama file
            files.sort(key=natural_sort_key)
            
            # Rename file secara urut
            for index, file_name in enumerate(files, 1):
                old_file_path = os.path.join(folder_path, file_name)
                
                # Buat nama baru dengan format nama_folder + nomor_urut.png
                new_file_name = f"{folder_name}{index}.png"
                new_file_path = os.path.join(folder_path, new_file_name)
                
                # Cek apakah nama file baru sudah ada
                if os.path.exists(new_file_path):
                    print(f"Peringatan: {new_file_path} sudah ada, melewati rename untuk {old_file_path}")
                    continue
                
                try:
                    os.rename(old_file_path, new_file_path)
                    print(f"Berhasil rename: {old_file_path} -> {new_file_path}")
                except Exception as e:
                    print(f"Gagal rename {old_file_path} -> {new_file_path}: {str(e)}")

if __name__ == "__main__":
    # Ganti dengan path folder img kamu
    root_folder = "img"
    rename_files_in_folders(root_folder)