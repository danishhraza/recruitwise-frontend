import { useState, useRef, useEffect } from "react"
import ReactPlayer from "react-player"
import { Badge } from "../../../components/ui/badge"
import { Progress } from "../../../components/ui/progress"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip"

// Video component that supports jumping to timestamps using ReactPlayer
function ProctoringVideo({ applicant, onJumpToTimestamp }) {
  const playerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(true)
  const [playedSeconds, setPlayedSeconds] = useState(0)
  const [duration, setDuration] = useState(0)

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Jump to a specific timestamp (in seconds)
  const jumpToTime = (seconds) => {
    console.log("ProctoringVideo - jumpToTime called with seconds:", seconds)
    if (playerRef.current) {
      console.log("ProctoringVideo - playerRef.current exists, calling seekTo")
      playerRef.current.seekTo(seconds)
      setPlaying(true)
    } else {
      console.log("ProctoringVideo - playerRef.current is null")
    }
  }

  // Register the jump callback with parent component immediately, not in an effect
  // This ensures the callback is available right away
  console.log("ProctoringVideo - Setting jumpToTime callback immediately")
  if (onJumpToTimestamp) {
    console.log("ProctoringVideo - Calling onJumpToTimestamp with jumpToTime")
    onJumpToTimestamp(jumpToTime)
  }

  const handleProgress = (state) => {
    setPlayedSeconds(state.playedSeconds)
  }

  return (
    <Card className="overflow-hidden bg-primary-foreground">
      <div className="relative">
        <div className="aspect-video">
          <ReactPlayer
            ref={playerRef}
            url="https://recruitwisebucket.s3.eu-north-1.amazonaws.com/webcam/WIN_20250516_23_35_59_Pro.mp4"
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            controls={true}
            playsinline={true}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onProgress={handleProgress}
            onDuration={setDuration}
            config={{
              file: {
                attributes: {
                  style: { width: '100%', height: '100%' }
                }
              }
            }}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            Watch full camera recording of the interview with proctoring data.
          </p>
          <p className="text-sm">{formatTime(playedSeconds)} / {formatTime(duration)}</p>
        </div>
      </div>
    </Card>
  )
}

// Incident button that can be clicked to jump to a specific timestamp
function IncidentButton({ time, onClick }) {
  // Convert time format like "00:45" to seconds
  const parseTimeToSeconds = (timeStr) => {
    console.log("IncidentButton - parseTimeToSeconds called with timeStr:", timeStr)
    const [minutes, seconds] = timeStr.split(':').map(Number)
    const totalSeconds = minutes * 60 + seconds
    console.log("IncidentButton - converted to totalSeconds:", totalSeconds)
    return totalSeconds
  }
  
  const handleClick = () => {
    console.log("IncidentButton - handleClick called for time:", time)
    const seconds = parseTimeToSeconds(time)
    console.log("IncidentButton - converted to seconds:", seconds)
    if (onClick) {
      console.log("IncidentButton - onClick exists, calling it")
      onClick(seconds)
    } else {
      console.log("IncidentButton - onClick is null or undefined")
    }
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 px-2 py-0 h-6 text-xs" 
            onClick={handleClick}
          >
            {time}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Jump to this incident</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Main proctoring component
export function ProctoringResults({ applicant }) {
  // Function to jump to timestamp, will be set by the video component
  // Using a ref instead of state to ensure it's available immediately and persists across renders
  const jumpToTimestampRef = useRef(null)
  
  const setJumpToTimestamp = (callback) => {
    console.log("ProctoringResults - setJumpToTimestamp called with a callback function")
    jumpToTimestampRef.current = callback
  }
  
  console.log("ProctoringResults - Component rendering, jumpToTimestampRef.current is:", jumpToTimestampRef.current ? "function" : "null")

  // Proctoring violation data
  const violations = {
    cellPhone: [
      { timestamp: "00:59" }
    ],
    lookingAway: [
      { timestamp: "00:37" },
      { timestamp: "00:46" },
      { timestamp: "00:52" },
    ]
  }
  
  // Ensure jumpToTimestamp is called properly
  const handleJumpToTimestamp = (seconds) => {
    console.log("ProctoringResults - handleJumpToTimestamp called with seconds:", seconds)
    if (jumpToTimestampRef.current) {
      console.log("ProctoringResults - jumpToTimestampRef.current exists, calling it")
      jumpToTimestampRef.current(seconds)
    } else {
      console.log("ProctoringResults - jumpToTimestampRef.current is null or undefined")
    }
  }

  return (
    <div className="space-y-6 ">
      <ProctoringVideo 
        applicant={applicant} 
        onJumpToTimestamp={setJumpToTimestamp} 
      />
      
      <Card className="p-6 bg-primary-foreground">
        <h3 className="text-lg font-medium mb-4">Proctoring Results</h3>
        <div className="space-y-6">
          {/* Identity Verification */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Identity Verification</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                Passed
              </Badge>
            </div>
            <Progress value={100} className="h-2 bg-muted" />
          </div>
          
          {/* Cell Phone Detection */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Cell Phone Detected</span>
              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                {violations.cellPhone.length} incidents
              </Badge>
            </div>
            <Progress value={70} className="h-2 bg-muted" />
            <div className="flex flex-wrap mt-2">
              <span className="text-sm text-muted-foreground">Timestamps:</span>
              {violations.cellPhone.map((incident, index) => (
                <IncidentButton 
                  key={index} 
                  time={incident.timestamp} 
                  onClick={handleJumpToTimestamp} 
                />
              ))}
            </div>
          </div>
          
          {/* Looking Away Violation */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Looking Away Violation</span>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                {violations.lookingAway.length} incidents
              </Badge>
            </div>
            <Progress value={60} className="h-2 bg-muted" />
            <div className="flex flex-wrap mt-2">
              <span className="text-sm text-muted-foreground">Timestamps:</span>
              {violations.lookingAway.map((incident, index) => (
                <IncidentButton 
                  key={index} 
                  time={incident.timestamp} 
                  onClick={handleJumpToTimestamp} 
                />
              ))}
            </div>
          </div>
          
          {/* Candidate Missing */}
          {/* <div>
            <div className="flex justify-between mb-2">
              <span>Candidate Missing From Camera</span>
              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                {violations.missing.length} incident
              </Badge>
            </div>
            <Progress value={85} className="h-2 bg-muted" />
            <div className="flex flex-wrap mt-2">
              <span className="text-sm text-muted-foreground">Timestamps:</span>
              {violations.missing.map((incident, index) => (
                <IncidentButton 
                  key={index} 
                  time={incident.timestamp} 
                  onClick={handleJumpToTimestamp} 
                />
              ))}
            </div>
          </div> */}
          
          {/* Browser Focus */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Browser Focus</span>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                Warning
              </Badge>
            </div>
            <Progress value={85} className="h-2 bg-muted" />
            <p className="text-sm text-muted-foreground mt-1">Browser focus lost for 15 seconds at 12:45</p>
          </div>
        </div>
      </Card>
    </div>
  )
}