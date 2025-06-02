import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CheckDevices from './CheckDevices';
import VideoCall from "../components/VideoCall";
import InterviewError from "../components/InterviewError"; // Import the error component
import { useRoom } from "../Context/RoomContext";
import axios from "../../api/axios";
import { toast } from "sonner";
import io from 'socket.io-client';

function Room() {
    const { stage, setStage } = useRoom();
    const { roomid } = useParams();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false); // Add authorization state

    // Initialize socket connection only after authorization
    useEffect(() => {
        if (!isAuthorized) return; // Don't connect socket until authorized

        // Connect to socket when component mounts and user is authorized
        const socketConnection = io('http://localhost:3000/interview', {
            withCredentials: true,
            transports: ['websocket']
        });

        // Setup socket event listeners
        socketConnection.on('connect', () => {
            console.log('Socket connected successfully');
            toast.success("Connected to interview server", { id: 'socket-connection', duration: 3000 });
        });

        socketConnection.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            toast.error(`Connection error: ${err.message || 'Unable to connect to server'}`, { 
                id: 'socket-error', 
                duration: 5000 
            });
        });

        socketConnection.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            toast.error(`Disconnected: ${reason}`, { id: 'socket-disconnect', duration: 5000 });
        });

        // Save socket to state
        setSocket(socketConnection);

        // Clean up the socket connection when the component unmounts
        return () => {
            console.log('Cleaning up socket connection');
            if (socketConnection) {
                socketConnection.disconnect();
            }
        };
    }, [isAuthorized]); // Only run when isAuthorized changes

    // Fetch room data with error handling
    async function fetchRoomData() {
        try {
            setIsConnecting(true);
            setHasError(false); // Reset error state
            const response = await axios.get(`http://localhost:3000/interview/${roomid}`, {
                withCredentials: true
            });
            console.log('Room data:', response.data.application);
            setIsAuthorized(true); // Set authorized to true on success
            setIsConnecting(false);
        } catch (error) {
            console.error('Error fetching room data:', error);
            setHasError(true); // Set error state
            setIsAuthorized(false); // Set authorized to false on error
            setIsConnecting(false);
            toast.error("Failed to fetch room data. Invalid access or interview has begun.");
        }
    }

    useEffect(() => {
        fetchRoomData();
    }, [roomid]);

    // Handle dashboard navigation
    const handleDashboardClick = () => {
        navigate('/dashboard'); // Navigate to dashboard
    };

    // Show error component if there's an error
    if (hasError) {
        return <InterviewError onDashboardClick={handleDashboardClick} />;
    }

    // If we're connecting or checking authorization, show a loading state
    if (isConnecting || !isAuthorized) {
        return (
            <div className="flex justify-center items-center h-screen bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-foreground">
                        {isConnecting ? "Verifying access..." : "Connecting to interview room..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {stage === 'checkDevices' && <CheckDevices roomId={roomid} socket={socket} />}
            {stage === 'call' && <VideoCall roomId={roomid} socket={socket} />}
            {stage === 'ended' && (
                <div className="flex flex-col items-center justify-center h-screen bg-background">
                    <h1 className="text-2xl font-bold mb-4">Interview Ended</h1>
                    <p className="mb-6">Thank you for participating in the interview.</p>
                    <button 
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                        onClick={() => navigate('/')}
                    >
                        Return Home
                    </button>
                </div>
            )}
        </div>
    );
}

export default Room;