// Canonical skill content shared by the desktop and compact portfolio layouts.

import cIcon from "../assets/icons/programming/c.svg";
import pythonIcon from "../assets/icons/programming/python.svg";
import javascriptIcon from "../assets/icons/programming/javascript.svg";
import htmlIcon from "../assets/icons/web/html5.svg";
import cssIcon from "../assets/icons/web/css3.svg";
import gitIcon from "../assets/icons/development/git.svg";
import githubIcon from "../assets/icons/development/github.svg";
import vscodeIcon from "../assets/icons/development/vscode.svg";
import scapyIcon from "../assets/icons/cybersecurity/scapy.svg";
import suricataIcon from "../assets/icons/cybersecurity/suricata.svg";
import nmapIcon from "../assets/icons/cybersecurity/nmap.svg";
import sqliteIcon from "../assets/icons/database/sqlite.svg";
import mysqlIcon from "../assets/icons/database/MySQL.svg";
import flaskIcon from "../assets/icons/frameworks/flask.svg";
import flStudioIcon from "../assets/icons/creativity/fl_studio.svg";
import adobeExpressIcon from "../assets/icons/creativity/adobe_express.svg";
import microsoftClipchampIcon from "../assets/icons/creativity/microsoft_clipchamp.svg";

const skillGroups = [
    {
        id: "programming",
        title: "Programming",
        skills: [
            { name: "C", icon: cIcon },
            { name: "Python", icon: pythonIcon },
            { name: "JavaScript", icon: javascriptIcon },
        ],
    },
    {
        id: "web",
        title: "Web Development",
        skills: [
            { name: "HTML5", icon: htmlIcon },
            { name: "CSS3", icon: cssIcon },
            { name: "JavaScript", icon: javascriptIcon },
        ],
    },
    {
        id: "cybersecurity",
        title: "Cybersecurity",
        skills: [
            { name: "Scapy", icon: scapyIcon },
            { name: "Suricata", icon: suricataIcon },
            { name: "Nmap", icon: nmapIcon },
        ],
    },
    {
        id: "development-tools",
        title: "Development Tools",
        skills: [
            { name: "Git", icon: gitIcon },
            { name: "GitHub", icon: githubIcon },
            { name: "Visual Studio Code", icon: vscodeIcon },
        ],
    },
    {
        id: "database-framework",
        title: "Database / Framework",
        skills: [
            { name: "SQLite", icon: sqliteIcon },
            { name: "Flask", icon: flaskIcon },
            { name: "MySQL", icon: mysqlIcon },
        ],
    },
    {
        id: "creativity",
        title: "Creativity",
        skills: [
            { name: "FL Studio", icon: flStudioIcon },
            { name: "Adobe Express", icon: adobeExpressIcon },
            { name: "Microsoft Clipchamp", icon: microsoftClipchampIcon },
        ],
    },
];

export default { skillGroups };
