import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Paper, Grid, IconButton } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, CallEnd } from '@mui/icons-material';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VideoRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [remoteStream, setRemoteStream] = useState(null);

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const peerConnection = useRef();
    const socket = useRef();

    const servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
            }
        ]
    };

    useEffect(() => {
        // Initialize Socket
        socket.current = io('/', { path: '/socket.io' }); // Proxy handles request to backend

        socket.current.emit('join-room', roomId, user.id);

        socket.current.on('user-connected', (userId) => {
            console.log('User connected:', userId);
            createOffer(userId);
        });

        socket.current.on('offer', async (payload) => {
            await handleOffer(payload);
        });

        socket.current.on('answer', async (payload) => {
            await handleAnswer(payload);
        });

        socket.current.on('ice-candidate', async (candidate) => {
            if (peerConnection.current) {
                try {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }
        });

        socket.current.on('user-disconnected', () => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
            setRemoteStream(null);
        });

        startLocalStream();

        return () => {
            if (socket.current) socket.current.disconnect();
            if (peerConnection.current) peerConnection.current.close();
        };
    }, [roomId]);

    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            // Initialize Peer Connection
            peerConnection.current = new RTCPeerConnection(servers);

            stream.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, stream);
            });

            peerConnection.current.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
            };

            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    // Send candidate to peer (we don't know peer ID here easily without tracking, assuming strict 1-1 for now or broadcasting to room)
                    // In production, we need target User ID. For now, we rely on room broadcast or stored peer ID.
                    // Since our signaling is basic, let's assume the other user in the room is the target.
                    // But socket.to(roomId) broadcasts to all.
                    // We need to know WHO sent the offer to reply.
                }
            };

        } catch (err) {
            console.error("Error accessing media devices:", err);
        }
    };

    // Simplified WebRTC Negotiation (Assuming 1-on-1)
    // Need to track peerId to send signaling explicitly. 
    // For this demo, let's just log the flow. Re-implementing full mesh or perfect negotiation is complex.

    const createOffer = async (targetUserId) => {
        const pc = peerConnection.current;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.current.emit('offer', {
            target: targetUserId, // This needs to be handled by server/socket logic
            caller: user.id,
            sdp: offer
        });

        // We need to update onicecandidate to send to THIS targetUserId
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current.emit('ice-candidate', {
                    target: targetUserId,
                    candidate: event.candidate
                });
            }
        };
    };

    const handleOffer = async (payload) => {
        const pc = peerConnection.current;
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.current.emit('answer', {
            target: payload.caller,
            caller: user.id,
            sdp: answer
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.current.emit('ice-candidate', {
                    target: payload.caller,
                    candidate: event.candidate
                });
            }
        };
    };

    const handleAnswer = async (payload) => {
        const pc = peerConnection.current;
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    };

    const toggleMic = () => {
        const stream = localVideoRef.current.srcObject;
        stream.getAudioTracks()[0].enabled = !micOn;
        setMicOn(!micOn);
    };

    const toggleCam = () => {
        const stream = localVideoRef.current.srcObject;
        stream.getVideoTracks()[0].enabled = !camOn;
        setCamOn(!camOn);
    };

    const leaveRoom = () => {
        navigate('/appointments');
    };

    return (
        <Box sx={{ p: 2, height: '90vh' }}>
            <Typography variant="h5" gutterBottom>Video Session</Typography>
            <Grid container spacing={2} sx={{ height: '80%' }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ height: '100%', bgcolor: 'black', position: 'relative', overflow: 'hidden' }}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Typography sx={{ position: 'absolute', bottom: 10, left: 10, color: 'white' }}>You</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ height: '100%', bgcolor: 'black', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <Typography color="white">Waiting for other participant...</Typography>
                        )}
                        <Typography sx={{ position: 'absolute', bottom: 10, left: 10, color: 'white' }}>Remote</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
                <IconButton onClick={toggleMic} sx={{ bgcolor: micOn ? 'primary.main' : 'error.main', color: 'white' }}>
                    {micOn ? <Mic /> : <MicOff />}
                </IconButton>
                <IconButton onClick={toggleCam} sx={{ bgcolor: camOn ? 'primary.main' : 'error.main', color: 'white' }}>
                    {camOn ? <Videocam /> : <VideocamOff />}
                </IconButton>
                <IconButton onClick={leaveRoom} sx={{ bgcolor: 'error.dark', color: 'white' }}>
                    <CallEnd />
                </IconButton>
            </Box>
        </Box>
    );
};

export default VideoRoom;
