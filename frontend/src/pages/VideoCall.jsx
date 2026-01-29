import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VideoCall = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const jitsiContainerRef = useRef(null);
    const jitsiApiRef = useRef(null);

    const roomName = searchParams.get('room');
    const userName = JSON.parse(sessionStorage.getItem('user'))?.name || 'Guest';

    useEffect(() => {
        if (!roomName) {
            alert('Invalid meeting room');
            navigate(-1);
            return;
        }

        // Load Jitsi Meet API
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => initializeJitsi();
        document.body.appendChild(script);

        return () => {
            if (jitsiApiRef.current) {
                jitsiApiRef.current.dispose();
            }
            document.body.removeChild(script);
        };
    }, [roomName, navigate]);

    const initializeJitsi = () => {
        if (!window.JitsiMeetExternalAPI) return;

        const domain = 'meet.jit.si';
        const options = {
            roomName: roomName,
            width: '100%',
            height: '100%',
            parentNode: jitsiContainerRef.current,
            userInfo: {
                displayName: userName
            },
            configOverwrite: {
                startWithAudioMuted: true,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
                disableDeepLinking: true
            },
            interfaceConfigOverwrite: {
                SHOW_JITSI_WATERMARK: false,
                SHOW_WATERMARK_FOR_GUESTS: false,
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                    'tileview', 'download', 'help', 'mute-everyone'
                ]
            }
        };

        jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        jitsiApiRef.current.addEventListener('readyToClose', () => {
            navigate(-1);
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-900">
            <div className="h-full w-full" ref={jitsiContainerRef}></div>
        </div>
    );
};

export default VideoCall;
