import os
import json
import re

def natural_sort_key(filename):
    # Fungsi untuk mengambil angka dari nama file untuk pengurutan numerik
    # Misalnya, aether10.png -> ["aether", "10", ".png"] -> 10
    match = re.search(r'(\d+)', filename)
    return int(match.group(0)) if match else filename

def generate_characters_json(root_folder, output_file):
    characters = []
    current_id = 1
    
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
            
            # Buat entri JSON untuk setiap file
            for file_name in files:
                # Nama file tanpa ekstensi
                name_without_ext = os.path.splitext(file_name)[0]
                
                # Struktur entri JSON
                character_entry = {
                    "id": str(current_id),
                    "name": name_without_ext,
                    "character": folder_name,
                    "img": f"{folder_name}/{file_name}",
                    "color": "#0077DD",
                    "defaultText": {
                        "text": "Hello!",
                        "x": 148,
                        "y": 58,
                        "r": -2,
                        "s": 47
                    }
                }
                
                characters.append(character_entry)
                current_id += 1
    
    # Tulis ke file JSON
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(characters, f, indent=2, ensure_ascii=False)
        print(f"Berhasil menghasilkan {output_file} dengan {len(characters)} entri.")
    except Exception as e:
        print(f"Gagal menulis ke {output_file}: {str(e)}")

if __name__ == "__main__":
    # Ganti dengan path folder img kamu
    root_folder = "img"
    output_file = "D:/GM/tools/GI-Stickers/src/characters.json"
    generate_characters_json(root_folder, output_file)