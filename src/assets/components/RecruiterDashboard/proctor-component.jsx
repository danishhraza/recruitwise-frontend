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
function ProctoringVideo({ videoLink, onJumpToTimestamp }) {
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
            url={videoLink}
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
function IncidentButton({ timestamp, onClick }) {
  // Convert timestamp (in seconds) to MM:SS format for display
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  const handleClick = () => {
    console.log("IncidentButton - handleClick called for timestamp:", timestamp)
    if (onClick) {
      console.log("IncidentButton - onClick exists, calling it")
      onClick(timestamp)
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
            {formatTime(timestamp)}
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
export function ProctoringResults({ proctoringResults, videoLink }) {
  // Function to jump to timestamp, will be set by the video component
  // Using a ref instead of state to ensure it's available immediately and persists across renders
  const jumpToTimestampRef = useRef(null)
  
  const setJumpToTimestamp = (callback) => {
    console.log("ProctoringResults - setJumpToTimestamp called with a callback function")
    jumpToTimestampRef.current = callback
  }
  
  console.log("ProctoringResults - Component rendering, jumpToTimestampRef.current is:", jumpToTimestampRef.current ? "function" : "null")

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

  // Add debugging to see what we're receiving
  console.log("ProctoringResults - proctoringResults:", proctoringResults)
  console.log("ProctoringResults - type:", typeof proctoringResults)
  console.log("ProctoringResults - isArray:", Array.isArray(proctoringResults))

  // Process proctoring results to group by incident type
  // Ensure proctoringResults is an array before processing
  const processedResults = (Array.isArray(proctoringResults) ? proctoringResults : []).reduce((acc, result) => {
    const incidentType = result.incident
    if (!acc[incidentType]) {
      acc[incidentType] = []
    }
    // Add all timestamps for this incident type
    result.timestamps?.forEach(timestamp => {
      acc[incidentType].push(timestamp)
    })
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <ProctoringVideo 
        videoLink={videoLink} 
        onJumpToTimestamp={setJumpToTimestamp} 
      />
      
      <Card className="p-6 bg-primary-foreground">
        <h3 className="text-lg font-medium mb-4">Proctoring Results</h3>
        <div className="space-y-6">
          
          {/* Render each incident type dynamically */}
          {Object.entries(processedResults).map(([incidentType, timestamps]) => {
            // Determine badge color based on incident type
            const getBadgeColor = (incident) => {
              switch (incident.toLowerCase()) {
                case 'person absent from frame':
                  return 'bg-red-500/10 text-red-500'
                case 'looking away violation':
                  return 'bg-amber-500/10 text-amber-500'
                case 'cell phone detected':
                  return 'bg-orange-500/10 text-orange-500'
                default:
                  return 'bg-gray-500/10 text-gray-500'
              }
            }

            // Calculate progress value based on number of incidents (you can adjust this logic)
            const progressValue = Math.min((timestamps.length / 10) * 100, 100)

            return (
              <div key={incidentType}>
                <div className="flex justify-between mb-2">
                  <span className="capitalize">{incidentType}</span>
                  <Badge variant="outline" className={getBadgeColor(incidentType)}>
                    {timestamps.length} incidents
                  </Badge>
                </div>
                <Progress value={progressValue} className="h-2 bg-muted" />
                <div className="flex flex-wrap mt-2">
                  <span className="text-sm text-muted-foreground">Timestamps:</span>
                  {timestamps.slice(0, 20).map((timestamp, index) => (
                    <IncidentButton 
                      key={`${incidentType}-${index}`}
                      timestamp={timestamp} 
                      onClick={handleJumpToTimestamp} 
                    />
                  ))}
                  {timestamps.length > 20 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      +{timestamps.length - 20} more incidents
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {/* Show message if no proctoring results */}
          {Object.keys(processedResults).length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No proctoring incidents detected.
            </div>
          )}
        
        </div>
      </Card>
    </div>
  )
}