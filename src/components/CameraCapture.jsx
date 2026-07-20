import React, { useRef, useState, useEffect } from "react";
import {
    FaCamera,
    FaRedo,
    FaCheck,
    FaTimes
} from "react-icons/fa";

import "./CameraCapture.css";

export default function CameraCapture({
    title,
    description,
    onCapture
}) {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        return () => stopCamera();
    }, []);

    async function startCamera() {

        try{

            const media =
                await navigator.mediaDevices.getUserMedia({
                    video:{
                        facingMode:"user"
                    }
                });

            setStream(media);

            videoRef.current.srcObject = media;

        }catch{

            alert("Não foi possível acessar a câmera.");

        }

    }

    function stopCamera(){

        if(stream){

            stream.getTracks().forEach(track=>track.stop());

        }

    }

    function capture(){

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(video,0,0);

        const image = canvas.toDataURL("image/png");

        setPhoto(image);

        stopCamera();

        onCapture(image);

    }

    function retake(){

        setPhoto(null);

        startCamera();

    }

    return(

        <div className="camera-card">

            <h3>{title}</h3>

            <p>{description}</p>

            {!stream && !photo && (

                <button
                    className="camera-btn"
                    onClick={startCamera}
                >
                    <FaCamera/>

                    Abrir câmera

                </button>

            )}

            {stream && (

                <>

                    <div className="camera-preview">

                        <video
                            autoPlay
                            playsInline
                            ref={videoRef}
                        />

                    </div>

                    <button
                        className="capture-btn"
                        onClick={capture}
                    >
                        <FaCamera/>

                        Capturar

                    </button>

                </>

            )}

            {photo && (

                <>

                    <img
                        src={photo}
                        alt=""
                        className="captured-photo"
                    />

                    <div className="camera-actions">

                        <button
                            onClick={retake}
                        >
                            <FaRedo/>

                            Tirar novamente

                        </button>

                        <button
                            className="success"
                        >
                            <FaCheck/>

                            Confirmar

                        </button>

                    </div>

                </>

            )}

            <canvas
                ref={canvasRef}
                hidden
            />

        </div>

    );

}