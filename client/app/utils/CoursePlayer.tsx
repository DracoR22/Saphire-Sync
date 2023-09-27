'use client'

import { useEffect, useState } from "react"
import axios from 'axios'

interface Props {
    videoUrl: string
    title: string
}

const CoursePlayer = ({videoUrl, title}: Props) => {

  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: ""
  })

  useEffect(() => {
    axios.post(`https://saphire-sync.onrender.com/api/v1/getVdoCipherOTP`, {
      videoId: videoUrl,
    })
    .then((res) => {
      setVideoData(res.data);
    });
  }, [videoUrl])

    return (
        <div style={{position:"relative",paddingTop:"56.25%",overflow:"hidden"}}>
        {videoData.otp && videoData.playbackInfo !== "" && (
          <iframe
          // URL OF THE PLAYER ID
            src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=MJQp3URBw4M5MW47`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "90%",
              height: "90%",
              border: 0
            }}
            allowFullScreen={true}
            allow="encrypted-media"
          ></iframe>
        )}
      </div>
    )
}

export default CoursePlayer
