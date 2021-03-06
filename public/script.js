const socket=io('/');


const videoGrid =document.getElementById('video-grid');
const myVideo =document.createElement('video');
myVideo.muted=true;

const myPeer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
})

myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })

    socket.on('user-connected',(userId)=>{
        connecToNewUser(userId,stream);
    })
    let text = $('input')

    $('html').keydown((e)=>{
        if(e.which==13 && text.val().length != 0){
            socket.emit('message',text.val());
            text.val('');
        }
    })
    
    socket.on('createMessage',message=>{
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToBottom();
    })
})
socket.emit('join-room',ROOM_ID);


const connecToNewUser=(userId,stream)=>{
    const call =myPeer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
}

const addVideoStream = (video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videoGrid.append(video);
}
const scrollToBottom = ()=>{
    let d=$('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));

}

const muteUnmute =() =>{
    const enabled= myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled =true;
    }
}

const  setMuteButton=()=>{
    const html=`
    <i class="mute fas fa-microphone"></i>
    <span>Mute</span>  
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}
const  setUnmuteButton=()=>{
    const html=`
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>  
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}
const playstop=()=>{
    let enabled=myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled=false;
        setPlayvideo();
    }
    else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
    }
}
const setPlayvideo=()=>{
    const html=`
    <i class="play fas fa-video-slash"></i>
    <span>Play Video</span>  
    `
    document.querySelector('.main_video_button').innerHTML=html;
}
const setStopVideo=()=>{
    const html=`
    <i class="stop fas fa-video"></i>
    <span>Stop Video</span>  
    `
    document.querySelector('.main_video_button').innerHTML=html;
}