import {
    Card,
    Typography,
    IconButton,
    Tooltip,
  } from "@material-tailwind/react";
  import { X, Facebook, Instagram } from "iconoir-react";
  
  export default function UserProfileCard() {
    return (
      <Card className="max-w-xs bg-black border-slate-700 text-white">
        <Card.Header
          as="img"
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&fit=crop&w=800&q=80"
          alt="profile-picture"
        />
        <Card.Body className="text-center">
          <Typography type="h5">Andrew Alexa</Typography>
          <Typography className="my-1">
            CEO & Co-Founder
          </Typography>
        </Card.Body>
        <Card.Footer className="flex items-center justify-center gap-1">
          <Tooltip>
            <Tooltip.Trigger as={IconButton} size="sm" variant="ghost">
              <X className="h-3.5 w-3.5" color="white" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              Follow
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger as={IconButton} size="sm" variant="ghost">
              <Facebook className="h-4 w-4" color="white" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              Like
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <Tooltip.Trigger as={IconButton} size="sm" variant="ghost">
              <Instagram className="h-4 w-4" color="white"/>
            </Tooltip.Trigger>
            <Tooltip.Content>
              Follow
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip>
        </Card.Footer>
      </Card>
    );
  }
  