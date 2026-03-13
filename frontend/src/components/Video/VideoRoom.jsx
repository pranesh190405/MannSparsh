import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Avatar, Chip, Fade } from '@mui/material';
import {
    Mic, MicOff, Videocam, VideocamOff, CallEnd,
    SignalCellularAlt, SignalCellularConnectedNoInternet0Bar, Person
} from '@mui/icons-material';
import io from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ]
};

const VideoRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [connectionState, setConnectionState] = useState('connecting');
    const [hasRemote, setHasRemote] = useState(false);
    const [mediaError, setMediaError] = useState(null);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const socketRef = useRef(null);
    const localStreamRef = useRef(null);

    // Keep user in a ref so the effect always has the latest value
    const userRef = useRef(user);
    useEffect(() => { userRef.current = user; }, [user]);

    // =============================================
    // Main initialization — ALL WebRTC logic inline
    // to avoid stale closure problems
    // =============================================
    useEffect(() => {
        let mounted = true;
        const iceCandidateBuffer = [];

        const init = async () => {
            // --- 1. Get local media stream ---
            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            } catch (err) {
                console.error('Failed to get media:', err);
                if (err.name === 'NotAllowedError') {
                    setMediaError('Camera/microphone access was denied. Please allow access and refresh.');
                } else if (err.name === 'NotFoundError') {
                    setMediaError('No camera or microphone found on this device.');
                } else {
                    setMediaError('Could not access camera/microphone. Please check your device settings.');
                }
                return;
            }
            if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }

            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // --- 2. Create peer connection ---
            const pc = new RTCPeerConnection(ICE_SERVERS);
            peerConnectionRef.current = pc;

            // Add local tracks to peer connection
            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            // Handle incoming remote tracks
            pc.ontrack = (event) => {
                console.log('[WebRTC] Remote track received');
                const [remoteStream] = event.streams;
                setHasRemote(true);
                // Allow React to mount the video element
                setTimeout(() => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                }, 100);
            };

            // Monitor ICE connection state
            pc.oniceconnectionstatechange = () => {
                const state = pc.iceConnectionState;
                console.log('[WebRTC] ICE state:', state);
                switch (state) {
                    case 'checking':
                        setConnectionState('connecting');
                        break;
                    case 'connected':
                    case 'completed':
                        setConnectionState('connected');
                        break;
                    case 'disconnected':
                        setConnectionState('reconnecting');
                        break;
                    case 'failed':
                        setConnectionState('failed');
                        break;
                    case 'closed':
                        setConnectionState('disconnected');
                        break;
                    default:
                        break;
                }
            };

            // --- Helper: drain buffered ICE candidates ---
            const drainIceCandidates = async () => {
                if (!pc.remoteDescription) return;
                while (iceCandidateBuffer.length > 0) {
                    const candidate = iceCandidateBuffer.shift();
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (e) {
                        console.error('[WebRTC] Error adding buffered ICE candidate:', e);
                    }
                }
            };

            // --- 3. Connect socket ---
            const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
            console.log('[WebRTC] Connecting socket to:', socketUrl);
            const socket = io(socketUrl, { path: '/socket.io' });
            socketRef.current = socket;

            const userId = userRef.current?._id || userRef.current?.id;
            console.log('[WebRTC] My userId:', userId, 'Room:', roomId);

            // --- When another user joins the room, WE create the offer ---
            socket.on('user-connected', async (remoteUserId) => {
                console.log('[WebRTC] Remote user joined:', remoteUserId, '— creating offer');

                // Set ICE candidate handler targeting the remote user
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log('[WebRTC] Sending ICE candidate to:', remoteUserId);
                        socket.emit('ice-candidate', {
                            target: remoteUserId,
                            candidate: event.candidate
                        });
                    }
                };

                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    console.log('[WebRTC] Offer created and sent to:', remoteUserId);
                    socket.emit('offer', {
                        target: remoteUserId,
                        caller: userId,
                        sdp: offer
                    });
                } catch (err) {
                    console.error('[WebRTC] Error creating offer:', err);
                }
            });

            // --- Handle incoming offer ---
            socket.on('offer', async (payload) => {
                console.log('[WebRTC] Offer received from:', payload.caller);

                // Set ICE candidate handler targeting the caller
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log('[WebRTC] Sending ICE candidate to:', payload.caller);
                        socket.emit('ice-candidate', {
                            target: payload.caller,
                            candidate: event.candidate
                        });
                    }
                };

                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
                    await drainIceCandidates();

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    console.log('[WebRTC] Answer created and sent to:', payload.caller);
                    socket.emit('answer', {
                        target: payload.caller,
                        caller: userId,
                        sdp: answer
                    });
                } catch (err) {
                    console.error('[WebRTC] Error handling offer:', err);
                }
            });

            // --- Handle incoming answer ---
            socket.on('answer', async (payload) => {
                console.log('[WebRTC] Answer received from:', payload.caller);
                try {
                    await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
                    await drainIceCandidates();
                } catch (err) {
                    console.error('[WebRTC] Error handling answer:', err);
                }
            });

            // --- Handle incoming ICE candidate ---
            socket.on('ice-candidate', async (candidate) => {
                console.log('[WebRTC] ICE candidate received');
                if (!pc.remoteDescription) {
                    iceCandidateBuffer.push(candidate);
                    return;
                }
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error('[WebRTC] Error adding ICE candidate:', e);
                }
            });

            // --- Handle remote user disconnect ---
            socket.on('user-disconnected', () => {
                console.log('[WebRTC] Remote user disconnected');
                setHasRemote(false);
                setConnectionState('disconnected');
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = null;
                }
            });

            // --- 4. Join the room AFTER everything is set up ---
            console.log('[WebRTC] Joining room:', roomId, 'as user:', userId);
            socket.emit('join-room', roomId, userId);
        };

        init();

        // --- Cleanup ---
        return () => {
            mounted = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(t => t.stop());
                localStreamRef.current = null;
            }
        };
    }, [roomId]);

    const toggleMic = () => {
        const stream = localStreamRef.current;
        if (!stream) return;
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMicOn(audioTrack.enabled);
        }
    };

    const toggleCam = () => {
        const stream = localStreamRef.current;
        if (!stream) return;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setCamOn(videoTrack.enabled);
        }
    };

    const leaveRoom = () => {
        if (socketRef.current) socketRef.current.disconnect();
        if (peerConnectionRef.current) peerConnectionRef.current.close();
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
        }
        navigate('/appointments');
    };

    const connectionChip = {
        connecting: { label: 'Connecting...', color: '#f59e0b', icon: <SignalCellularConnectedNoInternet0Bar sx={{ fontSize: 14 }} /> },
        connected: { label: 'Connected', color: '#10b981', icon: <SignalCellularAlt sx={{ fontSize: 14 }} /> },
        reconnecting: { label: 'Reconnecting...', color: '#f59e0b', icon: <SignalCellularConnectedNoInternet0Bar sx={{ fontSize: 14 }} /> },
        failed: { label: 'Connection failed', color: '#ef4444', icon: <SignalCellularConnectedNoInternet0Bar sx={{ fontSize: 14 }} /> },
        disconnected: { label: 'Participant left', color: '#94a3b8', icon: <SignalCellularConnectedNoInternet0Bar sx={{ fontSize: 14 }} /> },
    };

    const chip = connectionChip[connectionState] || connectionChip.connecting;

    // Error state
    if (mediaError) {
        return (
            <Box sx={{
                height: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                bgcolor: '#111', color: 'white', gap: 2, p: 3, textAlign: 'center'
            }}>
                <VideocamOff sx={{ fontSize: 64, color: '#ef4444' }} />
                <Typography variant="h6">{mediaError}</Typography>
                <IconButton onClick={() => navigate('/appointments')}
                    sx={{ bgcolor: '#ef4444', color: 'white', px: 4, borderRadius: 2, '&:hover': { bgcolor: '#dc2626' } }}>
                    <Typography fontWeight={600}>Go Back</Typography>
                </IconButton>
            </Box>
        );
    }

    return (
        <Box sx={{
            height: '100vh', width: '100vw', bgcolor: '#0f0f0f',
            display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
        }}>
            {/* Top bar */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 3, py: 1.5, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)'
            }}>
                <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>
                    MannSparsh · Video Session
                </Typography>
                <Chip
                    icon={chip.icon}
                    label={chip.label}
                    size="small"
                    sx={{
                        bgcolor: chip.color + '20', color: chip.color,
                        fontWeight: 600, fontSize: '0.75rem',
                        '& .MuiChip-icon': { color: chip.color }
                    }}
                />
            </Box>

            {/* Main video area */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {/* Remote video (large) */}
                {hasRemote ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        onLoadedMetadata={(e) => {
                            e.target.play().catch(err => console.error("Video play error:", err));
                        }}
                        style={{
                            width: '100%', height: '100%', objectFit: 'contain',
                            background: '#0f0f0f'
                        }}
                    />
                ) : (
                    <Box sx={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: 2
                    }}>
                        <Avatar sx={{
                            width: 96, height: 96, bgcolor: '#1e293b',
                            fontSize: '2.5rem', color: '#64748b'
                        }}>
                            <Person sx={{ fontSize: 48 }} />
                        </Avatar>
                        <Typography sx={{ color: '#94a3b8', fontSize: '1rem' }}>
                            Waiting for the other participant to join...
                        </Typography>
                    </Box>
                )}

                {/* Remote name label */}
                {hasRemote && (
                    <Fade in>
                        <Typography sx={{
                            position: 'absolute', bottom: 100, left: 24,
                            color: 'white', bgcolor: 'rgba(0,0,0,0.5)',
                            px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.8rem'
                        }}>
                            Remote Participant
                        </Typography>
                    </Fade>
                )}

                {/* Local video (PIP overlay) */}
                <Box sx={{
                    position: 'absolute', bottom: 100, right: 24,
                    width: { xs: 120, sm: 180, md: 240 },
                    aspectRatio: '4/3',
                    borderRadius: 2, overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.15)',
                    bgcolor: '#1a1a2e',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                    {camOn ? (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                        />
                    ) : (
                        <Box sx={{
                            width: '100%', height: '100%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', bgcolor: '#1e293b'
                        }}>
                            <Avatar sx={{ width: 48, height: 48, bgcolor: '#334155', color: '#94a3b8' }}>
                                {user?.name?.[0]?.toUpperCase() || 'Y'}
                            </Avatar>
                        </Box>
                    )}
                    <Typography sx={{
                        position: 'absolute', bottom: 6, left: 8,
                        color: 'white', fontSize: '0.7rem',
                        bgcolor: 'rgba(0,0,0,0.5)', px: 1, py: 0.25, borderRadius: 0.5
                    }}>
                        You
                    </Typography>
                </Box>
                {/* Hidden video element for when cam is off (keeps stream reference) */}
                {!camOn && (
                    <video ref={localVideoRef} autoPlay muted playsInline
                        style={{ display: 'none' }} />
                )}
            </Box>

            {/* Bottom control bar */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: { xs: 2, sm: 3 },
                py: 2, px: 3,
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
                pt: 6
            }}>
                {/* Mic toggle */}
                <IconButton
                    onClick={toggleMic}
                    sx={{
                        width: 52, height: 52,
                        bgcolor: micOn ? 'rgba(255,255,255,0.12)' : '#ef4444',
                        color: 'white',
                        '&:hover': { bgcolor: micOn ? 'rgba(255,255,255,0.2)' : '#dc2626' },
                        transition: 'all 0.2s'
                    }}
                >
                    {micOn ? <Mic /> : <MicOff />}
                </IconButton>

                {/* Camera toggle */}
                <IconButton
                    onClick={toggleCam}
                    sx={{
                        width: 52, height: 52,
                        bgcolor: camOn ? 'rgba(255,255,255,0.12)' : '#ef4444',
                        color: 'white',
                        '&:hover': { bgcolor: camOn ? 'rgba(255,255,255,0.2)' : '#dc2626' },
                        transition: 'all 0.2s'
                    }}
                >
                    {camOn ? <Videocam /> : <VideocamOff />}
                </IconButton>

                {/* End call */}
                <IconButton
                    onClick={leaveRoom}
                    sx={{
                        width: 64, height: 52, borderRadius: '28px',
                        bgcolor: '#ef4444', color: 'white',
                        '&:hover': { bgcolor: '#dc2626', transform: 'scale(1.05)' },
                        transition: 'all 0.2s'
                    }}
                >
                    <CallEnd />
                </IconButton>
            </Box>
        </Box>
    );
};

export default VideoRoom;
