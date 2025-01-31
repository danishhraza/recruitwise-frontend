import { Button } from 'antd';
import React, { useState, useEffect } from 'react';

const LiveAudioStreaming = () => {
    const [ws, setWs] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioStream, setAudioStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    // Set up WebSocket once when the component mounts
    useEffect(() => {
        // Create WebSocket connection
        const socket = new WebSocket('ws://localhost:8080/audio');
        
        socket.onopen = () => {
            console.log('WebSocket connected');
        };
        
        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };
        
        socket.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };
        
        setWs(socket);

        // Clean up the WebSocket connection and media stream when the component unmounts
        return () => {
            if (socket) {
                socket.close();
            }
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // Empty dependency array ensures this effect runs once, when the component mounts

    // Start recording audio and send chunks to the server
    const startRecording = () => {
        // Request microphone access
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                setAudioStream(stream);
                const recorder = new MediaRecorder(stream);
                recorder.ondataavailable = (event) => {
                    // Send audio chunk over WebSocket
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(event.data); // Send audio chunk to server
                    }
                };
                recorder.start(100);  // Start recording in chunks every 100ms
                setMediaRecorder(recorder);
                setIsRecording(true);
            })
            .catch((error) => {
                console.error('Error accessing microphone: ', error);
            });
    };

    // Stop recording and close the WebSocket connection
    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            audioStream.getTracks().forEach(track => track.stop()); // Stop microphone
        }
        setIsRecording(false);
    };

    return (
        <div>
            <h1>Live Audio Streaming</h1>
            <Button onClick={startRecording} disabled={isRecording}>
                Start Recording
            </Button>
            <Button onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
            </Button>
        </div>
    );
};

export default LiveAudioStreaming;
