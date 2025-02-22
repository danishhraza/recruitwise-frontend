import * as React from "react";
import {
  Card,
  List,
  Chip,
} from "@material-tailwind/react";
import {
  User,
  Settings,
} from "iconoir-react";
import { BriefcaseBusiness } from "lucide-react";
import { CustomerServiceFilled } from "@ant-design/icons";
import Profile from "./Profile";
import Support from "./Support";
import SettingsTab from "./SettingsTab";
import UserSidebar from "./UserSidebar";

const Links = [
  {
    icon: User,
    title: "Profile",
    param: "",
    component:<Profile/>
  },
  {
    icon: Settings,
    title: "Settings",
    param: "settings",
    component:<SettingsTab/>
  },
  {
    icon: CustomerServiceFilled,
    title: "Help & Support",
    param: "support",
    component:<Support/>
  },
];

export default function MultiLevelSidebar({currentTab,setCurrentTab,currentComponent,setCurrentComponent}) {

  return (
    <Card className="hidden lg:inline-block max-w-[280px] h-screen bg-black border-slate-700 text-white">
      <Card.Header className="mx-4 mb-0 mt-3 h-max">
        <img src="/images/logo2-white.webp" alt="logo" className="w-[220px]"/>
      </Card.Header>
      <Card.Body className="p-3">
        <List>
          {Links.map(({ icon: Icon, title, param,component, badge }) => (
            <List.Item key={title} onClick={()=>{setCurrentTab(title); setCurrentComponent(component);console.log(component)}} className={`text-white hover:bg-slate-700 hover:text-white ${currentTab == title && 'bg-slate-700'}`}>
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
          <hr className="-mx-3 my-3 border-secondary border-slate-800" />
        </List>
        <UserSidebar setCurrentTab={setCurrentTab} currentTab={currentTab} setCurrentComponent={setCurrentComponent}/>
      </Card.Body>
    </Card>
  );
}
