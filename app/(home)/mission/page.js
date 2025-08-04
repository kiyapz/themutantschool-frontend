"use client";
import DropDown from "@/components/Dropdown";
import { FaSearch } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 9;

export default function Mission() {
  const [clickedButtons, setClickedButtons] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const options = [
    { label: "Design", value: "Design" },
    { label: "Code", value: "Code" },
    { label: "Growth Hacking", value: "Growth Hacking" },
  ];

  const optionsintencity = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Expert", value: "Expert" },
  ];

  const [powerDiscipline, setPowerDiscipline] = useState("");
  const [mutationIntensity2, setMutationIntensity2] = useState([]);
  const [mutationIntensity3, setMutationIntensity3] = useState([]);
  const [mutationIntensity4, setMutationIntensity4] = useState("");
  const [mutationIntensity5, setMutationIntensity5] = useState("");

  const optionss = [
    { label: "Telepathy", value: "telepathy" },
    { label: "Telekinesis", value: "telekinesis" },
    { label: "Shape Shifting", value: "shapeshifting" },
    { label: "Super Strength", value: "superstrength" },
  ];

  const optionsIntensity = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Expert", value: "Expert" },
  ];

  const optionsIntensity2 = [
    { label: "0hr - 2hrs", value: "0hr - 2hrs" },
    { label: "3hrs - 5hrs", value: "3hrs - 5hrs" },
    { label: "5hrs - 10hrs", value: "5hrs - 10hrs" },
    { label: "11hrs - more", value: "11hrs - more" },
  ];

  const optionsIntensity3 = [
    { label: "Free", value: "Free" },
    { label: "$1 - $100", value: "$1 - $100" },
    { label: "$101 - $400", value: "$101 - $400" },
  ];

  const optionsIntensity4 = [
    { label: "3.0 < ", value: "3.0 < " },
    { label: "3.5 <", value: "3.5 <" },
    { label: "4.0 <", value: "4.0 <" },
    { label: "4.5 <", value: "4.5 <" },
  ];

  const course = [
    {
      id: "course_001",
      courseName: "Complete Web Development Bootcamp",
      rating: 4.8,
      price: 89.99,
      time: "42 hours",
      category: "Code",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250",
    },
    {
      id: "course_002",
      courseName: "Python for Data Science",
      rating: 4.6,
      price: 79.99,
      time: "35 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250",
    },
    {
      id: "course_003",
      courseName: "Digital Marketing Masterclass",
      rating: 4.7,
      price: 64.99,
      time: "28 hours",
      category: "Growth Hacking",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250",
    },
    {
      id: "course_004",
      courseName: "React.js Complete Guide",
      rating: 4.9,
      price: 94.99,
      time: "38 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250",
    },
    {
      id: "course_005",
      courseName: "Machine Learning A-Z",
      rating: 4.5,
      price: 109.99,
      time: "55 hours",
      category: "Code",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$101 - $400",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250",
    },
    {
      id: "course_006",
      courseName: "Graphic Design Fundamentals",
      rating: 4.4,
      price: 49.99,
      time: "22 hours",
      category: "Design",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250",
    },
    {
      id: "course_007",
      courseName: "Node.js Backend Development",
      rating: 4.7,
      price: 74.99,
      time: "31 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250",
    },
    {
      id: "course_008",
      courseName: "iOS App Development with Swift",
      rating: 4.6,
      price: 99.99,
      time: "45 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250",
    },
    {
      id: "course_009",
      courseName: "SQL Database Mastery",
      rating: 4.8,
      price: 59.99,
      time: "26 hours",
      category: "Code",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250",
    },
    {
      id: "course_010",
      courseName: "Adobe Photoshop Complete Course",
      rating: 4.5,
      price: 69.99,
      time: "33 hours",
      category: "Design",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=250",
    },
    {
      id: "course_011",
      courseName: "Cloud Computing with AWS",
      rating: 4.7,
      price: 119.99,
      time: "48 hours",
      category: "Code",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$101 - $400",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250",
    },
    {
      id: "course_012",
      courseName: "Unity Game Development",
      rating: 4.6,
      price: 84.99,
      time: "40 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250",
    },
    {
      id: "course_013",
      courseName: "Excel for Business Analytics",
      rating: 4.3,
      price: 39.99,
      time: "18 hours",
      category: "Growth Hacking",
      level: "Beginner",
      duration: "5hrs - 10hrs",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250",
    },
    {
      id: "course_014",
      courseName: "Cybersecurity Fundamentals",
      rating: 4.8,
      price: 89.99,
      time: "36 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250",
    },
    {
      id: "course_015",
      courseName: "JavaScript ES6+ Complete Guide",
      rating: 4.9,
      price: 79.99,
      time: "34 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250",
    },
    {
      id: "course_016",
      courseName: "Video Editing with Premiere Pro",
      rating: 4.4,
      price: 74.99,
      time: "29 hours",
      category: "Design",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=250",
    },
    {
      id: "course_017",
      courseName: "Angular Complete Developer Course",
      rating: 4.6,
      price: 94.99,
      time: "41 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250",
    },
    {
      id: "course_018",
      courseName: "Docker and Kubernetes Mastery",
      rating: 4.7,
      price: 104.99,
      time: "37 hours",
      category: "Code",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$101 - $400",
      image:
        "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=250",
    },
    {
      id: "course_019",
      courseName: "UI/UX Design Principles",
      rating: 4.5,
      price: 69.99,
      time: "25 hours",
      category: "Design",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250",
    },
    {
      id: "course_020",
      courseName: "Blockchain Development",
      rating: 4.3,
      price: 129.99,
      time: "52 hours",
      category: "Code",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$101 - $400",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250",
    },
    {
      id: "course_021",
      courseName: "WordPress Theme Development",
      rating: 4.4,
      price: 54.99,
      time: "24 hours",
      category: "Code",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=250",
    },
    {
      id: "course_022",
      courseName: "Data Visualization with Tableau",
      rating: 4.6,
      price: 89.99,
      time: "32 hours",
      category: "Growth Hacking",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250",
    },
    {
      id: "course_023",
      courseName: "Android App Development",
      rating: 4.5,
      price: 94.99,
      time: "43 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&h=250",
    },
    {
      id: "course_024",
      courseName: "SEO Optimization Mastery",
      rating: 4.7,
      price: 59.99,
      time: "21 hours",
      category: "Growth Hacking",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=250",
    },
    {
      id: "course_025",
      courseName: "Ruby on Rails Complete Course",
      rating: 4.4,
      price: 84.99,
      time: "39 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=250",
    },
    {
      id: "course_026",
      courseName: "Social Media Marketing Strategy",
      rating: 4.6,
      price: 49.99,
      time: "19 hours",
      category: "Growth Hacking",
      level: "Beginner",
      duration: "5hrs - 10hrs",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250",
    },
    {
      id: "course_027",
      courseName: "Project Management Professional",
      rating: 4.8,
      price: 99.99,
      time: "35 hours",
      category: "Growth Hacking",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250",
    },
    {
      id: "course_028",
      courseName: "Vue.js Framework Deep Dive",
      rating: 4.5,
      price: 79.99,
      time: "30 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250",
    },
    {
      id: "course_029",
      courseName: "DevOps Engineering Bootcamp",
      rating: 4.7,
      price: 114.99,
      time: "46 hours",
      category: "Code",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$101 - $400",
      image:
        "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=250",
    },
    {
      id: "course_030",
      courseName: "Artificial Intelligence Fundamentals",
      rating: 4.6,
      price: 109.99,
      time: "44 hours",
      category: "Code",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$101 - $400",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250",
    },
    {
      id: "course_031",
      courseName: "Email Marketing Automation",
      rating: 4.3,
      price: 44.99,
      time: "16 hours",
      category: "Growth Hacking",
      level: "Beginner",
      duration: "5hrs - 10hrs",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250",
    },
    {
      id: "course_032",
      courseName: "Flutter Mobile Development",
      rating: 4.8,
      price: 89.99,
      time: "38 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250",
    },
    {
      id: "course_033",
      courseName: "Git and GitHub Mastery",
      rating: 4.5,
      price: 34.99,
      time: "12 hours",
      category: "Code",
      level: "Beginner",
      duration: "5hrs - 10hrs",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=250",
    },
    {
      id: "course_034",
      courseName: "Content Marketing Strategy",
      rating: 4.4,
      price: 54.99,
      time: "23 hours",
      category: "Growth Hacking",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=250",
    },
    {
      id: "course_035",
      courseName: "Salesforce Administration",
      rating: 4.7,
      price: 124.99,
      time: "41 hours",
      category: "Growth Hacking",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$101 - $400",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250",
    },
    {
      id: "course_036",
      courseName: "MongoDB Database Design",
      rating: 4.6,
      price: 69.99,
      time: "27 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250",
    },
    {
      id: "course_037",
      courseName: "Figma UI Design Complete Guide",
      rating: 4.8,
      price: 59.99,
      time: "26 hours",
      category: "Design",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250",
    },
    {
      id: "course_038",
      courseName: "PowerBI Data Analysis",
      rating: 4.5,
      price: 79.99,
      time: "31 hours",
      category: "Growth Hacking",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250",
    },
    {
      id: "course_039",
      courseName: "Linux System Administration",
      rating: 4.7,
      price: 89.99,
      time: "36 hours",
      category: "Code",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=250",
    },
    {
      id: "course_040",
      courseName: "Shopify Store Development",
      rating: 4.4,
      price: 64.99,
      time: "24 hours",
      category: "Growth Hacking",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250",
    },
    {
      id: "course_041",
      courseName: "Google Ads Mastery Course",
      rating: 4.6,
      price: 74.99,
      time: "28 hours",
      category: "Growth Hacking",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250",
    },
    {
      id: "course_042",
      courseName: "TensorFlow Machine Learning",
      rating: 4.8,
      price: 119.99,
      time: "49 hours",
      category: "Code",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$101 - $400",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250",
    },
    {
      id: "course_043",
      courseName: "API Development with Express",
      rating: 4.5,
      price: 69.99,
      time: "29 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250",
    },
    {
      id: "course_044",
      courseName: "Adobe Illustrator Complete Guide",
      rating: 4.4,
      price: 59.99,
      time: "25 hours",
      category: "Design",
      level: "Beginner",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=250",
    },
    {
      id: "course_045",
      courseName: "Firebase Backend Services",
      rating: 4.7,
      price: 74.99,
      time: "32 hours",
      category: "Code",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250",
    },
    {
      id: "course_046",
      courseName: "Ethical Hacking Certification",
      rating: 4.8,
      price: 134.99,
      time: "55 hours",
      category: "Code",
      level: "Expert",
      duration: "11hrs - more",
      priceRange: "$101 - $400",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250",
    },
    {
      id: "course_047",
      courseName: "Business Intelligence with SQL",
      rating: 4.6,
      price: 84.99,
      time: "35 hours",
      category: "Growth Hacking",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250",
    },
    {
      id: "course_048",
      courseName: "Cryptocurrency Trading Course",
      rating: 4.2,
      price: 94.99,
      time: "27 hours",
      category: "Growth Hacking",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250",
    },
    {
      id: "course_049",
      courseName: "3D Modeling with Blender",
      rating: 4.5,
      price: 79.99,
      time: "42 hours",
      category: "Design",
      level: "Intermediate",
      duration: "11hrs - more",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250",
    },
    {
      id: "course_050",
      courseName: "Advanced Excel Formulas",
      rating: 4.3,
      price: 49.99,
      time: "20 hours",
      category: "Growth Hacking",
      level: "Beginner",
      duration: "5hrs - 10hrs",
      priceRange: "$1 - $100",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250",
    },
  ];

  // Filter and sort courses based on selected criteria
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = course.filter((c) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        c.courseName.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter (Power Discipline)
      const matchesCategory =
        powerDiscipline === "" || c.category === powerDiscipline;

      // Level filter (mutationIntensity2 - checkboxes)
      const matchesLevel =
        mutationIntensity2.length === 0 || mutationIntensity2.includes(c.level);

      // Duration filter (mutationIntensity3 - checkboxes)
      const matchesDuration =
        mutationIntensity3.length === 0 ||
        mutationIntensity3.includes(c.duration);

      // Price filter (mutationIntensity4 - radio)
      const matchesPrice =
        mutationIntensity4 === "" ||
        (mutationIntensity4 === "Free" && c.price === 0) ||
        (mutationIntensity4 === "$1 - $100" && c.price > 0 && c.price <= 100) ||
        (mutationIntensity4 === "$101 - $400" &&
          c.price > 100 &&
          c.price <= 400);

      // Rating filter (mutationIntensity5 - radio)
      const matchesRating =
        mutationIntensity5 === "" ||
        (mutationIntensity5 === "3.0 < " && c.rating > 3.0) ||
        (mutationIntensity5 === "3.5 <" && c.rating > 3.5) ||
        (mutationIntensity5 === "4.0 <" && c.rating > 4.0) ||
        (mutationIntensity5 === "4.5 <" && c.rating > 4.5);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel &&
        matchesDuration &&
        matchesPrice &&
        matchesRating
      );
    });

    // Apply sorting
    if (sortBy === "Most Popular") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Recent") {
      // For demo purposes, sort by course ID (assuming higher IDs are more recent)
      filtered = filtered.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === "Free") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }

    return filtered;
  }, [
    searchTerm,
    powerDiscipline,
    mutationIntensity2,
    mutationIntensity3,
    mutationIntensity4,
    mutationIntensity5,
    sortBy,
  ]);

  const handleButtonClick = (courseId) => {
    setClickedButtons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filteredAndSortedCourses]);

  const totalPages = Math.ceil(
    filteredAndSortedCourses.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredAndSortedCourses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="w-screen h-full bg-white flexcenter ">
      <div className="max-w-[1800px] w-full  ">
        {/* Herosection */}
        <div
          style={{
            backgroundImage: "url('/images/Rectangle 120.png')",
          }}
          className="h-screen relative z-20 flex items-center justify-center flex-col w-full bg-cover bg-center"
        >
          <div
            style={{ paddingTop: "10%" }}
            className="max-w-[336.97px] relative herosection-mb flexcenter flex-col gap-5 sm:max-w-[852.48px] w-full px-4"
          >
            <div className="relative z-40">
              <h2 className="text-[#E2E2E2] Xirod text-[24px] leading-[28px] xs:text-[32px] xs:leading-[36px] sm:text-[40px] sm:leading-[44px] md:text-[51px] md:leading-[57px] text-center">
                Choose Your Next
              </h2>
              <h2 className="text-[#E2E2E2] Xirod text-[24px] leading-[28px] xs:text-[32px] xs:leading-[36px] sm:text-[40px] sm:leading-[44px] md:text-[51px] md:leading-[57px] text-center">
                Mutation Mission
              </h2>
            </div>

            <p className="font-[500] text-[12px] xs:text-[14px] relative z-40 sm:text-[17px] leading-[14px] sm:leading-[24px] md:leading-[28px] text-[#CDE98D] text-center px-2">
              EVERY MISSION IS A TEST. EVERY SKILL IS A POWER WAITING TO AWAKEN
            </p>
          </div>
       
        </div>

        {/* main */}

        {/* search btn */}
        <div
          style={{ paddingTop: "60px" }}
          className="w-full grid bg-white  gap-5 sm:gap-0 xl:grid-cols-3"
        >
          <div className=""></div>
          <div className="col-span-2 flex flex-col gap-5 xl:gap-0 sm:flex-row px-4 sm:px-6 md:px-8 xl:px-0 items-center w-full justify-between">
            <p className="font-[700]  text-[20px] xs:text-[25px] md:text-[30px] xxl:text-[37px] leading-[24px] text-black text-center xl:text-left">
              All Missions
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2   w-full sm:w-auto">
              <div
                style={{ padding: "0 15px" }}
                className="border-[#C0C0C0] border text-black rounded-[38px] flex items-center h-[47.15px] w-full sm:max-w-[350px] md:max-w-[400px] lg:max-w-[446.1px]"
              >
                <FaSearch className="text-[#CCCCCC] flex-shrink-0" />
                <input
                  style={{ padding: "7px" }}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`"Search Missions… Try "Growth hacking", "Figma", "Python""`}
                  className="w-full h-full outline-none placeholder-[#B6B6B6] font-[700] text-black text-[8px] xs:text-[10px] leading-[30px]"
                />
              </div>
              <div
                className="border-[#C0C0C0] text-[#B6B6B6] font-[500] leading-[30px] text-[10px] flexcenter border rounded-[38px] h-[47.15px] w-full sm:w-[120px] md:w-[150px] lg:w-[175.72px] relative cursor-pointer"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                Sort by :
                <span className="text-black"> {sortBy || "Default"}</span>
                {showSortDropdown && (
                  <div
                    style={{ padding: "2px" }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#C0C0C0]  rounded-[10px] shadow-lg z-50"
                  >
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[10px] text-[10px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortBy("Most Popular");
                        setShowSortDropdown(false);
                      }}
                    >
                      Most Popular
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[10px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortBy("Recent");
                        setShowSortDropdown(false);
                      }}
                    >
                      Recent
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[10px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortBy("Free");
                        setShowSortDropdown(false);
                      }}
                    >
                      Free
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[10px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortBy("");
                        setShowSortDropdown(false);
                      }}
                    >
                      Default
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* values */}
        <div
          style={{ padding: "15px" }}
          className="grid xl:grid-cols-3 gap-5 w-full min-h-screen bg-white text-black"
        >
          {/* Desktop sidebar - hidden on small screens */}
          <div className="p-6 max-w-4xl mx-auto">
            <div className="hidden xl:flex flex-col gap-5">
              <div
                style={{ padding: "10px" }}
                className="p-4 shadow-sm rounded-[20px] "
              >
                <DropDown
                  label="Choose Your Power Discipline"
                  options={options}
                  value={powerDiscipline}
                  onChange={setPowerDiscipline}
                  type="text"
                />
              </div>

              <div
                style={{ padding: "10px" }}
                className="h-fit  rounded-[20px]  grid w-full shadow-sm"
              >
                <div className="border-b-[1px] border-gray-300">
                  <DropDown
                    label="Mutation Intensity (Checkbox)"
                    options={optionsIntensity}
                    value={mutationIntensity2}
                    onChange={setMutationIntensity2}
                    type="checkbox"
                  />
                </div>

                <div className="border-b-[1px] border-gray-300">
                  <DropDown
                    label="Mutation Intensity (Checkbox Multi)"
                    options={optionsIntensity2}
                    value={mutationIntensity3}
                    onChange={setMutationIntensity3}
                    type="checkbox"
                  />
                </div>

                <div className="border-b-[1px] border-gray-300">
                  <DropDown
                    label="Mutation Intensity (Radio)"
                    options={optionsIntensity3}
                    value={mutationIntensity4}
                    onChange={setMutationIntensity4}
                    type="radio"
                  />
                </div>

                <div>
                  <DropDown
                    label="Mutation Intensity (Radio 2)"
                    options={optionsIntensity4}
                    value={mutationIntensity5}
                    onChange={setMutationIntensity5}
                    type="radio"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-2">
            {currentItems.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-[#6D6D6D] text-lg">
                  No missions found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="w-full flex items-center flex-col  sm:grid md:grid-cols-3  gap-5 ">
                {currentItems.map((course, i) => (
                  <div
                    key={course.id}
                    className="h-[516.72px] w-full max-w-[340.81px] border-[#A6A6A6] rounded-[20px] shadow-md "
                  >
                    <div
                      style={{ backgroundImage: `url(${course.image})` }}
                      className="h-[294.71px] w-full bg-pink-100 rounded-t-[20px] bg-cover bg-center"
                    ></div>

                    <div
                      className="flex flex-col  justify-between flex-1 h-[222.01px]  "
                      style={{ padding: "20px" }}
                    >
                      <div>
                        <div className="flex items-center justify-between w-full">
                          <p
                            style={{ marginBottom: "3px" }}
                            className="w-[53.75px] h-[22.94px] border border-[#A6A6A6] text-[#A6A6A6] flexcenter font-[500] leading-[25px] text-[10px]  rounded-[5px]"
                          >
                            Design
                          </p>
                          <p className="w-[53.75px] flexcenter h-[22.94px] bg-[#D3D3D3] text-black font-[600] text-[8px] leading-[28px] rounded-[30px]">
                            <AiFillStar className="text-[#FFA100] w-[12.19px]  " />
                            <span>{course.rating}</span>
                          </p>
                        </div>
                        <p className="text-[#292929] font-[700] text-[20px] leading-[23px] ">
                          {course.courseName}
                        </p>
                        <p className="text-[#288C4F] font-[800] text-[15px] leading-[28px]">
                          {" "}
                          ${course.price}
                        </p>
                      </div>

                      <div className="">
                        <p className="text-[#5C5C5C] font-[500] flex items-center gap-1 text-[10px] leading-[28px]">
                          <FaClock className="w-[12.19px] mr-1" />
                          <span>{course.time}</span>
                        </p>
                        <button
                          onClick={() => handleButtonClick(course.id)}
                          className={`${
                            clickedButtons.has(course.id)
                              ? "bg-[#7343B3] text-white"
                              : "bg-[#C1C1C1] text-black"
                          } font-[700] cursor-pointer h-[42.52px] w-[138.44px] rounded-[8px] text-[13px] leading-[28px] transition-colors duration-200`}
                        >
                          Enter Mission
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* pagination button */}
            {totalPages > 1 && (
              <div className="flex items-center gap-5 justify-center">
                {/* Previous button */}
                <p>
                  <span
                    onClick={
                      currentPage > 1
                        ? () => setCurrentPage(currentPage - 1)
                        : undefined
                    }
                    className={`text-[20.5px] ${
                      currentPage > 1
                        ? "text-[#6D6D6D] cursor-pointer hover:text-[#7343B3]"
                        : "text-[#CCCCCC] cursor-not-allowed"
                    }`}
                  >
                    {`<`}
                  </span>
                </p>

                {/* Page numbers */}
                <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      style={{ margin: "20px 0" }}
                      key={i}
                      className={`sm:h-[60px] h-[20px] w-[20px] flexcenter cursor-pointer sm:w-[60px] h-[20px] w-[20px] flexcenter font-[700] text-[10px] sm:text-[18px] leading-[30px] rounded-full transition-all duration-200 ${
                        currentPage === i + 1
                          ? "bg-[#7343B3] text-white shadow-sm shadow-[#7C38FF]"
                          : "bg-white text-[#6D6D6D] hover:bg-[#F5F5F5]"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* Next button */}
                <p>
                  <span
                    onClick={
                      currentPage < totalPages
                        ? () => setCurrentPage(currentPage + 1)
                        : undefined
                    }
                    className={`text-[20.5px] ${
                      currentPage < totalPages
                        ? "text-[#6D6D6D] cursor-pointer hover:text-[#7343B3]"
                        : "text-[#CCCCCC] cursor-not-allowed"
                    }`}
                  >
                    {`>`}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
