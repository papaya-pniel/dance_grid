import cv2
import numpy as np
import mediapipe as mp
import os

# ---- CONFIG ----
input_video_path = 'public/boogie_square_tutorial.mp4'     # Replace with your input video
background_image_path = 'public/blue.jpg'   # Replace with your background image
output_video_path = 'output_with_new_bg.mp4'  # Output video file name

# ---- Setup ----
mp_selfie_segmentation = mp.solutions.selfie_segmentation
segmentor = mp_selfie_segmentation.SelfieSegmentation(model_selection=1)

cap = cv2.VideoCapture(input_video_path)
if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

# Get video properties
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# Setup video writer
fourcc = cv2.VideoWriter_fourcc(*'avc1')  # H.264 codec  # You can use 'XVID' or others depending on platform
out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

# Load and resize background
bg_image = cv2.imread(background_image_path)
if bg_image is None:
    print("Error: Background image not found.")
    exit()
bg_image = cv2.resize(bg_image, (width, height))

print("Processing video...")

# ---- Process Video ----
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Run segmentation
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = segmentor.process(rgb_frame)
    mask = result.segmentation_mask > 0.5

    # Blend with background
    mask_blurred = cv2.GaussianBlur(mask.astype(np.float32), (15, 15), 0)
    output_frame = (mask_blurred[:, :, None] * frame + (1 - mask_blurred[:, :, None]) * bg_image).astype(np.uint8)
    output_frame = np.where(mask[:, :, None], frame, bg_image)

    # Write frame
    out.write(output_frame.astype(np.uint8))

# ---- Cleanup ----
cap.release()
out.release()
print(f"Done. Output saved to: {os.path.abspath(output_video_path)}")
