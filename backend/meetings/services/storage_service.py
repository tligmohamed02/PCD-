import os

def save_audio_file(uploaded_file, destination_folder="uploads"):
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)
    file_path = os.path.join(destination_folder, uploaded_file.name)
    with open(file_path, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
    print(f"File saved to {file_path}")
    return file_path


