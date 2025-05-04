import whisper
from pyannote.audio import Pipeline
from huggingface_hub import login
import json
import os
import subprocess

class TranscriptionService:
    def __init__(self, hf_token: str, whisper_model_size: str = "medium"):
        
        login(hf_token)
        
        self.whisper_model = whisper.load_model(whisper_model_size)
        self.diarization_pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1")

    def convert_audio(self, input_path: str, output_path: str = "converted.wav") -> str:
        command = ["ffmpeg", "-y", "-i", input_path, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", output_path]
        subprocess.run(command, check=True)
        return output_path

    def transcribe_with_speakers(self, audio_path: str) -> list:
        
        wav_path = self.convert_audio(audio_path)

       
        diarization = self.diarization_pipeline(wav_path)

        
        transcription_result = self.whisper_model.transcribe(wav_path, word_timestamps=True)

        
        final_output = []
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            start = turn.start
            end = turn.end

            text = ""
            for segment in transcription_result["segments"]:
                seg_start = segment["start"]
                seg_end = segment["end"]
                if seg_end > start and seg_start < end:
                    text += segment["text"] + " "

            final_output.append({
                "start": round(start, 2),
                "end": round(end, 2),
                "speaker": speaker,
                "text": text.strip()
            })

        return final_output

    def save_to_json(self, result: list, output_file: str):
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=4)

