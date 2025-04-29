import os
import re

def natural_sort_key(filename):
    # Fungsi untuk mengambil angka dari nama file untuk pengurutan numerik
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
            
            # Buat daftar rename: (old_path, temp_path, new_path)
            rename_list = []
            for index, file_name in enumerate(files, 1):
                old_file_path = os.path.join(folder_path, file_name)
                new_file_name = f"{folder_name}{index}.png"
                new_file_path = os.path.join(folder_path, new_file_name)
                # Gunakan nama sementara: originalnamafile_temp{index}.png
                base_name = os.path.splitext(file_name)[0]  # Nama tanpa ekstensi
                temp_file_name = f"{base_name}_temp{index}.png"
                temp_file_path = os.path.join(folder_path, temp_file_name)
                rename_list.append((old_file_path, temp_file_path, new_file_path))
            
            # Langkah 1: Rename semua file ke nama sementara
            for old_path, temp_path, new_path in rename_list:
                try:
                    os.rename(old_path, temp_path)
                    print(f"Berhasil rename ke sementara: {old_path} -> {temp_path}")
                except Exception as e:
                    print(f"Gagal rename ke sementara {old_path} -> {temp_path}: {str(e)}")
                    return  # Hentikan jika gagal untuk menghindari inkonsistensi
            
            # Langkah 2: Rename dari nama sementara ke nama akhir
            for _, temp_path, new_path in rename_list:
                try:
                    os.rename(temp_path, new_path)
                    print(f"Berhasil rename ke akhir: {temp_path} -> {new_path}")
                except Exception as e:
                    print(f"Gagal rename ke akhir {temp_path} -> {new_path}: {str(e)}")

if __name__ == "__main__":
    # Ganti dengan path folder img kamu
    root_folder = "img"
    rename_files_in_folders(root_folder)