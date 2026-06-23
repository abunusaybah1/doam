import BadRoad from "@/public/images/bad-road.png";
import Floor from "@/public/images/floor.png";
import Darkness from "@/public/images/darkness.png";
import Water from "@/public/images/water.png";


export const latestReports = [
  {
    // tag: "Infrastructure",
    text: "Broken streetlights on Lagos-Abeokuta Expressway for 4 months",
    loc: "Agege, Lagos",
    duration: "2 hrs ago",
  },
  {
    // tag: "Water",
    text: "Community borehole non-functional since January",
    loc: "Kuje, Abuja",
    duration: "5 hrs ago",
  },
  {
    // tag: "Waste",
    text: "Refuse dump blocking school gate for weeks",
    loc: "Enugu North",
    duration: "1 day ago",
  },
];

export const stats = [
  { label: "Problems filed", num: "1,204" },
  { label: "In progress", num: "38" },
  { label: "Resolved", num: "91" },
];

export const sampleProblems = [
  {
    id: "01",
    location: "Anambra State",
    title: "Roads that swallow people whole",
    desc: "Potholes the size of craters. Cars disappearing into mud. People dying on routes that should have been fixed years ago. This is not an accident — it is abandonment.",
    img: BadRoad,
    endorsement: 312,
    status: "CRITICAL",
  },
  {
    id: "02",
    location: "Abuja, FCT",
    title: "Children learning on bare concrete floors",
    desc: "No desks. No chairs. 60 pupils in a room built for 20. Teachers doing their best in conditions that say clearly — nobody is paying attention.",
    img: Floor,
    endorsement: 198,
    status: "URGENT",
  },
  {
    id: "03",
    location: "Kano State",
    title: "4km for a bucket of water, every single day",
    desc: "Women and children walk hours before sunrise just to get water that is barely clean. There is no excuse for this in 2026. None.",
    img: Water,
    endorsement: 445,
    status: "CRITICAL",
  },
  {
    id: "04",
    location: "Lagos State",
    title: "Darkness as a way of life",
    desc: "Generators running 20 hours a day. Businesses folding. Students reading by candlelight. NEPA has been a punchline for 40 years. It shouldn't still be funny.",
    img: Darkness,
    endorsement: 527,
    status: "ONGOING",
  },
];
