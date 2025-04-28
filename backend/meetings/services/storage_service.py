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


# from djongo import models 

# class AudioFile(models.Model):
#     name = models.CharField(max_length=255)
#     file = models.BinaryField()
#     uploaded_at = models.DateTimeField(auto_now_add=True)

# def save_audio_to_mongodb(uploaded_file):
#     audio = AudioFile(name=uploaded_file.name, file=uploaded_file.read())
#     audio.save()
#     return audio.id