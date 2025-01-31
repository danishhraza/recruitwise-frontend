import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Assuming the server is running on 'http://localhost:3000'
const socket = io('http://localhost:3000');

const PeerRoom = ({ roomId }) => {
  const [peers, setPeers] = useState([]); // Store the list of peers

  useEffect(() => {
    // Function to handle updated peer data
    const handlePeerData = (updatedPeers) => {
      console.log('Received updated peers:', updatedPeers);
      setPeers(updatedPeers); // Update the list of peers in the state
    };

    // Listen for the 'peerData' event
    socket.on('peerData', handlePeerData);

    // Cleanup the listener when the component unmounts or roomId changes
    return () => {
      socket.off('peerData', handlePeerData);
    };
  }, [roomId]); // Re-run effect when roomId changes

  // Function to join the room
  const joinRoom = (peerId) => {
    socket.emit('joinRoom', roomId, peerId); // Emit join room event
  };

  // Function to leave the room
  const leaveRoom = (peerId) => {
    socket.emit('leaveRoom', roomId, peerId); // Emit leave room event
  };

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <ul>
        {peers.map((peer) => (
          <li key={peer}>{peer}</li>
        ))}
      </ul>
      <button onClick={() => joinRoom('new-peer-id')}>Join Room</button>
      <button onClick={() => leaveRoom('peer-id-to-leave')}>Leave Room</button>
    </div>
  );
};

export default PeerRoom;
