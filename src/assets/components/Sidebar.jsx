import * as React from "react";
import {
  Card,
  List,
  Typography,
  Chip,
  Collapse,
} from "@material-tailwind/react";
import {
  Archive,
  EmptyPage,
  Folder,
  Mail,
  MoreHorizCircle,
  NavArrowRight,
  Pin,
  SendDiagonal,
  Bin,
  UserXmark,
} from "iconoir-react";

const Links = [
  {
    icon: Mail,
    title: "Inbox",
    href: "#",
    badge: 14,
  },
  {
    icon: SendDiagonal,
    title: "Sent",
    href: "#",
  },
  {
    icon: EmptyPage,
    title: "Drafts",
    href: "#",
  },
  {
    icon: Pin,
    title: "Pins",
    href: "#",
  },
  {
    icon: Archive,
    title: "Archive",
    href: "#",
  },
  {
    icon: Bin,
    title: "Trash",
    href: "#",
  },
];

export default function MultiLevelSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="hidden lg:inline-block max-w-[280px] h-screen bg-black border-slate-700 text-white">
      <Card.Header className="mx-4 mb-0 mt-3 h-max">
        <img src="/images/logo2-white.webp" alt="logo" className="w-[220px]"/>
      </Card.Header>
      <Card.Body className="p-3">
        <List>
          {Links.map(({ icon: Icon, title, href, badge }) => (
            <List.Item key={title} href={href} className="text-white">
              <List.ItemStart>
                <Icon className="h-[18px] w-[18px]" />
              </List.ItemStart>
              {title}
              {badge && (
                <List.ItemEnd>
                  <Chip size="sm" variant="ghost">
                    <Chip.Label>{badge}</Chip.Label>
                  </Chip>
                </List.ItemEnd>
              )}
            </List.Item>
          ))}
          <List.Item onClick={() => setIsOpen((cur) => !cur)} className={`text-white ${isOpen && "bg-slate-700"} hover:bg-slate-700 hover:text-white`}>
            <List.ItemStart>
              <MoreHorizCircle className="h-[18px] w-[18px] " />
            </List.ItemStart>
            More
            <List.ItemEnd>
              <NavArrowRight
                className={`h-4 w-4 ${isOpen ? "rotate-90" : ""}`}
              />
            </List.ItemEnd>
          </List.Item>
          <Collapse open={isOpen}>
            <List>
              <List.Item className="text-white">
                <List.ItemStart>
                  <Folder className="h-[18px] w-[18px]" />
                </List.ItemStart>
                Spam
              </List.Item>
              <List.Item className="text-white">
                <List.ItemStart>
                  <Folder className="h-[18px] w-[18px]" />
                </List.ItemStart>
                Spam
              </List.Item>
              <List.Item className="text-white">
                <List.ItemStart>
                  <Folder className="h-[18px] w-[18px]" />
                </List.ItemStart>
                Spam
              </List.Item>
            </List>
          </Collapse>
        </List>
      </Card.Body>
    </Card>
  );
}
