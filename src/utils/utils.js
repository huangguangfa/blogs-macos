export function getUserMedia(gotStream,noStream){
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia; 
    return navigator.getUserMedia({
        video: true
    }, gotStream, noStream);
}