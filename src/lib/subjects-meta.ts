// Auto-generated. Do not edit by hand.
export type TopicMeta = { id: string; name: string; count: number };
export type SubjectMeta = { id: string; name: string; description: string; topics: TopicMeta[] };
export const SUBJECTS: SubjectMeta[] = [
  {
    "id": "ictsm-theory",
    "name": "ICTSM Theory",
    "description": "ITI ICTSM 2nd Year",
    "topics": [
      {
        "id": "linux-operating-system",
        "name": "Linux operating system",
        "count": 18
      },
      {
        "id": "printer-and-scanner",
        "name": "Printer and Scanner",
        "count": 25
      },
      {
        "id": "monitor-and-sound-card",
        "name": "Monitor and Sound Card",
        "count": 25
      },
      {
        "id": "ups-and-modem",
        "name": "UPS and MODEM",
        "count": 50
      },
      {
        "id": "computer-update-and-troubleshoot",
        "name": "Computer Update and Troubleshoot",
        "count": 25
      },
      {
        "id": "tablet-smart-devices",
        "name": "Tablet  Smart devices",
        "count": 25
      },
      {
        "id": "internet-and-web-browser",
        "name": "Internet and Web Browser",
        "count": 15
      },
      {
        "id": "network-components",
        "name": "Network Components",
        "count": 25
      },
      {
        "id": "network-protocols",
        "name": "Network Protocols",
        "count": 50
      },
      {
        "id": "sharing-resources",
        "name": "Sharing Resources",
        "count": 5
      },
      {
        "id": "network-troubleshooting",
        "name": "Network Troubleshooting",
        "count": 25
      },
      {
        "id": "network-security",
        "name": "Network Security",
        "count": 15
      },
      {
        "id": "server-installation",
        "name": "Server Installation",
        "count": 20
      },
      {
        "id": "install-dns-and-rras",
        "name": "Install DNS and RRAS",
        "count": 25
      },
      {
        "id": "windows-linux-server-configuration",
        "name": "Windows & Linux Server Configuration",
        "count": 25
      }
    ]
  },
  {
    "id": "employability-skills",
    "name": "Employability Skills",
    "description": "2nd Year",
    "topics": [
      {
        "id": "basic-career-skills",
        "name": "Basic Career Skills",
        "count": 67
      },
      {
        "id": "future-work-skills",
        "name": "Future Work Skills",
        "count": 51
      },
      {
        "id": "internet-skills",
        "name": "Internet Skills",
        "count": 50
      },
      {
        "id": "professional-skills",
        "name": "Professional Skills",
        "count": 59
      },
      {
        "id": "entrepreneurial-skills",
        "name": "Entrepreneurial Skills",
        "count": 38
      }
    ]
  }
];
export const getSubjectMeta=(id:string)=>SUBJECTS.find(s=>s.id===id);
