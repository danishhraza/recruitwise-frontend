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
    if (!isAuthorized) return;

    console.log('Initializing persistent socket connection...');
    
    const socketConnection = io('process.env.SERVER_URL/interview', {
        withCredentials: true,
        
        // Force WebSocket and prevent fallback that might cause disconnections
        transports: ['websocket'],
        upgrade: false, // Don't try to upgrade - stay on websocket
        rememberUpgrade: false,
        
        // Aggressive ping/pong to keep connection alive
        pingInterval: 10000, // Ping every 10 seconds (very frequent)
        pingTimeout: 5000,   // Wait 5 seconds for pong response
        
        // Disable reconnection initially - we want to prevent disconnection
        reconnection: false, // We'll enable this after connection is stable
        
        // Connection timeouts
        timeout: 20000,
        
        // Force new connection
        forceNew: false,
        
        // Auto-connect
        autoConnect: true,
        
        // Prevent browser from closing connection
        closeOnBeforeunload: false
    });

    // Keep-alive mechanism using existing socket events
    let keepAliveInterval;
    
    socketConnection.on('connect', () => {
        console.log('✅ Socket connected - setting up keep-alive mechanism');
        
        // Enable reconnection after successful connection
        socketConnection.io.opts.reconnection = true;
        socketConnection.io.opts.reconnectionAttempts = 10;
        socketConnection.io.opts.reconnectionDelay = 1000;
        
        // Use existing events to keep connection alive
        keepAliveInterval = setInterval(() => {
            if (socketConnection.connected) {
                // Use existing room-based events to keep connection alive
                socketConnection.emit('heartbeat', { roomId: roomid, timestamp: Date.now() });
            }
        }, 8000); // Every 8 seconds
        
        toast.success("Connected to interview server", { 
            id: 'socket-connection', 
            duration: 3000 
        });
        setIsConnecting(false);
    });

    socketConnection.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        
        // Clear keep-alive interval
        if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
            keepAliveInterval = null;
        }
        
        // Re-enable reconnection if it was disabled
        socketConnection.io.opts.reconnection = true;
        
        toast.error(`Connection lost: ${reason}`, { 
            id: 'socket-disconnect', 
            duration: 5000 
        });
    });

    // Prevent browser from pausing the socket when tab becomes inactive
    const preventConnectionPause = () => {
        // Use Page Visibility API to detect tab state changes
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log('Tab hidden - maintaining socket connection');
                
                // Immediately send a heartbeat to keep connection active
                if (socketConnection.connected) {
                    socketConnection.emit('heartbeat', { roomId: roomid, timestamp: Date.now() });
                }
                
                // Reduce but don't stop the keep-alive pings
                if (keepAliveInterval) {
                    clearInterval(keepAliveInterval);
                    keepAliveInterval = setInterval(() => {
                        if (socketConnection.connected) {
                            socketConnection.emit('heartbeat', { roomId: roomid, timestamp: Date.now() });
                        }
                    }, 5000); // More frequent when hidden (every 5 seconds)
                }
            } else {
                console.log('Tab visible - resuming normal operation');
                
                // Resume normal keep-alive interval
                if (keepAliveInterval) {
                    clearInterval(keepAliveInterval);
                    keepAliveInterval = setInterval(() => {
                        if (socketConnection.connected) {
                            socketConnection.emit('heartbeat', { roomId: roomid, timestamp: Date.now() });
                        }
                    }, 8000);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    };

    // Set up prevention mechanism
    const cleanupVisibility = preventConnectionPause();

    // Additional: Prevent connection from being closed by browser optimization
    const preventBrowserOptimization = () => {
        // Keep a small amount of activity to prevent browser from optimizing away the connection
        const activityInterval = setInterval(() => {
            if (socketConnection.connected) {
                // Send minimal data to keep connection active
                socketConnection.emit('ping', Date.now());
            }
        }, 15000); // Every 15 seconds

        return () => clearInterval(activityInterval);
    };

    const cleanupActivity = preventBrowserOptimization();

    setSocket(socketConnection);

    // Cleanup
    return () => {
        console.log('Cleaning up socket connection');
        
        // Clear all intervals
        if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
        }
        
        // Run cleanup functions
        cleanupVisibility();
        cleanupActivity();
        
        // Clean up socket
        if (socketConnection) {
            socketConnection.removeAllListeners();
            socketConnection.disconnect();
        }
    };
}, [isAuthorized, roomid]);

    // Fetch room data with error handling
    async function fetchRoomData() {
        try {
            setIsConnecting(true);
            setHasError(false); // Reset error state
            const response = await axios.get(`process.env.SERVER_URL/interview/${roomid}`, {
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